# BoardPage

- 旧位置：`Pages/Board/index.tsx` / `withRouter(class extends RouteComponent...)`。
- 新位置：`src/pages/board/ui/BoardPage.tsx` / `BoardPage`。
- 之前：匿名 route class 在 mount 刷新 tagInfo、读取 `match.params`、请求 Board 并用 history 跳错误页。
- 现在：具名函数使用 `useParams`、`useNavigate` 和普通首次 effect 执行同一顺序。
- 保持不变：Board API、404/401/500 目标、空白 loading、`board-body` DOM 和默认页码 `"1"`。
- 延期：仅首次挂载取数，同组件快速切版面没有旧响应保护或统一刷新。
- 兼容：旧 index 保留 default re-export；Router 直接使用 page 窄入口。
- 人工检查：deep link、刷新、错误页、快速切版面、back/forward 与页面 DOM。
