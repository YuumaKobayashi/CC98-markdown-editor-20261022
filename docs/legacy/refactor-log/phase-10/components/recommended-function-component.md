# RecommendedFunctionComponent class → function 对照

- 原文件/符号：`Components/MainPage.tsx` / `RecommendedFunctionComponent`
- 新文件/符号：`src/pages/home/ui/RecommendedFunctionComponent.tsx` / `RecommendedFunctionComponent`
- 原 props/state：`{ data }` / 无 state
- 原 lifecycle 与调用顺序：无；按数组顺序输出图片和链接
- 原 Redux/Router/DOM/fetch/storage 依赖：无
- 新 hooks 和依赖数组：无
- cleanup 对应关系：无
- 保持不变的行为：index key、图片、target、标题和 className 不变
- 发现但未修复的缺陷 ID：`P10-HOME-001`
- 人工验收路径与结果：`/` 推荐功能，待验收

## 原写法

```tsx
export class RecommendedFunctionComponent extends React.Component<{ data }, {}> {
  render() {
    return <div>{this.props.data.map(this.convertRecommendedFunction)}</div>;
  }
}
```

## 新写法

```tsx
export function RecommendedFunctionComponent(props: Props) {
  return <div>{props.data.map(convertRecommendedFunction)}</div>;
}
```
