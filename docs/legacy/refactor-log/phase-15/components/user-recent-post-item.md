# UserRecentPostItem class → function 对照

- 原文件/符号：`Components/UserCenter/ExactActivitiesPost.tsx` / anonymous default class
- 新文件/符号：`src/entities/post/ui/UserRecentPostItem.tsx` / `UserRecentPostItem`
- 原 props/state：`userRecentPost`；无 state
- 原 lifecycle/依赖：无 lifecycle；Router `Link`、recent-post DTO
- 新 hooks：无 hooks
- cleanup：原/新均无
- 保持不变：时间、赞踩、版面/主题 URL、楼层 hash、正文和注释 JSX
- 缺陷：无新增修复
- 人工路径：用户中心我的回复、用户活动回复列表；待验收

## 原写法 / 新写法

`class extends React.Component<Props>` 的纯 `render` 改为 `function UserRecentPostItem({ userRecentPost })`；JSX 与计算公式保持对应。

## 审核结论

待人工填写。
