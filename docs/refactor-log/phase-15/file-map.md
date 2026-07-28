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

## 版面列表与展示叶子迁移组

| 旧位置 | 新 owner | 兼容方式 |
|---|---|---|
| `Components/Board/BoardList.tsx` 的三个 React class | `pages/board-list` | 保留 `BoardList`、`RootBoard`、`ChildBoard` 与两个数据构造器 named re-export；Router 改用 `BoardListPage` |
| `Components/Board/Board.tsx` 的四个展示叶子 | `pages/board` | 旧文件导入新实现供内部使用，并以原符号 named re-export |
| `Components/Topic/Topic-New.tsx` 的 `Category` | `entities/topic/NewTopicsBreadcrumb` | 页面内部改用新实现并继续 named re-export `Category` |
| `Components/Topic/Topic-Recommended.tsx` 的 `Category` | `entities/topic/RecommendedTopicsBreadcrumb` | 页面内部改用新实现并继续 named re-export `Category` |

Board 主 route、Topic-New 与 Topic-Recommended lazy 入口保持原样；本组只把 `/boardlist` 切到新 page 入口。

## 公共用户管理子页迁移组

| 旧位置 | 新 owner | 兼容方式 |
|---|---|---|
| `Components/UserCenter/User/Manage.tsx` | `pages/user-profile/manage/UserProfileManagePage` | 旧 default export 改为 re-export；Router 改用 manage 窄入口 |
| `Components/UserCenter/Manage/DeleteTopicsAndPosts.tsx` | `pages/user-profile/manage/DeleteRecentUserContent` | 旧 default export 保持兼容 |
| `Components/UserCenter/Manage/Operation.tsx` | `pages/user-profile/manage/UserPunishmentForm` | 旧 default export 保持兼容 |
| `Components/UserCenter/Manage/ShowPost.tsx` | `pages/user-profile/manage/UserRecentPostsManager` | 旧 default export 保持兼容 |

公共用户详情 layout、overview、侧栏与 Redux userInfo 结构不在本组改动；manage page 只通过 typed dispatch 更新既有访问页和用户 id。

## Focus 页面剩余壳层迁移组

| 旧位置 | 新 owner | 兼容方式 |
|---|---|---|
| `Components/Focus/FocusBoardArea.tsx` | `pages/focus/ui/FocusBoardArea` | 旧文件保留 named re-export；Router index 与 `board/*` 改用 page 窄入口 |
| `Components/Focus/FocusTopicArea.tsx` | `pages/focus/ui/FocusTopicArea` | 旧文件保留组件和 props 类型 named re-export；Focus 三个子页改用 page 内部实现 |

`Components/Focus/CardTopicSingle.tsx`、`CardBoard.tsx`、`CardRecommendTopic.tsx` 及内部音视频播放器继续服务 `/newtopics` 卡片视图，不在本组迁移。

## 主题发现页与卡片视图迁移组

| 旧位置 | 新 owner | 兼容方式 |
|---|---|---|
| `Components/Topic/Topic-New.tsx` | `pages/new-topics/NewTopicsPage` | 保留 default、`NewTopicsPage` 与 `Category` re-export；Router 改用 page 窄入口 |
| `Components/Topic/Topic-Recommended.tsx` | `pages/recommended-topics/RecommendedTopicsPage` | 保留 default、`AllRecommendedTopic`、`RecommendedTopicsPage` 与 `Category` re-export；Router 改用 page 窄入口 |
| `Components/Focus/CardTopicSingle.tsx` | `entities/topic/TopicCard` | 保留 `CardTopicSingle`、`VideoPlayer`、`AudioPlayer` 别名 |
| `Components/Focus/CardBoard.tsx` | `pages/new-topics/NewTopicsBoardSidebar` | 保留 `CardBoard` named re-export |
| `Components/Focus/CardRecommendTopic.tsx` | `pages/new-topics/RandomRecentTopics` | 保留 `CardRecommendTopic` named re-export |

服务 API、Redux reducer、公开 URL 和旧 State 文件均不迁移；legacy facade 留待 P21 依据引用证明删除。

## 用户中心资料、主题与转账设置迁移组

