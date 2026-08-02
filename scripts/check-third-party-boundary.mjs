import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, "..");
const manifestPath = path.join(scriptDirectory, "third-party-boundary.json");
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

function fingerprint(values) {
  return crypto.createHash("sha256").update(values.join("\n")).digest("hex");
}

function importedNames(node) {
  const names = [];
  const clause = node.importClause;
  if (!clause) return names;
  if (clause.name) names.push("default");
  const bindings = clause.namedBindings;
  if (bindings && ts.isNamedImports(bindings)) {
    for (const element of bindings.elements) {
      names.push((element.propertyName ?? element.name).text);
    }
  } else if (bindings && ts.isNamespaceImport(bindings)) {
    names.push("*");
  }
  return names.sort();
}

const sourceFiles = manifest.sourceRoots.flatMap((root) =>
  collectFiles(path.join(projectRoot, root), (name) => /\.tsx?$/.test(name)),
);
const parsedSources = sourceFiles.map((filePath) => ({
  filePath,
  relativePath: toProjectPath(filePath),
  source: fs.readFileSync(filePath, "utf8"),
  sourceFile: ts.createSourceFile(
    filePath,
    fs.readFileSync(filePath, "utf8"),
    ts.ScriptTarget.Latest,
    true,
    filePath.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  ),
}));

const importEdges = new Map();
const symbolConsumers = new Map();
for (const source of parsedSources) {
  for (const statement of source.sourceFile.statements) {
    if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier)) {
      continue;
    }
    const packageName = statement.moduleSpecifier.text;
    const names = importedNames(statement);
    const edges = importEdges.get(packageName) ?? [];
    edges.push(`${source.relativePath}:${names.join(",")}`);
    importEdges.set(packageName, edges);

    for (const name of names) {
      const key = `${packageName}:${name}`;
      const consumers = symbolConsumers.get(key) ?? new Set();
      consumers.add(source.relativePath);
      symbolConsumers.set(key, consumers);
    }
  }
}

for (const contract of manifest.importContracts) {
  const edges = [...(importEdges.get(contract.package) ?? [])].sort();
  const consumers = new Set(edges.map((edge) => edge.slice(0, edge.indexOf(":"))));
  if (edges.length !== contract.edgeCount) {
    errors.push(`${contract.package} import 边应为 ${contract.edgeCount}，实际为 ${edges.length}`);
  }
  if (consumers.size !== contract.consumerCount) {
    errors.push(
      `${contract.package} consumer 应为 ${contract.consumerCount}，实际为 ${consumers.size}`,
    );
  }
  if (fingerprint(edges) !== contract.fingerprint) {
    errors.push(`${contract.package} import 路径或符号偏离 C1.7.6 登记`);
  }
}

for (const contract of manifest.symbolContracts) {
  const consumers = [
    ...(symbolConsumers.get(`${contract.package}:${contract.symbol}`) ?? []),
  ].sort();
  if (consumers.length !== contract.consumerCount) {
    errors.push(
      `${contract.package} ${contract.symbol} consumer 应为 ${contract.consumerCount}，实际为 ${consumers.length}`,
    );
  }
  if (fingerprint(consumers) !== contract.fingerprint) {
    errors.push(`${contract.package} ${contract.symbol} consumer 偏离 C1.7.6 登记`);
  }
}

for (const contract of manifest.fileContracts) {
  const filePath = path.join(projectRoot, contract.path);
  if (!fs.existsSync(filePath)) {
    errors.push(`第三方边界文件不存在: ${contract.path}`);
    continue;
  }
  const source = fs.readFileSync(filePath, "utf8");
  for (const marker of contract.contains ?? []) {
    if (!source.includes(marker)) {
      errors.push(`${contract.path} 缺少第三方边界标记: ${marker}`);
    }
  }
  for (const marker of contract.notContains ?? []) {
    if (source.includes(marker)) {
      errors.push(`${contract.path} 出现未限界或已删除标记: ${marker}`);
    }
  }
}

for (const contract of manifest.orderedMarkers) {
  const source = fs.readFileSync(path.join(projectRoot, contract.path), "utf8");
  const beforeIndex = source.indexOf(contract.before);
  const afterIndex = source.indexOf(contract.after);
  if (beforeIndex === -1 || afterIndex === -1 || beforeIndex >= afterIndex) {
    errors.push(`${contract.path} 第三方脚本顺序失效: ${contract.before} -> ${contract.after}`);
  }
}

for (const marker of manifest.forbiddenSourceMarkers) {
  const consumers = parsedSources
    .filter((source) => source.source.includes(marker))
    .map((source) => source.relativePath);
  if (consumers.length) {
    errors.push(`未登记第三方源码标记 ${marker}: ${consumers.join(", ")}`);
  }
}

const vendorStylePaths = new Set(manifest.vendorStyleFiles);
const styleFiles = manifest.styleRoots.flatMap((root) =>
  collectFiles(path.join(projectRoot, root), (name) => /\.(?:s?css)$/.test(name)),
);
for (const styleFile of styleFiles) {
  const relativePath = toProjectPath(styleFile);
  if (vendorStylePaths.has(relativePath)) continue;
  const source = fs.readFileSync(styleFile, "utf8");
  const forbiddenSelector = source.match(/\.(?:ant|antd|slick|sp)-[\w-]+/);
  if (forbiddenSelector) {
    errors.push(`${relativePath} 出现 vendor 目录外第三方 selector: ${forbiddenSelector[0]}`);
  }
}

const spectrumPath = path.join(
  projectRoot,
  "src/foundation/styles/vendors/_spectrum.scss",
);
const spectrumSource = fs.readFileSync(spectrumPath, "utf8");
const spectrumBoundary = spectrumSource.indexOf(".cc98-vendor-spectrum-color-picker {");
const firstSpectrumSelector = spectrumSource.indexOf(".sp-");
if (
  spectrumBoundary === -1 ||
  firstSpectrumSelector === -1 ||
  spectrumBoundary > firstSpectrumSelector ||
  !/}\s*}\s*$/.test(spectrumSource)
) {
  errors.push("Spectrum 上游样式未完整置于 cc98 vendor owner 根下");
}

const antdPath = path.join(projectRoot, "src/foundation/styles/vendors/_antd.scss");
const antdSource = fs.readFileSync(antdPath, "utf8");
for (const match of antdSource.matchAll(/([^{}]+)\{/g)) {
  const selector = match[1].trim();
  if (selector.startsWith("@") || !/\.(?:ant|antd|slick)-/.test(selector)) continue;
  if (!selector.includes(".cc98-vendor-")) {
    errors.push(`Ant Design override 缺少 cc98 owner 根: ${selector}`);
  }
}

if (errors.length) {
  console.error("Third-party boundary check failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  const importEdgeCount = manifest.importContracts.reduce(
    (sum, contract) => sum + contract.edgeCount,
    0,
  );
  const portalConsumerCount = manifest.symbolContracts
    .filter((contract) => contract.package === "antd")
    .reduce((sum, contract) => sum + contract.consumerCount, 0);
  console.log(
    `Third-party boundary check passed: ${importEdgeCount} registered import edges, ` +
      `${portalConsumerCount} Ant Design portal/config consumer edges, ` +
      `${manifest.vendorStyleFiles.length} vendor style owners, 0 business :global selectors.`,
  );
}
