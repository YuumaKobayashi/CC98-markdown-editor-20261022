# P04 人工检查清单

## Codex 已核对

- [x] 开始时位于 `dev20260716`，工作区干净，P03 已提交；
- [x] Node `20.20.0`、npm `10.8.2`，Vite `8.1.4`；
- [x] `npm ci --no-audit --no-fund` 成功；沙箱内首次因 npm cache 权限失败，获准环境重跑成功；
- [x] `npm ls --depth=0` 退出码为 0；
- [x] 水印仍为 `2.0.9`、仍固定 commit `b268ef6d5868689e25f0b8f0d58d203bf1f032d5`，没有私有库内容入库；
- [x] `npx tsc --noEmit --skipLibCheck` 成功；不带 `skipLibCheck` 时仍有旧第三方声明错误；
- [x] clean install 后 `npm run build:release` 成功；沙箱内 Terser `spawn EPERM` 后在获准环境成功；
- [x] clean install 后 `npm run build:shadow` 成功；沙箱内 Vite 路径解析 `spawn EPERM` 后在获准环境成功；
- [x] `npm run dev:shadow` 在 `127.0.0.1:5173` 启动成功，首页、`static/index.html`、Vite client、主入口、首末主题 CSS、jQuery、Font Awesome、播放器 CSS、两份播放器 CSS source map、配置 JSON 与 SPA fallback 均返回 200；
- [x] 抽查含旧静态 `require()` 的 Main、UBB、Markdown、播放器和编辑器模块，转换结果不再包含浏览器端 `require()`；其 32 个直接模块依赖均返回 200；
- [x] 修复 `formdata-polyfill` 纯副作用调用被误转成 default import 导致的白屏；9 个旧 `require()` 入口及其 45 个直接依赖复核均返回 200，`extends.tsx` 只生成 side-effect import；
- [x] Webpack 与 Vite HTML 均含 placeholder + 29 个同序主题，首项 `css_blue`、末项 `css_cc98_23rd_light`；
- [x] 两套输出均包含 `main`、`vendors`、`static/index.html`、`static/reset.html` 和 `web.config`；
- [x] `public/static` 的 2513 个文件在两套输出中均无缺失；
- [x] 两套 reset/IIS 产物分别与维护源 SHA-256 一致；
- [x] `dist-vite/`、`dist/`、`node_modules/` 均未进入 Git 待提交文件；
- [x] `git diff --check` 成功；
- [x] 审查时发现初轮 Vite dev server 进程树仍残留并锁住 `dart-sass`；已停止该进程树，最终复验服务也已按完整 npm/Vite/Sass 进程树停止，端口 `5173` 无监听；未 push，未开始 P05。

## 人工验收

- [ ] 审查 29 个主题 manifest 的 id/key/SCSS 映射；
- [ ] 抽查 Webpack/Vite 生成 HTML 中主题索引与对应 CSS 文件；
- [ ] 接受 Vite 额外 `rolldown-runtime`、省略主题 JS stub 以及 chunk/hash/体积差异；
- [ ] 接受旧 Sass `@import`、Spectrum hack、chunk 体积和 optional extraneous 包作为已记录保留项；
- [ ] 接受 callable namespace import 的机械改写与 UBB editor Sass 路径修正；
- [ ] 在本机浏览器运行 `dev:shadow`，人工检查首页渲染、控制台、主题切换和代表性 UBB 内容；
- [x] 已授权按“共享构建合同 / 源码兼容改写 / Vite 影子构建 / P04 文档”四个批次提交。

人工确认时间与结论：2026-07-18，用户回复“去执行吧”，授权执行审查修复、最终门禁和四批提交；未勾选的浏览器人工项仍不视为完成。
