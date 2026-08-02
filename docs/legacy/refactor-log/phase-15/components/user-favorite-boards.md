# UserFavoriteBoards

- 原位置：`Components/UserCenter/MyFavoritesBoards.tsx` / `Boards`。
- 新位置：`src/pages/user-center/custom-boards/ui/UserFavoriteBoards.tsx` / `UserFavoriteBoards`。
- 之前：`connect` class 在 constructor 中先请求版面列表，再设置当前页签。
- 现在：具名函数用 typed hooks，以两个按声明顺序执行的 `useEffect` 保持相同 dispatch 顺序。
- 行为：loading、空态、卡片、分隔线、`MyFavoritesBoard` mutation 子组件和公开 URL 不变。
- 兼容：旧路径保留 default re-export；Router lazy import 新 page 入口。
- 人工检查：首次进入、loading/空态、列表分隔线和关注/取关。
