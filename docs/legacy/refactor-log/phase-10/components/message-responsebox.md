# MessageResponsebox class → function 对照

- 原文件/符号：`Components/Message/MessageResponsebox.tsx` / `MessageResponsebox`
- 新文件/符号：`src/entities/message/ui/MessageResponsebox.tsx` / `MessageResponsebox`
- 原 props/state：`MessageResponseProps` / 无 state
- 原 lifecycle 与调用顺序：无；依次生成 board、楼层、用户、标题和 UBB 内容
- 原 Redux/Router/DOM/fetch/storage 依赖：无；使用 Moment 和冻结 UBB
- 新 hooks 和依赖数组：无
- cleanup 对应关系：无
- 保持不变的行为：分页算法、已读/未读标记、UBB options、日期格式及既有额外 `}` 不变
- 发现但未修复的缺陷 ID：`P10-MESSAGE-001`
- 人工验收路径与结果：登录后 `/message` 回复通知，待验收

## 原写法

```tsx
export class MessageResponsebox extends React.Component<MessageResponseProps> {
  render() { return <UbbContainer code={content} options={options} />; }
}
```

## 新写法

```tsx
export function MessageResponsebox(props: MessageResponseProps) {
  return <UbbContainer code={content} options={options} />;
}
```
