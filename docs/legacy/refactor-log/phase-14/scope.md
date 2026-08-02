# P14 Router 与持久壳层范围

> 状态：用户已明确授权进入并执行 P14；实施基线为 `80d46444`，开始时除未跟踪 `.vscode/` 外工作树干净；不提交、不 push、不进入 P15

## 唯一大事

在保持公开 URL、IIS deep link、业务请求和现有页面行为的前提下，将 React Router 4、`ConnectedRouter` 和两个嵌套 `BrowserRouter` 迁为 React 18/Node 20 可用的单一现代 Router，并使 Header、Footer、Provider 与 Store 在普通页内导航期间持续挂载。

## 允许范围

- 固定 React Router 7 兼容档，使用一个 `createBrowserRouter` 与一个 `RouterProvider`；
- 将顶层 route、Message/Focus 子 route、UserCenter/User 子 route 和 legacy Board 内部 route 迁入现代 route tree；
- 使用 `Outlet` 表达持久 AppShell 和 Message/Focus/UserCenter/User/legacy Board layout；
- 为尚未函数化的 class 建立仅含 `match.params`、`location.pathname/search`、`history.push/replace/length` 的临时 route props 桥；
- 将 `Prompt` 迁为基于 Router blocker 与 `beforeunload` 的窄兼容组件；
- 将登录失效与未挂载通知控制器的应用级跳转迁到 Router navigation port；
- 删除 `react-router-redux`、`history`、router reducer/middleware 和 Redux `router` 分支；
- 在静态路由行为通过后加入 route lazy；
- 执行两套 TypeScript、正式构建、静态残留审计、deep-link HTTP 与代表路径浏览器验收。

## 禁止范围

- 不进入 React 19、Router 8、Framework Mode、SSR、loader/action 或 RTK Query 业务迁移；
- 不修改公开 URL、IIS rewrite、固定 `/static/*`、reset 独立入口或整页跳转语义；
- 不函数化复杂 class，不扩大临时 route props 合同；兼容桥由 P15 删除；
- 不修复 Board 双 owner、不可达 legacy branch、缺失 `/error/404`/`/error/500` 显式 route、大小写或参数刷新等已知旧缺陷；
- 不改变请求参数、返回值、Redux action、storage、主题、样式、timer、UBB 或 editor 业务；
- 不修改或提交 `.vscode/`，不提交、不 push、不进入 P15。

## 完成条件

1. 运行时只有一个 Router，且不存在 `ConnectedRouter`、嵌套 `BrowserRouter` 或 Redux router 副本；
2. Header、Footer、Provider 与 Store 位于持久根 layout，普通导航只替换 Outlet；
3. P13.5 登记的公开 URL、route props、程序化导航和 Prompt 合同有明确迁移映射；
4. route implementation 形成 Vite 动态 chunk，业务取数仍留在现有组件 lifecycle/service；
5. `npm run typecheck`、`npm run build`、`git diff --check` 和静态残留审计通过；
6. deep link、back/forward、同组件参数变化、Message/Focus、登录失效、编辑阻断和持久壳层经人工核对；
7. 整理未提交 diff 与证据后停止，等待用户审核和提交授权。
