import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, "..");
const manifest = JSON.parse(
  fs.readFileSync(path.join(scriptDirectory, "foundation-style-boundary.json"), "utf8"),
);
const errors = [];

function toProjectPath(filePath) {
  return path.relative(projectRoot, filePath).split(path.sep).join("/");
}

function collectFiles(directory, predicate) {
  if (!fs.existsSync(directory)) return [];
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...collectFiles(absolutePath, predicate));
    else if (predicate(entry.name)) files.push(absolutePath);
  }
  return files;
}

function normalizeSelector(selector) {
  return selector
    .replace(/\s+/g, " ")
    .replace(/\s*,\s*/g, ", ")
    .trim();
}

function collectTopLevelSelectors(source) {
  const clean = source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\r\n]*/g, "");
  const selectors = [];
  let depth = 0;
  let start = 0;
  for (let index = 0; index < clean.length; index += 1) {
    const character = clean[index];
    if (character === "{" && depth === 0) {
      const header = normalizeSelector(clean.slice(start, index));
      if (header && !header.startsWith("@")) selectors.push(header);
      depth = 1;
    } else if (character === "{" && depth > 0) {
      depth += 1;
    } else if (character === "}" && depth > 0) {
      depth -= 1;
      if (depth === 0) start = index + 1;
    } else if (character === ";" && depth === 0) {
      start = index + 1;
    }
  }
  return selectors;
}

function collectKeyframes(source) {
  return [...source.matchAll(/@(?:-webkit-)?keyframes\s+([\w-]+)/g)].map(
    (match) => match[1],
  );
}

function collectSassVariables(source) {
  return [...source.matchAll(/^\$([\w-]+):\s*([^;]+);/gm)].map((match) => ({
    name: match[1],
    value: match[2].trim(),
  }));
}

function resolveSassModule(importerPath, request) {
  const unresolved = path.resolve(path.dirname(importerPath), request);
  const candidates = [
    unresolved,
    `${unresolved}.scss`,
    path.join(path.dirname(unresolved), `_${path.basename(unresolved)}.scss`),
  ];
  return candidates.find((candidate) => fs.existsSync(candidate));
}

const sitePath = path.join(projectRoot, manifest.siteEntrypoint.path);
const siteSource = fs.readFileSync(sitePath, "utf8");
const siteImports = [...siteSource.matchAll(/@import\s+["']([^"']+)["'];/g)].map(
  (match) => match[1],
);
if (JSON.stringify(siteImports) !== JSON.stringify(manifest.siteEntrypoint.orderedImports)) {
  errors.push("Site.scss Foundation import order differs from the final manifest");
}
const siteWithoutImports = siteSource.replace(/@import\s+["'][^"']+["'];/g, "").trim();
if (siteWithoutImports) errors.push("Site.scss must remain an import-only entrypoint");

const expectedFoundationFiles = new Map(
  manifest.foundationFiles.map((contract) => [contract.path, contract]),
);
const sassImporters = new Map();
const sassFiles = ["src", "Components", "Pages", "Ubb", "Utility"]
  .map((root) => path.join(projectRoot, root))
  .flatMap((root) => collectFiles(root, (name) => name.endsWith(".scss")));
