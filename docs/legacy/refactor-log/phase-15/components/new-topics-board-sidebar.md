# NewTopicsBoardSidebar

- 旧位置：`Components/Focus/CardBoard.tsx` / `CardBoard`。
- 新位置：`src/pages/new-topics/ui/NewTopicsBoardSidebar.tsx` / `NewTopicsBoardSidebar`。
- 之前：class mount 请求版面并注册 sticky window scroll handler。
- 现在：具名函数在普通 mount effect 中执行相同请求、占位数据和 sticky 算法。
- 保持不变：`boardsInfo` 缓存、默认展开、版面顺序、名称转换、索引 key、161.2 阈值、40px 下限和 DOM/CSS。
- 延期：scroll listener 不 cleanup、旧 OR 空值判断和索引 key 均记录后续处理。
- 兼容：旧符号 `CardBoard` 继续 named re-export。
- 人工检查：缓存/请求、展开、链接、长短名称、短/长侧栏和上下滚动。
