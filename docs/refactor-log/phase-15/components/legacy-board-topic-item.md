# LegacyBoardTopicItem

- 旧位置：`Components/Board/Board.tsx` 的 `TopicTitleAndContent` class。
- 新 owner：`src/pages/board/legacy-list/ui/LegacyBoardTopicItem.tsx` 具名函数。
- 行为：主题图标、高亮、匿名、作者、楼层页码、最后回复、管理 checkbox 和冻结 UBB hover 保持。
- 缺陷：逐主题标签请求、调试日志、无取消和旧响应保护继续保留。

人工重点：各类主题图标/颜色、匿名显示、分页链接、最后回复、hover UBB 与批量选择。
