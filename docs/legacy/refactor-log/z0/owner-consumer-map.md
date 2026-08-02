# Z0 owner map 与 consumer map

## 1. 活动 legacy 运行链

| 活动旧 owner | 直接现代消费者 | 加载/调用结论 | 目标阶段与 owner |
| --- | --- | --- | --- |
| `Components/UbbContainer` | Board、Topic Detail、User Profile、Message、Notification、Site Content 共 12 个文件 | 被加载、运行时可达、存在 JSX 直接调用 | Z2 `modules/ubb` public renderer |
| `Components/UbbEditor` | Daily Signin、Editor、Topic Reply Composer 3 个 Route 文件 | 被加载、运行时可达、存在 JSX/ref 直接调用 | Z2 `modules/ubb` public editor |
| `Ubb/UbbCodeExtension`、`Ubb/Core`、`RightTagHandler` | Board/Topic/User/Notification 和 UBB Container | 被加载、运行时可达；Engine factory、options 与 handler 直接使用 | Z2 `modules/ubb` 公共合同和内部实现 |
| 其余已注册 UBB Handler | `UbbCodeExtension` | 45 个 Handler/核心文件经注册链加载；Math/Sandbox 两个实现只在注释中禁用 | Z2 原样迁址，保留注册顺序与禁用注释 |
| `Props/FocusBoard` | Focus Route、Board Search | 被加载、可达、作为 props/DTO 使用 | Z1 Board/Follow 或 Route 私有合同 |
| `Props/FocusTopic` 及其 `MediaTopicContent`、`TopicContentType` | Focus/New/Hot/Search Route 与 Topic Module | 被加载、可达、作为 DTO 使用 | Z1 Topic 公共合同 |
| `Props/RecommendedTopic` | Recommended Topics Route 与 Topic Module | 被加载、可达、作为 DTO 使用 | Z1 Topic 公共合同 |
| `States/AppState` | 19 个 Application 文件、13 个 Module 文件 | 被加载、可达，业务 DTO/页面模型直接使用 | Z1 按 User/Board/Topic/Post/Follow/Route 拆分 |
| `States/BoardEvent` | Board Moderation Record | 被加载、可达，DTO 直接使用 | Z1 Board/Moderation 合同 |
| `Utility.ts` | Board Page、Favorite Topic Manager；另被 AnnualReview 休眠入口引用 | 活动主图可达且有直接调用；不能整文件删除 | Z3 逐导出收口；Z4 再删 AnnualReview 导出 |
| `Utility/fetchUtility` | Board Route API | 被加载、可达、直接调用 | Z3 Foundation HTTP 或 Board Route owner |
| `Utility/timeZoneUtility` | User Profile Overview | 被加载、可达、直接调用 | Z3 Foundation date/time 或 Route owner |
| `ErrorBoundary` | Application root provider | 文件被加载、可达、直接 JSX 调用；同文件 `ErrorEmitter` 不可达 | Z3 保留 error-boundary 语义并拆除休眠 symbol |
| `Constant`、`DocumentTitle`、`NoticeMessage`、`ReSignCalendar` | Topic/Daily Signin/Favorites | 被加载、可达、存在直接调用 | Z3 分别归 posting/Route/Foundation UI 真实 owner |

## 2. 现代源码到 legacy 的直接边

AST 复核得到 82 条 `src/** -> @legacy/**` 直接 import：

| 目标 | 边数 | 主要消费者 |
| --- | ---: | --- |
| `States/AppState` | 32 | Application 19；Board/Favorite/Follow/Post/Topic/User Module 13 |
| `Components/UbbContainer` | 12 | Application 6；Message/Notification/Site Content/User Module 6 |
| `Props/FocusTopic` | 7 | Application 4；Topic Module 3 |
| `Ubb/UbbCodeExtension` | 7 | Application 4；Notification Module 3 |
| `Components/NoticeMessage` | 5 | Topic Detail 4；Favorite Topic Manager 1 |
| `Components/UbbEditor` | 3 | Daily Signin、Editor、Topic Reply Composer |
| `Props/FocusBoard` | 2 | Focus、Board Search |
| `Props/RecommendedTopic` | 2 | Recommended Topics、Topic Module |
| `Ubb/Core` | 2 | User Profile Route、User Module |
| 其余 9 个目标 | 10 | Constant、DocumentTitle、ErrorBoundary、ReSignCalendar、BoardEvent、RightTagHandler、fetchUtility、timeZoneUtility 各一条，Utility 两条 |
| **合计** | **82** | 其中 27 条 Module→legacy 边由 architecture allowlist 精确登记 |

每一条 Module→legacy allowlist 都带 `removeWhen`，Z1/Z2 删除对应例外；Application→legacy 边虽不违反当前层级规则，也必须在 Z1–Z3 同批切换。

## 3. Router 与 lazy consumer

当前主 Router 只有 `src/application/router/app-router.tsx`。公开路由组冻结为：

- `/`；`/topic/hot-monthly`、`hot-weekly`、`hot-history`；`/topic/:topicid/:page?`；`/topic/:topicId/postid/:postId/:page?`；
- `/boardlist`；`/board/:id/:page?/*`；`/index/*`；
- `/usercenter` 及 followings/fans/topics/history/posts/favorites/config/custom-boards/transferwealth/theme 子路由；
- `/message` 及 response/attme/system/message/setting 子路由；
- `/focus` 及 board/user/favorite 子路由；
- `/newtopics/*`、`/recommendedtopics/*`、`/user/:method/:id`、`/logon`、`/search/*`、`/searchBoard/*`、`/signin/*`、`/sitemanage/*`、`/editor/:mode/:id?/*`、`/error/401/*` 与 catch-all 404。

Router 没有 `/list` 或 AnnualReview Route。旧 `list.asp?boardid=...&page=...` 由 IIS 精确 redirect 到 `/board/:id/:page`；无 page 时 redirect 到 `/board/:id`。

## 4. AnnualReview owner

- `Pages/AnnualReview/**` 与 `Pages/AnnualReviewV2/**` 只在各自树内互相 import，不在 bootstrap、Router、Vite、Template、IIS 或独立 HTML 中加载。
- 两棵树仍直接调用 `Utility.ts -> @modules/annual-review`，并共用 `Pages/AnnualReview/AnnualReview.scss`、Foundation interval chart 与 `/static/images/annual-review/**`。
- 因其无运行入口，标记为“未加载、运行时不可达、主应用无直接调用”；仍必须等 Z4 重新核对固定 URL/共享资源后整体删除。
