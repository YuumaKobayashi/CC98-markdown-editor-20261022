# TopicReplyContent

- 旧位置：`Components/Topic/Topic-ReplyContent.tsx` / `ReplyContent`。
- 新位置：`src/pages/topic/ui/TopicReplyContent.tsx`。
- 现在：具名函数按内容类型复用冻结 UBB、Markdown 转换与投票 owner。
- 保持：内容类型、DOM id/class、图片/链接行为、投票插入和 HTML 渲染结果。
- 延期：Markdown 继续写入 `innerHTML`；投票信息异常继续吞掉。
- 兼容：旧文件保留 default 与 `ReplyContent` 导出；未使用的 v1 管理 import 不再随实现存在。
- 人工检查：UBB、Markdown、投票、图片、链接、空/异常内容和样式。
