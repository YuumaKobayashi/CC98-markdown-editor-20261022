# P15 React class 清单

## 基线与口径

- 基线：`a38580e2`；
- 使用 TypeScript AST 统计实际 class declaration，避免把注释中的旧代码算入；
- 自用户中心近期动态、收藏与历史组起同时补充 class expression 口径；该组沿用的历史口径只扫描 `Components/**` 与 `src/**`，因此当时只补出了 `Components/Topic/Topic-ReplierSignature.tsx`；
- 自当前公开 Board 页面组起增加符合总计划范围的完整口径，同时扫描 `Components/**`、`Pages/**` 与 `src/**`；历史窄口径继续保留用于对照，不回写此前批次数字；
- 排除冻结的 `Ubb/**`、`Components/UbbEditor/**`、`Components/UbbContainer.tsx`；
- `ErrorBoundary` 是唯一允许最终保留的 React class；同文件的 `ErrorEmitter` 仍属于 P15 目标。

## 基线分布

| 位置 | React class 声明数 |
|---|---:|
| `Components/` 根目录 | 35 |
| `Components/Board` | 19 |
| `Components/Common` | 1 |
| `Components/Focus` | 11 |
| `Components/Message` | 8 |
| `Components/Search` | 5 |
| `Components/SiteManage` | 3 |
| `Components/Topic` | 30 |
| `Components/UserCenter` | 39 |
| 合计 | 151 |

P15 目标为其中 150 个声明；首批迁移 `MyTopics`、`MyPosts` 两个声明。首批完成后预期剩余 148 个目标声明及一个允许保留的 `ErrorBoundary`。

## 首批清单

| 原符号 | 风险 | 新 owner | 状态 |
|---|---|---|---|
| `Components/UserCenter/MyTopics.tsx` / `MyTopics` | Redux + Router + mount/update 取数 | `src/pages/user-center/my-topics` | 已实现，待人工验收 |
| `Components/UserCenter/MyPosts.tsx` / `MyPosts` | Redux + Router + mount/update 取数 + 导航 | `src/pages/user-center/my-posts` | 已实现，待人工验收 |

后续 class 在各自小批开始前补充逐符号 owner 与风险，不因本批授权自动迁移。

## 无 Redux 简单组件组

| 批次 | 原符号 | 新 owner | 状态 |
|---|---|---|---|
| entity 展示 | `ExactActivitiesPost`、`ExactActivitiesTopic` | `entities/post`、`entities/topic` | 已实现，待人工验收 |
| entity 展示 | `MessagePerson`、`UnreadDot` | `entities/message` | 已实现，待人工验收 |
| entity 展示 | `ExactProfile` | `entities/user` | 已实现，待人工验收 |
| shared/app 展示 | `NoticeMessage`、`SendTopicNoticeMessage` | `shared/ui/feedback` | 已实现，待人工验收 |
| shared/app 展示 | `Footer`、`DocumentTitle` | `app/layouts`、`shared/ui/document-title` | 已实现，待人工验收 |
| 页面组合 | `Focus`、`SiteManage` | `pages/focus`、`pages/site-manage` | 已实现，待人工验收 |
| 页面组合 | `ExactActivities`、`ConfigSignature` | `pages/user-center/overview`、`features/account` | 已实现，待人工验收 |

TypeScript AST 复核确认 13 个目标声明均已消失；在 `dd514178` 检查点剩余 136 个非冻结 React class 声明，其中 `ErrorBoundary` 是唯一允许最终保留的例外，因此该检查点仍有 135 个 P15 目标待迁。

## 无 Redux 轻状态与导航组件组

| 批次 | 原符号 | 新 owner | 状态 |
|---|---|---|---|
| 分页 | `PageModel`、根 `Pager` | `shared/ui/pagination` | 已实现，待人工验收 |
| 分页 | 用户中心 `Pager` | `pages/user-center/pagination` | 已实现，待人工验收 |
| topic 展示 | `FocusTopicSingle`、`RecommendedTopicSingle`、`SearchTopicSingle` | `entities/topic` | 已实现，待人工验收 |
| topic 导航 | Topic `Category`、`AwardInfo` | `entities/topic` | 已实现，待人工验收 |
| Focus page | `FocusUserArea` | `pages/focus` | 已实现，待人工验收 |

TypeScript AST 复核确认本组 9 个目标声明均已消失，当前剩余 127 个非冻结 React class 声明；排除最终保留的 `ErrorBoundary` 后，仍有 126 个 P15 目标待迁，因此 P15 尚未完成。

