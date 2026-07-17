// P04 Vite 影子构建入口。
// 只写入 dist-vite，不改变仍由 Webpack 负责的 dist；Vite 构建完成后再复制
// 现有部署依赖，避免把 node_modules 内容误当作 public 中的手工维护资源。
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "vite";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "dist-vite");

const copies = [
  ["deploy/iis/web.config", "web.config"],
  ["reset.html", "static/reset.html"],
  ["node_modules/jquery/dist", "static/scripts/lib/jquery"],
  ["node_modules/moment", "static/scripts/lib/moment"],
  ["node_modules/bootstrap/dist", "static/scripts/lib/bootstrap"],
  ["node_modules/bootstrap-icons", "static/scripts/lib/bootstrap-icons"],
  ["node_modules/frowser/build", "static/scripts/lib/frowser"],
  ["node_modules/font-awesome", "static/content/font-awesome"],
  ["node_modules/mathjax-full", "static/scripts/lib/mathjax-full"],
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

console.log(`Vite 影子产物已生成：${output}`);
