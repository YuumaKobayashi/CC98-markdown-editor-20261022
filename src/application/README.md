# Application

应用级启动、Provider、Router、Store、持久布局和页面入口编排的 owner。P06 迁入 `bootstrap` 与最小 Provider 树，P09 迁入唯一根 Store，P14 迁入单一 Router 与持久 `AppShell`，A1 将这些 Application Shell 文件归入本目录，S1.5 将壳层错误退出 Redux，S1.6 将领域缓存和 Posting 草稿归还 Module。

依赖边界：

- 可以组合 `modules`、`foundation` 和第三方包；
- 目标 `foundation`、`modules` 不得 import `application`；迁移期 `pages`、旧 `features` 和根兼容文件会在各自 owner 阶段收口；
- 页面只负责入口编排，不重复实现可复用业务能力；
- Topic Detail、User Center 等页面可以同时消费同一个 Topic 或 Favorite 模块。

## P14 Router 边界

- 完整运行结构、Router 7 API、lazy、兼容桥与树外导航决策见 [`../../docs/refactor-log/phase-14/router-implementation.md`](../../docs/refactor-log/phase-14/router-implementation.md)；
- `router/app-router.tsx` 是公开 URL、嵌套路由与 route lazy 的唯一声明位置；
- `layouts/app-shell.tsx` 持续挂载 Header、Footer、错误控制与根 `Outlet`；
- `router/legacy-route-props.tsx` 只兼容 `match.params`、`location.pathname/search` 与 `history.push/replace/length`；
- `router/navigation.ts` 为组件树外的登录失效等旧副作用提供单一导航端口；
- 业务取数仍由既有组件 lifecycle/service 负责，P14 不引入 loader/action。

## Error Provider 边界

- `ApplicationErrorProvider` 是 AppShell 业务错误的唯一状态 owner，仍按原 `ApplicationErrorKey` 映射 `Components/Status`；
- AppShell 在错误时只替换根 `Outlet`，Header、Footer 与路由切换清错继续保持挂载；
- Editor 和 legacy Utility 通过 `reportApplicationError` 命令式上报，组件树外调用不再 dispatch Redux action；
- HTTP 异常统一化、Router `errorElement` 和错误文案重构不属于 S1.5。

## Store 边界

- `store` 注册 Session 与 Notification slice，并暂时承载 `userInfo` 这一个 legacy reducer；Application Error 已退出 Redux；
- Session 是登录状态和当前用户的唯一 Redux owner；legacy `userInfo` 只保留 `refreshCurrentUserInfo` 失败时写入的错误兼容状态，等待 S1.7 收口；
- Notification 是四类未读计数的唯一 Redux owner；Application Store 只负责注册 reducer，业务 action、selector 和刷新行为由 Notification Module 公开；
- Router 不再写入 Redux，也不再拥有独立 `history`、reducer 或 middleware；
- 新代码使用 `@application/store` 与 typed hooks，旧代码暂由根 `Store.tsx` facade 兼容；
- listener middleware 保留当前用户通过 User 公共策略接口写入 cache 的跨模块编排，`CrossTabSync` 统一处理 `userInfo` 和 `showCardUser` 跨标签事件；
- User Preference Module 直接持有 `showCardUser` 的持久化与订阅合同，不建立 Redux slice；页面状态、RTK Query 和其余旧 reducer 清理分别归后续 S1 批次。

## 缓存与草稿边界

- Application 页面可以决定何时读取、刷新或清理缓存，但业务键、TTL、编码和介质由对应 Module 持有；
- Board、Topic、Daily Signin 和 Posting 页面只消费 Module 根入口，不直接访问其业务 Storage 键；
- 页面私有缓存继续由各 Route 持有，不因 S1.6 泛化为全局 cache。
