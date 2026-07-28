# TopicReplySignature

- 旧位置：`Components/Topic/Topic-ReplierSignature.tsx` / 匿名 class expression。
- 新位置：`src/pages/topic/ui/TopicReplySignature.tsx`。
- 现在：具名函数以局部 state 处理点赞踩、引用、编辑、评分和发言管理。
- 保持：首楼/追踪 page 参数、点赞踩状态、按钮权限、Quote 数据、编辑 URL、Modal 回调与 DOM/CSS。
- 延期：props 变化不同步初始点赞状态，mutation 无 pending/取消/旧响应保护。
- 兼容：旧文件继续提供原 default 导出。
- 人工检查：点赞踩、引用、编辑、评分、管理、首楼/热评/追踪和异常 API。
