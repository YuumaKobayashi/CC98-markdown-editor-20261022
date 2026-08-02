import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, "..");
const sourceRoot = path.join(projectRoot, "src");
const allowlistPath = path.join(scriptDirectory, "style-transition-allowlist.json");
const globalBaselinePath = path.join(scriptDirectory, "style-global-baseline.json");
const ownerFreezePath = path.join(scriptDirectory, "style-owner-freeze.json");
const require = createRequire(import.meta.url);
const { themes } = require("../build/theme-manifest.cjs");

function toProjectPath(filePath) {
  return path.relative(projectRoot, filePath).split(path.sep).join("/");
}

function applicationRouteName(filePath) {
  const relativePath = path.relative(
    path.join(sourceRoot, "application", "routes"),
    filePath,
  );
  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    return null;
  }
  return relativePath.split(path.sep)[0] || null;
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

function addConsumer(consumers, targetPath, consumerPath) {
  const key = path.normalize(targetPath);
  const current = consumers.get(key) ?? new Set();
  current.add(toProjectPath(consumerPath));
  consumers.set(key, current);
}

function resolveSassImport(importerPath, specifier) {
  if (!specifier.includes(".module")) return null;

  const unresolved = path.resolve(path.dirname(importerPath), specifier);
  const candidates = [
    unresolved,
    `${unresolved}.scss`,
    path.join(path.dirname(unresolved), `_${path.basename(unresolved)}.scss`),
  ];

  return candidates.find((candidate) => fs.existsSync(candidate)) ?? null;
}

function collectGlobalOccurrences(source) {
  const occurrences = [];
  let cursor = 0;

  while (cursor < source.length) {
    const start = source.indexOf(":global(", cursor);
    if (start === -1) break;

    let depth = 1;
    let end = start + ":global(".length;
    while (end < source.length && depth > 0) {
      if (source[end] === "(") depth += 1;
      if (source[end] === ")") depth -= 1;
      end += 1;
    }

    if (depth !== 0) {
      return { occurrences, unterminatedAt: start };
    }

    occurrences.push(source.slice(start, end));
    cursor = end;
  }

  return { occurrences, unterminatedAt: null };
}

function fingerprintGlobalOccurrences(occurrences) {
  return crypto.createHash("sha256").update(occurrences.join("\n")).digest("hex");
}

const allowlist = JSON.parse(fs.readFileSync(allowlistPath, "utf8"));
const globalBaseline = JSON.parse(fs.readFileSync(globalBaselinePath, "utf8"));
const ownerFreeze = JSON.parse(fs.readFileSync(ownerFreezePath, "utf8"));
const transitionalModules = new Set(allowlist.transitionalModulePartials);
const moduleRoots = [sourceRoot];
const moduleFiles = moduleRoots.flatMap((directory) =>
  collectFiles(directory, (name) => name.endsWith(".module.scss")),
);
const modulePaths = new Set(moduleFiles.map(toProjectPath));
const sassConsumers = new Map();
const typescriptConsumers = new Map();
const typescriptEdges = [];
const errors = [];

const frozenOwnerEdges = new Map();
for (const entry of ownerFreeze.frozenInactiveImports) {
  for (const modulePath of entry.modules) {
    const key = `${entry.source} -> ${modulePath}`;
    if (frozenOwnerEdges.has(key)) {
      errors.push(`C1.7.3 冻结样式边重复登记: ${key}`);
    }
    frozenOwnerEdges.set(key, entry);
  }
}
const consumedFrozenOwnerEdges = new Set();

const frozenLegacyStyles = new Map();
const frozenLegacyStyleEdges = new Map();
for (const entry of ownerFreeze.frozenLegacyStyles ?? []) {
  if (frozenLegacyStyles.has(entry.path)) {
    errors.push(`${ownerFreeze.phase} 冻结 legacy 样式重复登记: ${entry.path}`);
  }
  frozenLegacyStyles.set(entry.path, entry);

  for (const importer of entry.importers) {
    const key = `${importer} -> ${entry.path}`;
    if (frozenLegacyStyleEdges.has(key)) {
      errors.push(`${ownerFreeze.phase} 冻结 legacy 样式边重复登记: ${key}`);
    }
    frozenLegacyStyleEdges.set(key, entry);
  }
}
const consumedFrozenLegacyStyleEdges = new Set();

