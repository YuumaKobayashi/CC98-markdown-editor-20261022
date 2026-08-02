# MessageResponsesPage

- 旧位置：`Components/Message/MessageResponse.tsx` 的 `MessageResponse` class。
- 新 owner：`src/pages/message/responses` 的具名函数。
- 数据：页面直接使用 type 1 和既有回复 API，每次进入页面都获取最新数据；只复用普通页码计算函数。
- 修复：移除可能过期的第一页会话缓存；旧请求不覆盖当前页；列表使用稳定消息 id key。
- 兼容：标题、Pager URL、实体展示和旧 `MessageResponse` 导出保持不变。

人工重点：首页加载、未读刷新、分页、非法页码、快速切页和回复链接。
