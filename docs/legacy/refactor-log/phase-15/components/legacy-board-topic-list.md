# LegacyBoardTopicList

- 旧位置：`Components/Board/Board.tsx` 的 `ListContent` class。
- 新 owner：`src/pages/board/legacy-list/ui/LegacyBoardTopicLists.tsx` 具名函数。
- 行为：普通主题、每页 20 条、首页置顶、管理选择框、分页与路由导航保持。
- 缺陷：请求无取消/旧响应保护，初始版面 id 与当前路由 id 混用保留。

人工重点：普通列表、首页/后续页、管理模式、分页与快速切版。
