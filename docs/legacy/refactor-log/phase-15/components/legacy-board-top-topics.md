# LegacyBoardTopTopics

- 旧位置：`Components/Board/Board.tsx` 的 `ListTopContent` class。
- 新 owner：`src/pages/board/legacy-list/ui/LegacyBoardTopicLists.tsx` 具名函数。
- 行为：首页请求和展示置顶主题，复用统一 legacy 主题项。
- 保持：原请求参数、空列表结构、DOM/CSS 和主题排序。

人工重点：首页置顶显示、切版、异常 API 和普通页不重复展示。
