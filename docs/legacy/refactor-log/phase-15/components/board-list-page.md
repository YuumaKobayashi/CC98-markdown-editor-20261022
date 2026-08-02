# BoardListPage

- 旧位置：`Components/Board/BoardList.tsx` 的 `BoardList` class。
- 新 owner：`src/pages/board-list` 的具名函数。
- 副作用：mount `useEffect`请求原 `/Board/all`，不新增缓存、loading、错误或重试 UI。
- 展示：版面顺序、右侧导航、页面标题和 1140px 布局保持不变。
- 修复：导航目标不存在时不再解引用 null。
- 兼容：Router 改用窄入口；旧位置继续 named re-export `BoardList`。

人工重点：API 成功/失败、导航定位、页面顺序和首次空白行为。
