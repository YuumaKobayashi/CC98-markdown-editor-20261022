# LegacyBoardRecords

- 旧位置：`Components/Board/Board.tsx` 的 `BoardRecord` class。
- 新 owner：`src/pages/board/legacy-list/ui/LegacyBoardRecords.tsx` 具名函数。
- 依赖：直接调用 board 记录 service，复用 `BoardModerationRecordItem`。
- 行为：事件记录分页、每页数量、Modal 内容和 IP hover 叶子保持。
- 缺陷：首次请求、初始版面 id、错误吞噬和旧响应覆盖行为保留。

人工重点：记录 Modal、分页、IP hover、切版与异常 API。
