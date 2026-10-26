# P15 函数组件 C 范围

> 当前状态：剩余 live 非年度回顾主链迁移已完成机械验证，停在编辑器、签到、旧 `/index` 与 UBB MessageBar 人工验收门禁；旧 `/list` Board 由用户免除人工验收并暂留至 P21，Topic 两组已通过人工验收，近期动态/收藏/历史与当前公开 `/board` 两组人工验收仍开放。P15 尚未完成、不暂存、不提交、不 push、不自动进入下一组。

## 唯一大事

将仍依赖 Redux、Router 或复杂 lifecycle 的 React class 按风险分组迁为函数组件，并随批次归入 `app/pages/features/entities/shared` owner。当前批次只迁移仍有真实路由或运行时 JSX 调用的 9 个 class 结构；年度回顾、`ErrorBoundary` 和零调用 P21 候选不进入本批。

## 已完成的无 Redux 简单组件组

- 迁移 11 个在用文件中的 13 个无 Redux、无 local state class；
- 按 entity 展示、共享/app 展示、无状态页面组合分三个内部批次；
- 保留旧路径 facade，并把已迁移模块与少量直接 owner 调用方切到窄入口；
- `DocumentTitle` 使用 `useEffect`；修复 `MessagePerson` 修改 props 和用户生日格式异常时的空匹配崩溃；
- 建立逐组件对照、class 清单、文件映射、静态证据和人工清单。

## 已完成的无 Redux 轻状态与导航组件组

- 迁移根 Pager 的两个 class、用户中心 Pager、三个主题列表项、Topic breadcrumb、AwardInfo 和 FocusUserArea，共 9 个 class；
- 通用 Pager 只使用一个 `useState`，不增加同步 props 的 effect；
- 将匿名链接、无标签显示、breadcrumb 和 Focus 页签改成声明式派生；
- 保留旧路径 facade，并将实际调用方切到 shared/entity/page 窄入口；
- 修复用户中心 Pager 的重复空 key，移除目标组件内的 render 调试日志；
- 建立逐组件对照、行为变化记录、AST 证据和人工清单。

## 用户中心 Redux 页面与壳层组允许范围

- 迁移 `UserCenterBeforeConnect`、`UserCenterExact`、`Following`、`Fans`、`Boards`，共 5 个 class；
- 使用 `useAppSelector`、`useAppDispatch`、`useParams` 和 `useEffect`，移除目标组件的 `connect`、`withRouter` 和 class route props；
- 对关注/粉丝页复用既有 `parseUserCenterPage`，并分离页签、路由取数和视口副作用；
- 保留 legacy `Navigation`、`MyFollowingsUser`、`MyFavoritesBoard` 等未迁移子组件；
- 旧路径保持 default facade，Router lazy import 与直接 owner 调用方改用新 page 窄入口；
- 建立逐组件对照、class 清单、文件映射、静态证据与人工清单。

## 用户中心 Redux 页面与壳层组禁止范围

- 不迁移用户中心侧边 `Navigation`、`MyFollowingsUser`、`MyFavoritesBoard`、头像、收藏 mutation、公共用户详情壳、`ErrorControl` 或本轮外 class；
- 不改动 thunk、API、Redux 结构、全局 `userInfo.isLoading` 共享事实源或请求取消策略；
- 不迁移 `FocusBoardArea`/`FocusTopicArea` 的请求、缓存、滚动监听、版面点击与双击逻辑；
- 不删除全局 `legacy-route-props`、`RouteComponent` 或 `navigation-prompt`；
- 不改变公开 URL、API、Redux state、样式、主题、依赖或冻结 UBB/editor；
- 不使用 `isFirstCommit`、previous-props 模拟器、无依据的 `useLayoutEffect`、`React.FC` 或组件级箭头函数；
- 不修改 `.vscode/`，除用户授权的阶段性检查点提交外不额外提交，不 push，不自动进入下一组。

## 用户中心 Redux 页面与壳层组完成条件

