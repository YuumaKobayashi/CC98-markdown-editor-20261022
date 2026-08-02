# LegacyBoardBestTopicItems

- 旧位置：`Components/Board/Board.tsx` 的 `BestTopics` class。
- 新 owner：`src/pages/board/legacy-list/ui/LegacyBoardTopicLists.tsx` 具名函数。
- 行为：保留原调用时机、参数传递、列表结构与主题项复用。
- 缺陷：`getBestTopics` 的既有参数顺序问题不在迁移中修复。

人工重点：精华列表页码、请求参数表现和异常 API。
