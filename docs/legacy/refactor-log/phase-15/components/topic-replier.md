# TopicReplier

- 旧位置：`Components/Topic/Topic-Replier.tsx` / `Replier`。
- 新位置：`src/pages/topic/ui/TopicReplier.tsx`。
- 现在：具名函数直接使用 user/account/auth 与页面关注 service，局部 state/ref 保留原展示和交互。
- 保持：头像框、用户链接、匿名、在线/身份、关注按钮、粉丝数、权限 DOM/CSS 和提示。
- 延期：关注失败可能保留禁用/省略号状态；快速重复操作无旧响应保护。
- 兼容：旧文件保留 default 与 `Replier` 导出。
- 人工检查：匿名/实名、头像框、关注/取消、未登录、失败 API 与权限。
