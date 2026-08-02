# UserRecentPostsManager

- 旧位置：`Components/UserCenter/Manage/ShowPost.tsx` 的 `ShowTopic` class。
- 新 owner：`src/pages/user-profile/manage` 的具名函数。
- 数据：保留 `/User/:id/post`、days/from/size 参数、每页 10 条及版面名补全。
- 状态：本地维护帖子、总数、页码和 loading；请求序号避免快速翻页或切换用户时旧结果覆盖。
- 修复：帖子 key 组合主题、楼层和时间，避免同主题多条回复冲突。
- 已知保留：整十条时总页数文案仍可能多显示一页。
- 兼容：旧位置保留 default re-export。

人工重点：首尾分页、快速翻页、版面名、链接、IP、时间和内容。
