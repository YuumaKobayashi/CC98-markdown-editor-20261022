# SchoolSuggestionBox class → function 对照

- 原文件/符号：`Components/MainPage.tsx` / `SchoolSuggestionBox`
- 新文件/符号：`src/pages/home/ui/SchoolSuggestionBox.tsx` / `SchoolSuggestionBox`
- 原 props/state：空 props / 无 state
- 原 lifecycle 与调用顺序：无
- 原 Redux/Router/DOM/fetch/storage 依赖：无
- 新 hooks 和依赖数组：无
- cleanup 对应关系：无
- 保持不变的行为：钉钉意见箱 URL、固定图片 URL、尺寸和新窗口行为不变
- 发现但未修复的缺陷 ID：`P10-HOME-001`
- 人工验收路径与结果：`/` 意见箱，待验收

## 原写法

```tsx
export class SchoolSuggestionBox extends React.Component<{}, {}> {
  render() { return <img src="/static/images/xyyjx.jpg" />; }
}
```

## 新写法

```tsx
export function SchoolSuggestionBox() {
  return <img src="/static/images/xyyjx.jpg" />;
}
```
