# TopicSearchPage

- 旧位置：`Components/Search/Search.tsx` 的 `Search` class。
- 新 owner：`src/pages/search/topics` 具名函数。
- 路由：由 `useLocation().search` 驱动首次和后续查询，保留双重 URI 解码与 URL 形状。
- 状态：显式区分 loading、ready、loading-more、done、empty、error；增量请求仍以 20 条判断是否可继续。
- 修复：只取前五个关键词；旧响应不覆盖新路由；滚动监听正确清理；展示 class 不再由 jQuery 修改；主题使用稳定 id key。
- 兼容：旧路径保留 `Search` named re-export。

人工重点：正常/空/失败/非法搜索、超过五词、增量失败重试、快速导航及 back/forward。
