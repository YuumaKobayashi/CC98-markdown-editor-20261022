# RandomRecentTopics

- 旧位置：`Components/Focus/CardRecommendTopic.tsx` / `CardRecommendTopic`。
- 新位置：`src/pages/new-topics/ui/RandomRecentTopics.tsx` / `RandomRecentTopics`。
- 之前：class 读写当前/上一批缓存并直接修改按钮 visibility。
- 现在：具名函数使用普通 effect、加载锁 ref 和显式按钮 state。
- 保持不变：10 条随机近期 API、两个缓存键、标题截断、单级上一批、DOM/CSS、文案、链接与调试日志。
- 延期：OR 空值判断、缺失 key 与 console 日志按严格保真保留。
- 兼容：旧符号 `CardRecommendTopic` 继续 named re-export。
- 人工检查：首次缓存、换一换、上一批、截断、链接、空列表和异常 API。
