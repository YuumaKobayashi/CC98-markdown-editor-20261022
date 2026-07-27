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

## 首页、搜索与站务组件组

- 之前：首页由五个 live class 分担 mount 请求、props 随机选择和 interval；现在：具名函数按数据加载、数据变化和 timer 三类职责使用独立 effect，并清理旧结果与 interval。
- 之前：广告初始化读取 `mainAds`、请求读取 `mainAds-v2`；现在：统一使用现有登录清理流程认可的 `mainAds-v2`。
- 之前：主题搜索用 `componentWillReceiveProps`、共享 storage、实例布尔值和 jQuery class mutation维护请求；现在：pathname query、显式状态和请求序号共同决定 UI，滚动监听有 cleanup。
- 有意变化：超过五个关键词时使用前五个而非误取第六项之后；非法编码显示空态；主题/版面结果补充稳定 key。
- 之前：站务公告 timer 不清理，栏目编辑器直接修改 state 数组且空列表新增会访问 `data[0]`；现在：timer/异步结果受保护，列表不可变更新，新 ID 为最大值加一。

## 消息与私信组件组

- 之前：消息 layout 直接读取 Store，四个子页通过 jQuery 竞争修改 active class；现在：typed selector 和 pathname 在一次 render 中确定未读数与唯一 active 页签。
- 之前：三类通知 class 在 mount/update 复制取数逻辑，且任意页首次进入都可能误用第一页缓存；现在：共享分页实现只在第 1 页、对应未读数为零时读缓存。
- 之前：联系人页在 render 中修改 DOM class，并通过未读 DOM class 推断是否清缓存；现在：Redux 未读数、联系人 id 和显式加载状态决定缓存及展示。
- 之前：窗口反复原地 reverse 消息数组，每次 update 手工重绑 textarea 事件，发送 timer 不清理；现在：不可变数组、React 事件和 cleanup 管理相同行为。
- 有意变化：无聊天对象发送不再访问空 props；切换联系人会清空旧草稿；消息 prepend 在绘制前恢复锚点；deep link 新联系人的 `lastContent` 保存字符串内容而非整条消息对象。

## Header、登录、通知与错误控制组

- 之前：Header 的 Redux、Router、storage 监听、搜索 DOM 状态和导航混在三个 class 中，匿名 window/document handler 从不移除；现在：具名函数通过 typed hooks 与 Router hooks 直接表达依赖，监听均在 effect cleanup 中移除。
- 之前：顶部搜索类型、hover、展开和输入值由 jQuery/DOM 持有；现在：由 React state 声明式渲染，仍保留主题、全站、版内、用户、版面及双重 URI 编码合同。
- 之前：登录页使用 `connect`、legacy history、jQuery 表单编码和未清理 timer；现在：使用 typed dispatch、受控输入、refs、`URLSearchParams`和 timer cleanup，成功后仍整页返回。
- 之前：缺少返回地址时可能把页面导航到空值；现在：仅接受当前 origin 的有效返回地址，否则回退 `/`。
- 之前：停用通知控制器的 SignalR、storage、focus 和 Notification 副作用集中在 class lifecycle 且监听不清理；现在：按职责拆分 effect 并清理，但组件仍未挂载，运行时继续不连接。
- 停用通知源码中的点击导航改用标准 `notification.onclick`；由于 owner 无运行时消费者，本批不会触发浏览器通知。
- 之前：`ErrorControl` 只在接收到 pathname 变化 props 时清错；现在：依赖当前 pathname 的普通 effect 在首次壳层挂载和后续导航时清错，不使用首次提交标记或 previous-props 模拟器。

## 公共用户详情页迁移组

