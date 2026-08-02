# EditorTitleInput

- 旧位置：`Components/Edit.tsx` 的 `InputTitle` class。
- 新 owner：`src/pages/editor/ui/EditorTitleInput.tsx` 具名函数。
- 行为：标题、主题类型、财富、标签 DOM 读取、jQuery class 操作和调试日志保持。
- 清理：迁移后的 document / element 监听在 effect 清理中成对移除。
- 兼容：旧文件继续以 `InputTitle` 导出新 owner。

人工重点：标题长度、类型与权限、财富、标签选择和参数切换。
