# TopicCard

- 旧位置：`Components/Focus/CardTopicSingle.tsx` / `CardTopicSingle`。
- 新位置：`src/entities/topic/ui/TopicCard.tsx` / `TopicCard`。
- 之前：class 在 mount 后用 jQuery删除匿名链接，并用 DOM id 切换原图和缩略图。
- 现在：具名函数从 props/state 声明式派生匿名属性、图片显隐和选中 class。
- 保持不变：主题字段、DOM id/class、链接、楼层锚点、原图 URL 转换、最多六图布局以及音视频选择。
- 兼容：旧符号 `CardTopicSingle` 映射到 entity 入口。
- 人工检查：实名/匿名、空标题、一至六图、缩略图、原图、所有链接与音视频主题。