for (const sassFile of sassFiles) {
  const source = fs.readFileSync(sassFile, "utf8");
  for (const match of source.matchAll(/@use\s+["']([^"']+)["'][^;]*;/g)) {
    if (!match[1].startsWith(".")) continue;
    const target = resolveSassModule(sassFile, match[1]);
    if (!target) continue;
    const importers = sassImporters.get(path.normalize(target)) ?? new Set();
    importers.add(toProjectPath(sassFile));
    sassImporters.set(path.normalize(target), importers);
  }
}
const actualFoundationFiles = collectFiles(
  path.join(projectRoot, "src/foundation/styles"),
  (name) => name.endsWith(".scss"),
).map(toProjectPath);
for (const actualPath of actualFoundationFiles) {
  if (!expectedFoundationFiles.has(actualPath)) {
    errors.push(`Unregistered Foundation stylesheet: ${actualPath}`);
  }
}
for (const [relativePath, contract] of expectedFoundationFiles) {
  if (
    !contract.owner ||
    !contract.scope ||
    !contract.reason ||
    !Array.isArray(contract.consumers) ||
    contract.consumers.length === 0 ||
    !Array.isArray(contract.selectors) ||
    !Array.isArray(contract.keyframes)
  ) {
    errors.push(`Incomplete Foundation owner metadata: ${relativePath}`);
  }
  const absolutePath = path.join(projectRoot, relativePath);
  if (!fs.existsSync(absolutePath)) {
    errors.push(`Registered Foundation stylesheet is missing: ${relativePath}`);
    continue;
  }
  const actualSelectors = collectTopLevelSelectors(fs.readFileSync(absolutePath, "utf8"));
  if (JSON.stringify(actualSelectors) !== JSON.stringify(contract.selectors)) {
    errors.push(
      `${relativePath} selector set differs: expected ${JSON.stringify(contract.selectors)}, actual ${JSON.stringify(actualSelectors)}`,
    );
  }
  const actualKeyframes = collectKeyframes(fs.readFileSync(absolutePath, "utf8"));
  if (JSON.stringify(actualKeyframes) !== JSON.stringify(contract.keyframes)) {
    errors.push(
      `${relativePath} keyframe set differs: expected ${JSON.stringify(contract.keyframes)}, actual ${JSON.stringify(actualKeyframes)}`,
    );
  }
  if (contract.sassVariables) {
    const actualVariables = collectSassVariables(fs.readFileSync(absolutePath, "utf8"));
    if (JSON.stringify(actualVariables) !== JSON.stringify(contract.sassVariables)) {
      errors.push(`${relativePath} Sass variable set differs from the final manifest`);
    }
  }
  if (contract.sassImporters) {
    const actualImporters = [...(sassImporters.get(path.normalize(absolutePath)) ?? [])].sort();
    const expectedImporters = [...contract.sassImporters].sort();
    if (JSON.stringify(actualImporters) !== JSON.stringify(expectedImporters)) {
      errors.push(`${relativePath} Sass importer set differs from the final manifest`);
    }
  }
}

for (const forbiddenPath of manifest.forbiddenPaths) {
  const absolutePath = path.join(projectRoot, forbiddenPath);
  if (!fs.existsSync(absolutePath)) continue;
  const entries = fs.statSync(absolutePath).isDirectory()
    ? collectFiles(absolutePath, () => true)
    : [absolutePath];
  if (entries.length) errors.push(`Forbidden final style path still exists: ${forbiddenPath}`);
}

const sourceRoots = ["src", "Components", "Pages", "Ubb", "Utility"]
  .map((root) => path.join(projectRoot, root))
  .filter((root) => fs.existsSync(root));
const sourceFiles = sourceRoots.flatMap((root) =>
  collectFiles(root, (name) => /\.tsx?$/.test(name)),
);
const layoutCounts = new Map(manifest.layoutTokens.flatMap((entry) => [[entry.old, 0], [entry.current, 0]]));
const styleImporters = new Map();

function collectClassNameLiteralText(node) {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return [node.text];
  }
  if (ts.isTemplateExpression(node)) {
    return [
      node.head.text,
      ...node.templateSpans.flatMap((span) => [
        ...collectClassNameLiteralText(span.expression),
        span.literal.text,
      ]),
    ];
  }
  const values = [];
  ts.forEachChild(node, (child) => values.push(...collectClassNameLiteralText(child)));
  return values;
}

