# HousingTemplateDialog

- 旧位置：`Components/Edit.tsx` 的 `TmpForm` / `Tmp` class。
- 新 owner：`src/pages/editor/ui/HousingTemplateDialog.tsx` 具名函数。
- 行为：住房模板字段、生成文本、弹窗和父组件回填语义保持。
- 兼容：旧文件继续以 `Tmp` 导出新 owner。
- 缺陷：水费“其他”字段仍沿用错误的电费字段判断。

人工重点：租售字段、付款方式、水电费“其他”、模板生成与回填。
