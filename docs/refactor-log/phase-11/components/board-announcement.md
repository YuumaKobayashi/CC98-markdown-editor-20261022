# BoardAnnouncement class → function 对照

- 原文件/符号：`Pages/Board/Announcement.tsx` 默认 class
- 新文件/符号：`src/pages/board/ui/BoardAnnouncement.tsx` / `BoardAnnouncement`
- 原 props/state：`data`、`isFirstPage`；`isFollow`、`loading`、`editVisible`、`content`
- 原 lifecycle 与调用顺序：无 lifecycle；state 在实例创建时从当前用户和首次 props 初始化
- 原 Redux/Router/DOM/fetch/storage 依赖：无 Redux/Router；关注、取关、编辑请求；图片 error DOM 写入；UBB renderer
- 新 hooks 和依赖数组：4 个 `useState`；首次派生值使用惰性 initializer；无 effect；5 个内部 helper/handler/async action 使用 `const + 箭头函数`
- cleanup 对应关系：原实现无 cleanup，新实现无 cleanup
- 保持不变的行为：请求及 loading 顺序、关注文字、编辑弹窗、默认展开页、图片 fallback、UBB options
- 发现但未修复的缺陷 ID：`P11-BOARD-001`
- 人工验收路径与结果：Board 第 1/后续页、关注/取关、版主编辑；待人工填写

## 原写法

```tsx
state = {
  isFollow: Utility.isFollowThisBoard(this.props.data.id),
  loading: false,
  editVisible: false,
  content: this.props.data.bigPaper
};
```

## 新写法

```tsx
const [isFollow, setIsFollow] = React.useState(() => isFollowThisBoard(data.id));
const [loading, setLoading] = React.useState(false);
const [editVisible, setEditVisible] = React.useState(false);
const [content, setContent] = React.useState(() => data.bigPaper);
const follow = async () => {
  // 保持原请求和 state 提交顺序
};
```

## 审核结论

待人工填写。
