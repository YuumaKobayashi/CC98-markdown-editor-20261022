# P02 服务运行记录

本阶段没有启动 Node server、Webpack Dev Server 或其他长期进程，因此没有 PID、端口或停止操作。

为验证构建边界，执行了以下一次性命令：

- `npm ci`：失败，原因是现有 package/lock 中的 moment 版本不一致；
- `npm install --package-lock=false --legacy-peer-deps --no-audit --no-fund`：成功，仅创建已忽略的 `node_modules`；
- `npm run build:debug`：成功；
- `npm run build:release`：受限环境首次 `spawn EPERM`，允许 Terser worker 后成功。

以上命令均已结束，没有遗留监听端口或后台服务。
