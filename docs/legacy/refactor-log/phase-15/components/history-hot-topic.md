# HistoryHotTopic

- 旧位置：`Components/Topic/Topic-Hot-History.tsx` class。
- 新 owner：`src/pages/hot-topics/history` 具名函数。
- 数据：共享 `HotTopicPage` 使用 `kind="history"` 请求既有热门 API。
- 行为：标题“历史上的今天”、DOM/CSS、字段映射和空白初始状态不变。
- 修复：主题项使用稳定 id key；卸载后的旧请求结果被忽略。
- 兼容：旧路径保留 `HistoryHotTopic` named re-export。

人工重点：真实数据顺序、匿名主题、媒体内容、最后回复链接和快速离页。
