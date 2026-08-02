# NoticeMessage class → function 对照

- 原文件/符号：`Components/NoticeMessage.tsx` / `NoticeMessage`
- 新文件/符号：`src/shared/ui/feedback/NoticeMessage.tsx` / `NoticeMessage`
- 原 props/state：text/id/top/left；无 state/lifecycle
- 新 hooks/cleanup：均无
- 保持不变：`noticeSuccess displaynone`、DOM id、fixed positioning 与文本样式
- 人工路径：回复、收藏、消息设置等成功/失败提示；待验收

## 原写法 / 新写法

`PureComponent` 的纯 render 改为具名函数；不改变外部 jQuery 所依赖的 DOM ABI。

## 审核结论

待人工填写。
