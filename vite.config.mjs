import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { minify } from "html-minifier-terser";
import ts from "typescript";
import { defineConfig } from "vite";

const require = createRequire(import.meta.url);
const { themes, themeEntries } = require("./build/theme-manifest.cjs");
const { createThemeNames, renderTemplate } = require("./build/template-contract.cjs");
const root = path.dirname(fileURLToPath(import.meta.url));
const modernSourcePrefix = normalizeFsPath(path.join(root, "src")) + "/";
const browserProcessDefines = {
  // vfile@3 expects the browser process shim that Webpack supplied implicitly.
  "process.cwd": "(() => '/')",
};

function normalizeFsPath(fileName) {
  return fileName
    .replace(/\\/g, "/")
    .replace(/^\/([A-Za-z]:\/)/, "$1")
    .toLowerCase();
}

function loadTypeScriptCompilerOptions(configName) {
  const configFile = path.join(root, configName);
  const { config, error } = ts.readConfigFile(configFile, ts.sys.readFile);
  const parsed = error
    ? { errors: [error] }
    : ts.parseJsonConfigFileContent(config, ts.sys, root, undefined, configFile);
  if (parsed.errors.length > 0) {
    throw new Error(
      ts.formatDiagnostics(parsed.errors, {
        getCanonicalFileName: (fileName) => fileName,
        getCurrentDirectory: () => root,
        getNewLine: () => "\n",
      })
    );
  }

  return {
    ...parsed.options,
    noEmit: false,
    noEmitOnError: false,
    sourceMap: false,
  };
}

const devStaticRewrites = [
  ["/static/scripts/lib/jquery/", "node_modules/jquery/dist/"],
  ["/static/scripts/lib/moment/", "node_modules/moment/"],
  ["/static/scripts/lib/bootstrap/", "node_modules/bootstrap/dist/"],
  ["/static/scripts/lib/bootstrap-icons/", "node_modules/bootstrap-icons/"],
  ["/static/scripts/lib/frowser/", "node_modules/frowser/build/"],
  ["/static/scripts/lib/mathjax-full/", "node_modules/mathjax-full/"],
  ["/static/scripts/lib/spectrum/", "node_modules/spectrum-colorpicker/"],
  ["/static/content/font-awesome/", "node_modules/font-awesome/"],
  ["/static/content/DPlayer.min.css", "node_modules/dplayer/dist/DPlayer.min.css"],
  ["/static/content/DPlayer.min.css.map", "node_modules/dplayer/dist/DPlayer.min.css.map"],
  ["/static/content/APlayer.min.css", "node_modules/aplayer/dist/APlayer.min.css"],
  ["/static/content/APlayer.min.css.map", "node_modules/aplayer/dist/APlayer.min.css.map"],
  ["/static/content/hls.min.js", "node_modules/hls.js/dist/hls.min.js"],
];

function toViteFsUrl(fileName) {
  return `/@fs/${fileName.replace(/\\/g, "/")}`;
}

