# UserCenterSettingsPage

- 旧位置：`Components/UserCenter/Config.tsx` / `Config`。
- 新位置：`src/pages/user-center/settings/ui/UserCenterSettingsPage.tsx` / `UserCenterSettingsPage`。
- 之前：connected class 在 constructor 复制 Redux 用户资料，并用实例方法提交、重置和合并子表单字段。
- 现在：具名函数使用 typed Redux hooks、受控编辑模型和 mount effect；头像、签名与其他设置继续组成同一 DOM。
- 保持不变：`/me` PUT、Authorization/JSON、邮箱/QQ/生日校验、Redux 刷新、提交/重置按钮、提示文案与一秒成功提示。
- 延期：非法日历日期可能自动进位，成功 timer 不 cleanup。
- 兼容：旧文件保留 default 与 `Config`；Router 使用 settings 窄入口。
- 人工检查：初始化/reset、全部字段、校验边界、成功/失败、刷新与 deep link。
