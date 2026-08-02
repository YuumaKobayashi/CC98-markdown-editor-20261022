# BoardContent

- 旧位置：`Pages/Board/Body.tsx` / `Body`。
- 新位置：`src/pages/board/ui/BoardContent.tsx` / `BoardContent`。
- 之前：class mount 并发加载置顶、当前列表和标签，事件用 setState callback 后请求并拼接 pathname 导航。
- 现在：具名函数用普通首次 effect和显式 next 参数保持同一请求、筛选与导航顺序。
- 保持不变：正常/精华/保存/标签 API、20 条分页、首页置顶合并、上下 Pagination、Spin 和 Footer 数据。
- 延期：back/forward 不统一重取，空列表永久 Spin，请求异常/竞态无局部处理，topicCount 切回普通列表不恢复。
- 兼容：旧 Body 文件保留 default re-export。
- 人工检查：三种类型、两级标签、分页、空列表、异常 API、back/forward 和快速操作。
