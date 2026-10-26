# QRCode class → function 对照

- 原文件/符号：`Components/MainPage.tsx` / `QRCode`
- 新文件/符号：`src/pages/home/ui/QRCode.tsx` / `QRCode`
- 原 props/state：title/src / 无 state
- 原 lifecycle 与调用顺序：无
- 原 Redux/Router/DOM/fetch/storage 依赖：无
- 新 hooks 和依赖数组：无
- cleanup 对应关系：无
- 保持不变的行为：标题、图片 URL、100% 宽度、首页标题结构不变
- 发现但未修复的缺陷 ID：`P10-HOME-001`
- 人工验收路径与结果：`/` 三个二维码，待验收

## 原写法

```tsx
export class QRCode extends React.Component<{ title: string; src: string }, {}> {
  render() { return <img src={this.props.src} />; }
}
```

## 新写法

```tsx
export function QRCode(props: QRCodeProps) {
  return <img src={props.src} />;
}
```
