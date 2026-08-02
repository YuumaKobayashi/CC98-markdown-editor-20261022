# TopicPage

- 旧位置：`Components/Topic/Topic.tsx` / `Post`、`ShowTopic`。
- 新位置：`src/pages/topic/ui/TopicPage.tsx`。
- 现在：具名页面用 Router hooks、普通 effect、Quote context 和 composer handle 承接主题取数、翻页、引用与回复刷新。
- 保持：公开 URL、请求顺序、宽松页码解析、键盘翻页、草稿确认、hash 滚动、DOM/CSS 与父子回调。
- 延期：页面请求无取消/旧响应保护；缺失编辑器 ref 的键盘路径保持。
- 兼容：旧文件保留 default、`Post`、`ShowTopic` 与 Quote context 导出；Router 使用 page barrel。
- 人工检查：deep link、刷新、分页、back/forward、键盘、回复、收藏、标签、异常 API。
