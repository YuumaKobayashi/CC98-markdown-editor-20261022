# P15 React class 清单

## 基线与口径

- 基线：`a38580e2`；
- 使用 TypeScript AST 统计实际 class declaration，避免把注释中的旧代码算入；
- 扫描 `Components/**` 与 `src/**`；
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

## P21 删除候选

根 `Breadcrumb`、根 `Category/Test`、`MessageBar`、`FindIP`、`TopicReplyUserBar`、`ExactActivitiesPosts` 未发现运行时调用，本轮不为清零 class 而迁移。`CountDown` 只有 import 和注释 JSX，需在 P21 重新做引用/构建证明后决定删除。
