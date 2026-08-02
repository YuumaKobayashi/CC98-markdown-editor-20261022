# P04 服务运行记录

为验证新增的开发查看入口，本阶段短暂启动过一次 Vite dev server：

- 命令：`npm run dev:shadow -- --host 127.0.0.1`；
- 地址：`http://127.0.0.1:5173/`；
- Vite Node PID：`14840`；
- 用途：只做本地 HTTP 资源链路验证，没有代理 API、没有写入正式发布目录；
- 停止：验证结束后停止本次启动产生的 Vite/npm/cmd 进程树（PID `14840`、`15004`、`39796`、`29592`），并复核端口 `5173` 无监听。

验证覆盖首页、`static/index.html`、Vite client、主入口、首末主题 CSS、既有第三方脚本/样式、配置 JSON、SPA fallback，以及含静态 `require()` 的代表模块和 32 个直接依赖。当前会话没有可用图形浏览器实例，因此没有把 HTTP 200 推断为页面视觉与交互验收完成。

后续人工运行发现 `formdata-polyfill` 是纯副作用模块，不提供 default export，而初版转换器将其误转成 default import，导致 `extends.tsx` 在模块实例化阶段白屏。转换器现已区分有返回值的 `require()` 与独立副作用调用；修复后复核 9 个旧 `require()` 入口和 45 个直接依赖均返回 200，`extends.tsx` 输出 side-effect import，不再请求 default export。

## 2026-07-18 审查复验

审查发现上述初轮停止记录不准确：旧的 `npm run dev:shadow`、Vite 与 `dart-sass` 进程树仍在监听 `5173`，并锁住 `node_modules/sass-embedded-win32-x64/dart-sass/src`，导致 clean install 首次以 `EBUSY` 失败。定位完整父子进程链后已停止该进程树，随后 `npm ci --no-audit --no-fund` 成功。

修复开发静态文件匹配后再次启动 `npm run dev:shadow -- --host 127.0.0.1`。首页、`static/index.html`、Vite client、主入口、首末主题 CSS、jQuery、Font Awesome、DPlayer/APlayer CSS 及两份 `.css.map`、配置 JSON 和 SPA fallback 均返回 200。当前会话仍没有可用图形浏览器实例，因此没有把 HTTP 结果推断为视觉、控制台或交互验收完成。

最终复验结束后按 `npm -> cmd -> Vite -> dart-sass` 完整进程树自底向上停止服务，并确认端口 `5173` 无监听。其他 Node/npm 进程均为有界命令：依赖安装、TypeScript 检查、Webpack release、Vite shadow 和静态文件核对。
