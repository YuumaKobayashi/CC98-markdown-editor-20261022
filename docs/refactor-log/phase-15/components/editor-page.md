# EditorPage

- 旧位置：`Components/Edit.tsx` 的 `EditForm` / `ShowEdit` class 主链。
- 新 owner：`src/pages/editor/ui/EditorPage.tsx` 具名函数；页面专用 HTTP 操作位于 `src/pages/editor/api/service.ts`。
- 路由：Router 直接处理 `/editor/:mode/:id?/*`，通过 hooks 读取参数，并在 `mode` / `id` 变化时重新初始化。
- 行为：发主题、投票主题、编辑主题/回复、UBB/Markdown、标签、匿名、通知、缓存、状态分支和跳转合同保持。
- 兼容：`Components/Edit.tsx` 继续导出 `ShowEdit`；零调用的 `Tags`、`Options` 原样保留。
- 缺陷：请求竞态、错误吞噬、提交无 pending 锁、部分错误状态仍继续执行及重复编辑器逻辑保留。

人工重点：三个 mode 的 deep link、刷新、参数切换、back/forward、缓存、提交错误、通知与跳转。
