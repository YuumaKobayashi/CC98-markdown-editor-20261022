# TopicIPData class → function 对照

- 原文件/符号：`Components/Topic/Topic-IPData.tsx` 默认 class
- 新文件/符号：`src/features/moderation/ui/TopicIPData.tsx` / `TopicIPData`
- 原 props/state：`IPData`、`changeStatus`；`visible: true`
- 原 lifecycle 与调用顺序：无 lifecycle
- 原 Redux/Router/DOM/fetch/storage 依赖：无；父组件负责请求和卸载
- 新 hooks 和依赖数组：`useState(true)`；无 effect；内部 `onClick` 使用 `const + 箭头函数`
- cleanup 对应关系：原实现无 cleanup，新实现无 cleanup
- 保持不变的行为：Modal 属性、确认/取消回调、折叠列表、内容截断和父组件卸载合同
- 发现但未修复的缺陷 ID：`P11-MODERATION-001`
- 人工验收路径与结果：有权限用户在 Topic 管理区点击“查看IP”；待人工填写

## 原写法

```tsx
state: State = { visible: true };
onClick = () => this.props.changeStatus();
```

## 新写法

```tsx
const [visible] = React.useState(true);
const { IPData, changeStatus } = props;
const onClick = () => {
  changeStatus();
};
```

## 审核结论

待人工填写。
