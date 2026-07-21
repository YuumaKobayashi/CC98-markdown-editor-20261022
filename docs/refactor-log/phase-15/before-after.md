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

## 无 Redux 轻状态与导航组件组

- 之前：通用 Pager 由 `PageModel`/`Pager` 两个 class 组成，用户中心 Pager 是匿名 class；现在：分别由 `shared/ui/pagination` 和 `pages/user-center/pagination` 的具名函数承接。通用 Pager 的 `nextPage` 仍只在实例首次创建时取 `page`，没有新增 props 同步 effect。
- 之前：用户中心总页数不超过 7 时每个 `<li>` 都使用空 key，并在 render 中输出 props；现在：使用稳定的 `href + page` key，并移除调试日志。页码窗口、disabled、首尾省略号、`hasTotal`、keyword 与 URL 保持不变。
- 之前：匿名主题与无标签搜索结果先按可点击/可见 DOM 渲染，再由 `componentDidMount` + jQuery 删除属性或增加 `displaynone`；现在：首次 render 直接根据数据输出相同的最终属性和 class，不使用 effect。
- 之前：Topic breadcrumb 在 mount/update 把四个 props 字段复制到 state，首个 commit 使用空 state；现在：直接从当前 props 派生 URL 和文案，不产生额外 render 或陈旧副本。
- 之前：AwardInfo 由 `withRouter` 注入 history，并在 render 输出 props；现在：使用 `useNavigate` 的具名 handler，DOM、目标 URL 与两处点击行为不变。
- 之前：Focus board/user/favorite 子页面各自在挂载后修改父级页签 class，其中收藏页使用 `useLayoutEffect`；现在：`FocusLayout` 根据 pathname 同步计算唯一 active 页签，`/focus` 默认 board，deep link 和 back/forward 不依赖子组件副作用。

## 用户中心 Redux 页面与壳层组

- 之前：用户中心认证壳与个人主页由 `connect` class 承接；现在：两个 page owner 用 typed selector/dispatch 表达登录态、用户资料与 action 依赖。`LogOut`、标题、Navigation、Outlet、资料、头像和近期动态的 JSX 结构不变。
- 之前：个人主页 `componentDidMount` 先切到 `profile`，再刷新当前用户信息；现在：两个按声明顺序运行的 `useEffect` 保持相同 dispatch 顺序。
- 之前：我的关注/粉丝由 `componentWillMount` 取数、`componentWillReceiveProps` 比对 Router props 后滚动和重取；现在：页签、当前页取数和视口各自由真实依赖 effect 表达，使用既有正整数页码解析。
- 有意变化：关注与粉丝页首次进入也滚动到顶部；无效或非正页码回退第 1 页，和已迁移的主题/回复页保持一致。
- 之前：关注版面在 constructor 中先请求再切换页签；现在：两个 effect 按相同顺序 dispatch。列表切片、分隔线、loading、空态和原卡片组件不变。

## 用户中心交互叶子组

- 之前：侧栏 class 在 mount/unmount 手工绑定滚动监听；现在：`useEffect` 负责同一监听与清理，阈值、按钮 class、导航 URL 和 jQuery 500ms 回顶行为不变。
- 之前：关注版面卡片 class 用三项 state 驱动关注/取关；现在：函数组件用单一局部状态对象和具名异步 handler 保持请求、状态文案、DOM 与 CSS class 合同。
- 之前：关注/粉丝卡片通过无状态 `connect` 只注入 dispatch，并在相同 id 下用 `componentWillReceiveProps` 复制 props；现在：由 keyed 卡片实例从当前用户数据初始化状态，直接使用 typed dispatch，不重建 props 生命周期模拟器。
- 缺陷修复：旧取关 handler 未 `await Utility.unfollowUser(...)`，Promise 恒为 truthy，网络失败也会立即显示成功并 dispatch；现在等待真实布尔结果，失败时保留关注状态并显示“取关失败”。

## 热门主题同构页面组

- 之前：周/月/历史热门各自复制一个 `componentDidMount` class、一个 breadcrumb class 和整套主题映射；现在：三个具名 page wrapper 通过共享 `HotTopicPage`/`HotTopicBreadcrumb` 提供相同 DOM 与数据字段。
- 之前：mount 后异步结果无视组件是否已经卸载；现在：`useEffect` cleanup 标记旧结果，快速切换路由后不再更新已卸载页面。
- 之前：`data.map(coverFocusPost)` 返回的主题项没有 React key；现在：使用稳定的 `topic.id`，不改变渲染 DOM 或顺序。
- 未使用的 `from: 0` state 被移除；首次请求完成前仍显示空白列表，不新增 loading、空态或重试 UI。
