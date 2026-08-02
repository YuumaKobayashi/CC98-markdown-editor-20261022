# NewTopicsPage

- 旧位置：`Components/Topic/Topic-New.tsx` / `AllNewTopic`。
- 新位置：`src/pages/new-topics/ui/NewTopicsPage.tsx` / `NewTopicsPage`。
- 之前：`connect` class 用字段、lifecycle 和 jQuery 管理模式、加载、滚动与显隐。
- 现在：具名函数使用 typed Redux hooks、state、ref 和 mount effect；新帖 listener 继续配对 cleanup。
- 保持不变：三种视图、偏好 API、Redux/本地隐私开关、缓存键、20/500 条合同、重复截断、300px 阈值、loading/done、500ms 回顶、URL、DOM/CSS 和文案。
- 延期：首次/刷新失败锁、`debugger` 按严格保真保留。
- 兼容：旧文件保留 default、`NewTopicsPage` 与 `Category`；Router 使用 page 窄入口。
- 人工检查：三种模式、偏好恢复、隐私、触底/末页、刷新、回顶、未登录与异常 API。