1. 本轮 5 个目标 class 均由具名函数承接，旧文件只保留兼容导出；
2. 新 owner 通过 typed hooks 消费既有 Redux，不含 `connect`、Store 直接读取或 legacy Router props；
3. 每个内部批次两套 TypeScript、diff 与静态审计通过，整组正式构建通过；
4. AST class 总数从 127 降到 122；排除 `ErrorBoundary` 后仍有 121 个 P15 目标；
5. 代码与文档分别形成可审阅的本地检查点并停止；真实页面/API 验收继续作为独立门禁。

## 当前用户中心交互叶子组

- 迁移侧栏 `Navigation`、关注版面 `MyFavoritesBoard`、关注/粉丝 `MyFollowingsUser`，共 3 个 live class；
- 分别归入 `pages/user-center/layout`、`pages/user-center/custom-boards`、`features/follow`，旧路径保留 default re-export；
- 保留侧栏 DOM、NavLink URL、滚动阈值、500ms 回顶动画，版面卡片 DOM/API/按钮状态，以及用户卡片展示、hover、私信和 Redux action；
- 修复用户取关请求漏写 `await` 的确定缺陷：只在真实请求成功后更新本地与 Redux 状态，失败显示“取关失败”；
- 不迁移头像、近期动态无限滚动、收藏页面、公共用户页或其他请求/Modal/复杂状态组件；
- 不新增依赖，不使用 `connect`、`React.FC`、`isFirstCommit`、previous-props 模拟器或 `useLayoutEffect`；
- 完成条件为 3 个目标 class 消失、AST 总数从 122 降至 119、两套类型检查和正式构建通过，并保留未暂存 diff 停在人工验收。

## 当前热门主题同构页面组

- 迁移周热门、月热门、历史热门三个页面及各自 breadcrumb，共 6 个 live class；
- 共享 `HotTopicPage`、`HotTopicBreadcrumb`，并保留 weekly、monthly、history 三个独立 lazy 入口；
- 使用依赖热门类型的 `useEffect` 取数，cleanup 忽略组件卸载后的旧结果；首次加载继续显示空白列表；
- 保留热门 API、页面标题、breadcrumb、DOM/CSS、主题字段和三个公开 URL；补充稳定 topic key；
- 随机推荐、近期动态无限滚动、Message 缓存页和其他复杂生命周期不在本组；
- 完成条件为 6 个目标 class 消失、AST 总数从 119 降至 113、两套类型检查和正式构建通过，代码与文档分别形成本地检查点；人工验收继续作为独立门禁。

## 当前首页、搜索与站务组件组

- 以 `82bf9fda` 为基线，迁移首页 5 个、搜索 4 个、站务 2 个 live React class；
- 首页归入 `pages/home`，搜索保持 topic/board 两个独立 page 入口，站务编辑器归入既有 `pages/site-manage` owner；
- 搜索改为路由与显式请求状态驱动，首页和公告的 mount 请求使用 effect cleanup，广告轮播 timer 正确清理；
- 保留公开 URL、API、缓存、DOM/CSS、旧导出和冻结 UBB；不新增 Redux、依赖或 Router bridge；
- 零调用 `RecommendedBoardComponent` 继续作为 P21 删除候选，不为凑足 12 个迁移；
- 完成条件为 11 个目标 class 消失、AST 总数从 113 降至 102、两套类型检查和正式构建通过；人工验收继续独立开放。

## 当前消息与私信组件组

- 以 `e2ec8348` 为基线，迁移消息 layout、三类通知页、私信联系人页和会话窗口，共 6 个 live class；
- layout 和三类通知页归入 `pages/message` 独立窄入口，联系人页与窗口共同归入 `pages/message/private-messages`；
- 用 pathname/Redux 派生页签和未读数，用路由页码 effect 表达通知取数，用 React state/事件承接联系人、会话、编辑与上传；
- 仅会话 prepend 后的滚动锚点恢复使用一次有依据的 `useLayoutEffect`，其余副作用使用普通 effect；
- 保留消息 API、Redux、缓存键、公开 URL、DOM/CSS、实体展示、上传和旧导出，不修改冻结 UBB；
- 完成条件为 6 个目标 class 消失、AST 总数从 102 降至 96、两套类型检查和正式构建通过；人工验收继续独立开放。

