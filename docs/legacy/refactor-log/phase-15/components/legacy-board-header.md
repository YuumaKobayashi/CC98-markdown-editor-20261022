# LegacyBoardHeader

- 旧位置：`Components/Board/Board.tsx` 的 `ListHead` class。
- 新 owner：`src/pages/board/legacy-list/ui/LegacyBoardHeader.tsx` 具名函数。
- 依赖：复用 `BoardBreadcrumb`、版面关注 service 和大字报编辑 service。
- 行为：版面图标、名称、大字报、版主、关注按钮、子版面和广告布局保持。
- 缺陷：关注状态不随版面 props 可靠同步，且无 pending/统一失败恢复。

人工重点：大字报编辑、关注/取消、版主与子版面链接、未登录和权限差异。
