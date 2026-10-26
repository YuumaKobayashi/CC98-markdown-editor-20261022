// Node 20-compatible, isolated test-only TypeScript loader. No emitted files.
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");
const root = path.resolve(__dirname, "..");
const original = require.extensions[".ts"];
require.extensions[".ts"] = (module, filename) => {
  const relative = path.relative(root, filename).replace(/\\/g, "/");
  if (!relative.startsWith("src/foundation/integrations/markdown/") && !relative.startsWith("scripts/")) {
    throw new Error(`Unexpected test import: ${relative}`);
  }
  const result = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    fileName: filename,
  });
  module._compile(result.outputText, filename);
};
(async () => {
  try {
    require("./check-markdown-helpers.ts");
    await require("./check-markdown-lifecycle.ts").run();
  } finally {
    if (original) require.extensions[".ts"] = original;
    else delete require.extensions[".ts"];
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