## 当前 Header、登录、通知与错误控制组

- 以 `986ce9e5` 为基线，迁移 `Header`、`DropDownConnect`、`SearchBeforeConnent`、`LogOnExact`、`NotificationController`、`ErrorControl`；
- Header 与搜索归入 `app/layouts/header`，登录归入 `pages/auth/login`，通知控制器归入 `features/message/realtime-notifications`，错误重置归入 `app/providers`；
- Header 的 storage/document 监听改为具名 effect handler 并 cleanup；顶部搜索改为受控状态和 Router hooks，不再用 jQuery 修正 DOM；
- 登录保留原 token、用户刷新、主题和整页返回合同，并为缺失、损坏或跨域返回地址回退 `/`；
- `NotificationController` 只迁移源码，AppShell 继续不挂载，因此不得建立 SignalR 连接或请求浏览器通知权限；
- `ErrorBoundary` 继续作为唯一允许保留的 React class，零调用 `ErrorEmitter` 留作 P21 删除候选；
- 完成条件为 6 个目标 class 消失、AST 总数从 96 降至 90、两套类型检查和正式构建通过；人工验收继续独立开放。

## 当前公共用户详情页迁移组

- 以 `69a67b04` 为基线，迁移 `UserBeforeConnent`、`UserExact`、`UserNavigationBeforeConnect`、`ExactAvatar`、`Profile`、`Activities` 六个 live class；
- 页面 layout、overview、导航、资料与近期主题归入 `pages/user-profile`，共享头像徽章归入 `entities/user/profile-avatar`；
- Router 使用 layout/overview 窄入口；旧六个文件只保留兼容 re-export，用户管理子页继续保持 legacy；
- 新增 `USER_LOOKUP_STARTED`，在 `method/id` 改变时恢复用户存在状态；overview 只接受 `name` 或正整数 `id`，并继续将 name URL replace 为 id URL；
- 头像配置、关注状态与近期主题均以当前用户为组件身份；请求序号阻止快速切换时的旧结果覆盖；
- 近期主题保持 `size=11`、每批展示 10 条及 1500px 阈值，并在最终批次解除监听；
- 不修改 Redux 数据结构、关注 API、用户管理子页、冻结 UBB/editor、样式或依赖；
- 完成条件为 6 个目标 class 消失、AST 总数从 90 降至 84、两套类型检查和正式构建通过；真实 API、登录态、滚动与 UBB 验收继续独立开放。

## 当前版面列表与展示叶子迁移组

- 以 `4d40a407` 为基线，迁移版面列表 3 个、版面页展示叶子 4 个、新帖/随机精选 breadcrumb 2 个 live React class；
- 版面列表归入 `pages/board-list` 并由 Router 使用独立 page 窄入口；版面展示叶子归入既有 `pages/board`；两个 breadcrumb 归入 `entities/topic`；
- 保留 `/Board/all`、版面顺序、展开状态、主管/子版面链接、图片回退、标签、Pager、发帖权限、广告、操作记录和两个 topic 页面文案；
- 操作记录 IP hover 改用本地 state，移除该叶子的 jQuery；标签按钮补稳定 key，导航锚点不存在时安全忽略；
- 旧文件继续兼容原 named export；Board 主页面、复杂列表/管理、topic 列表、Redux、Router bridge 与 Modal 不在本组迁移；
- 完成条件为 9 个目标 class 消失、AST 总数从 84 降至 75、两套类型检查和正式构建通过；真实 API、登录态、图片、分页和 hover 验收继续独立开放。

## 当前公共用户管理子页迁移组

