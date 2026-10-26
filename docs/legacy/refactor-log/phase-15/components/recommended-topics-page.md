# RecommendedTopicsPage

- 旧位置：`Components/Topic/Topic-Recommended.tsx` / `AllRecommendedTopic`。
- 新位置：`src/pages/recommended-topics/ui/RecommendedTopicsPage.tsx` / `RecommendedTopicsPage`。
- 之前：class 在 mount 读取当前缓存，并直接修改上一批按钮 hidden 属性。
- 现在：具名函数在普通 effect 中加载，按钮显隐由 state 派生。
- 保持不变：10 条推荐 API、`CurrentRecommendedTopics`、`LastRecommendedTopics`、单级上一批、页面标题、DOM/CSS、文案和链接。
- 兼容：旧文件继续导出 `AllRecommendedTopic`、default 与 `Category`；Router 使用 page 窄入口。
- 人工检查：首次缓存、换一换、上一批、刷新/deep link、空列表及异常 API。
