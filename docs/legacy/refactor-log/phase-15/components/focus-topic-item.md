# FocusTopicItem

- 原位置：`Components/Focus/FocusTopicSingle.tsx` / `FocusTopicSingle`。
- 新位置：`src/entities/topic/ui/FocusTopicItem.tsx` / `FocusTopicItem`。
- 之前：class 在 mount 后用 jQuery 删除匿名作者及对应最后回复用户链接的 href/target。
- 现在：具名函数按 `userId` 在首次 render 条件输出 href/target，不使用 effect 或 jQuery。
- 行为：DOM id/class、标签分支、空标题占位、主题/版面 URL 和最后回复页码锚点不变。
- 兼容：旧路径将 `FocusTopicItem` 具名映射为 `FocusTopicSingle`；直接调用方使用 entity 入口。
- 人工检查：实名/匿名、有/无标签、10 层边界、空标题和各链接。
