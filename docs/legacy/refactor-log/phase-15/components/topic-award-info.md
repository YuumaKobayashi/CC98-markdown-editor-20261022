# TopicAwardInfo

- 原位置：`Components/Topic/Topic-AwardInfo.tsx` / `AwardInfo`。
- 新位置：`src/entities/topic/ui/TopicAwardInfo.tsx` / `TopicAwardInfo`。
- 之前：class 通过 `withRouter` 获取 history，头像和用户名分别内联 push，并在 render 输出 props。
- 现在：具名函数使用 `useNavigate` 和一个具名 handler，移除调试日志。
- 行为：`/user/name/:userName`、头像/用户名双入口、评分内容、理由和 DOM class 不变。
- 兼容：旧路径保留 default re-export；评分调用方改用 entity 入口。
- 人工检查：头像/用户名导航、内容和理由展示。