for (const filePath of sourceFiles) {
  const source = fs.readFileSync(filePath, "utf8");
  const sourceFile = ts.createSourceFile(
    filePath,
    source,
    ts.ScriptTarget.Latest,
    true,
    filePath.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );

  function visit(node) {
    if (
      ts.isImportDeclaration(node) &&
      ts.isStringLiteral(node.moduleSpecifier) &&
      /\.s?css$/.test(node.moduleSpecifier.text) &&
      node.moduleSpecifier.text.startsWith(".")
    ) {
      const target = path.resolve(path.dirname(filePath), node.moduleSpecifier.text);
      const importers = styleImporters.get(path.normalize(target)) ?? new Set();
      importers.add(toProjectPath(filePath));
      styleImporters.set(path.normalize(target), importers);
    }

    if (ts.isJsxAttribute(node) && node.name.text === "className" && node.initializer) {
      const strings = collectClassNameLiteralText(node.initializer);
      for (const value of strings) {
        for (const token of value.split(/\s+/).filter(Boolean)) {
          if (layoutCounts.has(token)) layoutCounts.set(token, layoutCounts.get(token) + 1);
        }
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);
}

for (const contract of manifest.layoutTokens) {
  if (layoutCounts.get(contract.old) !== 0) {
    errors.push(`Legacy layout token ${contract.old} still has ${layoutCounts.get(contract.old)} active consumers`);
  }
  if (layoutCounts.get(contract.current) !== contract.count) {
    errors.push(
      `${contract.current} should have ${contract.count} active consumers, actual ${layoutCounts.get(contract.current)}`,
    );
  }
}

for (const contract of manifest.legacyGlobalStyles) {
  if (
    !contract.owner ||
    !contract.removeWhen ||
    !Array.isArray(contract.importers) ||
    contract.importers.length === 0
  ) {
    errors.push(`Incomplete legacy global deletion metadata: ${contract.path}`);
  }
  const absolutePath = path.join(projectRoot, contract.path);
  if (!fs.existsSync(absolutePath)) {
    errors.push(`Registered legacy global stylesheet is missing: ${contract.path}`);
    continue;
  }
  const actualImporters = [...(styleImporters.get(path.normalize(absolutePath)) ?? [])].sort();
  const expectedImporters = [...contract.importers].sort();
  if (JSON.stringify(actualImporters) !== JSON.stringify(expectedImporters)) {
    errors.push(`${contract.path} importer set differs from the final manifest`);
  }
}

const allowedLegacyStyles = new Set(manifest.legacyGlobalStyles.map((entry) => entry.path));
const ordinaryStyles = ["src", "Components", "Pages", "Ubb", "Utility"]
  .map((root) => path.join(projectRoot, root))
  .flatMap((root) => collectFiles(root, (name) => name.endsWith(".scss") && !name.endsWith(".module.scss")))
  .map(toProjectPath)
  .filter(
    (relativePath) =>
      !relativePath.startsWith("src/foundation/styles/") &&
      !relativePath.startsWith("src/foundation/theme/"),
  );
for (const relativePath of ordinaryStyles) {
  if (!allowedLegacyStyles.has(relativePath)) {
    errors.push(`Unregistered ordinary global stylesheet: ${relativePath}`);
  }
}

const moduleFiles = ["src", "Components", "Pages", "Ubb", "Utility"]
  .map((root) => path.join(projectRoot, root))
  .flatMap((root) => collectFiles(root, (name) => name.endsWith(".module.scss")));
for (const moduleFile of moduleFiles) {
  const source = fs.readFileSync(moduleFile, "utf8");
  if (source.includes(":global(") || source.includes("global(")) {
    errors.push(`Business CSS Module contains a global escape: ${toProjectPath(moduleFile)}`);
  }
}

if (errors.length) {
  console.error("Foundation style boundary check failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(
    `Foundation style boundary check passed: ${expectedFoundationFiles.size} registered files, ` +
      `${manifest.layoutTokens.reduce((sum, entry) => sum + entry.count, 0)} layout consumers, ` +
      `${manifest.legacyGlobalStyles.length} frozen legacy global styles.`,
  );
}
