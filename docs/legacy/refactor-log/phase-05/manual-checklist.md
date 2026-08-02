# P05 检查清单

## Codex 已核对

- [x] 开始时位于 `dev20260716`，工作区干净，P04 已提交；
- [x] Node `20.20.0`、npm `10.8.2`、Vite `8.1.4`；
- [x] manifest/lock 已移除仓库自有 Webpack 直接依赖和旧 Sass；
- [x] `npm ci --no-audit --no-fund` 在获准环境成功；
- [x] `npm ls --depth=0` 退出码为 0；
- [x] `npm ls webpack --all` 为空；
- [x] `npm ls webpack webpack-cli webpack-sources --all` 只显示 `dplayer@1.24.0` 传递的 `webpack-cli@3.0.4`、`mini-css-extract-plugin` 和 `webpack-sources@1.4.3`；
- [x] `npx tsc --noEmit --skipLibCheck` 成功；
- [x] `npm run build` 连续两次成功；
- [x] 两次 `dist/` 均有 9449 个文件，完整路径加内容聚合 SHA-256 均为 `90207230254f76c9494d0a55c13cd92afdcecf15805b898ead660a962164ac47`；
- [x] `public/static` 2513 个文件在 `dist/static` 中零缺失；
- [x] `dist` 含 29 个主题 CSS、一个 main chunk、一个 vendors chunk、`static/index.html`、`static/reset.html` 和 `web.config`；HTML 中 placeholder 加 29 个主题与 manifest 同序，首项 `css_blue`、末项 `css_cc98_23rd_light`；
- [x] IIS 与 reset 产物分别和维护源 SHA-256 一致；
- [x] 可用 subagent 启动 `npm run dev`；首页、固定入口、Vite client、Main、首末主题、配置、jQuery、DPlayer 和带 `Accept: text/html` 的 SPA fallback 均返回 200；
- [x] subagent 停止完整 npm/Vite/Sass 进程树，`netstat` 与 `Get-NetTCPConnection` 均确认 5173 无监听；
- [x] 人工发现 Markdown `process.cwd` 运行时缺口后，Vite 正式构建和开发依赖预打包均补上与旧 Webpack 同语义的浏览器 shim；
- [x] 用户现有 5173 与独立 5174 下发的 `remark` 模块均无原始 `process.cwd` 调用，VFile 实际赋值为 `this.cwd = (() => "/")()`；独立 5174 进程树已完整回收，用户 5173 服务未触碰；
- [x] Markdown 兼容修复后 `npx tsc --noEmit --skipLibCheck` 和 `npm run build` 成功，生产 main/vendors 中无原始 `process.cwd` 调用；
- [x] 最终 `git diff --check`、自有 Webpack 引用扫描和未跟踪产物检查通过；`dist/`、`node_modules/` 均保持忽略，`dist-vite/` 不存在。

## 人工验收

- [x] 接受只保留 `npm run dev` / `npm run build`，旧命令不提供别名；
- [ ] 在浏览器检查首页、控制台、主题切换和代表性 UBB；
- [ ] 刷新原报错内容，人工确认 Markdown 正常显示且 ErrorBoundary 不再出现；
- [ ] 用生产 `dist/` 检查 IIS deep link、reset 和生产配置覆盖；
- [x] 审查 P05 diff 与已知问题后授权两批提交。

人工确认时间与结论：2026-07-18，用户回复“写一下提交吧”，授权两批提交；未勾选项继续保留为未验证。
