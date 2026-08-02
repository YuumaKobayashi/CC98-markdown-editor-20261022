# BoardTagPagination

- 旧位置：`Components/Board/Board.tsx` 的 `ListTagAndPager` class。
- 新 owner：`src/pages/board` 的具名函数。
- 展示：无标签、一级标签、两级标签、“全部”、tag1/tag2 URL 与 Pager 合同保持不变。
- 修复：标签映射外层元素使用稳定 tag id key。
- 兼容：legacy `Board.tsx` 内部使用新实现并继续 named export `ListTagAndPager`。

人工重点：零/一/两组标签、页码窗口、标签与分页组合路由。
