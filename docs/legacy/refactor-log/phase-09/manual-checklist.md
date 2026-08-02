# P09 人工与机械检查清单

## 已完成机械检查

- [x] manifest/lock 精确安装 `@reduxjs/toolkit@1.9.7`、`react-redux@8.1.3`，移除 `@types/react-redux`；
- [x] lockfile 实装 Redux 4.2.1、redux-thunk 2.4.2，没有 Redux/React Redux 第二主版本；
- [x] 仓库内 clean `npm ci` 成功，安装 758 个包；私有 watermark 仍为原 Git commit，未 vendor；
- [x] 首次 clean install 的 Sass 锁已按 PID/命令行定位；只短暂停止并在验证后恢复阶段开始前已有的仓库 Vite 服务；
- [x] `npm ls --depth=0` 退出码为 0；仅保留已登记的 optional/extraneous 安装项；
- [x] `npm run typecheck:modern` 成功；
- [x] `npm run typecheck:legacy` 成功；
- [x] `npm run typecheck` 聚合命令成功；
- [x] `npm run build` 成功，转换 2,371 个模块；
- [x] 产物仍为 9,449 个文件、29 个主题 CSS；index/reset/IIS 文件存在；
- [x] 静态确认根 reducer 只有 `error/router/userInfo/message`，`Post` 未注册；
- [x] 静态确认没有 `createApi`、API reducer/middleware、业务 slice 或第二个 Store；
- [x] listener middleware 没有业务 listener，CrossTabSync handler/key 白名单为空；
- [x] 修复 React Redux 8 不再提供 legacy Store context 导致 `ConnectedRouter` 读取 `dispatch` 失败；显式 `store` prop 仍指向唯一根 Store；
- [x] 冻结 UBB、旧 reducer、Actions/AsyncActions、Header/NotificationController、主题和 API service 无源码 diff；
- [x] `git diff --check` 成功；`.vscode/` 仍是原有未跟踪目录。

## 待人工验收

- [ ] 启动应用，确认首页、普通导航、浏览器前进/后退正常；
- [ ] 在 Redux DevTools 确认只有 `error`、`router`、`userInfo`、`message` 四个 key；
- [ ] 确认登录/退出、Header 用户信息、主题和未读数行为与 P08 一致；
- [ ] 打开消息路径，确认现有直接 `getState()`/`dispatch()` 流程仍工作；
- [ ] 触发旧用户/历史 thunk，确认没有新增 immutable/serializable middleware 异常；
- [ ] 使用两个标签页确认 `userInfo`/`showCardUser` 仍由 Header 旧合同同步；
- [ ] 确认没有 SignalR 连接、额外远端请求或新增 storage key；
- [ ] 接受转换模块因 RTK/React Redux 从 2,344 增至 2,371，产物文件和主题数保持。
