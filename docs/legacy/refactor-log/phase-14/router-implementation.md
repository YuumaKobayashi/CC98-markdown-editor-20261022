# P14 Router 实现与兼容说明

本文说明 P14 当前 Router 的运行结构、React Router 7 API 用法、legacy 兼容边界，以及 React 组件树外发起导航时的选择原则。完整公开 URL 清单见 [`route-map.md`](./route-map.md)。

## 一句话概括

当前实现是 **React Router 7 Data Router + 单一浏览器 Router + 持久 `AppShell`**。旧 class 组件暂时通过几个窄兼容桥继续工作；这些桥只覆盖 P13.5 审计中确认仍在使用的能力，并不是 React Router 4 的完整 polyfill。

## 运行结构

```text
ErrorBoundary
└─ Redux Provider
   └─ CrossTabSync
      └─ AntD ConfigProvider
         └─ RouterProvider
            └─ AppShell（持续挂载）
               ├─ Header
               ├─ ErrorControl
               ├─ Outlet（当前页面或嵌套 layout）
               └─ Footer
```

`src/app/providers/create-app-root.tsx` 仍负责根 Provider 组合，但应用内容已从 legacy `App` 改为 `AppRouter`。

`src/app/router/app-router.tsx` 在模块初始化时完成三件事：

1. 用 `createBrowserRouter(routes)` 创建唯一 Router；
2. 把 `appRouter.navigate` 绑定到应用级 navigation port；
3. 由 `RouterProvider` 把 Router 接入 React 树。

Router location 是 URL 状态的唯一事实源。Redux 不再保存 `router` 分支，也不再安装 `routerReducer`、`routerMiddleware` 或维护另一份 `history`。

## Route tree 与持久 layout

最外层 route 使用 `AppShell`，所有公开页面都是它的 children。普通页内导航只替换根 `Outlet`，因此 Header、Footer、Provider 和 Store 不会随页面重新挂载。

UserCenter、Message、Focus 和 User 是嵌套 layout：父组件保留导航栏、标题和页面结构，原有局部 `BrowserRouter/Route` 被删除，匹配到的子页面统一渲染到父组件的 `Outlet`。

旧 Router 4 的非 `exact` route 具有前缀匹配行为。迁移后通过显式 `/*` 承接仍允许更深路径的 route，例如：

```tsx
{ path: "search/*", ... }
{ path: "editor/:mode/:id?/*", ... }
{ path: "list/:boardId/:type?/:page?/*", ... }
```

部分嵌套 layout 保留 `{ path: "*", element: null }`：未知子路径仍显示父 layout，但不产生新的子页面。这是在不扩大 P14 行为范围的前提下保留旧 fallback 行为，不代表新增了子级 404 页面。

旧 `Redirect` 使用 `<Navigate replace>` 表达，避免默认跳转在浏览历史中额外增加一项。

## React Router 7 API 对照

| API | 当前用途 | 替代的旧实现 |
| --- | --- | --- |
| `createBrowserRouter` | 创建唯一浏览器 Router 和 route tree | `ConnectedRouter` 与顶层 `Switch` |
| `RouterProvider` | 把 Data Router 接入 React 树 | `ConnectedRouter` |
| `Outlet` | 渲染匹配到的嵌套子页面 | 子模块自己的 `Route/Switch` |
| `Navigate` | 声明式 replace 重定向 | `Redirect` |
| `Link` | 普通站内导航 | Router 4 `Link` |
| `NavLink` | 根据 `isActive` 计算激活样式 | `activeClassName` |
| `useLocation` | 获取 `pathname/search` | 旧 route props 或直接读取全局 location |
| `useParams` | 获取动态路径参数 | `match.params` |
| `useNavigate` | 组件内执行 push/replace | `history.push/replace` |
| `useBlocker` | 阻断 Router 内部导航 | `Prompt` |
| `useBeforeUnload` | 刷新或关闭标签页时提示 | 浏览器离开保护 |
| `useRouteError` | 取得 Data Router 捕获的异常 | 无直接旧 API 对应项 |

`NavLink` 的旧 `exact` 使用 `end` 表达，旧 `activeClassName` 使用 `className={({ isActive }) => ...}` 表达。

## Route lazy：额外优化，不是 Router 7 必需条件

Router 升级本身可以继续静态 import 页面：

```tsx
import { MainPage } from "@legacy/Components/MainPage";

{
  index: true,
  Component: MainPage,
}
```

P14 额外把页面改为 Data Router 的 route `lazy`：

```tsx
{
  index: true,
  lazy: lazyNamed(
    () => import("@legacy/Components/MainPage"),
    "MainPage"
  ),
}
```

这会让 Vite 按 route 生成动态 chunk，页面代码在首次命中相应 route 时加载。它是代码分包/首屏依赖优化，不是 React Router 7 能运行的前提。

旧模块同时存在默认导出、具名导出和需要 route props 的 class，因此 `app-router.tsx` 提供四个组合辅助函数：

- `lazyNamed`：加载具名导出；
- `lazyDefault`：加载 `default` 导出；
- `lazyNamedWithRouteProps`：加载具名导出后套 legacy route props 桥；
- `lazyDefaultWithRouteProps`：加载默认导出后套 legacy route props 桥。

代价是 route tree 增加间接层，并通过字符串导出名及 `ComponentType<any>` 放宽了部分静态检查。导出名错误、动态 chunk 加载失败或首次导航加载问题需要在真实浏览器中验证。共享 vendor 仍然较大，因此不能只依据生成了页面 chunk 就断言用户可感知性能一定改善。

