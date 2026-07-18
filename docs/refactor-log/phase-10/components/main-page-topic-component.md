# MainPageTopicComponent class → function 对照

- 原文件/符号：`Components/MainPage.tsx` / `MainPageTopicComponent`
- 新文件/符号：`src/pages/home/ui/MainPageTopicComponent.tsx` / `MainPageTopicComponent`
- 原 props/state：data/name/fetchUrl/style/mores；无 state
- 原 lifecycle 与调用顺序：无；先生成更多链接，再按 black/blue 选择结构
- 原 Redux/Router/DOM/fetch/storage 依赖：无；使用普通 `<a>`
- 新 hooks 和依赖数组：无
- cleanup 对应关系：无
- 保持不变的行为：topic URL、空标题占位、两套 className、未知 style 的无返回值语义
- 发现但未修复的缺陷 ID：`P10-HOME-001`
- 人工验收路径与结果：`/` 首页各话题栏目，待验收

## 原写法

```tsx
export class MainPageTopicComponent extends React.Component<Props, {}> {
  render() {
    if (this.props.style === "black") return <div className="mainPageListContent2" />;
    if (this.props.style === "blue") return <div className="mainPageListContent1" />;
  }
}
```

## 新写法

```tsx
export function MainPageTopicComponent(props: Props): React.ReactElement {
  if (props.style === "black") return <div className="mainPageListContent2" />;
  if (props.style === "blue") return <div className="mainPageListContent1" />;
}
```
