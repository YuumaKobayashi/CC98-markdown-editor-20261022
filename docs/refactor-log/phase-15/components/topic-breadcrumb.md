# TopicBreadcrumb

- 原位置：`Components/Topic/Topic-Category.tsx` / `Category`。
- 新位置：`src/entities/topic/ui/TopicBreadcrumb.tsx` / `TopicBreadcrumb`。
- 之前：class 在 mount/update 将 topic/board props 复制到 state，首次 commit 使用空值。
- 现在：具名函数直接从当前 props 派生 breadcrumb 文案和链接，不使用 state/effect。
- 行为：首页、`/boardlist`、版面和主题 URL、内联样式与标题截断 DOM 不变。
- 兼容：旧路径保持 `Category` 具名映射；Topic 与 trace 直接使用 entity 入口。
- 人工检查：首次显示、主题切换、版面名/标题和四段导航。
