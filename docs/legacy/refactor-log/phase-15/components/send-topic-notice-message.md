# SendTopicNoticeMessage class → function 对照

- 原文件/符号：`Components/NoticeMessage.tsx` / `SendTopicNoticeMessage`
- 新文件/符号：`src/shared/ui/feedback/NoticeMessage.tsx` / `SendTopicNoticeMessage`
- 原 props/state：text/id；无 state/lifecycle
- 新 hooks/cleanup：均无
- 保持不变：CSS class、DOM id 和“操作失败。”前缀
- 人工路径：发帖错误提示；待验收

## 原写法 / 新写法

`PureComponent` render 改为同名具名函数。

## 审核结论

待人工填写。
