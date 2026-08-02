# LegacyBoardSavedTopics

- 旧位置：`Components/Board/Board.tsx` 的 `ListSaveContent` class。
- 新 owner：`src/pages/board/legacy-list/ui/LegacyBoardTopicLists.tsx` 具名函数。
- 行为：保存主题入口、分页、主题项、权限与路由结构保持。
- 保持：原请求时机、参数、DOM/CSS、loading 和空列表合同。

人工重点：保存主题 deep link、未登录/权限差异、分页和异常 API。
