# DeleteRecentUserContent

- 旧位置：`Components/UserCenter/Manage/DeleteTopicsAndPosts.tsx` 的 `Delete` class。
- 新 owner：`src/pages/user-profile/manage` 的具名函数。
- 状态：本地保存天数与提示，handler 使用 `const + arrow`。
- 合同：保留删除主题/回复、1 至 365 天校验、DELETE URL、token 与原提示文案。
- 兼容：旧位置保留 default re-export。

人工重点：边界输入、两类删除及成功/失败响应。
