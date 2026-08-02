# UserCenterLayout

- 原位置：`Components/UserCenter/UserCenter.tsx` / `UserCenterBeforeConnect`。
- 新位置：`src/pages/user-center/layout/ui/UserCenterLayout.tsx` / `UserCenterLayout`。
- 之前：`connect` class 从 Redux 注入登录态，并在未登录时输出 `LogOut`。
- 现在：具名函数用 `useAppSelector` 读取同一字段。
- 行为：未登录页面、DocumentTitle、侧栏 Navigation、Outlet、DOM class、文案与公开 `/usercenter` URL 不变。
- 兼容：旧路径保留 default re-export；Router lazy import 直接使用 layout 入口。
- 人工检查：未登录、已登录、子路由切换和壳层标题。
