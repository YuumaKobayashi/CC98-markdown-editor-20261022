# P05 开发服务器记录

开发服务器验证由 subagent 执行，主线程不启动持续运行的 Node 服务。当前协作接口不能指定或确认 GPT-5.4，按用户在 P05 计划中的明确选择使用当前可用 subagent，并记录该限制。

## 启动

- 命令：`npm run dev -- --host 127.0.0.1`；
- 沙箱内首次因 Vite config load 的 `spawn EPERM` 失败，在获准环境启动成功；
- Vite `8.1.4`，547 ms ready，地址 `http://127.0.0.1:5173/`；
- 根进程树：38740 cmd → 11424 node/npm → 41076 cmd → 46492 node/Vite，运行时另有 Sass 子进程。

## HTTP 结果

| 路径 | 结果 | 内容核对 |
|---|---|---|
| `/` | 200 HTML | HTML marker 存在 |
| `/static/index.html` | 200 HTML | HTML marker 存在 |
| `/@vite/client` | 200 JavaScript | HMR marker 存在 |
| `/Main.tsx` | 200 JavaScript | module marker 存在 |
| `/static/content/css_blue.css` | 200 CSS | CSS marker 存在 |
| `/static/content/css_cc98_23rd_light.css` | 200 CSS | CSS marker 存在 |
| `/static/config.json` | 200 JSON | JSON 可解析 |
| `/static/scripts/lib/jquery/jquery.min.js` | 200 JavaScript | jQuery marker 存在 |
| `/static/content/DPlayer.min.css` | 200 CSS | `.dplayer` marker 存在 |
| `/board/1`，`Accept: text/html` | 200 HTML | SPA fallback 通过 |

同一 SPA 路径使用默认 `Accept: */*` 时返回 404；开发中间件只对浏览器 HTML 导航执行 fallback，这是请求头语义差异，不计为失败。

## 回收

- subagent 使用 `taskkill /PID 38740 /T /F` 终止完整 npm/Vite/Sass 进程树；
- 逐 PID 确认无存活；
- `netstat` 与 `Get-NetTCPConnection` 均确认 5173 无监听；
- 本轮临时日志目录已删除。

## Markdown 运行时修复复验

用户在 5173 的实际页面发现 `MarkdownParser` 抛出 `process.cwd is not a function` 后，补充验证如下：

- 用户原有 5173 服务属于 VS Code 终端进程，未由 Codex 停止；配置修改后 Vite 自动重启，实际下发的 `remark` 模块已无 `process.cwd`，VFile 赋值为 `this.cwd = (() => "/")()`；
- subagent 另用 `npm run dev -- --host 127.0.0.1 --port 5174 --strictPort` 启动隔离实例；进程树为 22164 cmd → 13768 node/npm → 2024 cmd → 27832 node/Vite；
- 5174 下发的 `remark.js?v=4f55e1fb` 返回 200，原始 `process.cwd` 调用为 0，VFile 赋值同样为 `this.cwd = (() => "/")()`；
- 当前会话无可连接的图形浏览器实例，未把模块转换证据推断为页面视觉验收；
- 完成后仅停止 5174 的 npm/Vite 进程树并删除四个临时日志，确认 5174 无监听；用户 5173 服务保持运行且未触碰。
