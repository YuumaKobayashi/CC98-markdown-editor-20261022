import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, "..");
const manifestPath = path.join(scriptDirectory, "dynamic-content-boundary.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const errors = [];

function toProjectPath(filePath) {
  return path.relative(projectRoot, filePath).split(path.sep).join("/");
}

function collectFiles(directory, predicate) {
  if (!fs.existsSync(directory)) return [];
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectFiles(absolutePath, predicate));
    } else if (predicate(entry.name)) {
      files.push(absolutePath);
    }
  }
  return files;
}

function compareExact(label, actualValues, expectedValues) {
  const actual = [...new Set(actualValues)].sort();
  const expected = [...new Set(expectedValues)].sort();
  if (JSON.stringify(actual) === JSON.stringify(expected)) return;

  const missing = expected.filter((value) => !actual.includes(value));
  const unexpected = actual.filter((value) => !expected.includes(value));
  if (missing.length) errors.push(`${label} 缺少: ${missing.join(", ")}`);
  if (unexpected.length) errors.push(`${label} 新增未登记项: ${unexpected.join(", ")}`);
}

function readSourceFile(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  const scriptKind = filePath.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  return ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true, scriptKind);
}

function importedNames(node) {
  const names = [];
  const clause = node.importClause;
  if (!clause) return names;
  if (clause.name) names.push(clause.name.text);
  const bindings = clause.namedBindings;
  if (bindings && ts.isNamedImports(bindings)) {
    for (const element of bindings.elements) {
      names.push((element.propertyName ?? element.name).text);
    }
  } else if (bindings && ts.isNamespaceImport(bindings)) {
    names.push(bindings.name.text);
  }
  return names;
}

const sourceRoots = manifest.sourceRoots.map((root) => path.join(projectRoot, root));
const typeScriptFiles = sourceRoots.flatMap((root) =>
  collectFiles(root, (name) => /\.tsx?$/.test(name)),
);
const parsedSources = new Map(
  typeScriptFiles.map((filePath) => [filePath, readSourceFile(filePath)]),
);

for (const contract of manifest.importContracts) {
  const consumers = [];
  for (const [filePath, sourceFile] of parsedSources) {
    let importsSymbol = false;
    for (const statement of sourceFile.statements) {
      if (!ts.isImportDeclaration(statement)) continue;
      if (importedNames(statement).includes(contract.symbol)) {
        importsSymbol = true;
      }
    }
    if (importsSymbol) consumers.push(toProjectPath(filePath));
  }
  compareExact(`${contract.symbol} 直接消费者`, consumers, contract.consumers);
  for (const dormantConsumer of contract.dormantConsumers) {
    if (!contract.consumers.includes(dormantConsumer)) {
      errors.push(`${contract.symbol} 休眠消费者未列入消费者集合: ${dormantConsumer}`);
      continue;
    }
    const dormantPath = path.join(projectRoot, dormantConsumer);
    const dormantSource = parsedSources.get(dormantPath);
    if (!dormantSource) {
      errors.push(`${contract.symbol} 休眠消费者源码不存在: ${dormantConsumer}`);
      continue;
    }
    let usageCount = 0;
    function countUsage(node) {
      if (ts.isImportDeclaration(node)) return;
      if (ts.isIdentifier(node) && node.text === contract.symbol) usageCount += 1;
      ts.forEachChild(node, countUsage);
    }
    countUsage(dormantSource);
    if (usageCount !== 0) {
      errors.push(`${contract.symbol} 休眠 import 已恢复活动使用: ${dormantConsumer}`);
    }
  }
  for (const dormantConsumer of contract.dormantTextConsumers ?? []) {
    const dormantPath = path.join(projectRoot, dormantConsumer);
    if (!fs.existsSync(dormantPath)) {
      errors.push(`${contract.symbol} 休眠文本边界不存在: ${dormantConsumer}`);
      continue;
    }
    if (!fs.readFileSync(dormantPath, "utf8").includes(contract.symbol)) {
      errors.push(`${contract.symbol} 休眠文本边界已失效: ${dormantConsumer}`);
    }
    if (consumers.includes(dormantConsumer)) {
      errors.push(`${contract.symbol} 休眠文本边界意外恢复为活动 import: ${dormantConsumer}`);
    }
  }
}

const registrationPath = path.join(projectRoot, manifest.registrationContract.path);
if (!fs.existsSync(registrationPath)) {
  errors.push(`UBB 注册入口不存在: ${manifest.registrationContract.path}`);
} else {
  const registrationSource = fs.readFileSync(registrationPath, "utf8");
  const activeSequence = [];
  for (const match of registrationSource.matchAll(
    /^\s*engine\.handlers\.(register|registerText)\((\w+)\);/gm,
  )) {
    activeSequence.push(`${match[1]}:${match[2]}`);
  }
  if (
    JSON.stringify(activeSequence) !==
    JSON.stringify(manifest.registrationContract.activeSequence)
  ) {
    errors.push("UBB handler 活动注册顺序与 C1.7.5 冻结清单不一致");
  }
}

function resolveStyleImport(importerPath, specifier) {
  if (!specifier.startsWith(".")) return null;
  const unresolved = path.resolve(path.dirname(importerPath), specifier);
  const candidates = [
    unresolved,
    `${unresolved}.scss`,
    `${unresolved}.css`,
    path.join(path.dirname(unresolved), `_${path.basename(unresolved)}.scss`),
  ];
  return candidates.find((candidate) => fs.existsSync(candidate)) ?? null;
}