## 用户中心 Redux 页面与壳层组

| 批次 | 原符号 | 新 owner | 状态 |
|---|---|---|---|
| 认证布局 | `UserCenterBeforeConnect` | `pages/user-center/layout` | 已实现，待人工验收 |
| 个人主页 | `UserCenterExact` | `pages/user-center/overview` | 已实现，待人工验收 |
| 关注分页 | `Following`、`Fans` | `pages/user-center/my-followings`、`my-fans` | 已实现，待人工验收 |
| 关注版面 | `Boards` | `pages/user-center/custom-boards` | 已实现，待人工验收 |

TypeScript AST 复核确认本组 5 个目标声明均已消失，当前剩余 122 个非冻结 React class 声明；排除最终保留的 `ErrorBoundary` 后，仍有 121 个 P15 目标待迁，因此 P15 尚未完成。

## 用户中心交互叶子组

| 原符号 | 新 owner | 状态 |
|---|---|---|
| `UserCenter/Navigation` | `pages/user-center/layout` | 已实现，待人工验收 |
| `UserCenter/MyFavoritesBoard` | `pages/user-center/custom-boards` | 已实现，待人工验收 |
| `UserCenter/MyFollowingsUser` | `features/follow` | 已实现，待人工验收 |

TypeScript AST 复核确认本组 3 个目标声明均已消失，当前剩余 119 个非冻结 React class 声明；排除最终保留的 `ErrorBoundary` 后，仍有 118 个 P15 目标待迁，因此 P15 尚未完成。

## 热门主题同构页面组

| 原符号 | 新 owner | 状态 |
|---|---|---|
| `Topic-Hot-Weekly/WeeklyHotTopic`、`Category` | `pages/hot-topics/weekly` | 已实现，待人工验收 |
| `Topic-Hot-Monthly/MonthlyHotTopic`、`Category` | `pages/hot-topics/monthly` | 已实现，待人工验收 |
| `Topic-Hot-History/HistoryHotTopic`、`Category` | `pages/hot-topics/history` | 已实现，待人工验收 |

TypeScript AST 复核确认本组 6 个目标声明均已消失，当前剩余 113 个非冻结 React class 声明；排除最终保留的 `ErrorBoundary` 后，仍有 112 个 P15 目标待迁，因此 P15 尚未完成。

## 首页、搜索与站务组件组

| 领域 | 原符号 | 新 owner | 状态 |
|---|---|---|---|
| 首页 | `MainPage`、`RecommendedReadingComponent`、`HotTopicComponent`、`AdsComponent`、`MainPageCountComponent` | `pages/home` | 已实现，待人工验收 |
| 主题搜索 | `Search`、`Category` | `pages/search/topics` | 已实现，待人工验收 |
| 版面搜索 | `SearchBoard`、`Category` | `pages/search/boards` | 已实现，待人工验收 |
| 站务 | `Announcement`、`Advertisement` | `pages/site-manage` | 已实现，待人工验收 |

TypeScript AST 复核确认本组 11 个 live React class 全部消失，当前剩余 102 个非冻结 React class 声明；排除最终保留的 `ErrorBoundary` 后，仍有 101 个 P15 目标待迁，因此 P15 尚未完成。`RecommendedBoardComponent` 保留为 P21 零调用删除候选。

## 消息与私信组件组

| 原符号 | 新 owner | 状态 |
|---|---|---|
| `Message/Message` | `pages/message/layout` | 已实现，待人工验收 |
| `Message/MessageResponse` | `pages/message/responses` | 已实现，待人工验收 |
| `Message/MessageAttme` | `pages/message/mentions` | 已实现，待人工验收 |
| `Message/MessageSystem` | `pages/message/system` | 已实现，待人工验收 |
| `Message/MessageMessage`、`MessageWindow` | `pages/message/private-messages` | 已实现，待人工验收 |

TypeScript AST 复核确认本组 6 个目标声明均已消失，当前剩余 96 个非冻结 React class 声明；排除最终保留的 `ErrorBoundary` 后，仍有 95 个 P15 目标待迁，因此 P15 尚未完成。

## Header、登录、通知与错误控制组

