# HeaderSearch

- 旧位置：`Components/Header.tsx` 的 `SearchBeforeConnent` class。
- 新 owner：`src/app/layouts/header` 的具名函数，兼容别名 `Search`。
- 状态：搜索类型、输入、下拉和 hover 由 React state 管理。
- 副作用：document 外部点击监听使用具名 handler 并 cleanup；路由上下文变化时选择主题或版内默认类型。
- 行为：主题、全站、版内、用户、版面 URL，双重 URI 编码、Enter 和空输入合同保持不变。

人工重点：主题/版面/帖子/搜索页上下文、下拉关闭、用户查询、back/forward。
