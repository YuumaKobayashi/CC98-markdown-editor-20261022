# app

应用级启动、Provider、Router、Store 和持久布局的 owner。P06 迁入 `bootstrap` 与最小 Provider 树，P09 迁入唯一根 Store，P14 迁入单一 Router 与持久 `AppShell`。

`app` 可以组合其他源码层，其他层不得 import `app`。P14 的 legacy route props 桥是过渡例外，只供尚未函数化的旧组件使用，由 P15 删除。

## P14 Router 边界

- 完整运行结构、Router 7 API、lazy、兼容桥与树外导航决策见 [`../../docs/refactor-log/phase-14/router-implementation.md`](../../docs/refactor-log/phase-14/router-implementation.md)；
- `router/app-router.tsx` 是公开 URL、嵌套路由与 route lazy 的唯一声明位置；
- `layouts/app-shell.tsx` 持续挂载 Header、Footer、错误控制与根 `Outlet`；
- `router/legacy-route-props.tsx` 只兼容 `match.params`、`location.pathname/search` 与 `history.push/replace/length`；
- `router/navigation.ts` 为组件树外的登录失效等旧副作用提供单一导航端口；
- 业务取数仍由既有组件 lifecycle/service 负责，P14 不引入 loader/action。

## Store 边界

- `store` 原样承载 `error`、`userInfo`、`message` 三个 legacy reducer；
- Router 不再写入 Redux，也不再拥有独立 `history`、reducer 或 middleware；
- 新代码使用 `@app/store` 与 typed hooks，旧代码暂由根 `Store.tsx` facade 兼容；
- listener middleware 与 `CrossTabSync` 当前没有业务 listener 或同步 key；
- RTK Query、领域 slice、持久化迁移和旧 reducer 清理分别归后续领域阶段。
