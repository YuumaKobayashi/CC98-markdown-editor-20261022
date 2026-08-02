# MessageSender class → function 对照

- 原文件/符号：`Components/Message/MessageSender.tsx` / `MessageSender`
- 新文件/符号：`src/entities/message/ui/MessageSender.tsx` / `MessageSender`
- 原 props/state：`MessageSendReceiveProps` / 无 state
- 原 lifecycle 与调用顺序：无；按 showTime 选择 class 后渲染
- 原 Redux/Router/DOM/fetch/storage 依赖：无；使用 Moment 和 `UbbContainer`
- 新 hooks 和依赖数组：无
- cleanup 对应关系：无
- 保持不变的行为：发送者 URL、头像、时间格式、DOM id、UBB 和 className 不变
- 发现但未修复的缺陷 ID：无
- 人工验收路径与结果：登录后 `/message` 私信发送气泡，待验收

## 原写法

```tsx
export class MessageSender extends React.Component<MessageSendReceiveProps> {
  render() { return <UbbContainer code={this.props.content} />; }
}
```

## 新写法

```tsx
export function MessageSender(props: MessageSendReceiveProps) {
  return <UbbContainer code={props.content} />;
}
```
