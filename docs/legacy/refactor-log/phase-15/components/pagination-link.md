# PaginationLink

- 原位置：`Components/Pager.tsx` / `PageModel`。
- 新位置：`src/shared/ui/pagination/Pager.tsx` / `PaginationLink`。
- 之前：私有 `React.PureComponent`，接收 text、url、active 并输出单个页码链接。
- 现在：文件内具名函数组件，props 和最终 `<li>/<Link>` 结构不变。
- 行为：保留 `page-item`、`page-link active`、链接文本和 URL；不引入 state 或 effect。
- 调用：仅由新 `Pager` 使用，旧文件不公开该私有符号。
- 人工检查：当前页 class、普通页链接、前后页符号显示。
