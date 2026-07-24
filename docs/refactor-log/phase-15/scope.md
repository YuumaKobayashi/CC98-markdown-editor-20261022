# P15 函数组件 C 范围

> 当前状态：公共用户管理子页迁移组已完成实现与机械验证，停在真实管理员登录态/API 人工验收；P15 尚未完成、不提交、不 push、不自动进入下一组

## 唯一大事

将仍依赖 Redux、Router 或复杂 lifecycle 的 React class 按风险分组迁为函数组件，并随批次归入 `app/pages/features/entities/shared` owner。当前批次迁移公共用户管理页及三个管理操作面板的 4 个 class；真实管理员登录态、权限与 API 验收仍开放，P15 尚未完成。

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
