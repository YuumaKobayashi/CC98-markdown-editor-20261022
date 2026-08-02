# P09 已知问题与保留项

## `STATE-STORE-001`：legacy thunk 直接修改 Store state

- `RefreshCurrentUserInfo.ts` 和 `GetMyHistoryPosts.ts` 等 thunk 会直接修改 `getState().userInfo` 的字段/数组；
- P09 为保持旧行为关闭 RTK immutable check，不把这些写操作伪装成 reducer 更新；
- 对应用户/历史领域迁移时必须通过 action、slice 或 query cache 单独收口。

## `STATE-STORE-002`：legacy reducer 包含持久化副作用

- `Reducers/UserInfo.tsx` 在 `CHANGE_USERINFO` 中写 localStorage 和 IndexedDB 用户缓存；
- listener middleware 已存在但注册表为空，P09 不改变副作用时机；
- P17 以完整 `CurrentUser` 聚合为边界迁移，禁止提前拆分跨端字段。

## `STATE-STORE-003`：组件与 adapter 直接访问 Store

- 多个消息组件、Topic 组件和 utility effect adapter 直接调用 `Store.getState()`/`dispatch()`；
- 根 facade 保证它们继续访问同一个 Store；
- 消息路径由 P18、其余路径由对应 owner 阶段迁移，不在 P09 批量改写。

## `STATE-SYNC-001`：Header storage listener 缺少集中 cleanup

- Header 仍分别监听 `userInfo` 和 `showCardUser`，使用匿名回调且不移除；
- P09 新 `CrossTabSync` 的 handler/key 白名单为空，避免与 Header 重复响应；
- P17 迁移时需保持旧编码、登录/退出和跨标签页语义，并处理 `StorageEvent.key === null`。

## `STATE-POST-001`：Post reducer 存在但未生效

- `Reducers/Post.tsx` 声明为 async，只处理 `ADD_AWARD`，当前根 Store 从未注册；
- P09 继续不注册，也不修复该文件；任何启用或删除都需独立缺陷审批。

## `STATE-SIGNALR-001`：通知控制器保持 dormant

- `NotificationController` 仍未挂载，SignalR、`signalr` 和 `messageCount` storage 协调不运行；
- P09 不把这些 key 加入 CrossTabSync，也不建立实时连接。

## 依赖与构建保留项

- React Redux 8.1.3 是 React 16.14/Redux 4 兼容档；Redux 5、RTK 2、redux-thunk 3 和 React Redux 9 未获本阶段授权；
- clean install 继续报告既有 deprecated 依赖和私有 Git 包跳过 integrity 检查；
- `npm ls --depth=0` 继续显示 P04 已登记的 watcher/glob/node-addon optional 安装项为 extraneous；
- 构建转换模块从 2,344 增至 2,371，需人工接受；产物文件和主题数未变。

## 未自动验证

- 未启动新的 dev/preview server，未访问真实 CC98/OpenID；
- 未验证真实登录、token、读写 API、Redux DevTools、浏览器导航或双标签页行为；
- 未新增自动测试、截图、artifact comparator 或 bundle analyzer。
