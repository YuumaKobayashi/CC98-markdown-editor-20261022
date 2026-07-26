# ThemeSettingsForm

- 旧位置：`Components/UserCenter/Theme.tsx` / `ThemeSettingComponent`。
- 新位置：`src/pages/user-center/theme/ui/ThemeSettingsForm.tsx` / `ThemeSettingsForm`。
- 之前：class 持有 setting state，用 ref 直接修改结果 span 并以 timer 隐藏。
- 现在：具名函数使用受控 state 和派生 display，仍由父级异步 callback 提交。
- 保持不变：只初始化一次 props setting、checkbox/time 转换、浏览器支持提示、表单 DOM/CSS、成功/失败文案和三秒显隐。
- 延期：props 后续变化不回填，结果 timer 卸载时不 cleanup。
- 兼容：旧 Theme facade 继续导出 `ThemeSettingComponent` 别名。
- 人工检查：两个开关、两个时间、浏览器支持提示、成功/失败和三秒隐藏。
