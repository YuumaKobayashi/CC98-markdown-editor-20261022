# P15 首批前后对照

## 组件与依赖

- 之前：两个 class 由 `connect(mapState, mapDispatch)(withRouter(...))` 包装，页面数据、取数动作和 Router 能力均通过 props 注入。
- 现在：两个 page owner 是具名函数，通过 `useAppSelector`、`useAppDispatch`、`useParams`、`useNavigate` 直接表达依赖；旧文件只 re-export。
- Redux reducer、action、thunk、请求参数、列表切片、Pager 合同、loading/空态和 JSX 文案保持不变。

## 副作用模型

- 之前：首次取数和页签 action 位于 `componentDidMount`，route props 对比与重新取数位于 `componentWillReceiveProps`；首次进入不滚动到顶部。
- 现在：页签归属、route 参数取数和视口滚动分别由三个 `useEffect` 表达。没有 mount 标记、previous-props ref 或 lifecycle 分支。
- 有意变化：首次进入也滚动到顶部；无效/负数页码统一回退到第 1 页；除字符串 `"1"` 外的 `ishot` 统一为 `0`。这些变化由用户授权在目标组件内优化逻辑。
- `useEffect` 在提交与浏览器绘制后运行，不再刻意复刻旧 lifecycle 的调用阶段；当前副作用不需要在绘制前测量或修正 DOM，因此不使用 `useLayoutEffect`。

## 路由与构建

- `/usercenter/mytopics/:page?`、`/usercenter/myposts/ishot/:ishot/:page?` 保持不变；热门切换仍落到第 1 页。
- Router 分别 lazy import 两个 page 子入口，不通过聚合 barrel 合并 route chunk。
- 全局 legacy Router 桥继续服务其他 class，本批只移除两个消费者。

## 无 Redux 简单组件组

- 之前：13 个 class 分散在 legacy `Components/**`，其中两个 `PureComponent`、一个单一 document title lifecycle，其余只是 render wrapper/展示叶子。
- 现在：全部改为具名函数并归入 entity、shared、app、page 或 feature owner；旧路径只保留兼容导出。
- `DocumentTitle` 用依赖 `[title]` 的 `useEffect` 统一 mount/update，children 与标题回退合同不变。
- `MessagePerson` 不再把空 `lastContent` 写回 props 对象，而使用局部派生值；合法输入输出不变。
- `UserProfile` 在生日字符串无法匹配 `YYYY-MM-DD` 时不再访问空匹配结果；正常生日、生日图标、UBB options 和资料展示不变。
- Focus 与 SiteManage 的 Router URL、Outlet/子组件结构不变；Footer 链接、Notice DOM id/CSS class、签名字段名和回调顺序不变。
