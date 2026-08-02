# FloorSize class → function 对照

- 原文件/符号：`Components/Topic/Topic-Reply.tsx` / `FloorSize`
- 新文件/符号：`src/entities/post/ui/FloorSize.tsx` / `FloorSize`
- 原 props/state：isHot/floor / 无 state
- 原 lifecycle 与调用顺序：无；先判断 hot，再按楼层范围选择结构
- 原 Redux/Router/DOM/fetch/storage 依赖：无
- 新 hooks 和依赖数组：无
- cleanup 对应关系：无
- 保持不变的行为：普通、超大、楼主和热门四种 DOM/className；热门图片固定 URL 和尺寸不变
- 发现但未修复的缺陷 ID：无
- 人工验收路径与结果：Topic 页，待验收

## 原写法

```tsx
export class FloorSize extends React.Component<Props> {
  render() { return <div className="reply-floor">{this.props.floor}</div>; }
}
```

## 新写法

```tsx
export function FloorSize(props: FloorSizeProps) {
  return <div className="reply-floor">{props.floor}</div>;
}
```
