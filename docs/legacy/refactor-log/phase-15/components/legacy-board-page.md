# LegacyBoardPage

- 旧位置：`Components/Board/Board.tsx` 的 `BList` class。
- 新 owner：`src/pages/board/legacy-list/ui/LegacyBoardPage.tsx` 具名函数。
- 路由：Router 直接处理 `list/:boardId/:type?/:page?/*`，通过 hooks 读取参数。
- 行为：版面信息、列表类型、管理区、大字报、子路由、20 条分页和错误跳转顺序保持。
- 缺陷：内部 `/board/...` 路由混用、请求竞态和初始版面 id 行为保留。

人工重点：deep link、刷新、切版、分页、back/forward、错误状态和权限。
