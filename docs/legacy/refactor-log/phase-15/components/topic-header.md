# TopicHeader

- 旧位置：`Components/Topic/Topic-TopicInfo.tsx` / `TopicInfo`。
- 新位置：`src/pages/topic/ui/TopicHeader.tsx`。
- 现在：具名函数以普通 effect 加载标签，以局部 state 处理收藏和图片显隐。
- 保持：标题、版面、标签、收藏状态/计数、广告、管理入口、DOM id/class 与 jQuery 点击语义。
- 延期：标签/收藏请求无取消、旧响应和统一错误反馈。
- 兼容：旧文件保留 default 与 `TopicInfo` 导出。
- 人工检查：标签、收藏/取消、广告、管理、匿名、未登录与异常 API。
