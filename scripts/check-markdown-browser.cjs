// Requires Playwright (local package or NODE_PATH); no login or live forum API calls.
const assert = require("node:assert/strict");
const path = require("node:path");
const { chromium } = require("playwright");

(async () => {
  const fs = require("node:fs/promises");
  const { build } = await import("vite");
  const root = path.resolve(__dirname, "..");
  // Bundle in memory and intercept all browser resources. No localhost server,
  // DNS, forum login or live uploads are involved in this regression suite.
  const bundle = await build({
    configFile: false,
    root,
    logLevel: "error",
    define: { "process.env.NODE_ENV": JSON.stringify("development") },
    resolve: { alias: {
      "@foundation": path.join(root, "src/foundation"),
      "@modules": path.join(root, "src/modules"),
      "@application": path.join(root, "src/application"),
    } },
    build: {
      write: false, minify: false, cssCodeSplit: false,
      lib: { entry: path.join(__dirname, "markdown-browser-harness.tsx"), name: "MarkdownHarness", formats: ["iife"] },
      rolldownOptions: { output: { codeSplitting: false } },
    },
  });
  const output = Array.isArray(bundle) ? bundle.flatMap((item) => item.output) : bundle.output;
  const javascript = output.filter((item) => item.type === "chunk").map((item) => item.code).join("\n");
  const stylesheet = output.filter((item) => item.type === "asset" && item.fileName.endsWith(".css")).map((item) => item.source).join("\n");
  let browser;
  try {
    browser = await chromium.launch({
      headless: true,
      channel: process.env.CC98_BROWSER_CHANNEL || (process.platform === "win32" ? "msedge" : undefined),
    });
    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const imageFile = await fs.readFile(path.join(root, "public/static/images/icon/lock.png"));
    await page.route("**/*", async (route) => {
      const url = new URL(route.request().url());
      if (url.pathname === "/") return route.fulfill({ contentType: "text/html", body: "<!doctype html><html><body></body></html>" });
      if (["/test-image.png", "/changed.png"].includes(url.pathname)) return route.fulfill({ contentType: "image/png", body: imageFile });
      const resources = [
        ["/static/scripts/lib/vditor/", "node_modules/vditor/"],
        ["/static/scripts/lib/katex/", "node_modules/katex/dist/"],
        ["/static/scripts/lib/highlight/", "node_modules/@highlightjs/cdn-assets/"],
      ];
      for (const [prefix, folder] of resources) {
        if (!url.pathname.startsWith(prefix)) continue;
        const filename = path.resolve(root, folder, url.pathname.slice(prefix.length));
        if (!filename.startsWith(path.resolve(root, folder) + path.sep)) return route.abort();
        const mime = filename.endsWith(".css") ? "text/css" : filename.endsWith(".js") ? "application/javascript" : "application/octet-stream";
        try { return await route.fulfill({ contentType: mime, body: await fs.readFile(filename) }); }
        catch { return route.fulfill({ status: 404, body: "missing fixture asset" }); }
      }
      return route.fulfill({ status: 404, body: "Remote image intentionally unavailable" });
    });
    await page.goto("http://cc98.test/");
    await page.addStyleTag({ content: stylesheet });
    await page.addScriptTag({ content: javascript });
    await page.evaluate(() => { window.harness = MarkdownHarness; });

    // Real DOMPurify integration, including generated KaTeX layout styles.
    await page.evaluate(async () => {
      const h = window.harness;
      const html = h.sanitizeHtml('<div class="katex"><a href="https://example.com" style="position:fixed;inset:0;z-index:9;transform:scale(9)">test</a></div><style>body{display:none}</style>');
      const container = document.createElement("div");
      container.innerHTML = html;
      const style = container.querySelector("a").style;
      if (style.position || style.zIndex || style.transform || container.querySelector("style")) throw new Error("sanitizer bypass");
      const katex = await h.ensureKatex();
      for (const formula of [String.raw`\frac{a}{b}`, String.raw`\sqrt[n]{x}`, String.raw`x_i^j`, String.raw`\begin{pmatrix}a&b\\c&d\end{pmatrix}`]) {
        container.innerHTML = h.sanitizeHtml(katex.renderToString(formula, { displayMode: true, throwOnError: false }));
        if (!container.querySelector(".katex")) throw new Error("missing sanitized formula");
      }
    });
    console.log("✓ 实际 DOMPurify 与 KaTeX 过滤管线");

    await page.evaluate(() => window.harness.mount(["![a](/test-image.png)", "second"], true));
    await page.waitForFunction(() => document.querySelectorAll(".vditor-ir .vditor-reset").length === 2);
    await page.waitForSelector(".cc98-img-toggle");
    const roots = page.locator(".vditor-ir .vditor-reset");
    // Reproduce the engine's caret-driven Markdown source mode before toggling.
    await page.evaluate(() => {
      const node = document.querySelector('[data-editor="0"] span[data-type="img"]');
      node.classList.add("vditor-ir__node--expand");
    });
    // Fails if MutationObserver keeps running; timeout remains in the Node process.
    await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 150)));
    await page.locator(".cc98-img-toggle").first().click();
    await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 150)));
    assert.equal(await page.locator(".cc98-img-toggle").first().textContent(), "折叠图片");
    await page.waitForFunction(() => {
      const node = document.querySelector('[data-editor="0"] span[data-type="img"]');
      const img = node.querySelector("img");
      return getComputedStyle(img).display !== "none" && img.complete && img.naturalWidth > 0;
    });
    await page.locator('[data-editor="0"] span[data-type="img"] img').click();
    await page.waitForFunction(() => {
      const marker = document.querySelector('[data-editor="0"] .vditor-ir__marker--link');
      return marker && marker.getBoundingClientRect().width > 0;
    });
    await page.keyboard.type("/changed.png");
    await page.waitForFunction(() => window.harness.values[0].includes("/changed.png"));
    if (await page.locator(".cc98-img-toggle").first().textContent() === "展开图片") await page.locator(".cc98-img-toggle").first().click();
    const imageButtonSize = await page.locator(".cc98-img-toggle").first().boundingBox();
    assert.ok(imageButtonSize.width >= 104 && imageButtonSize.height >= 36);
    await page.locator('[data-editor="0"] [data-type="cc98-expand"]').click();
    await page.waitForFunction(() => {
      const button = document.querySelector('[data-editor="0"] .cc98-img-toggle');
      const root = document.querySelector('[data-editor="0"] .vditor-ir .vditor-reset');
      const rect = button.getBoundingClientRect();
      const viewport = root.getBoundingClientRect();
      return button.textContent === "折叠图片" && getComputedStyle(button).visibility !== "hidden" &&
        rect.top >= viewport.top && rect.bottom <= viewport.bottom &&
        rect.bottom <= document.querySelector('[data-editor="0"] span[data-type="img"] img').getBoundingClientRect().top;
    });
    await page.locator(".cc98-img-toggle").first().click();
    await page.waitForFunction(() => {
      const img = document.querySelector('[data-editor="0"] span[data-type="img"] img');
      return getComputedStyle(img).display === "none";
    });
    console.log("✓ 原图确实解码、光标进入可编辑地址、按钮独立一行且放大后不覆盖图片");
    console.log("✓ StrictMode、多实例及图片展开观察器可收敛");

    await page.evaluate(() => window.harness.setValue(0, ""));
    await page.waitForFunction(() => document.querySelector('[data-value="0"]').textContent === "");
    await roots.nth(0).click();
    await page.keyboard.type("last input");
    // Read immediately on the next event loop; does not wait for Vditor's 400ms callback.
    await page.waitForFunction(() => window.harness.values[0].includes("last input"));
    assert.equal(await page.evaluate(() => window.harness.values[1].trimEnd()), "second");
    // Vditor records native undo snapshots after its configured 400ms delay.
    await page.waitForTimeout(450);
    await page.keyboard.press("Control+z");
    await page.waitForFunction(() => !window.harness.values[0].includes("last input"));
    await page.keyboard.press("Control+y");
    await page.waitForFunction(() => window.harness.values[0].includes("last input"));
    console.log("✓ 普通输入即时同步、多实例隔离与撤销重做路径");

    await page.evaluate(() => window.harness.setValue(0, ""));
    await page.waitForFunction(() => document.querySelector('[data-value="0"]').textContent === "");
    await roots.nth(0).click();
    for (let count = 1; count <= 4; count++) {
      await page.keyboard.type("$");
      await page.waitForFunction((expected) => window.harness.values[0].trim() === expected, "$".repeat(count));
    }
    await page.evaluate(() => window.harness.setValue(0, "$x$"));
    await page.waitForSelector('[data-editor="0"] .vditor-ir code[data-type="math-inline"]', { state: "attached" });
    await page.evaluate(() => window.harness.setValue(0, "$$\nx^2\n$$"));
    await page.waitForSelector('[data-editor="0"] .vditor-ir code[data-type="math-block"]', { state: "attached" });
    console.log("✓ 连续美元定界符、外部行内/块公式回填");

    await page.evaluate(() => window.harness.setValue(0, "upload preview"));
    await page.waitForFunction(() => document.querySelector('[data-value="0"]').textContent === "upload preview");
    await roots.nth(0).click();
    await page.locator('[data-editor="0"] input[type="file"]').setInputFiles({ name: "original.jpg", mimeType: "image/png", buffer: imageFile });
    await page.waitForFunction(() => window.harness.pendingUploads.length === 1);
    await page.evaluate(() => window.harness.pendingUploads.shift()("https://unavailable.test/original.jpg"));
    await page.waitForSelector('[data-editor="0"] .cc98-img-toggle');
    await page.locator('[data-editor="0"] .cc98-img-toggle').click();
    await page.waitForFunction(() => {
      const img = document.querySelector('[data-editor="0"] span[data-type="img"] img');
      return img?.complete && img.naturalWidth > 0 && img.src.startsWith("blob:");
    }, undefined, { timeout: 5000 }).catch(async (error) => {
      console.log("Upload preview diagnostics:", await page.evaluate(() => ({
        value: window.harness.values[0],
        output: document.querySelector('[data-value="0"]').textContent,
        images: [...document.querySelectorAll('[data-editor="0"] span[data-type="img"]')].map((node) => ({
          html: node.outerHTML, complete: node.querySelector("img").complete,
          width: node.querySelector("img").naturalWidth, currentSrc: node.querySelector("img").currentSrc,
        })),
      })));
      throw error;
    });
    assert.ok((await page.evaluate(() => window.harness.values[0])).includes("https://unavailable.test/original.jpg"));
    assert.ok(!(await page.evaluate(() => window.harness.values[0])).includes("blob:"));
    console.log("✓ 远端图片返回 404 时，刚上传的原图仍可预览且 Markdown 保留服务器地址");

    // File selection -> pending request -> document replacement -> new request.
    const file = { name: "report].txt", mimeType: "text/plain", buffer: Buffer.from("test") };
    await page.locator('[data-editor="0"] input[type="file"]').setInputFiles(file);
    await page.waitForFunction(() => window.harness.pendingUploads.length === 1);
    await page.evaluate(() => window.harness.setValue(0, "new document"));
    await page.waitForFunction(() => document.querySelector('[data-value="0"]').textContent === "new document");
    await page.locator('[data-editor="0"] input[type="file"]').setInputFiles({ ...file, name: "new.txt" });
    await page.waitForFunction(() => window.harness.pendingUploads.length === 2);
    await page.evaluate(() => {
      window.harness.pendingUploads[0]("https://example.com/old.txt");
      window.harness.pendingUploads[1]("https://example.com/new.txt");
    });
    await page.waitForFunction(() => window.harness.values[0].includes("new.txt"));
    assert.ok(!(await page.evaluate(() => window.harness.values[0])).includes("old.txt"));
    console.log("✓ 旧稿请求失效，新稿上传保留");

    await page.evaluate(() => window.harness.unmount());
    assert.deepEqual(errors, []);
    console.log("浏览器回归全部通过");
  } finally {
    if (browser) await browser.close();

  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
