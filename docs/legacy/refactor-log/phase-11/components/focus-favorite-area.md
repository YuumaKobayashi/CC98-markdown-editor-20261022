# FocusFavoriteArea class → function 对照

- 原文件/符号：`Components/Focus/FocusFavoriteArea.tsx` / `FocusFavoriteArea`
- 新文件/符号：`src/pages/focus/ui/FocusFavoriteArea.tsx` / `FocusFavoriteArea`
- 原 props/state：无
- 原 lifecycle 与调用顺序：`componentDidMount` 依次移除 Board/User 高亮并添加 Favorite 高亮
- 原 Redux/Router/DOM/fetch/storage 依赖：直接 jQuery DOM class 操作；渲染 legacy `FocusTopicArea`
- 新 hooks 和依赖数组：`useLayoutEffect(..., [])`，内部语句顺序不变
- cleanup 对应关系：原实现无 cleanup，新实现无 cleanup
- 保持不变的行为：固定 id、class 名、执行顺序、`id=-2`、“收藏主题”参数和原组件说明注释
- 发现但未修复的缺陷 ID：`P11-FOCUS-001`
- 人工验收路径与结果：`/focus/favorite`；待人工填写

## 原写法

```tsx
componentDidMount() {
  $("#myFocusBoard").removeClass("focus-title-hover");
  $("#myFocusUser").removeClass("focus-title-hover");
  $("#myFocusFavorite").addClass("focus-title-hover");
}
```

## 新写法

```tsx
React.useLayoutEffect(() => {
  $("#myFocusBoard").removeClass("focus-title-hover");
  $("#myFocusUser").removeClass("focus-title-hover");
  $("#myFocusFavorite").addClass("focus-title-hover");
}, []);
```

## 审核结论

待人工填写。
