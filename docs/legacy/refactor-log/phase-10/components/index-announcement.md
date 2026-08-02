# Announcement class → function 对照

- 原文件/符号：`Pages/Index/Announcement.tsx` / `Announcement`
- 新文件/符号：`src/pages/home/ui/Announcement.tsx` / `Announcement`
- 原 props/state：`{ data }` / 无 state
- 原 lifecycle 与调用顺序：无；空字符串直接返回 `null`
- 原 Redux/Router/DOM/fetch/storage 依赖：无；只调用 `UbbContainer`
- 新 hooks 和依赖数组：无
- cleanup 对应关系：无
- 保持不变的行为：与旧首页公告不同，空字符串继续返回 `null`
- 发现但未修复的缺陷 ID：`P10-HOME-001`
- 人工验收路径与结果：`/index`，待验收

## 原写法

```tsx
export class Announcement extends React.Component<{ data }, {}> {
  render() {
    if (this.props.data == "") return null;
    return <UbbContainer code={this.props.data} />;
  }
}
```

## 新写法

```tsx
export function Announcement(props: AnnouncementProps) {
  if (props.data == "") return null;
  return <UbbContainer code={props.data} />;
}
```
