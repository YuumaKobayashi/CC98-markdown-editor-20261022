# P15 函数组件 C 范围

> 当前状态：以 `82bf9fda` 为基线的首页、搜索与站务组件组已完成代码、文档及机械验证，保留未暂存 diff 等待人工验收；P15 尚未完成

## 唯一大事

将仍依赖 Redux、Router 或复杂 lifecycle 的 React class 按风险分组迁为函数组件，并随批次归入 `app/pages/features/entities/shared` owner。当前批次已迁移首页、搜索与站务领域的 11 个 live class；真实页面/API 验收仍开放，P15 尚未完成。

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
