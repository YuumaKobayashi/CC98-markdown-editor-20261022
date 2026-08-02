# UserProfileNavigation

- 旧位置：`Components/UserCenter/User/Navigation.tsx` 的 `UserNavigationBeforeConnect` class。
- 新 owner：`src/pages/user-profile/layout` 的具名函数。
- 状态：typed selectors 读取访问用户、当前用户、页签与权限。
- 展示：首页、个人中心和管理员管理入口的 URL、图标 class 与 active class 保持不变。
- 兼容：旧路径保留 default re-export。

人工重点：本人入口、管理员入口、exact/manage active 状态及 deep link。
