# UserCenterOverview

- 原位置：`Components/UserCenter/Exact.tsx` / `UserCenterExact`。
- 新位置：`src/pages/user-center/overview/ui/UserCenterOverview.tsx` / `UserCenterOverview`。
- 之前：`connect` class 在 mount 时先切换 profile 页签，再刷新当前用户信息。
- 现在：具名函数用 typed hooks，通过两个按声明顺序执行的 `useEffect` 保持相同 dispatch 顺序。
- 行为：当前用户字段、头像、资料、近期动态、DOM class 与 index URL 不变。
- 兼容：旧路径保留 default re-export；Router lazy named import 新 owner。
- 人工检查：首次进入、资料刷新、当前页签、头像和近期动态。
