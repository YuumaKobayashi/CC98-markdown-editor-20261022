# P07 开发服务器记录

开发服务器由 subagent 启动、检查并完整回收。没有执行页面 JavaScript，没有访问真实 CC98/OpenID，也没有使用账号、token 或用户数据。

## 启动

- 命令：`npm run dev -- --host 127.0.0.1`；
- 沙箱内首次因 Vite config load 的 `spawn EPERM` 失败，在获准环境启动成功；
- Vite `8.1.4`，642 ms ready，地址 `http://127.0.0.1:5173`；
- 主进程链：cmd `45684` → npm node `23204` → cmd `5136` → Vite node `41460`；
- 回收输出另确认 Sass 子链 `21148 → 40628`，补抓名称/命令行时 subagent 工具调用被中断，因此只保留 PID 证据。

## HTTP 结果

| 路径 | 结果 | 内容核对 |
|---|---|---|
| `/` | 200，HTML，20,321 bytes | 主 HTML |
| `/static/index.html` | 200，HTML，20,321 bytes | 主 HTML |
| `/static/config.json` | 200，JSON，149 bytes | runtime config |
| `/@vite/client` | 200，JavaScript，209,792 bytes | Vite client |
| `/static/scripts/main.js` | 200，JavaScript，7,440 bytes | 可见 `create-app-root`、effect 注册、runtime config、IndexedDB 和 theme runtime import |
| `/static/reset.html` | 404 | dev middleware 不提供根 `reset.html`；正式构建会复制到该 URL |

## 回收

- 通过 npm 根 PID 完整停止本轮 npm/Vite/Sass 树，并显式确认子 PID 全部消失；
- 外层 cmd 随后退出；
- `127.0.0.1:5173` 最终为 `NO_LISTENER`；
- subagent 未修改仓库文件。
