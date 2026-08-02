# UserRecentTopicItem class → function 对照

- 原文件/符号：`Components/UserCenter/ExactActivitiesTopic.tsx` / anonymous default class
- 新文件/符号：`src/entities/topic/ui/UserRecentTopicItem.tsx` / `UserRecentTopicItem`
- 原 props/state：`userRecentTopic`；无 state
- 原 lifecycle/依赖：无 lifecycle；Router `Link`、recent-topic DTO
- 新 hooks：无 hooks
- cleanup：原/新均无
- 保持不变：版面/主题 URL、时间、空标题占位和注释 JSX
- 缺陷：无新增修复
- 人工路径：用户中心我的主题、足迹和用户活动；待验收

## 原写法 / 新写法

匿名 class 的纯 `render` 改为具名 `UserRecentTopicItem` 函数；旧文件保留默认 facade。

## 审核结论

待人工填写。