## Legacy route props 兼容桥

React Router 7 不再向 class 页面自动注入 Router 4 风格的 props。`src/app/router/legacy-route-props.tsx` 用 hooks 获取现代 Router 数据，再向旧组件注入：

```ts
{
  match: {
    params,
  },
  location: {
    pathname,
    search,
  },
  history: {
    length,
    push(),
    replace(),
  },
}
```

映射关系如下：

- `match.params` 来自 `useParams()`；
- `location.pathname/search` 来自 `useLocation()`；
- `history.push(to, state)` 调用 `navigate(to, { state })`；
- `history.replace(to, state)` 调用 `navigate(to, { replace: true, state })`；
- `history.length` 读取 `window.history.length`。

桥接层有意不实现 `history.go/back/forward/listen`、`history.location/action`、`match.path/url/isExact`，也不负责 ref 转发或 HOC 静态属性提升。如果后续旧组件开始调用这些能力，应优先把该组件函数化并直接使用 Router 7 API，而不是继续扩张兼容桥。P15 负责删除这层桥。

## React 组件树外导航

### 为什么不能直接使用 `useNavigate`

`useNavigate()` 是 React Hook，只能在函数组件或自定义 Hook 的执行上下文中调用。普通 service、Redux listener、全局通知回调和 legacy utility 注册函数不在 React 组件树中，不能直接调用它。

### 选择顺序

#### 1. 组件内直接使用 `useNavigate`

```tsx
function Example() {
  const navigate = useNavigate();

  return <button onClick={() => navigate("/logon")}>退出</button>;
}
```

#### 2. 能传参时，优先把导航回调注入普通逻辑

```tsx
const navigate = useNavigate();

runOperation({
  onSuccess: () => navigate("/logon"),
});
```

这样依赖最明确，也最容易测试。

#### 3. 无法合理传参的 React 树外 legacy 逻辑使用 navigation port

```ts
import { navigate } from "@app/router/navigation";

navigate("/logon");
```

`src/app/router/navigation.ts` 保存一个已绑定的 `NavigateFunction`。`app-router.tsx` 创建 Router 后执行：

```ts
bindAppNavigate(appRouter.navigate.bind(appRouter));
```

当前使用者包括：

- 登录失效副作用：跳转 `/logon`；
- 通知点击回调：跳转 `/message/response`。

如果在 Router 绑定前调用，port 会抛出 `Application Router has not been initialized.`，避免导航静默失效。正常 bootstrap 的静态模块求值会先加载 `create-app-root -> app-router`，再执行 legacy utility 注册，因此正常入口下会先完成绑定。

业务模块不应默认直接 import `appRouter` 后调用 `appRouter.navigate()`：虽然技术上可行，但会把业务代码与具体 Router 实例耦合，并增加循环依赖风险。navigation port 的作用正是隔离这项依赖。

#### 4. 明确需要整页重载时使用浏览器导航

```ts
window.location.href = "/logon";
```

这会重新加载整个 SPA，不等同于 Router 站内导航。只有 reset、跨站地址、下载或确实要求完整刷新等语义才应使用。

## 旧 Prompt 兼容

`src/app/router/navigation-prompt.tsx` 为尚未函数化的编辑器保留旧字符串/布尔合同：

- `when === false`：不阻断；
- message 返回 `true`：允许站内导航；
- message 返回 `false`：取消本次导航且不弹窗；
- message 返回字符串：调用 `window.confirm`；
- 确认后调用 `blocker.proceed()`，取消后调用 `blocker.reset()`；
- 刷新或关闭标签页时由 `useBeforeUnload` 请求浏览器显示原生未保存内容提示。

现代浏览器不会可靠显示自定义 before-unload 文案，因此刷新/关闭只能使用浏览器原生提示。站内导航与刷新/关闭必须分别人工验收。

## 错误处理兜底

当前保留两类错误通道：

1. Redux 业务错误：`AppShell` 根据 `state.error` 用对应状态页替换根 `Outlet`；
2. route lazy 或 render 异常：route `errorElement` 通过 `useRouteError()` 取得异常，再抛给 Provider 树外层的 legacy `ErrorBoundary`。

这样不会落入 Data Router 的默认错误页面，同时保持现有业务错误状态和应用错误边界的 owner。

## `react-router-dom` 的冻结兼容

现代应用代码优先从 `react-router` 导入组件和 hooks，`RouterProvider` 从 `react-router/dom` 导入。`react-router-dom@7.18.0` 暂时保留，是因为冻结的 UBB handler 仍从该包导入 `Link`。

部分 UBB 文件仍残留未使用的 `BrowserRouter as Router`、`Route` import，但当前实际返回值只渲染 `Link`，没有创建第二个 Router。解冻 UBB 后应迁移这些 import，并删除这项兼容依赖。

## 已知边界与验收要求

- route lazy 是额外性能改动，应与 Router 语义迁移分别审核；
- legacy route props 只覆盖已证明仍在使用的窄合同，不是完整 Router 4 模拟；
- navigation port 依赖应用初始化顺序，孤立测试需要显式绑定或替代实现；
- `Prompt` 的站内确认和浏览器离开提示不是同一条执行路径；
- `NotificationController` 仍未挂载，本阶段只迁移其潜在导航依赖；
- `/list/*` 与 `/board/*` 的双 owner、子级未知路径、显式错误 route 缺失等旧问题不在 P14 修复；
- typecheck、build、route matching 和 HTTP 200 都不能替代真实浏览器中的 back/forward、刷新、参数变化、登录失效、编辑阻断和壳层持久性验收。
