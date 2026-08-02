# RecommendedReading

- 旧位置：`Components/MainPage.tsx` 的 `RecommendedReadingComponent` class。
- 新 owner：`pages/home` 的 `RecommendedReading` 具名函数。
- 状态：局部索引保留 hover 切换；依赖 `data` 的 `useEffect` 在数据更新后随机选择。
- 行为：图片、标题、摘要、外链、按钮 DOM/CSS 保持不变。
- 兼容：旧符号映射到新实现。

人工重点：首次数据到达、单条/多条推荐、hover 切换和空数组。
