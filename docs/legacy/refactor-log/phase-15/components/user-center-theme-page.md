# UserCenterThemePage

- 旧位置：`Components/UserCenter/Theme.tsx` / `Theme`。
- 新位置：`src/pages/user-center/theme/ui/UserCenterThemePage.tsx` / `UserCenterThemePage`。
- 之前：connected class 提交固定主题或日夜设置，再更新 Redux 与运行时 stylesheet。
- 现在：具名函数使用 typed Redux hooks 和同一 theme registry/runtime service。
- 保持不变：`/me/theme`、`me/theme-setting`、认证 header、未知主题回退、主题按钮样式/禁用、Redux userInfo 与 `changeTheme` 调用。
- 延期：固定主题 API 失败继续静默，不新增全局错误 UI。
- 兼容：旧文件保留 default、`Theme`、设置表单别名，以及 `themeList`、`themeDayNightGroups` 与对应类型。
- 人工检查：所有固定主题、未知编号、日夜设置后的实际主题、失败与刷新。
