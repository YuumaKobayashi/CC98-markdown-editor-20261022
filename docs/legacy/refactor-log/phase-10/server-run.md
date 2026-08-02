# P10 服务运行记录

首次在受限环境执行正式构建和开发服务时，Vite 配置加载均因 Windows helper `spawn EPERM` 失败；相同命令在允许子进程的环境中成功，未将该策略限制归因于仓库代码。

正式构建结果：

```text
vite v8.1.4
2384 modules transformed
9449 files
29 theme CSS files
```

随后使用隔离端口启动：

```text
npm run dev -- --host 127.0.0.1 --port 5174 --strictPort
```

以下路径返回 200：

- `/`；
- `/src/app/bootstrap/index.tsx` 与 `/static/scripts/main.js`；
- `/src/pages/home/index.ts`；
- `/src/entities/message/index.ts`；
- `/src/entities/post/index.ts`；
- `/static/images/hot.png` 与 `/static/config.json`。

一次对不存在的 `/src/app/bootstrap/main.tsx` 检查返回 404；核对配置后使用真实入口 `index.tsx` 重测为 200。这是检查路径错误，不是应用路由缺陷。

验证完成后按监听端口确认 Vite PID 38956，并终止其精确进程树；随后 5174 无监听。没有打开图形浏览器、访问真实 CC98/OpenID、建立 SignalR 连接或把 HTTP 200 推断为视觉/交互验收。
