# TopicReplyList

- 旧位置：`Components/Topic/Topic-Reply.tsx` / `Reply`。
- 新位置：`src/pages/topic/ui/TopicReplyList.tsx`。
- 现在：具名函数以普通 effect 按页码/回复数刷新，递归组合热评、奖励、内容、签名与管理弹窗。
- 保持：普通/追踪/热评接口、递归层级、楼层/hash、首楼签名参数、Modal 显隐和刷新回调。
- 延期：列表请求无取消、竞态和局部错误 UI；既有 key/日志保持。
- 兼容：旧文件保留 default、`Reply`、`ContentState` 和 `FloorSize`。
- 人工检查：普通/热评/追踪、hash、匿名、权限、快速翻页和异常 API。
