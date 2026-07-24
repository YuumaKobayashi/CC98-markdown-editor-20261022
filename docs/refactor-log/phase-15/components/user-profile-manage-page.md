# UserProfileManagePage

- 旧位置：`Components/UserCenter/User/Manage.tsx` 的 `UserManage` class。
- 新 owner：`src/pages/user-profile/manage` 的具名函数。
- 路由：从 `method/id` 解析目标用户；name 路由成功后 replace 到规范 id URL。
- 状态：请求序号阻止快速切换时旧结果覆盖，成功后更新既有 manage 页签和访问用户 id。
- 修复：不再优先使用 Redux 中可能陈旧的用户 id，非法参数和不存在用户继续进入既有 NotFound 流程。
- 兼容：Router 改用窄入口；旧位置保留 default re-export。

人工重点：id/name deep link、快速切换、back/forward、NotFound 后恢复与管理员权限。