- 之前：不存在用户把全局存在状态永久置为 false，父壳随后不再挂载取数页；现在：`method/id` 改变会先 dispatch `USER_LOOKUP_STARTED`，可从不存在用户恢复到正常用户。
- 之前：`UserExact` 通过 `connect`、`withRouter` 与 `componentWillReceiveProps`取数；现在：overview 以路由参数 effect 取数，只接受 `name` 或正整数 `id`，并用请求序号忽略旧响应。
- 之前：用户展示子树依赖 props-to-state lifecycle 隐式复用；现在：详情主体以用户 id 建立 React 身份，切换用户会自然重置关注、头像框和近期主题状态。
- 之前：头像徽章只在 mount 加载配置且徽章列表缺 key；现在：普通 effect 随展示头衔重算并忽略旧结果，徽章使用稳定 title id key。
- 之前：非法生日字符串会解引用空正则匹配；现在：只有匹配成功才比较月日，字段仍按原字符串展示。
- 之前：近期主题在最后不足 11 条后仍保留 scroll listener，并可能重复请求末页；现在：`hasMore` 在最终批次变为 false 并解除监听，用户切换立即清空并重新取数。
- 主题与分隔线改用稳定 topic id key；公开 URL、关注文案、资料字段、签名 UBB、每批 10 条及 1500px 阈值保持不变。

## 版面列表与展示叶子迁移组

- 之前：`BoardList` 在 class mount 中请求版面并由两个 class 子组件组合；现在：页面使用 mount `useEffect`，区块用本地展开 state，子版面为无状态函数。
- 之前：版面导航点击直接解引用目标 DOM；现在：目标不存在时安全忽略，正常锚点仍调用 `scrollIntoView`。
- 之前：标签映射返回的外层元素没有 key；现在：使用稳定 tag id key，URL、层级和顺序不变。
- 之前：发帖入口 class 含未调用的 `clickListener`，展示仍另行同步读取登录信息；现在：函数组件一次读取当前用户并直接派生同样的入口或提示，未调用方法删除。
- 之前：操作记录通过 jQuery 按 DOM id 切换 IP class，并在 hover 时打印日志；现在：本地 hover state 声明式派生相同 `displaynone` class，不再查询或修改 DOM。
- 之前：两个 topic breadcrumb 各自是纯 render class；现在：由 entity 具名函数承接，文案、样式和页面列表逻辑不变。

## 公共用户管理子页迁移组

- 之前：管理页优先读取 Redux `currentVisitingUserId`，直达另一个用户的 manage URL 时可能向旧用户发送管理请求；现在：严格从当前 `method/id` 路由解析目标用户。
- 之前：`/user/name/:name/manage` 会对用户名执行 `parseInt` 而无法正确加载；现在：先按用户名取数，再 replace 到规范 `/user/id/:id/manage`。
- 之前：快速切换管理对象时旧请求可覆盖当前页面；现在：请求序号只允许当前路由的结果生效。
- 之前：四个 class 分散保存表单与分页 state；现在：page 负责路由用户，三个具名函数分别负责删除、处罚与近期发言状态。
- 之前：近期发言使用 `topicId` 作为 key，同主题多条发言会冲突；现在：key 同时包含主题、楼层和时间。
- 删除范围、处罚操作、请求方法、提示文案、帖子展示与每页 10 条分页语义保持不变。

## Focus 页面剩余壳层迁移组

- 之前：版面标签在 mount 后由全局 jQuery 批量绑定 click/dblclick 并修改 class，卸载时不解绑；现在：每个标签使用 React handler，选中 class 由当前版面 state 派生。
- 之前：每次 `FocusTopicArea` props 变化都会在 `getData` 末尾再次注册 wheel、touchmove 和两个 scroll listener；现在：普通 effect 为当前 handler 注册一次并在依赖变化或卸载时完整 cleanup。
- 之前：快速切换版面时较早请求可晚到并覆盖新选择；现在：请求序号只允许当前 `id/name` 的首批和增量结果生效。
- 之前：是否可加载由 class 字段控制，loading/done 和回顶按钮由 jQuery 修改 DOM class；现在：加载锁使用 ref，停止与按钮状态声明式派生相同 class。
- 首次请求继续使用 offset 0；增量继续每批 20 条、最多 200 条，并按首条重复 id 截断旧尾部后拼接；三个 sessionStorage 键和失败后的可重试语义不变。
- 回到顶部继续使用既有 jQuery 500ms 动画；公开 URL、DOM id/class、提示文案、版面双击整页跳转和 `FocusTopicItem` 字段映射保持不变。

## 主题发现页与卡片视图迁移组