- 以 `f74d2733` 为基线，迁移用户管理页、删除近期内容、处罚操作和近期发言四个 live React class；
- 四个组件共同归入 `pages/user-profile/manage`，Router 的 manage 子路由改用 page 窄入口，旧文件仅保留 default re-export；
- 管理页直接以 `method/id` 路由为数据真相，支持 name 路由规范化为 id 路由，并用请求序号阻止快速切换时旧用户覆盖；
- 保留原管理 API、token、操作文案、校验范围、帖子字段、版面名补全、分页和公开 URL；
- 修复直达管理页可能沿用 Redux 中旧访问用户、name 路由无法取数及帖子 key 冲突；既有处罚解除校验和总页数显示合同继续保留；
- 完成条件为 4 个目标 class 消失、AST 总数从 75 降至 71、两套类型检查和正式构建通过；真实管理员登录态、权限和 API 验收继续独立开放。

## 当前 Focus 页面剩余壳层迁移组

- 以 `a2ea94c8` 为基线，迁移 `FocusBoardArea`、`FocusTopicArea` 两个 live React class；
- 两个组件共同归入既有 `pages/focus`，Router 的 index 与 `board/*` 子路由改用 page 窄入口，旧文件只保留兼容 re-export；
- 保留关注版面、关注用户、收藏主题 API，`focusBoardList`、`currentFocusBoard`、`focusBoard_:id` sessionStorage 键，每批 20 条、最多 200 条、重复主题截断和 500ms 回顶合同；
- 版面单击、双击和选中 class 改由 React 事件与 state 表达；滚动、触摸和 wheel 监听集中到普通 effect 并配对 cleanup；
- 修复切换版面反复注册监听器以及旧请求晚到覆盖当前主题流；不修改 Redux、服务接口、公开 URL、DOM/CSS 或文案；
- `CardTopicSingle`、音视频播放器、随机推荐和版面卡片属于 `/newtopics` 卡片视图，不在本组范围；
- 完成条件为 2 个目标 class 消失、AST 总数从 71 降至 69、两套类型检查和正式构建通过；真实登录态、关注 API、缓存、触底加载和浏览器验收继续独立开放。
- 2026-07-24 人工验收通过，代码检查点为 `53e67ef8`。

## 当前主题发现页与卡片视图迁移组

- 以 `4e34e83a` 为基线，迁移 `AllNewTopic`、`AllRecommendedTopic`、`CardTopicSingle`、`VideoPlayer`、`AudioPlayer`、`CardBoard`、`CardRecommendTopic` 七个 live React class；
- `/newtopics/*`、`/recommendedtopics/*` 分别归入 `pages/new-topics`、`pages/recommended-topics`，主题卡片与播放器归入 `entities/topic`，Router 改用新窄入口；
- 保留三种新帖视图、Redux 隐私开关、用户偏好 API、所有 sessionStorage 键、20/500 条新帖合同、10 条随机主题合同、重复主题截断、500ms 回顶、版面 sticky 和播放器 DOM/CSS；
- 图片展开和页面显隐改由 React state 表达；新帖 document listener 继续配对 cleanup；只有第三方播放器初始化及显示前 DOM 修正使用 `useLayoutEffect`；
- 按用户决定，本组不修复既有版面 scroll listener 泄漏、播放器失败后空实例访问、可疑 OR 空值判断、索引/缺失 key、`debugger` 与调试日志，全部登记后续处理；
- 迁移后零引用的 `NewTopicAreaState`、`RecommendedTopicAreaState`、`RandomTopicAreaState` 不删除，列入 P21 清理候选；
- 完成条件为七个目标 class 消失、AST 总数从 69 降至 62、两套类型检查和正式构建通过；排除 `ErrorBoundary` 后仍有 61 个 P15 目标，真实登录态/API/播放器/滚动验收继续独立开放。
- 2026-07-26 人工验收通过，代码检查点为 `37727da2`，文档检查点为 `4c3ad089`。

## 当前用户中心资料、主题与转账设置迁移组

