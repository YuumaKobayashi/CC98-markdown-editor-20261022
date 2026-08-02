# SpecialOfferComponent class → function 对照

- 原文件/符号：`Components/MainPage.tsx` / `SpecialOfferComponent`
- 新文件/符号：`src/pages/home/ui/SpecialOfferComponent.tsx` / `SpecialOfferComponent`
- 原 props/state：`{ data }` / 无 state
- 原 lifecycle 与调用顺序：无；data 非空时 map 福利链接
- 原 Redux/Router/DOM/fetch/storage 依赖：无
- 新 hooks 和依赖数组：无
- cleanup 对应关系：无
- 保持不变的行为：无数据返回 `null`，链接、新窗口、文案和 className 不变
- 发现但未修复的缺陷 ID：无
- 人工验收路径与结果：`/` 福利优惠，待验收

## 原写法

```tsx
export class SpecialOfferComponent extends React.Component<{ data }, {}> {
  render() {
    return this.props.data.length > 0 ? <div className="specialOffer" /> : null;
  }
}
```

## 新写法

```tsx
export function SpecialOfferComponent(props: Props) {
  return props.data.length > 0 ? <div className="specialOffer" /> : null;
}
```
