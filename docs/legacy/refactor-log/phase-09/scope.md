# P09 Redux Store 基础范围

> 状态：实现、运行时兼容修复、有界机械验证与提交授权完成；不 push、不开始 P10

## 唯一大事

用 Redux Toolkit `configureStore` 建立唯一的应用根 Store，原样承载现有 reducer 和 Router middleware，并为后续领域迁移提供 typed hooks、listener middleware 与应用级跨标签页同步壳。

## 允许范围

- 锁定兼容 React 16.14/Redux 4 的 Redux Toolkit 与 React Redux 版本；
- 将根 Store 实现迁入 `src/app/store`，保留根 `Store.tsx` facade；
- 原样挂载 `error`、`userInfo`、`message`、`router`；
- 建立 `RootState`、`AppStore`、`AppDispatch`、legacy action 类型和 typed hooks；
- 挂载没有业务 listener 的 listener middleware；
- 挂载 handler/key 白名单为空的 `CrossTabSync`，保证 listener cleanup；
- 记录安装、类型检查、构建、状态所有权和人工验收证据。

## 禁止范围

- 不创建业务 slice，不引入 RTK Query API/cache/middleware；
- 不拆分 `userInfo`，不迁移消息或错误状态，不注册 `Reducers/Post.tsx`；
- 不修复 thunk 直接修改 state、reducer storage 副作用或直接 `Store.getState()`；
- 不迁移 Header 现有 `userInfo`/`showCardUser` storage listener；
- 不启用 `NotificationController` 或 SignalR；
- 不升级 Redux 5、redux-thunk 3、RTK 2、React、Router 或 UI 依赖；
- 不修改、移动或格式化冻结 UBB 范围；
- 不访问真实 CC98/OpenID，不提交、不 push、不进入 P10。

## 完成条件

1. clean install 可从 manifest/lock 复现 RTK 1.9.7、React Redux 8.1.3、Redux 4.2.1、redux-thunk 2.4.2；
2. 根 state key 仍且仅为 `error`、`userInfo`、`message`、`router`；
3. legacy `connect`、Store 默认/命名导出和 thunk 类型继续通过两套 TypeScript 配置；
4. listener middleware 和 CrossTabSync 已挂载，但没有业务 listener 或同步 key；
5. 正式构建、部署文件、9,449 个产物文件和 29 个主题保持；
6. 真实页面和跨标签页行为保留为人工验收项。
