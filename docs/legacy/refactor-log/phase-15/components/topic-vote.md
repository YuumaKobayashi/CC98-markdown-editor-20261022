# TopicVote

- 旧位置：`Components/Topic/VoteInfo.tsx` / `VoteContent`。
- 新位置：`src/pages/topic/ui/TopicVote.tsx`。
- 现在：具名函数使用局部 state/ref 与普通 effect 承接投票加载、选择、提交和提示 timer。
- 保持：单选/多选、截止时间、结果、HTTP body、成功抛错提示、按钮和 DOM/CSS。
- 清理：提示 timer 在卸载时配对清除，不改变显示时机。
- 延期：非 ok/异常可能保持 voting；请求无取消和旧响应保护。
- 兼容：旧文件保留 default、`VoteContent` 与 `voteInfo` 导出。
- 人工检查：未投/已投、单选/多选、截止、成功/失败、快速提交和异常 API。
