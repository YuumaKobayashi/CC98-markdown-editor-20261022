// P05 Vite 正式构建入口。
// Vite 先生成 dist，再复制部署所需的维护文件和固定 URL 第三方资源；
// node_modules 中的文件只进入构建产物，不作为手工维护资源提交。
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "vite";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "dist");

const copies = [
  ["deploy/iis/web.config", "web.config"],
  ["reset.html", "static/reset.html"],
  ["node_modules/jquery/dist", "static/scripts/lib/jquery"],
  ["node_modules/moment", "static/scripts/lib/moment"],
  ["node_modules/frowser/build", "static/scripts/lib/frowser"],
  ["node_modules/font-awesome", "static/content/font-awesome"],
  ["node_modules/katex/dist", "static/scripts/lib/katex"],
  ["node_modules/@highlightjs/cdn-assets/highlight.min.js", "static/scripts/lib/highlight/highlight.min.js"],
  ["node_modules/@highlightjs/cdn-assets/styles/atom-one-light.min.css", "static/scripts/lib/highlight/styles/atom-one-light.min.css"],
  ["node_modules/@highlightjs/cdn-assets/styles/atom-one-dark.min.css", "static/scripts/lib/highlight/styles/atom-one-dark.min.css"],
  // Vditor 运行时资源：cdn 地址为 /static/scripts/lib/vditor，资源
  // 路径拼接为 `${cdn}/dist/...`，故目标路径保留 dist 一层。
  ["node_modules/vditor/dist", "static/scripts/lib/vditor/dist"],
  ["node_modules/spectrum-colorpicker/spectrum.js", "static/scripts/lib/spectrum/spectrum.js"],
  ["node_modules/dplayer/dist/DPlayer.min.css", "static/content/DPlayer.min.css"],
  ["node_modules/dplayer/dist/DPlayer.min.css.map", "static/content/DPlayer.min.css.map"],
  ["node_modules/aplayer/dist/APlayer.min.css", "static/content/APlayer.min.css"],
  ["node_modules/aplayer/dist/APlayer.min.css.map", "static/content/APlayer.min.css.map"],
  ["node_modules/hls.js/dist/hls.min.js", "static/content/hls.min.js"],
];

await build({ configFile: path.join(root, "vite.config.mjs") });

for (const [from, to] of copies) {
  const source = path.join(root, from);
  const destination = path.join(output, to);
  const stat = await fs.stat(source);
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.cp(source, destination, { recursive: stat.isDirectory(), force: true });
}

console.log(`Vite 正式产物已生成：${output}`);
