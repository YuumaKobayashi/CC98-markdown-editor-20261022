# MessageSystemPage

- 旧位置：`Components/Message/MessageSystem.tsx` 的 `MessageSystem` class。
- 新 owner：`src/pages/message/system` 的具名函数。
- 数据：页面直接使用 type 3 和既有系统通知 API，每次进入页面都获取最新数据；只复用普通页码计算函数。
- 修复：移除可能过期的第一页会话缓存；正整数页码、旧请求保护和稳定 key 与其余通知页一致。
- 兼容：标题、Pager URL、实体展示和旧 `MessageSystem` 导出保持不变。

人工重点：首页加载、分页、已读样式、有/无主题和楼层链接。
