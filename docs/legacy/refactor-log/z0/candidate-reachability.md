# Z0 历史 16 个零调用/P21 候选复核

判定基线为 `dev20260716@de6eca90`。搜索覆盖 symbol、文件名、相对/alias 路径、静态 import/export、Router lazy、dynamic import/require、Vite/HTML/EJS、IIS、public、样式与资源引用。

| # | 历史候选 | 当前状态 | 被加载 | 运行时可达 | 直接调用 | Z0 结论 |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | 根 `Breadcrumb` | `Components/Breadcrumb.tsx` 仍在 | 否 | 否 | 否 | 仅同名现代 owner 存在；Z3 才可删除旧实现 |
| 2 | 根 `Category/Test` | `Components/Category.tsx` 仍在 | 否 | 否 | 否 | 两个导出均无 consumer；混合文件逐 symbol 保留证明 |
| 3 | `FindIP` | C1.7.4 已删除 | 否 | 否 | 否 | 当前 HEAD 无旧文件/引用；活动 IP owner 在 Topic Route |
| 4 | `TopicReplyUserBar` | `Components/Topic/Topic-ReplyUserBar.tsx` 仍在 | 否 | 否 | 否 | 文件无 inbound edge；Z3 重新证明后处理 |
| 5 | `ExactActivitiesPosts` | C1.7.4 已删除 | 否 | 否 | 否 | 当前 HEAD 无旧实现；活动 User Center 不依赖它 |
| 6 | `ErrorEmitter` | 仍在活动 `ErrorBoundary.tsx` 内 | **文件是** | **文件是** | **symbol 否** | 不能按文件删除；Z3 只在 export consumer 归零后移除休眠 symbol，保留 ErrorBoundary |
| 7 | Topic `Judge` v1 | C1.7.4 已删除 | 否 | 否 | 否 | 活动管理 owner 不依赖它 |
| 8 | `TopicJudgeV2` | `Components/Topic/Topic-Judge-v2.tsx` 仍在 | 否 | 否 | 否 | v3/现代管理同名不构成 consumer；Z3 处理 |
| 9 | `PostManagement` v1 | C1.7.4 已删除 | 否 | 否 | 否 | v2 facade/现代 Dialog 是独立活动 owner |
| 10 | `TopicManagement` v1 | C1.7.4 已删除 | 否 | 否 | 否 | v2 facade/现代 Dialog 是独立活动 owner |
| 11 | `CountDown` | `Components/CountDown.tsx` 仍在 | 否 | 否 | 否 | 两处 JSX 仅位于注释；注释不是 import 或调用 |
| 12 | `RecommendedBoardComponent` | 仍在无 inbound 的 `Components/MainPage.tsx` | 否 | 否 | 否 | 不因文件内还有其他导出而推定可整文件删除 |
| 13 | `NewTopicAreaState` | `States/NewTopicAreaState.tsx` 仍在 | 否 | 否 | 否 | Z1 类型 owner 审核后删除 |
| 14 | `RecommendedTopicAreaState` | `States/RecommendedTopicAreaState.tsx` 仍在 | 否 | 否 | 否 | Z1 类型 owner 审核后删除 |
| 15 | `RandomTopicAreaState` | `States/RandomTopicAreaState.tsx` 仍在 | 否 | 否 | 否 | Z1 类型 owner 审核后删除 |
| 16 | `SearchState` | `States/SearchState.tsx` 仍在 | 否 | 否 | 否 | Z1 Search Route 类型审核后删除 |

补充候选 `Components/RouteComponent.tsx` 只有来自不可达 `Components/Topic/Post.tsx` 的 import，本身不在 bootstrap 可达图；它不是历史 16 项之一，Z3 仍需按相同标准证明后处理。

结论：16 项中 5 项已在 C1.7.4 删除，11 项仍存在；Z0 对剩余项只冻结证据，不执行删除。`ErrorEmitter` 特别证明了“文件被加载”与“symbol 有直接调用”必须分开记录。
