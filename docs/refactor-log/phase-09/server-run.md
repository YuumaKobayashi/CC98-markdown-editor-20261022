# P09 服务运行记录

P09 没有为功能验证启动新的 preview server、浏览器实例或真实 CC98/OpenID 连接；正式构建是有界命令。

仓库内第一次执行 clean `npm ci` 时，发现阶段开始前已经存在的 Vite 服务占用 Sass 文件：

```text
PID 27764 node vite --config vite.config.mjs
└─ PID 16456 dart-sass --embedded
```

该进程导致仓库内 `npm ci` 删除 `node_modules/sass-embedded-win32-x64/dart-sass/src` 时返回 `EBUSY`，并在失败前部分清理了 `node_modules`。非清理式 `npm install` 同样被该目录锁阻止。

先用隔离临时目录证明当前 manifest/lock 可以 clean install；随后再次核对命令行，只停止 PID 27764 与其 dart-sass 子进程 PID 16456。仓库内 clean `npm ci` 随即成功安装 758 个包，之后完成依赖树、聚合 typecheck 和正式构建验证。隔离临时目录已删除。

全部门禁结束后曾使用原命令 `npm run dev` 恢复仓库开发服务。恢复时进程树为：

```text
PID 28376 cmd npm run dev
└─ PID 38424 node npm-cli.js run dev
   └─ PID 41064 cmd vite --config vite.config.mjs
      └─ PID 9248 node vite --config vite.config.mjs
```

该服务用于后续人工检查时暴露出 React Redux 8 不再提供 legacy Store context，导致 `ConnectedRouter` 读取 `dispatch` 失败。P09 已改为向 `ConnectedRouter` 显式传入同一个根 Store；两套 typecheck、正式构建和 Vite 转换模块检查均通过。

检查结束后已终止遗留的 npm/Vite 进程树，并在宿主机确认 `5173` 无监听、本仓库无残留 Vite/Node 进程。没有启动 SignalR 或其他业务后台连接。