const styleImporters = new Map();
function addStyleImporter(targetPath, importerPath) {
  const key = path.normalize(targetPath);
  const current = styleImporters.get(key) ?? new Set();
  current.add(toProjectPath(importerPath));
  styleImporters.set(key, current);
}

for (const [filePath, sourceFile] of parsedSources) {
  for (const statement of sourceFile.statements) {
    if (!ts.isImportDeclaration(statement)) continue;
    const specifier = statement.moduleSpecifier.text;
    if (!/\.(?:s?css)$/.test(specifier)) continue;
    const target = resolveStyleImport(filePath, specifier);
    if (target) addStyleImporter(target, filePath);
  }
}

const styleScanRoots = [...sourceRoots, path.join(projectRoot, "Styles")];
const sassFiles = styleScanRoots.flatMap((root) =>
  collectFiles(root, (name) => /\.(?:s?css)$/.test(name)),
);
for (const filePath of sassFiles) {
  const source = fs.readFileSync(filePath, "utf8");
  for (const match of source.matchAll(/@(?:import|use)\s+["']([^"']+)["']/g)) {
    const target = resolveStyleImport(filePath, match[1]);
    if (target) addStyleImporter(target, filePath);
  }
}

for (const boundary of manifest.styleBoundaries) {
  const boundaryPath = path.join(projectRoot, boundary.path);
  if (!fs.existsSync(boundaryPath)) {
    errors.push(`动态内容样式边界不存在: ${boundary.path}`);
    continue;
  }
  const actualImporters = [...(styleImporters.get(path.normalize(boundaryPath)) ?? [])];
  compareExact(`${boundary.path} 样式 importer`, actualImporters, boundary.importers);
}

function stringValue(node, sourceFile) {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return node.text;
  }
  if (ts.isTemplateExpression(node)) {
    const text = node.getText(sourceFile);
    return text.slice(1, -1);
  }
  return null;
}

function collectStorageKeys(sourceFile) {
  const keys = new Set();
  function visit(node) {
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.name.text.endsWith("_KEY") &&
      node.initializer
    ) {
      const value = stringValue(node.initializer, sourceFile);
      if (value !== null) keys.add(value);
    }

    if (
      ts.isFunctionDeclaration(node) &&
      node.name?.text.endsWith("Key") &&
      node.body
    ) {
      for (const statement of node.body.statements) {
        if (!ts.isReturnStatement(statement) || !statement.expression) continue;
        const value = stringValue(statement.expression, sourceFile);
        if (value !== null) keys.add(value);
      }
    }

    if (ts.isCallExpression(node) && node.arguments.length > 0) {
      let isStorageCall = false;
      if (ts.isIdentifier(node.expression)) {
        isStorageCall = /(?:get|set|remove)LocalStorage$/.test(node.expression.text);
      } else if (ts.isPropertyAccessExpression(node.expression)) {
        isStorageCall =
          node.expression.expression.getText(sourceFile) === "localStorage" &&
          /^(?:getItem|setItem|removeItem)$/.test(node.expression.name.text);
      }
      if (isStorageCall) {
        const value = stringValue(node.arguments[0], sourceFile);
        if (value !== null) keys.add(value);
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);
  return [...keys];
}

for (const contract of manifest.storageContracts) {
  const filePath = path.join(projectRoot, contract.path);
  if (!fs.existsSync(filePath)) {
    errors.push(`Storage 合同文件不存在: ${contract.path}`);
    continue;
  }
  compareExact(
    `${contract.path} Storage key`,
    collectStorageKeys(readSourceFile(filePath)),
    contract.keys,
  );
}

function collectContentTypes(sourceFile) {
  const values = new Set();
  function visit(node) {
    if (
      ts.isPropertyAssignment(node) &&
      node.name.getText(sourceFile) === "contentType" &&
      ts.isNumericLiteral(node.initializer)
    ) {
      values.add(Number(node.initializer.text));
    }
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === "resolveTopicContent" &&
      node.arguments.length > 1 &&
      ts.isNumericLiteral(node.arguments[1])
    ) {
      values.add(Number(node.arguments[1].text));
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);
  return [...values];
}

for (const contract of manifest.contentTypeContracts) {
  const filePath = path.join(projectRoot, contract.path);
  if (!fs.existsSync(filePath)) {
    errors.push(`内容类型合同文件不存在: ${contract.path}`);
    continue;
  }
  compareExact(
    `${contract.path} contentType`,
    collectContentTypes(readSourceFile(filePath)),
    contract.values,
  );
}

for (const contract of manifest.fileContracts) {
  const filePath = path.join(projectRoot, contract.path);
  if (!fs.existsSync(filePath)) {
    errors.push(`动态内容合同文件不存在: ${contract.path}`);
    continue;
  }
  const source = fs.readFileSync(filePath, "utf8");
  for (const marker of contract.contains ?? []) {
    if (!source.includes(marker)) {
      errors.push(`${contract.path} 缺少冻结合同标记: ${marker}`);
    }
  }
  for (const marker of contract.notContains ?? []) {
    if (source.includes(marker)) {
      errors.push(`${contract.path} 出现禁止的合同标记: ${marker}`);
    }
  }
}

if (errors.length) {
  console.error("Dynamic content boundary check failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  const importCount = manifest.importContracts.reduce(
    (sum, contract) => sum + contract.consumers.length,
    0,
  );
  console.log(
    `Dynamic content boundary check passed: ${importCount} direct consumer edges, ` +
      `${manifest.registrationContract.activeSequence.length} active UBB registrations, ` +
      `${manifest.styleBoundaries.length} style boundaries, ` +
      `${manifest.storageContracts.length} storage contracts, ` +
      `${manifest.contentTypeContracts.length} content-type contracts.`,
  );
}
