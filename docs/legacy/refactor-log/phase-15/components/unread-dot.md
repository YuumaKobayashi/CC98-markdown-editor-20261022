# UnreadDot class → function 对照

- 原文件/符号：`Components/Message/MessagePerson.tsx` / internal `UnreadDot`
- 新文件/符号：`src/entities/message/ui/MessagePerson.tsx` / internal `UnreadDot`
- 原 props/state：`isRead`；无 state/lifecycle
- 新 hooks/cleanup：均无
- 保持不变：已读时 `displaynone`、未读时普通 counter class
- 人工路径：私信联系人已读/未读两种状态；待验收

## 原写法 / 新写法

class render 分支改为同名具名函数的提前返回分支。

## 审核结论

待人工填写。
