# P06 开发服务器记录

P06 使用隔离端口 `5174` 验证新入口，不触碰用户可能已有的 `5173` 服务。

## 启动

- 命令：`npm run dev -- --host 127.0.0.1 --port 5174 --strictPort`；
- 启动前确认 5174 无现有监听；
- Vite `8.1.4` 启动成功，验证根进程 PID 为 `42524`。

## HTTP 结果

| 路径 | 结果 | 内容核对 |
|---|---|---|
| `/` | 200，17881 bytes | root marker |
| `/static/index.html` | 200，17881 bytes | root marker |
| `/@vite/client` | 200，209792 bytes | HMR marker |
| `/static/scripts/main.js` | 200，7022 bytes | `createAppRoot` marker |
| `/src/app/bootstrap/index.tsx` | 200，7022 bytes | 新 bootstrap marker |
| `/src/app/providers/create-app-root.tsx` | 200，3020 bytes | Provider/ErrorBoundary marker |
| `/static/content/css_blue.css` | 200，831674 bytes | CSS marker |
| `/static/content/css_cc98_23rd_light.css` | 200，832794 bytes | CSS marker |
| `/static/config.json` | 200，149 bytes | JSON 可解析 |
| `/static/scripts/lib/jquery/jquery.min.js` | 200，529482 bytes | jQuery marker |
| `/static/content/DPlayer.min.css` | 200，139314 bytes | DPlayer marker |
| `/board/1`，`Accept: text/html` | 200，17881 bytes | SPA fallback/root marker |

## 回收

- 验证完成后只终止本轮 5174 的 npm/Vite/Sass 进程树；
- 确认 5174 无监听；
- 本轮临时 stdout/stderr 日志目录已删除。
