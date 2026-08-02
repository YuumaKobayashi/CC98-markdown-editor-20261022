# Header

- 旧位置：`Components/Header.tsx` 的 `Header` class。
- 新 owner：`src/app/layouts/header` 的具名函数。
- 状态：直接使用 `useLocation` 派生首页/普通页壳层，不再接收 pathname prop。
- 行为：Logo、顶部链接、CSS class、搜索和用户菜单组合保持不变。
- 兼容：旧路径保留 `Header` named re-export，AppShell 改用新入口。

人工重点：首页/普通页样式、普通导航时 Header 不重建、所有顶部链接正常。