| 旧位置 | 新 owner | 兼容方式 |
|---|---|---|
| `Components/UserCenter/Config.tsx` | `pages/user-center/settings/UserCenterSettingsPage` | 保留 default 与 `Config` 别名；Router `config/*` 改用 settings 窄入口 |
| `Components/UserCenter/ConfigAvatar.tsx` | `pages/user-center/settings/UserCenterAvatarSettings` | 保留 default 与 `UserCenterConfigAvatar` 别名 |
| `Components/UserCenter/ConfigOthers.tsx` | `pages/user-center/settings/UserCenterProfileSettings` | 保留 default 与 `ConfigOthers` 别名 |
| `Components/UserCenter/Theme.tsx` | `pages/user-center/theme/UserCenterThemePage`、`ThemeSettingsForm` | 保留 default、`Theme`、`ThemeSettingComponent`、主题列表和值类型导出；Router `theme/*` 改用 theme 窄入口 |
| `Components/UserCenter/TransferWealth.tsx` | `pages/user-center/transfer-wealth/TransferWealthPage` | 保留 default 与 `Wealth` 别名；Router `transferwealth/*` 改用窄入口 |

`EditableUserInfo` 归入 settings model；Redux reducer/action/thunk、`States/AppState`、认证与 HTTP service 均继续使用既有合同。

## 用户中心近期动态、收藏与浏览历史迁移组

| 旧位置 | 新 owner | 兼容方式 |
|---|---|---|
| `Components/UserCenter/ExactActivitiesTopics.tsx` | `pages/user-center/overview/UserRecentTopicsActivityList` | 保留 default/named re-export；overview 直接组合新 owner |
| `Components/UserCenter/MyFavoritesPosts.tsx` | `pages/user-center/favorites/UserCenterFavoriteTopicsPage` | 保留 default/named re-export；Router `myfavorites/*` 改用 page 窄入口 |
| `Components/UserCenter/ExactFavTopic.tsx` | `pages/user-center/favorites/UserCenterFavoriteTopicItem` | 保留 default/named re-export |
| `Components/UserCenter/MyFavoritesAdd.tsx` | `features/favorites/FavoriteTopicGroupSelect` | 保留 default/named re-export；Topic 旧 class 继续通过 facade 复用 |
| `Components/UserCenter/MyFavortitesManage.tsx` | `pages/user-center/favorites/FavoriteTopicGroupManager` | 保留 default/named re-export |
| `Components/UserCenter/MyHistory.tsx` | `pages/user-center/history/UserCenterHistoryPage` | 保留 default/named re-export；Router `myhistory/*` 改用 page 窄入口 |

收藏 service 继续位于 `features/favorites/api/service.ts`；新增 public barrel、分组类型和默认占位数据，不修改旧 Utility facade、Redux reducer/action/thunk 或 API wire shape。

## 当前公开 Board 页面迁移组

| 旧位置 | 新 owner | 兼容方式 |
|---|---|---|
| `Pages/Board/index.tsx` | `pages/board/BoardPage` | 旧文件保留 default re-export；Router `/board/:id/:page?/*` 改用 page 窄入口 |
| `Pages/Board/Head.tsx` | `pages/board/BoardHeader`、既有 `BoardBreadcrumb` | 旧文件保留 default 与 `Category` 兼容别名 |
| `Pages/Board/Body.tsx` | `pages/board/BoardContent` | 旧文件保留 default re-export |
| `Pages/Board/ListHead.tsx` | `pages/board/BoardTopicToolbar` | 旧文件保留 default re-export |
| `Pages/Board/PostList.tsx` | `pages/board/BoardTopicList` | 旧文件保留 default re-export |
| `Pages/Board/PostItem.tsx` | `pages/board/BoardTopicListItem`、`BoardTopicPreviewCard` | 旧文件保留 default re-export |
| `Pages/Board/Footer.tsx` | `pages/board/BoardFooterActions`、`BoardBatchManager`、`BoardModerationRecordList` | 旧文件保留 default re-export |
| `Pages/Board/action.ts` | `pages/board/api/service.ts` | 旧文件 re-export 全部原 service 符号；wire shape 不变 |

`Pages/Board/Announcement.tsx` 继续是既有 `BoardAnnouncement` facade；冻结 `UbbContainer` 只通过原 adapter 使用。旧 `/list/:boardId/...` 的 `Components/Board/Board.tsx`、其 Router 入口与旧 DOM 合同保持不变。

## Topic 评分与管理弹窗迁移组

