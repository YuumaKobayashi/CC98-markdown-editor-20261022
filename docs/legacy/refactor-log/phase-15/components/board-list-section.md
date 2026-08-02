# BoardListSection

- 旧位置：`Components/Board/BoardList.tsx` 的 `RootBoard` class。
- 新 owner：`src/pages/board-list` 的具名函数。
- 状态：一个 `useState(true)`保留默认展开与反复展开/收起。
- 展示：区名称、主管链接、间距、DOM id、按钮文案和子版面组合保持不变。
- 兼容：旧位置继续 named re-export `RootBoard`。

人工重点：默认展开、点击整个标题行切换、多个主管和无主管区域。