function convertStaticRequires(code) {
  const sideEffectImports = new Set();
  const imports = new Map();
  let rewritten = code.replace(
    /^\s*require\(\s*(["'])([^"']+)\1\s*\);?\s*$/gm,
    (_match, _quote, specifier) => {
      sideEffectImports.add(specifier);
      return "";
    }
  );
  rewritten = rewritten.replace(
    /\brequire\(\s*(["'])([^"']+)\1\s*\)/g,
    (_match, _quote, specifier) => {
      if (!imports.has(specifier)) {
        imports.set(specifier, `__vite_static_require_${imports.size}`);
      }
      return imports.get(specifier);
    }
  );
  if (imports.size === 0 && sideEffectImports.size === 0) return rewritten;

  const importStatements = [
    ...[...sideEffectImports]
      .filter((specifier) => !imports.has(specifier))
      .map((specifier) => `import ${JSON.stringify(specifier)};`),
    ...[...imports].map(
      ([specifier, identifier]) => `import ${identifier} from ${JSON.stringify(specifier)};`
    ),
  ];
  return `${importStatements.join("\n")}\n${rewritten}`;
}

function transitionalTypeScriptPlugin({ convertRequires }) {
  const modernCompilerOptions = loadTypeScriptCompilerOptions("tsconfig.json");
  const legacyCompilerOptions = loadTypeScriptCompilerOptions("tsconfig.legacy.json");

  return {
    name: "cc98-transitional-typescript",
    enforce: "pre",
    transform(code, id) {
      const fileName = id.split("?", 1)[0];
      if (!/\.tsx?$/.test(fileName) || fileName.includes("/node_modules/")) {
        return null;
      }
      const result = ts.transpileModule(code, {
        fileName,
        compilerOptions: normalizeFsPath(fileName).startsWith(modernSourcePrefix)
          ? modernCompilerOptions
          : legacyCompilerOptions,
        reportDiagnostics: false,
      });
      return {
        code: convertRequires ? convertStaticRequires(result.outputText) : result.outputText,
        map: null,
      };
    },
  };
}

function jqueryGlobalPlugin() {
  const jqueryModule = "\0cc98-jquery-global";
  return {
    name: "cc98-jquery-global",
    resolveId(id) {
      return id === "jquery" ? jqueryModule : null;
    },
    load(id) {
      if (id !== jqueryModule) return null;
      return "const jquery = window.jQuery; export default jquery;";
    },
  };
}

function forumHtmlPlugin() {
  const devThemeNames = [
    "default_theme_placeholder",
    ...themes.map(({ key }) => `${key}.css`),
  ];

  async function renderDevHtml(server, requestUrl) {
    const source = await fs.readFile(path.join(root, "Template.ejs"), "utf8");
    const html = renderTemplate(source, {
      errorTemplate: await fs.readFile(path.join(root, "error.html"), "utf8"),
      unsupportedTemplate: await fs.readFile(path.join(root, "unsupported.html"), "utf8"),
      scriptType: "module",
      jsFileNames: ["main.js"],
      themeNames: devThemeNames,
    });
    return server.transformIndexHtml(requestUrl, html);
  }

  return {
    name: "cc98-forum-html",
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const requestUrl = new URL(request.url || "/", "http://vite.local");

        if (requestUrl.pathname === "/static/scripts/main.js") {
          request.url = "/src/application/bootstrap/index.tsx";
          next();
          return;
        }

        const theme = themes.find(
          ({ key }) => requestUrl.pathname === `/static/content/${key}.css`
        );
        if (theme) {
          request.url = `${toViteFsUrl(path.resolve(root, theme.entry))}?direct`;
          next();
          return;
        }

        for (const [publicPath, sourcePath] of devStaticRewrites) {
          const matches = publicPath.endsWith("/")
            ? requestUrl.pathname.startsWith(publicPath)
            : requestUrl.pathname === publicPath;
          if (!matches) continue;
          const suffix = requestUrl.pathname.slice(publicPath.length);
          const absolutePath = path.resolve(root, sourcePath, suffix);
          const directQuery = absolutePath.endsWith(".css") ? "?direct" : requestUrl.search;
          request.url = `${toViteFsUrl(absolutePath)}${directQuery}`;
          next();
          return;
        }

        const acceptsHtml = request.headers.accept?.includes("text/html");
        const isHtmlEntry =
          requestUrl.pathname === "/" ||
          requestUrl.pathname === "/static/index.html" ||
          (acceptsHtml && !path.posix.extname(requestUrl.pathname));
        if (
          request.method === "GET" &&
          isHtmlEntry
        ) {
          try {
            response.statusCode = 200;
            response.setHeader("Content-Type", "text/html; charset=utf-8");
            response.end(await renderDevHtml(server, requestUrl.pathname));
          } catch (error) {
            next(error);
          }
          return;
        }

        next();
      });
    },
    async generateBundle(_options, bundle) {
      const cssFiles = [];
      let mainFile;
      for (const output of Object.values(bundle)) {
        if (output.type === "asset" && output.fileName.endsWith(".css")) {
          cssFiles.push(output.fileName);
        }
        if (output.type === "chunk" && output.isEntry && output.name === "main") {
          mainFile = path.posix.basename(output.fileName);
        }
      }
      if (!mainFile) throw new Error("Vite 未生成 main 入口");

      const source = await fs.readFile(path.join(root, "Template.ejs"), "utf8");
      const errorTemplate = await minify(
        await fs.readFile(path.join(root, "error.html"), "utf8"),
        { collapseWhitespace: true, minifyJS: true }
      );
      const unsupportedTemplate = await minify(
        await fs.readFile(path.join(root, "unsupported.html"), "utf8"),
        { collapseWhitespace: true, minifyJS: true }
      );
      const html = renderTemplate(source, {
        errorTemplate,
        unsupportedTemplate,
        scriptType: "module",
        jsFileNames: [mainFile],
        themeNames: createThemeNames(cssFiles),
      });
      this.emitFile({
        type: "asset",
        fileName: "static/index.html",
        source: await minify(html, { collapseWhitespace: true, minifyJS: true }),
      });
    },
  };
}

export default defineConfig(({ command }) => ({
  root,
  publicDir: "public",
  plugins: [
    transitionalTypeScriptPlugin({ convertRequires: command === "serve" }),
    jqueryGlobalPlugin(),
    forumHtmlPlugin(),
  ],
  resolve: {
    alias: [
      { find: "@application", replacement: path.join(root, "src/application") },
      { find: "@modules", replacement: path.join(root, "src/modules") },
      { find: "@foundation", replacement: path.join(root, "src/foundation") },
      { find: "@pages", replacement: path.join(root, "src/pages") },
      { find: "@features", replacement: path.join(root, "src/features") },
      { find: "@legacy", replacement: root },
      { find: "path", replacement: path.join(root, "node_modules/path-browserify/index.js") },
      { find: /^~antd/, replacement: path.join(root, "node_modules/antd") },
    ],
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify(command === "serve" ? "development" : "production"),
    ...browserProcessDefines,
  },
  optimizeDeps: {
    rolldownOptions: {
      transform: {
        define: browserProcessDefines,
      },
    },
  },
  server: {
    host: "127.0.0.1",
    port: 25174,
    strictPort: true,
  },
  css: {
    lightningcss: { errorRecovery: true },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    copyPublicDir: true,
    assetsInlineLimit: 0,
    cssCodeSplit: true,
    cssMinify: "lightningcss",
    reportCompressedSize: false,
    target: "es2015",
    rolldownOptions: {
      input: {
        main: path.join(root, "src/application/bootstrap/index.tsx"),
        ...Object.fromEntries(
          themes.map(({ key }) => [key, path.resolve(root, themeEntries[key])])
        ),
      },
      output: {
        entryFileNames: "static/scripts/[name]-[hash].js",
        chunkFileNames: "static/scripts/[name]-[hash].js",
        assetFileNames(assetInfo) {
          return assetInfo.name?.endsWith(".css")
            ? "static/content/[name]-[hash][extname]"
            : "static/assets/[name]-[hash][extname]";
        },
        manualChunks(id) {
          return id.includes("node_modules") ? "vendors" : undefined;
        },
      },
    },
  },
}));
