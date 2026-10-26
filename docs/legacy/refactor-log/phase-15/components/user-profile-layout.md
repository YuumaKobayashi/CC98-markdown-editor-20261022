# UserProfileLayout

- 旧位置：`Components/UserCenter/User/User.tsx` 的 `UserBeforeConnent` class。
- 新 owner：`src/pages/user-profile/layout` 的具名函数。
- 状态：typed selector 读取用户存在状态；路由参数变化时 dispatch `USER_LOOKUP_STARTED`。
- 路由：非法 method/id 直接显示 `NotFoundUser`，合法路由组合导航与 `Outlet`。
- 兼容：旧路径保留 default re-export，DOM class 与标题不变。

人工重点：不存在用户后访问正常用户可以恢复，非法参数与 manage 子路由行为正确。
