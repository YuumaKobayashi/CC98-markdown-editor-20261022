# EditorVoteSettings

- 旧位置：`Components/EditVoteIput.tsx` 的 `Vote` class。
- 新 owner：`src/pages/editor/ui/EditorVoteSettings.tsx` 具名函数，并导出独立投票校验函数。
- 行为：选项增删、单选/多选、截止时间、可见性、最多选择数和原校验文案保持。
- 兼容：旧文件继续导出 `Vote`、`props`；`Vote.isFormIllegal` 静态调用形状保持。

人工重点：投票选项边界、截止时间、多选上限、可见性和非法表单提示。
