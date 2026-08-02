# P04 已知问题与保留项

## `BUILD-VITE-001`：旧 Sass 语法产生迁移警告

- 29 个主题仍通过 `@import` 汇入完整 `Styles/Site.scss`；Vite 的现代 Sass 编译器报告弃用警告；
- P04 不运行自动 Sass migrator，不改主题样式结构；该项归 P20 按 feature 人工迁移；
- 旧 `sass@1.43.3` 未升级，Webpack 继续使用；Vite 通过隔离的 `sass-embedded@1.100.0` 获得 `initAsyncCompiler`。

## `BUILD-VITE-002`：Spectrum CSS 星号 hack 依赖错误恢复

- `Styles/spectrum.scss` 包含 `*display`、`*zoom`、`*width` 等旧 IE hack；
- Lightning CSS 会报告 `Unexpected token Semicolon`，但在 `errorRecovery` 下构建以 0 完成并生成全部主题 CSS；
- P04 不删除或改写该样式，后续 P20 结合浏览器支持边界处理。

## `BUILD-VITE-003`：Vite chunk 仍然较大

- 当前 `main` 约 573 KB，`vendors` 约 3.43 MB，Vite 报告超过 500 KB；
- P04 保持既有同步入口和业务依赖，不以代码分割改变加载顺序；路由 lazy 和依赖清理属于后续阶段。

## `BUILD-NPM-003`：clean install 后存在 optional extraneous 包

- `npm ls --depth=0` 退出码为 0，但显示 `@parcel/watcher`、Win32 watcher、`bindings`、`file-uri-to-path`、`nan`、`node-addon-api` 等 extraneous；
- 其中新增 watcher 项来自 Vite/Rolldown 的平台 optional 安装形态；P04 不手工删除 lock 条目或 node_modules 内容。

## `BUILD-TYPE-001`：旧第三方声明需要 `skipLibCheck`

- 裸 `npx tsc --noEmit` 仍在旧 jQuery、React Router 和 readable-stream 声明中失败；
- P03/P04 使用 `npx tsc --noEmit --skipLibCheck` 检查项目源码并通过；
- 本阶段不升级 TypeScript 或旧类型依赖，最终严格化属于 P08/P23。

## 执行环境限制

Webpack/Terser、Vite/Rolldown 和 npm 私有 Git 临时目录在受限沙箱中出现 `spawn EPERM` 或 cache `mkdtemp EPERM`；相同命令在获准环境成功，因此不是仓库构建失败。

## 已修复审查项

- 初版开发静态重写对文件和目录都使用前缀匹配，导致 `DPlayer.min.css.map` 与 `APlayer.min.css.map` 被错误拼接并返回 404；现已对目录使用前缀匹配、对文件使用精确匹配，并显式映射两份 source map；
- 最终 `dev:shadow` HTTP 复验中，两份播放器 CSS 和两份 source map 均返回 200；生产 shadow 构建仍复制相同文件；
- 初轮验证记录误判 Vite dev server 已完全停止；审查发现残留 npm/Vite/dart-sass 进程树并造成 `npm ci` 的 `EBUSY`。该进程树已停止，最终复验按完整进程树清理并确认端口 `5173` 无监听。

## 未自动验证

- 已启动 Vite dev server 并完成 HTTP 资源链路检查，但当前会话没有可用图形浏览器实例，未完成页面视觉和交互运行；
- 未在浏览器中运行生产 `dist-vite/`；
- 未做像素级主题对比、登录态主题切换、IIS 实际部署或 `config.Production.json` 覆盖验证；
- 这些结果不能从构建成功推断为人工运行时验收已完成。
