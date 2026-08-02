# BoardBreadcrumb

- 旧位置：`Components/Board/Board.tsx` 的 `Category` class。
- 新 owner：`src/pages/board` 的具名函数。
- 展示：首页、版面列表、当前版面三段链接、chevron、DOM/CSS 和间距保持不变。
- 兼容：legacy `Board.tsx` 内部使用新实现并继续 named export `Category`。

人工重点：不同版面 id/name、三个链接和 back/forward。
