# BoardBreadcrumb reuse

- 旧位置：`Pages/Board/Head.tsx` / `Category`。
- 新位置：`src/pages/board/ui/BoardBreadcrumb.tsx` / `BoardBreadcrumb`。
- 之前：头部私有 class 渲染首页、版面列表和当前版面三段 breadcrumb。
- 现在：当前 Board header 直接复用先前已迁移的具名函数。
- 保持不变：三个 URL、图标、字体、颜色、间距、宽度字符串和当前版面名称。
- 延期：普通链接与路由安全策略不在本批扩展。
- 兼容：旧 Head 文件额外保留 `Category` 兼容别名。
- 人工检查：三个链接、当前名称、DOM/CSS 和窄屏展示。
