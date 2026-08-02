# UserProfileOverview

- 旧位置：`Components/UserCenter/User/Router.tsx` 的 `UserExact` class。
- 新 owner：`src/pages/user-profile/overview` 的具名函数。
- 取数：`useParams` 驱动普通 effect，只接受 name 或安全正整数 id。
- 导航：成功后继续 replace 到 `/user/id/:id` 并更新当前访问页/id。
- 并发：请求序号阻止快速切换用户时旧结果覆盖；失败继续 dispatch `userNotFound`。
- 身份：详情子树以用户 id 建立身份，自然重置用户相关本地状态。

人工重点：中文 name、canonical replace、快速切换、back/forward 与不存在用户恢复。
