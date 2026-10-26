# BoardModerationRecordItem

- 旧位置：`Components/Board/Board.tsx` 的 `BoardRecordContent` class。
- 新 owner：`src/pages/board` 的具名函数。
- 状态：本地 hover state 声明式控制原 `displaynone` class，不再使用 jQuery。
- 展示：实名/匿名/不适用、主题、操作者、时间、IP、DOM id 和 target 保持不变。
- 兼容：legacy 文件继续 named export `BoardRecordContent`。

人工重点：非 `*` IP hover 显隐、`*` 始终隐藏及各链接。
