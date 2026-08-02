# NavigationErrorReset

- 旧位置：`Components/ErrorControl.tsx` 的 `ErrorControl` class。
- 新 owner：`src/app/providers/navigation-error-reset.tsx` 的具名函数。
- 状态：不再订阅未使用的 `isError`，直接使用 Router location 与 typed dispatch。
- 副作用：依赖 pathname 的普通 `useEffect` 在首次挂载和后续导航时清除全局错误。
- 兼容：旧路径保留 default/named re-export，AppShell 改用新 owner。

人工重点：错误状态首次进入、切换路径、back/forward 后正常清除，普通页面不被旧错误覆盖。
