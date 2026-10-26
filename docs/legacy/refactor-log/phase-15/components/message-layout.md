# MessageLayout

- 旧位置：`Components/Message/Message.tsx` 的 `Message` class。
- 新 owner：`src/pages/message/layout` 的具名函数。
- 状态：使用 typed selector 读取四类未读数，由 pathname 声明式确定当前页签。
- 行为：标题、Outlet、导航 URL、DOM id/CSS 和“全部标为已读”入口保持不变。
- 修复：未读数直接决定 counter 可见性；`/message` 和 setting 页也有确定的 active 页签。
- 兼容：旧路径保留 `Message` named re-export。

人工重点：五个页签、未读数变化、全部已读和 nested route/back/forward。