| 领域 | 原符号 | 新 owner | 状态 |
|---|---|---|---|
| Header 壳层 | `Header`、`DropDownConnect`、`SearchBeforeConnent` | `app/layouts/header` | 已实现，待人工验收 |
| 登录 | `LogOnExact` | `pages/auth/login` | 已实现，待人工验收 |
| 停用通知 | `NotificationController` | `features/message/realtime-notifications` | 已实现并保持未挂载 |
| 错误控制 | `ErrorControl` | `app/providers/navigation-error-reset` | 已实现，待人工验收 |

TypeScript AST 复核确认本组 6 个目标声明均已消失，当前剩余 90 个非冻结 React class 声明；排除最终保留的 `ErrorBoundary` 后，仍有 89 个 P15 目标待迁，因此 P15 尚未完成。

## 公共用户详情页迁移组

| 原符号 | 新 owner | 状态 |
|---|---|---|
| `UserBeforeConnent` | `pages/user-profile/layout` | 已实现，待人工验收 |
| `UserExact` | `pages/user-profile/overview` | 已实现，待人工验收 |
| `UserNavigationBeforeConnect` | `pages/user-profile/layout` | 已实现，待人工验收 |
| `ExactAvatar` | `entities/user/profile-avatar` | 已实现，待人工验收 |
| `User/Profile` 匿名 class | `pages/user-profile/overview` / `UserProfileDetails` | 已实现，待人工验收 |
| `User/Activities` 匿名 class | `pages/user-profile/overview` / `UserRecentTopics` | 已实现，待人工验收 |

TypeScript AST 复核确认本组 6 个目标声明均已消失，当前剩余 84 个非冻结 React class 声明；排除最终保留的 `ErrorBoundary` 后，仍有 83 个 P15 目标待迁，因此 P15 尚未完成。

## 版面列表与展示叶子迁移组

| 领域 | 原符号 | 新 owner | 状态 |
|---|---|---|---|
| 版面列表 | `BoardList`、`RootBoard`、`ChildBoard` | `pages/board-list` | 已实现，人工验收通过 |
| 版面页展示 | `Category`、`ListTagAndPager`、`ListButtonAndAds`、`BoardRecordContent` | `pages/board` | 已实现，人工验收通过 |
| topic breadcrumb | `Topic-New/Category`、`Topic-Recommended/Category` | `entities/topic` | 已实现，人工验收通过 |

TypeScript AST 复核确认本组 9 个目标声明均已消失，当前剩余 75 个非冻结 React class 声明；排除最终保留的 `ErrorBoundary` 后，仍有 74 个 P15 目标待迁，因此 P15 尚未完成。`RootBoardState`、`ChildBoardState` 是为兼容构造合同保留的非 React 数据 class，不计入该清单。

## 公共用户管理子页迁移组

| 原符号 | 新 owner | 状态 |
|---|---|---|
| `UserManage` | `pages/user-profile/manage` / `UserProfileManagePage` | 已实现，人工验收通过 |
| `Delete` | `pages/user-profile/manage` / `DeleteRecentUserContent` | 已实现，人工验收通过 |
| `Operation` | `pages/user-profile/manage` / `UserPunishmentForm` | 已实现，人工验收通过 |
| `ShowTopic` | `pages/user-profile/manage` / `UserRecentPostsManager` | 已实现，人工验收通过 |

TypeScript AST 复核确认本组 4 个目标声明均已消失，当前剩余 71 个非冻结 React class 声明；排除最终保留的 `ErrorBoundary` 后，仍有 70 个 P15 目标待迁，因此 P15 尚未完成。

## Focus 页面剩余壳层迁移组

| 原符号 | 新 owner | 状态 |
|---|---|---|
| `FocusBoardArea` | `pages/focus` / `FocusBoardArea` | 已实现，人工验收通过 |
| `FocusTopicArea` | `pages/focus` / `FocusTopicArea` | 已实现，人工验收通过 |

TypeScript AST 复核确认本组 2 个目标声明均已消失，当前剩余 69 个非冻结 React class 声明；排除最终保留的 `ErrorBoundary` 后，仍有 68 个 P15 目标待迁，因此 P15 尚未完成。迁移后零引用的 `FocusBoardAreaState`、`FocusTopicAreaState` 保留为 P21 清理候选，本批不删除非 React 数据 class。

## 主题发现页与卡片视图迁移组

