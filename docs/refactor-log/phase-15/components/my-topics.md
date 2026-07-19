# MyTopics class → function 对照

- 原文件/符号：`Components/UserCenter/MyTopics.tsx` / `MyTopics`
- 新文件/符号：`src/pages/user-center/my-topics/ui/MyTopics.tsx` / `MyTopics`
- 原 props/state：无 own props/local state；由 `connect` 注入列表、分页、loading 与两个 dispatch props，由 `withRouter` 注入 `match`
- 原 lifecycle 与调用顺序：mount 时取数后设置页签；route page 变化时取数后滚动
- 原 Redux/Router/DOM/fetch/storage 依赖：`userInfo` reducer、`getRecentTopics` thunk、UserCenter action、`match.params.page`、`window.scroll`
- 新 hooks 和依赖数组：typed selectors；页签 effect `[dispatch]`；取数 effect `[currentPage, dispatch]`；滚动 effect `[currentPage]`
- cleanup 对应关系：原实现无订阅/cleanup，新实现也不虚构 cleanup
- 保持不变的行为：合法页码请求、列表切片、无总数时的下一页推断、Pager URL、loading/空态、文案及原注释
- 有意变化：首次进入也滚动；无效或非正页码回退到 1
- 发现但未修复的缺陷 ID：共享 loading 与请求竞态见 `known-defects.md`
- 人工验收路径与结果：`/usercenter/mytopics`、`/usercenter/mytopics/2`；待人工填写

## 原写法

```tsx
componentDidMount() {
  const curPage = parseInt(this.props.match.params.page) || 1;
  this.props.getInfo(curPage);
  this.props.changePage();
}

componentWillReceiveProps(newProps: Props) {
  if (this.props.match.params.page !== newProps.match.params.page) {
    this.props.getInfo(parseInt(newProps.match.params.page) || 1);
    window.scroll(0, 0);
  }
}
```

## 新写法

```tsx
React.useEffect(() => {
  dispatch(Actions.changeUserCenterPage("mytopics"));
}, [dispatch]);

React.useEffect(() => {
  dispatch(getRecentTopics(currentPage));
}, [currentPage, dispatch]);

React.useEffect(() => {
  window.scroll(0, 0);
}, [currentPage]);
```

## 审核结论

待人工填写。
