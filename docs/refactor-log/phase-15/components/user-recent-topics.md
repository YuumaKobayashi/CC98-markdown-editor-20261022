# UserRecentTopics

- 旧位置：`Components/UserCenter/User/Activities.tsx` 的匿名 class。
- 新 owner：`src/pages/user-profile/overview/ui/UserRecentTopics.tsx` 的具名函数。
- 状态：本地 topics、loading、hasMore；用户 id 变化立即清空并重新请求。
- 分页：保持 `size=11`、展示 10 条、offset 与 1500px 滚动阈值。
- 清理：effect cleanup 移除 scroll listener，请求序号忽略旧用户结果。
- 修复：最终批次不足 11 条时停止监听；主题与分隔线使用稳定 topic id key。

人工重点：首次加载、增量、最终批次、空态、失败重试与切换用户。
