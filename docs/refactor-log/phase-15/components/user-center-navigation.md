# UserCenterNavigation

- 旧位置：`Components/UserCenter/Navigation.tsx` 匿名 class。
- 新 owner：`src/pages/user-center/layout/ui/UserCenterNavigation.tsx` 具名函数。
- state：保留回顶按钮的 `buttonClassName` 局部状态。
- effect：挂载时监听 document scroll，卸载时移除；不使用 `useLayoutEffect`。
- 行为：导航 URL、active class、234px 阈值、DOM id/class 和 jQuery 500ms 回顶动画不变。
- 兼容：旧路径 default re-export 新 owner。

人工重点：全部 NavLink、back/forward active 状态、滚动阈值与回顶动画。
