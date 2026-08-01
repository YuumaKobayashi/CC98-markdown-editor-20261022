import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, "..");
const sourceRoot = path.join(projectRoot, "src");
const allowlistPath = path.join(scriptDirectory, "style-transition-allowlist.json");
const require = createRequire(import.meta.url);
const { themes } = require("../build/theme-manifest.cjs");

function toProjectPath(filePath) {
  return path.relative(projectRoot, filePath).split(path.sep).join("/");
}

function collectFiles(directory, predicate) {
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

const allowlist = JSON.parse(fs.readFileSync(allowlistPath, "utf8"));
const transitionalModules = new Set(allowlist.transitionalModulePartials);
const legacyRootStyles = new Set(allowlist.legacyRootStyles);
const moduleFiles = collectFiles(sourceRoot, (name) => name.endsWith(".module.scss"));
const modulePaths = new Set(moduleFiles.map(toProjectPath));
const sassConsumers = new Map();
const typescriptConsumers = new Map();
const errors = [];

if (transitionalModules.size !== 0) {
  errors.push(`C1.5 已收口，过渡样式清单必须为空，实际为 ${transitionalModules.size} 项`);
}

if (moduleFiles.length !== 42) {
  errors.push(`C1.5 应保留 42 个真实 CSS Module，实际为 ${moduleFiles.length} 个`);
}

for (const relativePath of transitionalModules) {
  if (!modulePaths.has(relativePath)) {
    errors.push(`过渡样式清单包含不存在的文件: ${relativePath}`);
  }
}

const styleRoots = ["src", "Styles", "Components"]
  .map((directory) => path.join(projectRoot, directory))
  .filter((directory) => fs.existsSync(directory));
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

const typescriptRoots = ["src", "Components"]
  .map((directory) => path.join(projectRoot, directory))
  .filter((directory) => fs.existsSync(directory));
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
    const sourceWithoutImport =
      source.slice(0, match.index) + source.slice(match.index + match[0].length);
    const bindingUsePattern = new RegExp(`\\b${binding}\\s*(?:\\.|\\[)`);
    if (!bindingUsePattern.test(sourceWithoutImport)) {
      errors.push(`CSS Module 导入必须实际消费映射: ${toProjectPath(sourceFile)} -> ${binding}`);
    }
    addConsumer(
      typescriptConsumers,
      path.resolve(path.dirname(sourceFile), specifier),
      sourceFile,
    );
  }

  const anyModuleImportPattern = /(?:import|export)\s+(?:[^"']*?\s+from\s+)?["']([^"']+\.module\.scss)["']/g;
  for (const match of source.matchAll(anyModuleImportPattern)) {
    if (!matchedSpecifiers.has(match[1])) {
      errors.push(`CSS Module 必须使用默认绑定并实际消费: ${toProjectPath(sourceFile)} -> ${match[1]}`);
    }
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

const stylesDirectory = path.join(projectRoot, "Styles");
const actualLegacyRootStyles = new Set(
  collectFiles(stylesDirectory, (name) => name.endsWith(".scss")).map(toProjectPath),
);

for (const relativePath of actualLegacyRootStyles) {
  if (!legacyRootStyles.has(relativePath)) {
    errors.push(`禁止新增根 Styles 文件: ${relativePath}`);
  }
}
for (const relativePath of legacyRootStyles) {
  if (!actualLegacyRootStyles.has(relativePath)) {
    errors.push(`根 Styles 清单包含不存在的文件: ${relativePath}`);
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
      `${transitionalModules.size} transitional partials, ${themes.length} themes.`,
  );
}
