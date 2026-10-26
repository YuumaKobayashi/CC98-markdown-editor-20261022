# MessageSetting class → function 对照

- 原文件/符号：`Components/Message/MessageSetting.tsx` / `MessageSetting`、`NoticeSetting`
- 新文件/符号：`src/features/message/ui/MessageSetting.tsx` / `MessageSetting`；`src/features/message/model/types.ts` / `NoticeSetting`
- 原 props/state：无 React props/state；设置存于 `noticeSetting`
- 原 lifecycle 与调用顺序：`componentDidMount` 同步读取 storage，逐组修改 radio；无值时写入默认对象
- 原 Redux/Router/DOM/fetch/storage 依赖：jQuery DOM selector、localStorage facade、DocumentTitle、NoticeMessage
- 新 hooks 和依赖数组：`useLayoutEffect(..., [])`；storage 使用 P07 owner adapter
- cleanup 对应关系：原实现无 cleanup，新实现无 cleanup
- 保持不变的行为：五组值、默认对象、selector/id、保存顺序、成功提示、Topic 消费的 runtime class，以及原 TSX 文件头和 `NoticeSetting` 多行注释
- 发现但未修复的缺陷 ID：`P11-MESSAGE-001`
- 人工验收路径与结果：`/message/setting` 及回帖跳转；待人工填写

## 原写法

```tsx
async componentDidMount() {
  const noticeSetting = Utility.getLocalStorage<NoticeSetting>("noticeSetting");
  // 按设置修改 checked attribute；无值时写入默认对象
}
```

## 新写法

```tsx
React.useLayoutEffect(() => {
  const noticeSetting = getLocalStorage<NoticeSetting>("noticeSetting");
  // 保持相同 selector、attribute 和默认写入顺序
}, []);
const setMessageSetting = () => {
  // 保持相同 selector、storage 写入和提示顺序
};
```

## 审核结论

待人工填写。
