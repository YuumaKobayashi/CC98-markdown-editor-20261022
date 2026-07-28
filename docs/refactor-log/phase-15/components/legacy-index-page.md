# LegacyIndexPage

- 旧位置：`Pages/Index/Index.tsx` 的 `Index` class。
- 新 owner：`src/pages/legacy-index/ui/LegacyIndexPage.tsx` 具名函数。
- 路由：Router 直接加载旧 `/index` 页面。
- 行为：继续只渲染原文档标题，不扩展页面内容。
- 兼容：旧文件继续导出 `Index`。

人工重点：`/index` deep link、刷新和文档标题。
