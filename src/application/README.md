# Application

应用级启动、Provider、Router、Store、持久布局和页面入口编排的 owner。P06 迁入 `bootstrap` 与最小 Provider 树，P09 迁入唯一根 Store，P14 迁入单一 Router 与持久 `AppShell`，A1 将这些 Application Shell 文件归入本目录，S1.5 将壳层错误退出 Redux，S1.6 将领域缓存和 Posting 草稿归还 Module，S1.7 完成 legacy Redux 闭包，C1.7.2 为内容集合页与 User Center/Profile 建立有真实共同语义的布局组件，C1.7.3 将活动 Route 组件样式收口为同目录同名且单一直接 owner 的 CSS Module。

依赖边界：

- 可以组合 `modules`、`foundation` 和第三方包；
- `foundation`、`modules` 不得 import `application`；跨层依赖没有 allowlist；
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

- `ApplicationErrorProvider` 是 AppShell 业务错误的唯一状态 owner，仍按原 `ApplicationErrorKey` 映射 `application/routes/status`；Z3 已删除零消费的根 `Components/Status.tsx` 兼容转导；
- AppShell 在错误时只替换根 `Outlet`，Header、Footer 与路由切换清错继续保持挂载；
- Editor 和 Foundation Utility 通过 `reportApplicationError` 命令式上报，组件树外调用不再 dispatch Redux action；
- HTTP 异常统一化、Router `errorElement` 和错误文案重构不属于 S1.5。

## Store 边界

- `store` 只注册 Session 与 Notification slice，`RootState` 由唯一 Store 推导为 `{ session, notification }`；Application Error 和 legacy `userInfo` 均已退出 Redux；
- Session 是登录状态和当前用户的唯一 Redux owner；`refreshCurrentUserInfo` 由 Session 公共入口保留原静默失败合同，不再写入独立错误状态；
- Notification 是四类未读计数的唯一 Redux owner；Application Store 只负责注册 reducer，业务 action、selector 和刷新行为由 Notification Module 公开；
- Router 不再写入 Redux，也不再拥有独立 `history`、reducer 或 middleware；
- Application 组件使用 `@application/store` 与 typed hooks；Z3 在零消费者证明后已删除根 `Store.tsx` 兼容转导；
- Store 装配点向 Utility 兼容适配器注入 `dispatch/getState`，适配器不再自行导入或持有根 Store；
- listener middleware 保留当前用户通过 User 公共策略接口写入 cache 的跨模块编排，`CrossTabSync` 统一处理 `userInfo` 和 `showCardUser` 跨标签事件；
- User Preference Module 直接持有 `showCardUser` 的持久化与订阅合同，不建立 Redux slice；页面状态、领域缓存和草稿均由既有 Route/Module owner 持有，不引入 RTK Query。

## 缓存与草稿边界

- Application 页面可以决定何时读取、刷新或清理缓存，但业务键、TTL、编码和介质由对应 Module 持有；
- Board、Topic、Daily Signin 和 Posting 页面只消费 Module 根入口，不直接访问其业务 Storage 键；
- 页面私有缓存继续由各 Route 持有，不因 S1.6 泛化为全局 cache。
