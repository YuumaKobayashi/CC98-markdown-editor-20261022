# ChildBoardList

- 旧位置：`Components/Board/BoardList.tsx` 的 `ChildBoard` class。
- 新 owner：`src/pages/board-list` 的具名函数。
- 展示：特殊分区无图片布局、普通分区图片卡片、今日/总数和公开链接保持不变。
- 图片：加载失败继续替换为 `/static/images/_CC98.png`。
- 兼容：旧位置继续 named re-export `ChildBoard`。

人工重点：特殊分区 id、图片成功/失败、版面名替换和链接。
