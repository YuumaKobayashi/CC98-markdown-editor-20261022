# AnnouncementComponent class → function 对照

- 原文件/符号：`Components/MainPage.tsx` / `AnnouncementComponent`
- 新文件/符号：`src/pages/home/ui/AnnouncementComponent.tsx` / `AnnouncementComponent`
- 原 props/state：`{ data }` / 无 state
- 原 lifecycle 与调用顺序：无；每次 render 直接判断空字符串
- 原 Redux/Router/DOM/fetch/storage 依赖：无；只调用 `UbbContainer`
- 新 hooks 和依赖数组：无
- cleanup 对应关系：无
- 保持不变的行为：空字符串返回空 `div`；非空显示首页公告标题和 UBB
- 发现但未修复的缺陷 ID：`P10-HOME-001`
- 人工验收路径与结果：`/`，待验收

## 原写法

```tsx
export class AnnouncementComponent extends React.Component<{ data }, {}> {
  render() {
    if (this.props.data == "") return <div></div>;
    return <UbbContainer code={this.props.data} />;
  }
}
```

## 新写法

```tsx
export function AnnouncementComponent(props: AnnouncementComponentProps) {
  if (props.data == "") return <div></div>;
  return <UbbContainer code={props.data} />;
}
```
