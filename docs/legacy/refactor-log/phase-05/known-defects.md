# P05 已知问题与保留项

## 沿用的构建警告

- 29 个主题仍使用旧 Sass `@import`，正式构建会报告弃用警告；迁移归 P20；
- `Styles/spectrum.scss` 的旧 IE 星号 hack 仍触发 Lightning CSS 恢复性警告，但构建退出码为 0 且 29 个主题均生成；
- `main` 约 573 KB、`vendors` 约 3.43 MB，仍超过 chunk 建议阈值；代码分割归后续路由/依赖阶段。

## 安装环境

- 沙箱内 `npm ci` 因用户 npm cache 的私有 Git 临时目录 `mkdtemp EPERM` 失败，在获准环境重跑成功；
- 成功的 clean install 末尾报告一次无法清理 `sass-embedded-all-unknown` 内部 Sass 目录的 EPERM warning，但命令退出码为 0，后续依赖、类型与构建检查通过；
- `npm ls --depth=0` 仍显示 P04 已记录的 watcher 等 optional extraneous 包，命令退出码为 0。

## 第三方传递构建依赖

- 仓库未直接声明或安装 `webpack`，`npm ls webpack --all` 为空；
- `dplayer@1.24.0` 自身仍传递安装 `webpack-cli@3.0.4` 和 `webpack-sources@1.4.3`，对应 lock 条目按已确认范围保留；
- 这些包不是仓库构建入口，清零它们需要升级或替换播放器，超出 P05。

## 构建环境

- 沙箱内 Vite/Rolldown 加载配置时 `spawn EPERM`，在获准环境两次正式构建均成功；
- Sass、Spectrum 和大 chunk 警告不在 P05 扩大处理。

## 已修复：Markdown 缺少浏览器 `process.cwd`

- 人工运行发现含 Markdown UBB 的内容在 `MarkdownParser` 中抛出 `TypeError: process.cwd is not a function`；
- 根因是 `remark@10` 使用的 `vfile@3.0.1` 无条件调用 `process.cwd()`，而旧 Webpack 浏览器 shim 曾隐式提供返回 `/` 的实现；
- Vite 现同时在正式构建 `define` 和开发依赖预打包 `optimizeDeps.rolldownOptions.transform.define` 中定义 `process.cwd` 为 `() => "/"`；不修改 UBB 或 Markdown 内容语义；
- 用户现有 5173 与独立验证 5174 实际下发的 `remark` 模块均已变为 `this.cwd = (() => "/")()`，原始 `process.cwd` 调用为 0；
- 修复后 TypeScript 与正式构建通过，生产 main/vendors 中无原始 `process.cwd` 调用。当前会话没有可连接的图形浏览器实例，最终页面刷新显示仍由人工确认。

## 未自动验证

- 浏览器视觉、控制台、登录态主题切换、代表性 UBB、生产产物浏览器运行；
- IIS 实际部署、deep link rewrite 和 `config.Production.json` 覆盖；
- 这些项目不能由构建或 HTTP 200 推断为已通过。
