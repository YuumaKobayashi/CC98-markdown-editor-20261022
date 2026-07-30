# Application

应用级启动、Provider、Router、Store、持久布局和页面入口编排的 owner。P06 迁入 `bootstrap` 与最小 Provider 树，P09 迁入唯一根 Store，P14 迁入单一 Router 与持久 `AppShell`，A1 将这些 Application Shell 文件归入本目录。

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

## Store 边界

- `store` 注册 Session slice，并暂时承载 `error`、`userInfo`、`message` 三个 legacy reducer；
- Session 是登录状态和当前用户的唯一 Redux owner；legacy `userInfo` 只保留后续 S1 批次尚未迁移的页面、偏好和远端数据状态；
- Router 不再写入 Redux，也不再拥有独立 `history`、reducer 或 middleware；
- 新代码使用 `@application/store` 与 typed hooks，旧代码暂由根 `Store.tsx` facade 兼容；
- listener middleware 保留当前用户写入 User cache 的跨模块编排，`CrossTabSync` 统一处理 `userInfo` 跨标签事件；
- `showCardUser`、Notification、页面状态、RTK Query 和其余旧 reducer 清理分别归后续 S1 批次。
