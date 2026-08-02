# SearchTopicItem

- 原位置：`Components/Search/SearchTopicSingle.tsx` / `SearchTopicSingle`。
- 新位置：`src/entities/topic/ui/SearchTopicItem.tsx` / `SearchTopicItem`。
- 之前：class 在 mount 后以 jQuery 隐藏无标签行，并删除匿名相关链接属性。
- 现在：具名函数首次 render 即输出 `displaynone` 和条件 href/target。
- 行为：DOM id/class、标签文案、主题/版面 URL、空标题占位和最后回复锚点不变。
- 兼容：旧具名符号 re-export；搜索页使用 entity 入口。
- 人工检查：有/无标签、实名/匿名、空标题和最后回复链接。
