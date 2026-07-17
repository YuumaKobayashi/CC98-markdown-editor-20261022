"use strict";

const path = require("path");
const { themePlaceholder, themes } = require("./theme-manifest.cjs");

function basename(fileName) {
  return path.posix.basename(fileName.replace(/\\/g, "/"));
}

function createThemeNames(cssFiles) {
  const names = cssFiles.map(basename);
  const result = [themePlaceholder];

  for (const theme of themes) {
    const matches = names.filter(
      (name) => name === `${theme.key}.css` || name.startsWith(`${theme.key}-`)
    );
    if (matches.length !== 1) {
      throw new Error(
        `主题 ${theme.id}:${theme.key} 应有且仅有一个 CSS 产物，实际为 ${matches.length}`
      );
    }
    result.push(matches[0]);
  }

  return result;
}

function createWebpackTemplateParameters({ assets, errorTemplate, unsupportedTemplate }) {
  const themeKeys = new Set(themes.map(({ key }) => key));
  const jsFileNames = assets.js
    .map(basename)
    .filter((name) => !themeKeys.has(name.replace(/(?:-[^.]+)?\.js$/, "")));

  return {
    errorTemplate,
    unsupportedTemplate,
    scriptType: "text/javascript",
    jsFileNames,
    themeNames: createThemeNames(assets.css),
  };
}

function renderTemplate(source, parameters) {
  const replacements = new Map([
    ["<%= errorTemplate %>", parameters.errorTemplate],
    ["<%= unsupportedTemplate %>", parameters.unsupportedTemplate],
    ["<%= JSON.stringify(scriptType) %>", JSON.stringify(parameters.scriptType)],
    ["<%= JSON.stringify(jsFileNames) %>", JSON.stringify(parameters.jsFileNames)],
    ["<%= JSON.stringify(themeNames) %>", JSON.stringify(parameters.themeNames)],
  ]);

  let rendered = source;
  for (const [placeholder, value] of replacements) {
    if (!rendered.includes(placeholder)) {
      throw new Error(`HTML 模板缺少占位符：${placeholder}`);
    }
    rendered = rendered.replace(placeholder, value);
  }
  if (rendered.includes("<%")) {
    throw new Error("HTML 模板仍含未处理的 EJS 表达式");
  }
  return rendered;
}

module.exports = {
  createThemeNames,
  createWebpackTemplateParameters,
  renderTemplate,
};
