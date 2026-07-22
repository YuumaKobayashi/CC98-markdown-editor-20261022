# HomeHotTopics

- 旧位置：`Components/MainPage.tsx` 的 `HotTopicComponent` class。
- 新 owner：`pages/home` 的 `HomeHotTopics` 具名函数。
- 行为：空十大继续回退 `mainPageHotTopic`，无缓存时显示原提示；三类热门链接不变。
- 兼容：`HotTopicState` 数据 class 和旧 `HotTopicComponent` 导出保留。

人工重点：正常十大、空十大有/无缓存、空标题占位和三个热门入口。
