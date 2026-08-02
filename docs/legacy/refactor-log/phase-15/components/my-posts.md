# MyPosts class → function 对照

- 原文件/符号：`Components/UserCenter/MyPosts.tsx` / `MyPosts`
- 新文件/符号：`src/pages/user-center/my-posts/ui/MyPosts.tsx` / `MyPosts`
- 原 props/state：无 own props/local state；由 `connect` 注入列表、分页、loading 与 dispatch props，由 `withRouter` 注入 `match/history`
- 原 lifecycle 与调用顺序：mount 时按 page/ishot 取数后设置页签；任一参数变化时重新取数后滚动
- 原 Redux/Router/DOM/fetch/storage 依赖：`userInfo` reducer、`getRecentPosts` thunk、UserCenter action、`match.params`、`history.push`、`window.scroll`
- 新 hooks 和依赖数组：typed selectors；页签 effect `[dispatch]`；取数 effect `[currentPage, dispatch, isHot]`；滚动 effect `[currentPage, isHot]`；按钮使用 `useNavigate`
- cleanup 对应关系：原实现无订阅/cleanup，新实现也不虚构 cleanup
- 保持不变的行为：合法 page/ishot 请求、列表切片、Pager URL、热门按钮目标、loading/空态、文案及原注释
- 有意变化：首次进入也滚动；页码限定为正整数；`ishot` 限定为 `0 | 1`
- 发现但未修复的缺陷 ID：共享 loading 与请求竞态见 `known-defects.md`
- 人工验收路径与结果：`/usercenter/myposts/ishot/0`、`/usercenter/myposts/ishot/1` 及分页；待人工填写

## 原写法

```tsx
componentDidMount() {
  this.props.getInfo(curPage, Number(this.props.match.params.ishot));
  this.props.changePage();
}

componentWillReceiveProps(newProps: Props) {
  if (pageChanged || isHotChanged) {
    this.props.getInfo(curPage, Number(newProps.match.params.ishot));
    window.scroll(0, 0);
  }
}
```

## 新写法

```tsx
React.useEffect(() => {
  dispatch(Actions.changeUserCenterPage("myposts"));
}, [dispatch]);

React.useEffect(() => {
  dispatch(getRecentPosts(currentPage, isHot));
}, [currentPage, dispatch, isHot]);

React.useEffect(() => {
  window.scroll(0, 0);
}, [currentPage, isHot]);
```

## 审核结论

待人工填写。
