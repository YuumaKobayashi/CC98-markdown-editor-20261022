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
