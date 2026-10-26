# TrackedTopicPage

- 旧位置：`Components/Topic/Topic-Trace.tsx` / `CurUserPost`。
- 新位置：`src/pages/topic/ui/TrackedTopicPage.tsx`。
- 现在：具名页面以路由页码 effect 加载追踪回复，并复用 Topic 头部、列表、编辑器和 Quote context。
- 保持：重复 topic info 请求、规范化页码比较、首次收藏状态、调试日志、键盘翻页和回复后跳转。
- 延期：同页更换 topic/post 不一定重取；请求无取消与旧响应保护。
- 兼容：旧文件保留 default、`CurUserPost` 与 Quote context 导出。
- 人工检查：追踪 deep link、分页、back/forward、引用、回复、收藏与快速切换。
