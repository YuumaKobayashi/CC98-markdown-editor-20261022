# UserPunishmentForm

- 旧位置：`Components/UserCenter/Manage/Operation.tsx` 的 `Operation` class。
- 新 owner：`src/pages/user-profile/manage` 的具名函数。
- 状态：不可变更新操作类型、期限和理由，表单元素保持受控。
- 合同：保留锁定、屏蔽、TP、解除、PUT URL、token、理由和期限校验及提示文案。
- 已知保留：解除仍要求理由；TP 天数沿用 `-1` 或 7 至 1000 的既有合同。
- 兼容：旧位置保留 default re-export。

人工重点：三种操作、期限/理由边界、切换操作与后端失败。
