# P15 首批文件映射

| P15 前 | P15 首批位置 | 兼容方式 |
|---|---|---|
| `Components/UserCenter/MyTopics.tsx` | `src/pages/user-center/my-topics/ui/MyTopics.tsx` | 旧文件 re-export 默认与具名符号 |
| `Components/UserCenter/MyPosts.tsx` | `src/pages/user-center/my-posts/ui/MyPosts.tsx` | 旧文件 re-export 默认与具名符号 |
| 两处重复页码解析 | `src/pages/user-center/model/route-params.ts` | 两个 route owner 共用正整数页码合同 |
| Router 对 legacy 文件的 lazy import | `@pages/user-center/my-topics`、`@pages/user-center/my-posts` | 保持两个独立动态入口 |

旧 facade 计划在 P21 依据引用证据删除。P14 的全局 route props 桥仍有其他消费者，本批不删除或扩张。

## 无 Redux 简单组件组

| 旧位置 | 新 owner | 兼容方式 |
|---|---|---|
| `UserCenter/ExactActivitiesPost`、`ExactActivitiesTopic` | `entities/post`、`entities/topic` | 默认/具名 re-export |
| `Message/MessagePerson` | `entities/message` | 保留具名 `MessagePerson` |
| `UserCenter/ExactProfile` | `entities/user` | 默认/具名 re-export |
| `NoticeMessage` | `shared/ui/feedback` | 保留两个具名符号 |
| `Footer`、`DocumentTitle` | `app/layouts/footer`、`shared/ui/document-title` | 保留原具名/默认形状 |
| `Focus/Focus`、`SiteManage/Index` | `pages/focus/layout`、`pages/site-manage` | Router 改为直接 lazy 新 owner |
| `UserCenter/ExactActivities`、`ConfigSignature` | `pages/user-center/overview`、`features/account` | 默认/具名 re-export |

## 无 Redux 轻状态与导航组件组

| 旧位置 | 新 owner | 兼容方式 |
|---|---|---|
| 根 `Components/Pager.tsx` | `shared/ui/pagination` | 保留具名 `Pager` re-export |
| `Components/UserCenter/Pager.tsx` | `pages/user-center/pagination` | 保留 default re-export |
| `Focus/FocusTopicSingle`、`RecommendedTopicSingle`、`Search/SearchTopicSingle` | `entities/topic` | 旧具名符号映射到 `FocusTopicItem`、`RecommendedTopicItem`、`SearchTopicItem` |
| `Topic/Topic-Category`、`Topic-AwardInfo` | `entities/topic` | 保留 `Category` 具名和 `AwardInfo` default 形状 |
| `Focus/FocusUserArea` | `pages/focus` | 保留具名 re-export，Router lazy import 改用 page 入口 |

通用 Pager 的 Board/Topic/Message 调用方、用户中心 Pager 调用方和五个 topic 叶子的直接调用方均改用新窄入口；旧 facade 留待 P21 删除。

## 用户中心 Redux 页面与壳层组

| 旧位置 | 新 owner | 兼容方式 |
|---|---|---|
| `UserCenter/UserCenter` | `pages/user-center/layout` | 保留 default re-export；Router 直接 lazy layout 入口 |
| `UserCenter/Exact` | `pages/user-center/overview` | 保留 default re-export；Router lazy named `UserCenterOverview` |
| `UserCenter/MyFollowings`、`MyFans` | `pages/user-center/my-followings`、`my-fans` | 保留 default re-export；Router 直接 lazy page 入口 |
| `UserCenter/MyFavoritesBoards` | `pages/user-center/custom-boards` | 保留 default re-export；Router 直接 lazy page 入口 |

在该检查点尚未迁移的 `Navigation`、`MyFollowingsUser`、`MyFavoritesBoard` 仍经 legacy 路径消费；随后已由下述用户中心交互叶子组承接。

## 用户中心交互叶子组

| 旧位置 | 新 owner | 兼容方式 |
|---|---|---|
| `UserCenter/Navigation` | `pages/user-center/layout/ui/UserCenterNavigation` | 旧路径 default re-export；layout 改用本地 owner |
| `UserCenter/MyFavoritesBoard` | `pages/user-center/custom-boards/ui/UserFavoriteBoardCard` | 旧路径 default re-export；关注版面 page 改用本地 owner |
| `UserCenter/MyFollowingsUser` | `features/follow/ui/UserFollowCard` | 旧路径 default re-export；关注/粉丝 page 改用 feature 入口 |

## 热门主题同构页面组