- 以 `4c3ad089` 为基线，迁移 `Config`、`UserCenterConfigAvatar`、`ConfigOthers` 匿名组件、`Theme`、`ThemeSettingComponent`、`Wealth` 六个 live React class；
- 个人资料、头像与其他设置归入 `pages/user-center/settings`，主题页与表单归入 `pages/user-center/theme`，财富转账归入 `pages/user-center/transfer-wealth`；Router 三条子路由改用对应窄入口；
- 保留 `/me`、头像上传/设置、主题、主题设置、财富转账 API，Redux state/action/thunk、公开 URL、DOM/CSS、校验、提示文案、默认头像与主题注册表合同；
- 头像原生 mouse listener 继续在普通 effect 中集中注册并完整 cleanup；转账完成提示改由本次提交的显式 pending 状态驱动，不使用 previous-props 模拟 lifecycle；
- 按用户决定，本组只迁移组件，不修复已识别的日期校验、异步回调、主题静默失败、转账输入/共享状态/Redux 原地修改等既有缺陷，全部登记后续处理；
- 不迁移登录、收藏/历史、Board 主页面、编辑/主题管理和零调用候选，不新增依赖，不启动持续 Node server；
- 完成条件为六个目标 class 消失、AST 总数从 62 降至 56、两套类型检查和正式构建通过；排除 `ErrorBoundary` 后仍有 55 个 P15 目标，真实登录态/API/Canvas/上传/主题/转账验收继续独立开放。
- 2026-07-27 人工验收通过，代码检查点为 `37549b04`。

## 当前用户中心近期动态、收藏与浏览历史迁移组

- 以 `9939e63a` 为基线，迁移近期主题动态、收藏列表、收藏项、分组选择、分组管理和浏览历史六个 live React class；
- 收藏列表与管理归入 `pages/user-center/favorites`，浏览历史归入 `pages/user-center/history`，近期主题动态归入既有 overview，跨 Topic/用户中心复用的分组选择器归入 `features/favorites`；
- Router 的 `myfavorites/*`、`myhistory/*` 改用 page 窄入口，overview 不再反向导入 legacy class；六个旧文件仅保留兼容 re-export；
- 保留 `/me/recent-topic`、收藏查询/搜索/分组/mutation、浏览记录与开关 API，Redux state/action/thunk、公开 URL、DOM/CSS、文案、分页和 11 条探测合同；
- 近期动态的 scroll listener 在普通 effect 中注册并 cleanup；收藏的 keyword ref、请求后导航和既有重复请求语义保留；历史页不使用 previous-props 模拟器；
- 已识别的 hasTotal 键错位、query 同步、请求竞争、HTTP 状态忽略、Redux 原地修改和历史开关反馈缺陷仅登记，不在本批修复；
- `ExactActivitiesPosts` 继续作为 P21 零调用删除候选；Board、Topic 主链、Edit、登录、样式和依赖不在本组范围；
- class declaration 口径从 56 降至 50；补充 class expression 后完整结构从 57 降至 51。排除 `ErrorBoundary` 后仍有 50 个实际 P15 目标，P15 尚未完成。

## 当前公开 Board 页面迁移组

- 以 `22a6daae` 为基线，迁移 `Pages/Board` 中承接 `/board/:id/:page?/*` 的七个 class declaration 与一个匿名 class expression；
- 页面、头部、主题列表、筛选、主题项、速览、底部操作、批量管理和事件记录共同归入既有 `pages/board`；原有函数组件也一并归位，避免新 owner 反向组合 legacy 页面；
- Router 的公开 Board 路由改用 `pages/board/BoardPage` 窄入口，`Pages/Board/*` 与 `Pages/Board/action.ts` 只保留兼容 re-export；
- 普通 effect 承接页面首次取数、列表首次并发取数、主题速览和事件记录；不使用 `useLayoutEffect`、previous-props、mounted 或 isFirstCommit；
- 保留 Board/topic/tag/速览/大字报/小黑屋/事件/批量管理 API、公开 URL、DOM/CSS、AntD、UBB adapter、分页、权限与文案；
- `/list/:boardId/...` 仍由 `Components/Board/Board.tsx` 的 12 个 class 承接，不进入本组；AnnualReview、Index、Topic、Edit 与 P21 候选也不迁移；
- 完整 AST 口径从 75 declaration 加 2 expression 降至 68 declaration 加 1 expression；排除 `ErrorBoundary` 后仍有 68 个 P15 目标，P15 尚未完成；
- 真实登录态、Board/topic/tag/管理 API、权限、分页、hover UBB、back/forward 与浏览器验收继续独立开放。

