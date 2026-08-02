# UserRecentTopicsActivityList

- 旧位置：`Components/UserCenter/ExactActivitiesTopics.tsx` / `Activities`。
- 新位置：`src/pages/user-center/overview/ui/UserRecentTopicsActivityList.tsx` / `UserRecentTopicsActivityList`。
- 之前：connected class 在 `componentWillMount` 检查 Redux 缓存，用实例页码和 window scroll listener 触底取数。
- 现在：具名函数使用 typed hooks；初始缓存检查和 listener/cleanup 分成普通 effect，页码仍按每次读取递增。
- 保持不变：`/me/recent-topic`、11 条探测、1500px 阈值、Redux 数组、分隔线、loading 与“没有主题”文案。
- 延期：`hasTotal.profile`/`mytopics` 键错位，loading 更新前可能重复触发。
- 兼容：旧文件保留 default/named re-export，overview 直接组合新 owner。
- 人工检查：缓存、空列表、连续滚动、末批、异常 API 和重复触发边界。
