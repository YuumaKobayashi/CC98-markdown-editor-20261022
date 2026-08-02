# RecommendedTopicItem

- 原位置：`Components/Focus/RecommendedTopicSingle.tsx` / `RecommendedTopicSingle`。
- 新位置：`src/entities/topic/ui/RecommendedTopicItem.tsx` / `RecommendedTopicItem`。
- 之前：class 在 mount 后删除匿名作者链接属性，并计算未使用的最后回复页码。
- 现在：具名函数声明式输出作者链接属性，移除无可观察结果的死计算。
- 行为：主题、作者、版面、推荐语、时间、DOM class 和空标题占位不变。
- 兼容：旧具名符号 re-export；推荐主题页使用 entity 入口。
- 人工检查：实名/匿名推荐主题、空标题、推荐语和三个目标链接。
