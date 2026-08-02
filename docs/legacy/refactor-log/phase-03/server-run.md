# P03 服务运行记录

本阶段没有运行 Node server，也没有启动其他长期进程。

执行的 Node/npm 进程均为有界命令：lockfile 生成、`npm ci`、`npm ls`、TypeScript 检查和 Webpack debug/release 构建；命令结束后没有需要保留的 PID 或端口。
