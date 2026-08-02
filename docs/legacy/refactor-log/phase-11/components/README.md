# P11 组件迁移记录

本目录包含 4 个目标组件的 class→function 对照。人工验收结果均待填写；机械验证汇总见上级 `manual-checklist.md`。

四个组件本身使用具名 `function`；组件内部具名函数统一使用 `const + 箭头函数`。原注释随对应实现或符号原文迁入新 owner。

| 批次 | Owner | 组件 |
|---|---|---|
| 简单 local state | `pages/board` | `BoardAnnouncement` |
| 简单 local state | `features/moderation` | `TopicIPData` |
| mount-only effect | `pages/focus` | `FocusFavoriteArea` |
| mount-only effect | `features/message` | `MessageSetting` |
