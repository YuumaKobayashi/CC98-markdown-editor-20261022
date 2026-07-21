# P15 首批开发服务器记录

本批未启动 Node dev/preview server，因此没有 PID、端口或回收事项。

原因：实现范围可通过 TypeScript、生产构建和静态审计完成机械验证；真实登录态、API、分页、back/forward 和滚动行为保留给用户人工验收。未以构建成功替代浏览器验收。

## 构建环境记录

- 沙箱内首次运行 `npm run build` 时，Vite 加载配置阶段因 Windows 子进程策略报 `spawn EPERM`；
- 在允许子进程的同一工作树重跑成功，共转换 3,870 个模块；
- 生成独立的 `my-topics`（约 1.27 kB）和 `my-posts`（约 2.50 kB）动态块；
- 既有 Sass `@import`、Spectrum 旧 CSS 与大 chunk 警告继续存在，本批未修改。

## 无 Redux 简单组件组构建

- 本组未启动 Node dev/preview server，没有 PID、端口或回收事项；
- 沙箱内正式构建在 Vite 配置加载阶段因 Windows 子进程策略报 `spawn EPERM`；
- 在允许子进程的同一工作树重跑成功，共转换 3,880 个模块；
- 生成新的/更新后的 `document-title`、`feedback`、`focus layout`、`site-manage`、`post`、`topic` 等动态块；
- 既有 Sass `@import`、Spectrum 旧 CSS、plugin timing 与大 chunk 警告继续存在，本组未修改。

## 无 Redux 轻状态与导航组件组构建

- 本组未启动 Node dev/preview server，没有 PID、端口或回收事项；
- 沙箱内正式构建在 Vite 配置加载阶段因 Windows 子进程策略报 `spawn EPERM`；
- 在允许子进程的同一工作树重跑成功，共转换 3,882 个模块；
- 生成/更新 `pagination`、`topic`、`focus`、Board、Message 和用户中心相关动态块；
- 既有 Sass `@import`、Spectrum 旧 CSS、plugin timing 与大 chunk 警告继续存在，本组未修改。
