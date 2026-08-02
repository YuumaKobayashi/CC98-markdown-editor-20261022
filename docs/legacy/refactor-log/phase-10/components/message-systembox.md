# MessageSystembox class → function 对照

- 原文件/符号：`Components/Message/MessageSystembox.tsx` / `MessageSystembox`
- 新文件/符号：`src/entities/message/ui/MessageSystembox.tsx` / `MessageSystembox`
- 原 props/state：`MessageSystemProps` / 无 state
- 原 lifecycle 与调用顺序：无；按 topicId/floor/isRead 生成 UBB
- 原 Redux/Router/DOM/fetch/storage 依赖：无；使用 Moment 和冻结 UBB
- 新 hooks 和依赖数组：无
- cleanup 对应关系：无
- 保持不变的行为：楼层算法、已读颜色/粗体、链接、UBB options 和日期格式不变
- 发现但未修复的缺陷 ID：无
- 人工验收路径与结果：登录后 `/message` 系统消息，待验收

## 原写法

```tsx
export class MessageSystembox extends React.Component<MessageSystemProps> {
  render() { return <div className="message-system-box">{content}</div>; }
}
```

## 新写法

```tsx
export function MessageSystembox(props: MessageSystemProps) {
  return <div className="message-system-box">{content}</div>;
}
```