if (transitionalModules.size !== 0) {
  errors.push(`C1.5 已收口，过渡样式清单必须为空，实际为 ${transitionalModules.size} 项`);
}

const expectedGlobalModules = new Map();
for (const entry of globalBaseline.modules) {
  if (expectedGlobalModules.has(entry.path)) {
    errors.push(`${globalBaseline.phase} global 基线包含重复文件: ${entry.path}`);
  }
  expectedGlobalModules.set(entry.path, entry);
}

if (expectedGlobalModules.size !== globalBaseline.moduleCount) {
  errors.push(
    `${globalBaseline.phase} global 基线应登记 ${globalBaseline.moduleCount} 个文件，实际为 ${expectedGlobalModules.size} 个`,
  );
}

let actualGlobalOccurrenceCount = 0;
let actualGlobalModuleCount = 0;
for (const moduleFile of moduleFiles) {
  const relativePath = toProjectPath(moduleFile);
  const source = fs.readFileSync(moduleFile, "utf8");
  const { occurrences, unterminatedAt } = collectGlobalOccurrences(source);

  if (unterminatedAt !== null) {
    errors.push(`${relativePath} 存在未闭合的 :global(...)，偏移 ${unterminatedAt}`);
  }
  if (occurrences.length === 0) continue;

  actualGlobalModuleCount += 1;
  actualGlobalOccurrenceCount += occurrences.length;
  const expected = expectedGlobalModules.get(relativePath);
  if (!expected) {
    errors.push(`${globalBaseline.phase} 禁止新增未登记业务 global: ${relativePath}`);
    continue;
  }
  if (occurrences.length !== expected.occurrences) {
    errors.push(
      `${relativePath} 的 :global(...) 数量应为 ${expected.occurrences}，实际为 ${occurrences.length}`,
    );
  }

  const fingerprint = fingerprintGlobalOccurrences(occurrences);
  if (fingerprint !== expected.fingerprint) {
    errors.push(`${relativePath} 的 :global(...) selector 集合偏离 ${globalBaseline.phase} 冻结基线`);
  }
}

for (const relativePath of expectedGlobalModules.keys()) {
  if (!modulePaths.has(relativePath)) {
    errors.push(`${globalBaseline.phase} global 基线包含不存在的 CSS Module: ${relativePath}`);
  }
}

if (actualGlobalModuleCount !== globalBaseline.moduleCount) {
  errors.push(
    `${globalBaseline.phase} 应冻结 ${globalBaseline.moduleCount} 个含 global 的 CSS Module，实际为 ${actualGlobalModuleCount} 个`,
  );
}
if (actualGlobalOccurrenceCount !== globalBaseline.totalOccurrences) {
  errors.push(
    `${globalBaseline.phase} 应冻结 ${globalBaseline.totalOccurrences} 处 :global(...)，实际为 ${actualGlobalOccurrenceCount} 处`,
  );
}

for (const relativePath of transitionalModules) {
  if (!modulePaths.has(relativePath)) {
    errors.push(`过渡样式清单包含不存在的文件: ${relativePath}`);
  }
}

const styleRoots = [sourceRoot];
const styleFiles = styleRoots.flatMap((directory) =>
  collectFiles(directory, (name) => name.endsWith(".scss")),
);

for (const styleFile of styleFiles) {
  const source = fs.readFileSync(styleFile, "utf8");
  const importPattern = /@import\s+["']([^"']+)["']/g;
  for (const match of source.matchAll(importPattern)) {
    const target = resolveSassImport(styleFile, match[1]);
    if (target?.endsWith(".module.scss")) {
      addConsumer(sassConsumers, target, styleFile);
    }
  }
}

