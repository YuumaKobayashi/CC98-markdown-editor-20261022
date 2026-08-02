# UserProfileDetails

- 旧位置：`Components/UserCenter/User/Profile.tsx` 的匿名 class。
- 新 owner：`src/pages/user-profile/overview/ui/UserProfileDetails.tsx` 的具名函数。
- 状态：`useState` 管理关注、按钮禁用和提示，沿用既有 follow feature API。
- 展示：权限色、赞、锁定/禁言、资料字段、生日、私信与签名 UBB 保持不变。
- 修复：非法生日字符串先检查正则匹配，不再解引用 null。
- 身份：由 overview 的用户 id key 保证切换用户时自然重置。

人工重点：关注成功/上限/失败、取关、hover 文案、生日与 UBB。
