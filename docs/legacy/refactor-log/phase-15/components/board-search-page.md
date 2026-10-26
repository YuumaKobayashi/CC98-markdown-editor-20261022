# BoardSearchPage

- 旧位置：`Components/Search/SearchBoard.tsx` 的 `SearchBoard` class。
- 新 owner：`src/pages/search/boards` 具名函数。
- 路由：查询字符串变化时请求，快速切换产生的旧结果被忽略。
- 修复：无效参数、空数组和无返回值均声明式显示空态；版面链接使用稳定 id key。
- 兼容：URL、外链和旧 `SearchBoard` named re-export 保持不变。

人工重点：正常/空/非法关键词、中文双重编码、快速导航和版面外链。
