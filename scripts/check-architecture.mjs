import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, "..");
const sourceRoot = path.join(projectRoot, "src");
const sourceExtensions = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"]);
const forbiddenRootSourcePaths = [
  "@types/@cc98",
  "Components",
  "IndexedDB",
  "Match",
  "Pages",
  "Props",
  "States",
  "Styles",
  "Ubb",
  "Utility",
  "config",
  "Store.tsx",
  "Utility.ts",
  "SignalR.ts",
];

const aliasRoots = new Map([
  ["@application", "src/application"],
  ["@modules", "src/modules"],
  ["@foundation", "src/foundation"],
]);

function toProjectPath(filePath) {
  return path.relative(projectRoot, filePath).split(path.sep).join("/");
}

function collectSourceFiles(directory) {
  const files = [];

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolutePath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...collectSourceFiles(absolutePath));
    } else if (sourceExtensions.has(path.extname(entry.name))) {
      files.push(absolutePath);
    }
  }

  return files;
}

function getImports(filePath) {
  const sourceText = fs.readFileSync(filePath, "utf8");
  const sourceFile = ts.createSourceFile(
    filePath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    filePath.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  const specifiers = new Set();

  function addSpecifier(node) {
    if (node && ts.isStringLiteralLike(node)) {
      specifiers.add(node.text);
    }
  }

  function visit(node) {
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
      addSpecifier(node.moduleSpecifier);
    } else if (
      ts.isImportEqualsDeclaration(node) &&
      ts.isExternalModuleReference(node.moduleReference)
    ) {
      addSpecifier(node.moduleReference.expression);
    } else if (ts.isCallExpression(node) && node.arguments.length === 1) {
      const isDynamicImport = node.expression.kind === ts.SyntaxKind.ImportKeyword;
      const isRequire =
        ts.isIdentifier(node.expression) && node.expression.text === "require";

      if (isDynamicImport || isRequire) {
        addSpecifier(node.arguments[0]);
      }
    } else if (ts.isImportTypeNode(node) && ts.isLiteralTypeNode(node.argument)) {
      addSpecifier(node.argument.literal);
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return [...specifiers];
}

function pathLayer(absolutePath) {
  const relativePath = toProjectPath(absolutePath);

  if (relativePath === "src/foundation" || relativePath.startsWith("src/foundation/")) {
    return "foundation";
  }
  if (
    relativePath === "src/modules" ||
    relativePath.startsWith("src/modules/")
  ) {
    return "modules";
  }
  if (
    relativePath === "src/application" ||
    relativePath.startsWith("src/application/")
  ) {
    return "application";
  }
  return null;
}

function managedSourceLayer(absolutePath) {
  const relativePath = toProjectPath(absolutePath);

  if (relativePath === "src/foundation" || relativePath.startsWith("src/foundation/")) {
    return "foundation";
  }
  if (relativePath === "src/modules" || relativePath.startsWith("src/modules/")) {
    return "modules";
  }
  if (
    relativePath === "src/application" ||
    relativePath.startsWith("src/application/")
  ) {
    return "application";
  }

  return null;
}

function moduleName(absolutePath) {
  const relativePath = path.relative(path.join(sourceRoot, "modules"), absolutePath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    return null;
  }

  const [name] = relativePath.split(path.sep);
  return name || null;
}

function resolveTarget(importerPath, specifier) {
  for (const [alias, relativeRoot] of aliasRoots) {
    if (specifier === alias || specifier.startsWith(`${alias}/`)) {
      const remainder = specifier === alias ? "" : specifier.slice(alias.length + 1);
      const absolutePath = path.resolve(projectRoot, relativeRoot, remainder);
      return { absolutePath, layer: pathLayer(absolutePath) };
    }
  }

  if (specifier.startsWith(".")) {
    const absolutePath = path.resolve(path.dirname(importerPath), specifier);
    return { absolutePath, layer: pathLayer(absolutePath) };
  }

  return { absolutePath: null, layer: null };
}

function inspectImport(importerPath, specifier) {
  const from = toProjectPath(importerPath);
  const sourceLayer = managedSourceLayer(importerPath);
  const target = resolveTarget(importerPath, specifier);
  const violations = [];

  if (sourceLayer === "foundation" && ["modules", "application"].includes(target.layer)) {
    violations.push({
      from,
      specifier,
      rule: "layer-direction",
      message: `foundation cannot depend on ${target.layer}`,
    });
  }

  if (sourceLayer === "modules" && target.layer === "application") {
    violations.push({
      from,
      specifier,
      rule: "layer-direction",
      message: "modules cannot depend on application",
    });
  }

  if (/^@modules\/[^/]+\/.+/.test(specifier)) {
    violations.push({
      from,
      specifier,
      rule: "module-public-api",
      message: "module internals cannot be imported through a deep @modules path",
    });
  }

  if (
    sourceLayer === "modules" &&
    target.layer === "modules" &&
    specifier.startsWith(".") &&
    moduleName(importerPath) &&
    moduleName(target.absolutePath) &&
    moduleName(importerPath) !== moduleName(target.absolutePath)
  ) {
    violations.push({
      from,
      specifier,
      rule: "cross-module-relative",
      message: "cross-module imports must use the target module public entry",
    });
  }

  return violations;
}

const sourceFiles = collectSourceFiles(sourceRoot);
const violations = [];
let importCount = 0;

for (const relativePath of forbiddenRootSourcePaths) {
  if (fs.existsSync(path.join(projectRoot, relativePath))) {
    violations.push({
      from: relativePath,
      specifier: "(filesystem)",
      rule: "root-source-closure",
      message: "legacy root browser source path must not exist",
    });
  }
}

for (const filePath of sourceFiles) {
  if (managedSourceLayer(filePath) === null) {
    violations.push({
      from: toProjectPath(filePath),
      specifier: "(filesystem)",
      rule: "source-layout",
      message: "browser source must belong to application, modules, or foundation",
    });
  }

  const specifiers = getImports(filePath);
  importCount += specifiers.length;

  for (const specifier of specifiers) {
    for (const violation of inspectImport(filePath, specifier)) {
      violations.push(violation);
    }
  }
}

if (violations.length > 0) {
  if (violations.length > 0) {
    console.error("Architecture violations:");
    for (const violation of violations) {
      console.error(
        `- [${violation.rule}] ${violation.from} -> ${violation.specifier}: ${violation.message}`,
      );
    }
  }

  process.exitCode = 1;
} else {
  console.log(
    `Architecture check passed: ${sourceFiles.length} source files, ${importCount} imports, 0 violations.`,
  );
}