## 当前 Topic 评分与管理弹窗迁移组

- 以 `673995ca` 为基线，迁移 `TopicPostManagementV2`、`TopicJudgeV3`、`TopicTopicManagementV2` 与 `Topic-ManageHistory` 匿名 class 四个 live React class；
- 发言管理、评分、主题管理与管理记录共同归入既有 `features/moderation`，并由 public barrel 提供四个窄入口；`Topic-Reply.tsx` 与 `Topic-SendTopic.tsx` 不再反向导入 legacy 实现；
- 保留财富/威望奖惩、删除、TP/解除 TP、正负评分、锁定/热门/删除/移动/提升/两级固顶/精华/高亮、管理记录分页及其 API 参数和提示合同；
- 主题管理版面加载与管理记录首次请求使用普通 `useEffect`；其余交互由局部 state/ref 与事件表达，不使用 `useLayoutEffect`、mounted、isFirstCommit 或 previous-props 模拟器；
- 四个旧文件只保留兼容 re-export；Router、Redux、公开 URL、DOM/CSS、AntD 文案、父组件显隐、UBB/editor 与依赖均不改；
- `Judge`、`TopicJudgeV2`、`PostManagement` v1、`TopicManagement` v1 无 JSX 调用，登记为 P21 删除候选；`Award`、`ReplierSignature`、`Reply`、`SendTopic`、Topic 页面壳与旧 `/list` Board 不进入本组；
- 完整 AST 从 68 declaration 加 1 expression 降至 64 declaration 加 1 expression；排除允许保留的 `ErrorBoundary` 后仍有 64 个目标。历史窄口径为 46 declaration 加 1 expression，排除后仍有 46 个目标；
- 已识别的 pending、解析、请求竞态、权限过滤、移动默认值、高亮结果和管理记录错误处理缺陷只登记不修复；真实登录态、管理权限、Topic API、Modal、快速操作及浏览器验收继续独立开放。
- 2026-07-28 人工验收通过，代码检查点为 `57029e44`，文档检查点为 `908a3c7c`。

## 当前完整 Topic 主链迁移组

- 以 `908a3c7c` 为基线，迁移普通 Topic、追踪 Topic、回复列表、回复编辑器、奖励、关注用户、签名操作、回复内容、主题头部和投票十个 React class 结构；
- 十个 owner 共同归入 `pages/topic`，新增 public barrel；Router 直接加载 `TopicPage`、`TrackedTopicPage`，不再使用 `RouteComponent`、`withRouter` 或 legacy route props；
- 回复编辑器通过 `forwardRef(function ...)`、`useImperativeHandle` 保留 `isContentEmpty()`；Quote context、递归热评、键盘翻页、草稿、hash 居中滚动与父子回调合同保持；
- 直接复用 board、topic、user、favorites、reactions、account、auth、posting、moderation 和 shared owner service；页面专用回复、投票、关注请求归入 `pages/topic/api/service.ts`；
- 保留公开 URL、宽松 `parseInt`、Redux、Local Storage 键、API 顺序、UBB/Markdown、DOM/CSS、AntD 文案和 jQuery 滚动；已知请求竞态、错误吞噬与状态缺陷只登记；
- 十个旧文件只保留原导出形状的兼容 facade；`Judge`、`TopicJudgeV2`、`PostManagement` v1、`TopicManagement` v1、`TopicReplyUserBar` 留待 P21；
- AnnualReview、旧 `/list` Board、Edit、Index、登录和冻结 UBB/editor 不在本组，不新增依赖、不启动持续 Node server；
- 完整 AST 从 64 declaration 加 1 expression 降至 55 declaration 加 0 expression；排除 `ErrorBoundary` 后仍有 54 个 P15 目标，P15 尚未完成。
- 2026-07-28 人工验收通过，代码检查点为 `2f9669c1`，文档检查点为 `bf9eabaf`。

## 当前旧 `/list` Board 主链迁移组