- 之前：`AllNewTopic` 通过 `connect`、class 字段和 jQuery 共同维护模式、加载锁、按钮 class 与区域显隐；现在：具名 page 使用 typed Redux hooks、state 和 ref 表达相同状态，document listener 仍在 mount effect 中注册并配对 cleanup。
- 之前：`AllRecommendedTopic` 和右侧随机近期主题在 lifecycle 中读写当前/上一批缓存并直接修改按钮 DOM；现在：具名函数使用 state 派生相同 hidden/visibility，缓存键、10 条请求和单级返回合同不变。
- 之前：主题卡片 mount 后用 jQuery删除匿名链接并切换图片 DOM；现在：匿名属性、原图、缩略图与选中 class 由 props/state 声明式派生，原图 URL 转换和最多六图布局不变。
- 之前：DPlayer/APlayer 在 `componentDidMount` 创建并修改插件 DOM，在卸载时销毁；现在：只在 `useLayoutEffect` 中执行同样的显示前初始化、DOM 修正和销毁。
- 之前：版面侧栏 mount 后取版面并注册 sticky scroll handler；现在：普通 mount effect 执行相同流程和位移算法。
- 本组严格保真，不修复已识别的监听泄漏、播放器失败路径、OR 空值判断、列表 key 与调试语句；这些差异候选只登记、不改变。

## 用户中心资料、主题与转账设置迁移组

- 之前：`Config` constructor 复制 Redux 用户资料并在 class 方法中校验、提交和重置；现在：page 以 typed Redux hooks 初始化同一编辑模型，普通 mount effect 设置用户中心页签，提交/reset 合同不变。
- 之前：其他设置匿名 class 在 mount 拉取头衔并在 render 中构造年月日选项；现在：具名函数使用普通 effect 和受控字段，继续静默处理头衔请求失败并保留年份、保密值和可选头衔过滤。
- 之前：头像 class 用实例字段保存 canvas、拖拽元素和偏移，并在 lifecycle 中绑定九个原生 mouse listener；现在：refs 保存同一可变交互数据，单个普通 effect 注册并配对移除所有 listener。
- 之前：主题页和设置表单通过 `connect`、内部 state 与 ref 直接修改结果 span；现在：page 使用 typed hooks，表单用 state 派生相同结果文本和三秒显隐，主题 API、注册表、日夜推断和实际换肤调用不变。
- 之前：财富转账通过 `componentWillReceiveProps` 比较共享 Redux loading/error 前后值；现在：提交时建立显式 pending workflow，只有本次操作观察到 loading 后才消费既有 success/error state，不引入 previous-props 模拟。
- 本组按要求保留日期、文件异步、主题失败与转账输入/共享状态等已识别缺陷；公开 URL、DOM/CSS、文案、Redux 数据结构与 service API 不变。

## 用户中心近期动态、收藏与浏览历史迁移组

- 之前：用户中心 overview 反向导入 connected class，class 在 `componentWillMount` 检查缓存并手工注册 scroll listener；现在：overview 直接组合具名函数，初始缓存检查与 listener/cleanup 分成普通 effect，页码仍使用局部递增计数。
- 之前：收藏页通过 `connect`、`withRouter`、实例 keyword 字段和 `componentWillReceiveProps` 协调筛选、搜索、分页与请求；现在：typed Redux hooks、Router hooks 和 keyword ref 承接同一数据流。
- 保真：筛选/搜索事件仍先请求再导航，路由参数变化仍再次请求；分组刷新仍导航到不带 query 的当前路径，仅 query 变化仍不会同步 keyword。
- 之前：收藏项和 Topic 详情分别通过 legacy 分组选择 class 打开 Modal；现在：`features/favorites/FavoriteTopicGroupSelect` 由两处通过兼容入口共享，默认分组、失败回退和回调合同不变。
- 之前：分组管理 class 用 form ref、三个局部状态和 Notice DOM id 管理创建/重命名/删除；现在：函数组件使用相同 ref/state、表单校验、上限判断、API 顺序与提示 id。
- 之前：历史页在 mount 刷新 `/me`、取当前页并标记页签，props 页码变化时取数和滚顶；现在：mount effect 处理用户刷新/页签，page effect 处理取数和滚顶。首次挂载也会在 effect 后滚顶，是本批记录的生命周期时序差异。
- 收藏、历史与近期主题 thunk 的原地 Redux 修改、共享 loading/error、请求竞争和异常反馈均保持现状，只登记后续处理。
