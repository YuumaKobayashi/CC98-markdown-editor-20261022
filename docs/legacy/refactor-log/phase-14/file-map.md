# P14 文件映射

Router 的运行结构、库函数对照、lazy 设计、兼容限制和组件树外导航原则见 [`router-implementation.md`](./router-implementation.md)。

## Router 与壳层 owner

| 旧位置 | P14 位置 | 变化 |
| --- | --- | --- |
| `Components/App.tsx` | `src/app/router/app-router.tsx` | 顶层 `Switch/Route/Redirect` 改为唯一 Data Router route tree，并按 route 动态加载 |
| `Components/App.tsx` | `src/app/layouts/app-shell.tsx` | Header、Footer、错误控制迁入持久根 layout，页面只替换 `Outlet` |
| `src/app/providers/create-app-root.tsx` | 同文件 | Provider 树的应用内容从 legacy `App` 改为 `AppRouter` |
| `Components/Message/Message.tsx` | 同文件 + 根 route tree | 删除嵌套 `BrowserRouter`，保留导航 layout，以 `Outlet` 承载子页 |
| `Components/Focus/Focus.tsx` | 同文件 + 根 route tree | 删除嵌套 `BrowserRouter`，保留导航 layout，以 `Outlet` 承载子页 |
| `Components/UserCenter/Router.tsx` | `src/app/router/app-router.tsx` | 删除局部路由表，子 route 归唯一 route tree |
| `Components/UserCenter/User/Router.tsx` | 同文件 + 根 route tree | 保留用户详情实现，路由选择归唯一 route tree |

## 兼容边界

| 文件 | 合同 | 退出条件 |
| --- | --- | --- |
| `src/app/router/legacy-route-props.tsx` | 向旧 class 注入 `match.params`、`location.pathname/search`、`history.push/replace/length` | P15 将 route-aware class 函数化后删除 |
| `src/app/router/navigation.ts` | 为 React 树外副作用暴露已绑定的 `navigate` | 旧副作用迁入现代领域边界后重新评估 |
| `src/app/router/navigation-prompt.tsx` | 用 `useBlocker` 与 `beforeunload` 承接旧 `Prompt` 的字符串/布尔返回合同 | 编辑器函数化时移除兼容层 |
| `react-router-dom@7.18.0` | 仅给冻结 UBB 源文件的旧 import 提供兼容包 | 解冻并迁移 UBB 后移除；新代码只 import `react-router` |

## Store 清理

- `src/app/store/store.ts` 删除 `history`、`routerReducer`、`routerMiddleware`；
- `src/app/store/legacy-types.ts` 删除 Redux `router` 状态；
- `src/app/store/index.ts` 不再导出 history；
- `src/app/legacy/register-utility-effects.ts` 与 `Components/NotificationController.tsx` 改用应用导航端口；
- `package.json`/lockfile 删除直接 `history`、`react-router-redux` 及旧 Router 类型包，固定 `react-router` 与兼容 `react-router-dom` 为 `7.18.0`。

## 业务组件改动性质

其余大量 legacy 文件只做 Router import、类型和最小 props 接线迁移；请求 URL、参数、Redux action、storage、主题、样式和业务取数时机不在本阶段改变。`Components/Board/Board.tsx` 的内部 route 仅从 `Switch` 语法改为 `Routes`，其既有 owner 冲突与不可达性质不在 P14 修复。