- 以 `bf9eabaf` 为基线，迁移 `Components/Board/Board.tsx` 内本地 `RouteComponent` 与 `BList`、`ListHead`、置顶/精华/保存/标签/普通列表、事件记录和主题项共 12 个 React class 结构；
- 11 个业务 owner 归入 `src/pages/board/legacy-list/`；本地 route bridge 删除，legacy facade 的 `RouteComponent` 改为转导根 `Components/RouteComponent`；
- 新增 `LegacyBoardPage`，Router 的 `list/:boardId/:type?/:page?/*` 直接从 `@pages/board` 加载，不再向本主链注入 `withRouter` 或 legacy route props；
- 具名函数使用 `useState`、普通 `useEffect`、Router hooks 与必要 ref；直接调用 board、topic、follow、moderation、user、shared owner service，并复用既有 Board breadcrumb、操作/广告、标签分页和事件记录项；
- 保留 `/list` 外壳与内部 `/board/...` 路由/链接混用、宽松 `parseInt`、每页 20 条、首页置顶、标签层级、匿名/高亮/页码/最后回复、小黑屋、批量管理、大字报、冻结 UBB、DOM/CSS、AntD 文案及必要 jQuery；
- 请求竞态与错误吞噬、`isMaster` 初始化时序、关注状态同步、`BestTopics` 参数顺序、路由参数混用、小黑屋追加分页、批量操作和逐主题标签请求等既有缺陷只登记，不在迁移中修复；
- `Components/Board/Board.tsx` 仅保留原导出形状的兼容 facade；当前公开 `/board/:id/...` owner、后端 API、Redux schema、Local Storage、样式、依赖和冻结目录均不修改；
- `Pages/AnnualReview/**`、`Pages/AnnualReviewV2/**` 明确排除；完成后完整非冻结 AST 为 43 declaration 加 0 expression，排除 `ErrorBoundary` 后仍有 42 个 P15 目标；
- 机械验证已通过；用户明确免除真实 `/list` 路由、登录态、权限、Board/topic/tag/管理 API 与浏览器回归，不把免检记为验收通过；当前实现暂留，P21 重新完成引用、外部入口与构建证明后删除整条旧链。

## 当前剩余 live 非年度回顾主链迁移组

- 以 `78898e75` 为基线，仅迁移编辑器链 `EditForm`、`TagNotice`、编辑器 `Category`、`InputTitle`、`TmpForm`、`Vote`，以及真实路由使用的 `Signin`、`Index` 和冻结 UBB 实际渲染的 `MessageBar`；
- 编辑器归入 `pages/editor`，签到与旧 Index 分别归入 `pages/daily-signin`、`pages/legacy-index`，MessageBar 归入既有 `shared/ui/feedback`；Router 直接加载三个 page owner；
- `EditorPage` 使用 Router hooks、typed dispatch、局部 state/ref 和普通 effect；`mode/id` 变化重新初始化，标签 DOM/class 与 jQuery 选择语义保留，并为 document/element 监听配对 cleanup；
- 直接复用 board、topic、account、auth、posting、user 与 shared owner；原帖加载、发主题、编辑及 @通知的页面专用 wire 操作归入 `pages/editor/api/service.ts`；
- 保留发主题/投票主题/编辑、UBB/Markdown、标签、匿名、通知、财富、类型、8000 字限制、图片、住房模板、投票、@通知、缓存、签到 storage/reload 和公开 URL；
- `Components/Edit.tsx` 继续原样保留零调用 `Tags`、`Options`，其余旧路径保留兼容导出；`RouteComponent`、CountDown、旧 Topic v1/v2、旧 breadcrumb、FindIP、近期回复与年度回顾留待 P21 或后续授权；
- 修正旧清单对 `MessageBar` 的误判：冻结 UBB 的权限标签 handler 存在运行时 JSX 调用，因此本组迁移但不修改任何 `Ubb/**` 文件；
- 请求竞态、无 pending、错误吞噬、发帖状态分支、标签 DOM/日志、住房模板字段判断和签到失败仍 reload 等缺陷只登记；完整 AST 从 43 declaration 加 0 expression 降至 34 declaration 加 0 expression，排除 `ErrorBoundary` 后仍有 33 个目标。