| 原符号 | 新 owner | 状态 |
|---|---|---|
| `Topic-New/AllNewTopic` | `pages/new-topics` / `NewTopicsPage` | 已实现，人工验收通过 |
| `Topic-Recommended/AllRecommendedTopic` | `pages/recommended-topics` / `RecommendedTopicsPage` | 已实现，人工验收通过 |
| `CardTopicSingle` | `entities/topic` / `TopicCard` | 已实现，人工验收通过 |
| `VideoPlayer` | `entities/topic` / `TopicVideoPlayer` | 已实现，人工验收通过 |
| `AudioPlayer` | `entities/topic` / `TopicAudioPlayer` | 已实现，人工验收通过 |
| `CardBoard` | `pages/new-topics` / `NewTopicsBoardSidebar` | 已实现，人工验收通过 |
| `CardRecommendTopic` | `pages/new-topics` / `RandomRecentTopics` | 已实现，人工验收通过 |

TypeScript AST 复核确认本组七个目标声明均已消失，当前剩余 62 个非冻结 React class 声明；排除最终保留的 `ErrorBoundary` 后，仍有 61 个 P15 目标待迁，因此 P15 尚未完成。三个零引用旧 State class 保留为 P21 清理候选。

## 用户中心资料、主题与转账设置迁移组

| 原符号 | 新 owner | 状态 |
|---|---|---|
| `Config` | `pages/user-center/settings` / `UserCenterSettingsPage` | 已实现，人工验收通过 |
| `UserCenterConfigAvatar` | `pages/user-center/settings` / `UserCenterAvatarSettings` | 已实现，人工验收通过 |
| `ConfigOthers` 匿名 class | `pages/user-center/settings` / `UserCenterProfileSettings` | 已实现，人工验收通过 |
| `Theme` | `pages/user-center/theme` / `UserCenterThemePage` | 已实现，人工验收通过 |
| `ThemeSettingComponent` | `pages/user-center/theme` / `ThemeSettingsForm` | 已实现，人工验收通过 |
| `Wealth` | `pages/user-center/transfer-wealth` / `TransferWealthPage` | 已实现，人工验收通过 |

TypeScript AST 复核确认本组六个目标声明均已消失，当前剩余 56 个非冻结 React class 声明；排除最终保留的 `ErrorBoundary` 后，仍有 55 个 P15 目标待迁，因此 P15 尚未完成。

## 用户中心近期动态、收藏与浏览历史迁移组

| 原符号 | 新 owner | 状态 |
|---|---|---|
| `ExactActivitiesTopics/Activities` | `pages/user-center/overview` / `UserRecentTopicsActivityList` | 已实现，待人工验收 |
| `MyFavoritesPosts/Posts` | `pages/user-center/favorites` / `UserCenterFavoriteTopicsPage` | 已实现，待人工验收 |
| `ExactFavTopic` 匿名 class | `pages/user-center/favorites` / `UserCenterFavoriteTopicItem` | 已实现，待人工验收 |
| `MyFavoritesAddModalcontent` | `features/favorites` / `FavoriteTopicGroupSelect` | 已实现，待人工验收 |
| `MyFavoritesPostsManager` | `pages/user-center/favorites` / `FavoriteTopicGroupManager` | 已实现，待人工验收 |
| `MyHistory/Posts` | `pages/user-center/history` / `UserCenterHistoryPage` | 已实现，待人工验收 |

TypeScript AST 的历史 class declaration 口径从 56 降至 50，排除 `ErrorBoundary` 后仍有 49 个声明目标。补充 class expression 后，非冻结 React class 结构从 57 降至 51，排除 `ErrorBoundary` 后仍有 50 个实际目标；额外目标是 `Topic-ReplierSignature.tsx` 的 class expression。P15 尚未完成。

## P21 删除候选

根 `Breadcrumb`、根 `Category/Test`、`MessageBar`、`FindIP`、`TopicReplyUserBar`、`ExactActivitiesPosts`、`ErrorEmitter`、Topic `Judge`、`TopicJudgeV2`、`PostManagement` v1、`TopicManagement` v1 未发现 JSX 调用，本轮不为清零 class 而迁移。`CountDown` 只有 import 和注释 JSX，需在 P21 重新做引用/构建证明后决定删除。

## 完整 Topic 主链迁移组