| 旧位置 | 新 owner | 兼容方式 |
|---|---|---|
| `Components/Topic/Topic-PostManagement-v2.tsx` | `features/moderation/ui/PostManagementDialog` | 旧文件保留 default re-export；`Topic-Reply.tsx` 改用 moderation barrel |
| `Components/Topic/Topic-Judge-v3.tsx` | `features/moderation/ui/PostRatingDialog` | 旧文件保留 default re-export；`Topic-Reply.tsx` 改用 moderation barrel |
| `Components/Topic/Topic-TopicManagement-v2.tsx` | `features/moderation/ui/TopicManagementDialog` | 旧文件保留 default re-export；`Topic-SendTopic.tsx` 改用 moderation barrel |
| `Components/Topic/Topic-ManageHistory.tsx` | `features/moderation/ui/TopicManagementHistoryDialog` | 旧文件保留 default re-export；`Topic-SendTopic.tsx` 改用 moderation barrel |

四个新 owner 直接使用 `features/moderation/api/service`、`features/reactions/api/service` 与 `entities/board/api/service`；不再经 `Utility.ts` 总门面访问这些 API。Router、Redux、Topic 父组件 state/回调与公开 URL 均未改。

## 完整 Topic 主链迁移组

| 旧位置 | 新 owner | 兼容方式 |
|---|---|---|
| `Components/Topic/Topic.tsx` | `pages/topic/TopicPage` | 保留 default、`Post`、`ShowTopic` 和 Quote context 导出；Router 改用 page barrel |
| `Components/Topic/Topic-Trace.tsx` | `pages/topic/TrackedTopicPage` | 保留 default、`CurUserPost` 和 Quote context 导出 |
| `Components/Topic/Topic-Reply.tsx` | `pages/topic/TopicReplyList` | 保留 default、`Reply`、`ContentState`、`FloorSize` 导出 |
| `Components/Topic/Topic-SendTopic.tsx` | `pages/topic/TopicReplyComposer` | 保留 default、`SendTopic` 和 handle 类型导出 |
| `Components/Topic/Topic-Award.tsx` | `pages/topic/TopicAwardList` | 保留 default 与 `Award` 导出 |
| `Components/Topic/Topic-Replier.tsx` | `pages/topic/TopicReplier` | 保留 default 与 `Replier` 导出 |
| `Components/Topic/Topic-ReplierSignature.tsx` | `pages/topic/TopicReplySignature` | 保留原 default 导出 |
| `Components/Topic/Topic-ReplyContent.tsx` | `pages/topic/TopicReplyContent` | 保留 default 与 `ReplyContent` 导出 |
| `Components/Topic/Topic-TopicInfo.tsx` | `pages/topic/TopicHeader` | 保留 default 与 `TopicInfo` 导出 |
| `Components/Topic/VoteInfo.tsx` | `pages/topic/TopicVote` | 保留 default、`VoteContent` 与 `voteInfo` 导出 |

`pages/topic/api/service.ts` 承接关注、投票、回复提交和通知全部回复等页面专用 HTTP 操作；其他调用继续使用既有领域 owner。Router 只依赖 `TopicPage`、`TrackedTopicPage` 两个 public 入口。

## 旧 `/list` Board 主链迁移组

| 旧导出 | 新 owner | 兼容方式 |
|---|---|---|
| 文件内 `RouteComponent` | 根 `Components/RouteComponent` | `Components/Board/Board.tsx` 直接转导 |
| `BList` | `LegacyBoardPage` | facade 以 `BList` 别名导出；Router 直接加载新 page |
| `ListHead` | `LegacyBoardHeader` | facade 保留 `ListHead` |
| `ListTopContent` | `LegacyBoardTopTopics` | facade 保留 `ListTopContent` |
| `BestTopics` | `LegacyBoardBestTopicItems` | facade 保留 `BestTopics` |
| `ListContent` | `LegacyBoardTopicList` | facade 保留 `ListContent` |
| `ListTagContent` | `LegacyBoardOneTagTopics` | facade 保留 `ListTagContent` |
| `ListTagsContent` | `LegacyBoardTwoTagTopics` | facade 保留 `ListTagsContent` |
| `BoardRecord` | `LegacyBoardRecords` | facade 保留 `BoardRecord` |
| `ListBestContent` | `LegacyBoardFeaturedTopics` | facade 保留 `ListBestContent` |
| `ListSaveContent` | `LegacyBoardSavedTopics` | facade 保留 `ListSaveContent` |
| `TopicTitleAndContent` | `LegacyBoardTopicItem` | facade 保留 `TopicTitleAndContent` |

四个既有共享叶子继续由 facade 以 `Category`、`ListButtonAndAds`、`ListTagAndPager`、`BoardRecordContent` 原名导出。`@pages/board` 新增公开入口 `LegacyBoardPage`；其余 owner 仅为兼容 facade 提供别名，不新增业务 API。