const typescriptRoots = [sourceRoot];
const sourceFiles = typescriptRoots.flatMap((directory) =>
  collectFiles(directory, (name) => /\.tsx?$/.test(name)),
);
for (const sourceFile of sourceFiles) {
  const source = fs.readFileSync(sourceFile, "utf8");
  const importPattern = /import\s+([A-Za-z_$][\w$]*)\s+from\s+["']([^"']+\.module\.scss)["']/g;
  const matchedSpecifiers = new Set();
  for (const match of source.matchAll(importPattern)) {
    const binding = match[1];
    const specifier = match[2];
    matchedSpecifiers.add(specifier);
    if (!specifier.startsWith(".")) {
      errors.push(`CSS Module 必须由 owner 使用相对路径导入: ${toProjectPath(sourceFile)} -> ${specifier}`);
      continue;
    }
    const targetPath = path.resolve(path.dirname(sourceFile), specifier);
    const importerRoute = applicationRouteName(sourceFile);
    const targetRoute = applicationRouteName(targetPath);
    if (importerRoute && targetRoute && importerRoute !== targetRoute) {
      errors.push(
        `Application Route 不得反向导入其他 Route 的 CSS Module: ${toProjectPath(sourceFile)} -> ${specifier}`,
      );
    }
    const sourceWithoutImport =
      source.slice(0, match.index) + source.slice(match.index + match[0].length);
    const bindingUsePattern = new RegExp(`\\b${binding}\\s*(?:\\.|\\[)`);
    if (!bindingUsePattern.test(sourceWithoutImport)) {
      errors.push(`CSS Module 导入必须实际消费映射: ${toProjectPath(sourceFile)} -> ${binding}`);
    }
    addConsumer(
      typescriptConsumers,
      targetPath,
      sourceFile,
    );
    typescriptEdges.push({
      sourceFile,
      sourcePath: toProjectPath(sourceFile),
      targetPath,
      targetProjectPath: toProjectPath(targetPath),
      specifier,
    });
  }

  const anyModuleImportPattern = /(?:import|export)\s+(?:[^"']*?\s+from\s+)?["']([^"']+\.module\.scss)["']/g;
  for (const match of source.matchAll(anyModuleImportPattern)) {
    if (!matchedSpecifiers.has(match[1])) {
      errors.push(`CSS Module 必须使用默认绑定并实际消费: ${toProjectPath(sourceFile)} -> ${match[1]}`);
    }
  }
}

for (const edge of typescriptEdges) {
  const freezeKey = `${edge.sourcePath} -> ${edge.targetProjectPath}`;
  const frozen = frozenOwnerEdges.has(freezeKey);
  const sourceStem = path.basename(edge.sourceFile, path.extname(edge.sourceFile));
  const moduleStem = path.basename(edge.targetPath, ".module.scss");
  const colocated = path.dirname(edge.sourceFile) === path.dirname(edge.targetPath);
  const targetExists = modulePaths.has(edge.targetProjectPath);

  if (!targetExists && !frozen) {
    errors.push(`CSS Module 导入目标不存在: ${edge.sourcePath} -> ${edge.specifier}`);
  }
  if ((!colocated || sourceStem !== moduleStem) && !frozen) {
    errors.push(
      `活动组件必须与同名 CSS Module 共置: ${edge.sourcePath} -> ${edge.targetProjectPath}`,
    );
  }
  if (frozen) consumedFrozenOwnerEdges.add(freezeKey);
}

for (const [targetPath, consumers] of typescriptConsumers) {
  if (consumers.size <= 1) continue;
  for (const consumer of consumers) {
    const targetProjectPath = toProjectPath(targetPath);
    const freezeKey = `${consumer} -> ${targetProjectPath}`;
    if (!frozenOwnerEdges.has(freezeKey)) {
      errors.push(`活动 CSS Module 只能有一个直接 owner: ${targetProjectPath} <- ${consumer}`);
    } else {
      consumedFrozenOwnerEdges.add(freezeKey);
    }
  }
}

for (const freezeKey of frozenOwnerEdges.keys()) {
  if (!consumedFrozenOwnerEdges.has(freezeKey)) {
    errors.push(`${ownerFreeze.phase} 冻结样式边已失效，应移出清单: ${freezeKey}`);
  }
}

const legacyStyleTypeScriptRoots = [sourceRoot];
const legacyStyleSourceFiles = legacyStyleTypeScriptRoots.flatMap((directory) =>
  collectFiles(directory, (name) => /\.tsx?$/.test(name)),
);

for (const sourceFile of legacyStyleSourceFiles) {
  const source = fs.readFileSync(sourceFile, "utf8");
  const importPattern = /import\s+["']([^"']+\.scss)["']/g;
  for (const match of source.matchAll(importPattern)) {
    if (match[1].endsWith(".module.scss")) continue;
    if (!match[1].startsWith(".")) {
      errors.push(
        `冻结 legacy 样式必须使用相对路径导入: ${toProjectPath(sourceFile)} -> ${match[1]}`,
      );
      continue;
    }

    const targetPath = path.resolve(path.dirname(sourceFile), match[1]);
    const key = `${toProjectPath(sourceFile)} -> ${toProjectPath(targetPath)}`;
    if (!frozenLegacyStyleEdges.has(key)) {
      errors.push(`禁止新增未登记的 legacy 全局样式导入: ${key}`);
      continue;
    }
    consumedFrozenLegacyStyleEdges.add(key);
  }
}

for (const [stylePath] of frozenLegacyStyles) {
  const absolutePath = path.resolve(projectRoot, stylePath);
  if (!fs.existsSync(absolutePath)) {
    errors.push(`${ownerFreeze.phase} 冻结 legacy 样式不存在: ${stylePath}`);
  }
}
for (const freezeKey of frozenLegacyStyleEdges.keys()) {
  if (!consumedFrozenLegacyStyleEdges.has(freezeKey)) {
    errors.push(`${ownerFreeze.phase} 冻结 legacy 样式边已失效，应移出清单: ${freezeKey}`);
  }
}

for (const moduleFile of moduleFiles) {
  const relativePath = toProjectPath(moduleFile);
  const sassCount = sassConsumers.get(path.normalize(moduleFile))?.size ?? 0;
  const typescriptCount = typescriptConsumers.get(path.normalize(moduleFile))?.size ?? 0;

  if (transitionalModules.has(relativePath)) {
    if (sassCount === 0) {
      errors.push(`过渡样式已不再由 Sass 聚合，应迁出清单: ${relativePath}`);
    }
    if (typescriptCount !== 0) {
      errors.push(`过渡样式不得同时作为真实 CSS Module 导入: ${relativePath}`);
    }
  } else {
    if (sassCount !== 0) {
      errors.push(`真实 CSS Module 不得由 Sass 聚合: ${relativePath}`);
    }
    if (typescriptCount === 0) {
      errors.push(`未登记的伪 CSS Module 或无消费者样式: ${relativePath}`);
    }
  }
}

const expectedProperties = [
  "--cc98-theme-color-main",
  "--cc98-theme-color-sub",
  "--cc98-theme-color-topbar",
  "--cc98-background-image",
  "--cc98-background-image-card",
  "--cc98-background-color-page",
  "--cc98-background-color-textarea",
  "--cc98-font-color-text",
];
const customPropertiesPath = path.join(
  sourceRoot,
  "foundation/theme/tokens/_custom-properties.scss",
);
const customPropertiesSource = fs.readFileSync(customPropertiesPath, "utf8");

for (const property of expectedProperties) {
  const occurrences = customPropertiesSource.split(`${property}:`).length - 1;
  if (occurrences !== 1) {
    errors.push(`主题变量 ${property} 应在共享 partial 中恰好声明一次，实际为 ${occurrences}`);
  }
}

if (themes.length !== 29) {
  errors.push(`主题 manifest 应包含 29 个主题，实际为 ${themes.length}`);
}

for (const theme of themes) {
  const entryPath = path.resolve(projectRoot, theme.entry);
  const entryName = path.basename(entryPath, ".scss");
  const imports = [...fs.readFileSync(entryPath, "utf8").matchAll(/@import\s+["']([^"']+)["']/g)]
    .map((match) => match[1]);
  const expectedImports = [
    `../tokens/${entryName}`,
    "../tokens/custom-properties",
    "../../styles/Site.scss",
  ];

  if (JSON.stringify(imports) !== JSON.stringify(expectedImports)) {
    errors.push(`${toProjectPath(entryPath)} 的主题导入顺序必须为 token -> custom-properties -> Site.scss`);
  }
}

if (errors.length) {
  console.error("Style migration check failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(
    `Style migration check passed: ${moduleFiles.length - transitionalModules.size} real CSS Module, ` +
      `${transitionalModules.size} transitional partials, ${themes.length} themes, ` +
      `${actualGlobalOccurrenceCount} registered global occurrences in ${actualGlobalModuleCount} modules, ` +
      `${frozenOwnerEdges.size} frozen inactive owner edges, ` +
      `${frozenLegacyStyleEdges.size} frozen legacy style edges.`,
  );
}
