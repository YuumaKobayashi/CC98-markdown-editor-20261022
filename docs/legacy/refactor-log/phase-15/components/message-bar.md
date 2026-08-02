# MessageBar

- 旧位置：`Components/Common/MessageBar.tsx` 的 `MessageBar` class。
- 新 owner：`src/shared/ui/feedback/MessageBar.tsx` 具名函数。
- 实际调用：冻结 UBB 编辑器仍通过旧路径 facade 使用该组件，因此本批按 live 运行链迁移。
- 行为：`MessageType`、Info/Warning/default 样式、DOM class 和内容渲染保持。
- 兼容：旧文件继续导出 `MessageBar` 与 `MessageType`。

人工重点：UBB 限制标签提示的 Info、Warning 和默认样式。