| 原符号 | 新 owner | 状态 |
|---|---|---|
| `Post` / `ShowTopic` | `pages/topic` / `TopicPage` | 已实现，待人工验收 |
| `CurUserPost` | `pages/topic` / `TrackedTopicPage` | 已实现，待人工验收 |
| `Reply` | `pages/topic` / `TopicReplyList` | 已实现，待人工验收 |
| `SendTopic` | `pages/topic` / `TopicReplyComposer` | 已实现，待人工验收 |
| `Award` | `pages/topic` / `TopicAwardList` | 已实现，待人工验收 |
| `Replier` | `pages/topic` / `TopicReplier` | 已实现，待人工验收 |
| `ReplierSignature` 匿名 class expression | `pages/topic` / `TopicReplySignature` | 已实现，待人工验收 |
| `ReplyContent` | `pages/topic` / `TopicReplyContent` | 已实现，待人工验收 |
| `TopicInfo` | `pages/topic` / `TopicHeader` | 已实现，待人工验收 |
| `VoteContent` | `pages/topic` / `TopicVote` | 已实现，待人工验收 |

完整 TypeScript AST 复核确认十个目标结构均已消失：64 个 declaration 加 1 个 expression 降至 55 个 declaration 加 0 个 expression。排除允许保留的 `ErrorBoundary` 后仍有 54 个 P15 目标。P21 候选文件未删除；`ReplyContent` 迁出后不再携带未使用的 `PostManagement` v1 import。

## 完整口径修正与当前公开 Board 页面迁移组

`frontend-refactoring-plan-v2.md` 明确把 `Components/**` 与 `Pages/**` 都列为迁移范围。当前组开始前的完整非冻结 AST 统计为 75 个 class declaration、2 个 class expression，共 77 个 React class 结构；排除允许保留的 `ErrorBoundary` 后有 76 个目标。相对历史窄口径新增的 `Pages/**` 为：AnnualReview 7 个、AnnualReviewV2 10 个、Board 7 个 declaration 加 1 个 expression、Index 1 个。

| 原符号 | 新 owner | 状态 |
|---|---|---|
| `Pages/Board/index.tsx` 匿名 class expression | `pages/board` / `BoardPage` | 已实现，待人工验收 |
| `Pages/Board/Body.tsx` / `Body` | `pages/board` / `BoardContent` | 已实现，待人工验收 |
| `Pages/Board/Head.tsx` 匿名 class | `pages/board` / `BoardHeader` | 已实现，待人工验收 |
| `Pages/Board/Head.tsx` / `Category` | `pages/board` / `BoardBreadcrumb` | 已实现，待人工验收 |
| `Pages/Board/Footer.tsx` 匿名 class | `pages/board` / `BoardFooterActions` | 已实现，待人工验收 |
| `Pages/Board/Footer.tsx` / `Manage` | `pages/board` / `BoardBatchManager` | 已实现，待人工验收 |
| `Pages/Board/Footer.tsx` / `Record` | `pages/board` / `BoardModerationRecordList` | 已实现，待人工验收 |
| `Pages/Board/PostItem.tsx` / `Card` | `pages/board` / `BoardTopicPreviewCard` | 已实现，待人工验收 |

本组七个 declaration 与一个 expression 均已消失。完整口径现为 68 个 declaration 加 1 个 expression，共 69 个结构；排除 `ErrorBoundary` 后仍有 68 个目标。历史 `Components/** + src/**` 窄口径没有变化，仍为 50 个 declaration 加 1 个 expression，排除 `ErrorBoundary` 后 50 个目标。P15 尚未完成。

## Topic 评分与管理弹窗迁移组

| 原符号 | 新 owner | 状态 |
|---|---|---|
| `TopicPostManagementV2` | `features/moderation` / `PostManagementDialog` | 已实现，待人工验收 |
| `TopicJudgeV3` | `features/moderation` / `PostRatingDialog` | 已实现，待人工验收 |
| `TopicTopicManagementV2` | `features/moderation` / `TopicManagementDialog` | 已实现，待人工验收 |
| `Topic-ManageHistory` 匿名 class | `features/moderation` / `TopicManagementHistoryDialog` | 已实现，待人工验收 |

TypeScript AST 复核确认四个目标 declaration 均已消失。完整口径从 68 个 declaration 加 1 个 expression 降至 64 个 declaration 加 1 个 expression，共 65 个结构；排除 `ErrorBoundary` 后仍有 64 个目标。历史 `Components/** + src/**` 窄口径从 50 个 declaration 加 1 个 expression 降至 46 个 declaration 加 1 个 expression，排除后仍有 46 个目标。唯一 class expression 仍是 `Topic-ReplierSignature.tsx`；P15 尚未完成。
