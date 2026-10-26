# P14 开发服务器与 deep-link 证据

## 启动

- 本阶段未使用 subagent；当前执行指令不允许在用户未明确要求时派生 subagent，因此由主代理直接启动、检查并回收服务器；不存在可另行确认的 subagent 模型；
- 在当前工作树使用仓库既有 Vite 开发命令启动隐藏进程；
- 根命令进程 PID 为 `45336`，实际监听 `127.0.0.1:5173` 的 Node PID 为 `25100`；
- 验证完成后已停止 PID `25100`；其父进程随之退出，端口不再处于 `LISTENING`，未停止其他 Node/Vite 进程。

## HTTP 检查

以下代表路径以浏览器式 `Accept: text/html` 请求，均返回 `200` 且内容为 SPA 根 HTML：

- `/`
- `/topic/hot-weekly`
- `/topic/12345/postid/67890/2`
- `/list/81`
- `/boardList`
- `/usercenter`
- `/message`
- `/focus/favorite`
- `/user/id/123/manage`
- `/editor/edit/67890`
- `/board/81/2`
- `/searchBoard`
- 未知路径

另外，根 `app-router` 与 Message、Focus、Topic 等代表 lazy 模块的 Vite 转换请求均返回成功。

## 能证明与不能证明的内容

这些检查能证明开发服务器可提供 SPA fallback、代表 deep link 不被服务器层直接 404、入口和 lazy 模块可被 Vite 转换。它们不能证明视觉渲染、真实 API、登录态、交互、back/forward、Prompt 或持久壳层实例行为；这些项目保留在 `manual-checklist.md`。