| 旧位置 | 新 owner | 兼容方式 |
|---|---|---|
| `Topic/Topic-Hot-Weekly` | `pages/hot-topics/weekly` | 保留 `WeeklyHotTopic`、`Category` named re-export；Router 改用新入口 |
| `Topic/Topic-Hot-Monthly` | `pages/hot-topics/monthly` | 保留 `MonthlyHotTopic`、`Category` named re-export；Router 改用新入口 |
| `Topic/Topic-Hot-History` | `pages/hot-topics/history` | 保留 `HistoryHotTopic`、`Category` named re-export；Router 改用新入口 |

三个入口共享 `pages/hot-topics/ui` 实现，但继续保持独立 lazy route module。

## 首页、搜索与站务组件组

| 旧位置 | 新 owner | 兼容方式 |
|---|---|---|
| `Components/MainPage` 五个 live class | `pages/home`、`pages/home/main`、`pages/home/advertisement` | 旧具名符号 re-export；首页 Router 和广告调用方改用窄入口 |
| `Components/Search/Search` | `pages/search/topics` | 保留 `Search`、`Category` named re-export；Router 改用 topic search 入口 |
| `Components/Search/SearchBoard` | `pages/search/boards` | 保留 `SearchBoard`、`Category` named re-export；Router 改用 board search 入口 |
| `Components/SiteManage/Announcement`、`Advertisement` | `pages/site-manage/announcement`、`advertisement` | 保留原 default export；SiteManage 直接组合 owner |

`States/SearchState` 和 `RecommendedBoardComponent` 本组不删除，留待 P21 重新做引用证明。

## 消息与私信组件组

| 旧位置 | 新 owner | 兼容方式 |
|---|---|---|
| `Message/Message` | `pages/message/layout` | 保留 `Message` named re-export；Router 改用 layout 窄入口 |
| `Message/MessageResponse` | `pages/message/responses` | 保留旧符号；index/response 路由共用新入口 |
| `Message/MessageAttme` | `pages/message/mentions` | 保留旧符号；Router 移除 route props bridge |
| `Message/MessageSystem` | `pages/message/system` | 保留旧符号；Router 移除 route props bridge |
| `Message/MessageMessage`、`MessageWindow` | `pages/message/private-messages` | 保留两个旧符号；Router 改用私信 page 入口 |

`MessageWindowProps`、`MessageWindowState`、`MessageMessageState`、`MessageResponseState`、`MessageSystemState` 不再被 live owner 消费，留待 P21 引用清理。

## Header、登录、通知与错误控制组

| 旧位置 | 新 owner | 兼容方式 |
|---|---|---|
| `Components/Header` 的三个 live class | `app/layouts/header` | 保留 `Header`、`Search`、`SearchBeforeConnent` named re-export；AppShell 改用新入口 |
| `Components/LogOn` | `pages/auth/login` | 保留 default re-export；Router 改用登录 page 窄入口 |
| `Components/NotificationController` | `features/message/realtime-notifications` | 保留 default/named re-export，但无运行时挂载点 |
| `Components/ErrorControl` | `app/providers/navigation-error-reset` | 保留 default/named re-export；AppShell 改用新入口 |

本组不删除全局 route-props 桥；Router 中其他 legacy class 仍在使用。`ErrorBoundary` 继续从旧入口挂载，`ErrorEmitter` 留待 P21。

## 公共用户详情页迁移组

| 旧位置 | 新 owner | 兼容方式 |
|---|---|---|
| `Components/UserCenter/User/User.tsx` | `pages/user-profile/layout` | 保留 default re-export；Router 改用 layout 窄入口 |
| `Components/UserCenter/User/Router.tsx` | `pages/user-profile/overview` | 保留 default 与 `UserExactWithRouter` re-export；Router 改用 overview 窄入口 |
| `Components/UserCenter/User/Navigation.tsx` | `pages/user-profile/layout` | 保留 default re-export |
| `Components/UserCenter/ExactAvatar.tsx` | `entities/user/profile-avatar` | 保留 default re-export；用户中心 overview 改用 entity 窄入口 |
| `Components/UserCenter/User/Profile.tsx` | `pages/user-profile/overview/ui/UserProfileDetails` | 保留 default re-export |
| `Components/UserCenter/User/Activities.tsx` | `pages/user-profile/overview/ui/UserRecentTopics` | 保留 default re-export |

`Components/UserCenter/User/Manage.tsx` 及其路由仍走 legacy 子页；全局 route-props 桥继续由其他消费者使用。
