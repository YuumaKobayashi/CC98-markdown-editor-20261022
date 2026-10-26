# Phase 1：枚举与明确 magic number

完成日期：2026-08-02

本报告只覆盖 Phase 1。完整 endpoint、Controller action、请求/响应 DTO、service 与消费者矩阵见 [`read-only-audit.md`](./read-only-audit.md)。Topic/Post/Board DTO 字段补齐从 Phase 2 开始，本批未实施。

## 1. 后端来源与前端 owner

所有 TypeScript numeric enum 成员均显式赋值；没有依赖自动递增。

| 前端 owner | enum | 主后端静态来源（行号） | 前端使用范围 |
| --- | --- | --- | --- |
| `modules/topic/model` | `TopicState` | `Data/TopicState.cs:6-32` | Topic DTO、board/topic 状态展示、topic moderation |
|  | `TopicType` | `Data/TopicType.cs:6-25` | Topic DTO、site-content topic 投影、EditorPage |
|  | `TopicTopState` | `Data/TopicTopState.cs:6-30` | Topic DTO、board topic item、topic moderation |
|  | `TopicBestState` | `Data/TopicBestState.cs:6-25` | Topic DTO、board topic filter/item、topic moderation |
|  | `TopicAllowedViewerState` | `Data/TopicAllowedViewerState.cs:6-25` | Topic DTO |
|  | `TopicContentType` | `Data/TopicContentType.cs:6-40` | Topic DTO、TopicCard；含 `Lottery = 5` |
|  | `LotteryTopicStatus`、`LotteryMode` | `Data/LotteryTopicDetail.cs:31-50` | TopicReplyContent lottery UI |
|  | `SearchResultOrder` | `Models/SearchResultOrder.cs:6-20` | topic search wire enum；当前调用使用 action 默认值 |
|  | `TopicSortMode` | `Models/TopicSortMode.cs:6-20` | followee topic query；不复用于收藏 order |
| `modules/post/model` | `PostState` | `Data/Post.cs:174-180` | Post DTO |
|  | `PostContentType` | `Data/PostContentType.cs:6-10` | Post DTO、EditorPage、TopicReplyComposer/Content/List |
|  | `LikeState` | `Data/LikeState.cs:5-10` | like DTO 与 TopicReplySignature |
|  | `PostUserOperationType` | `Models/Manage/PostUserOperationType.cs:6-19` | moderation、post-rating operation body |
|  | `RatingType` | `Data/RatingReason.cs:21-35` | rating reason query、rating-v2 body、PostRatingDialog |
| `modules/user/model` | `UserGender` | `Data/UserGender.cs:3-7` | User/Session DTO、用户展示和 fallback |
|  | `UserState` | `Data/UserState.cs:6-34` | User/Session DTO、登录、发帖权限展示、用户处罚 |
|  | `UserTopicViewMode` | `Data/UserTopicViewMode.cs:6-26` | User/Session DTO、preference service、NewTopicsPage |
|  | `TargetWindow`、`UserRateState` | `Data/TargetWindow.cs:6-20`；`Data/UserRateState.cs:6-30` | 已导出；对应缺失 DTO 字段留待 Phase 3 补齐 |
|  | `ForumUserOperationType` | `Models/Manage/ForumUserOperationType.cs:3-16` | UserPunishmentForm request body |
| `modules/board/model` | `AnonymousState` | `Data/AnonymousState.cs:6-30` | Board DTO、EditorPage、TopicReplyComposer |
|  | `BoardInternalState` | `Data/BoardInternalState.cs:3-20` | Board DTO |
|  | `BoardPosterOnlyState` | `Data/BoardPosterOnlyState.cs:10-16` | 已导出；`allowPostOnly` 缺失字段留待 Phase 2 补齐 |
| `modules/notification/model` | `NotificationType` | `Data/NotificationType.cs:6-12` | ReplyAt/System notification DTO；不用于页面 section |
| `modules/site-content/model` | `ForumIndexColumnType` | `Data/ForumIndexColumnType.cs:6-48` | index DTO、SiteAdvertisementEditor |
|  | `ForumIndexColumnVisibility` | `Data/ForumIndexColumn.cs:89-95` | index DTO、SiteAdvertisementEditor |

## 2. enum / DTO 前后对照

| 协议面 | 修改前 | Phase 1 后 |
| --- | --- | --- |
| Topic 状态字段 | `number`；`TopicContentType` 内联且只有 0..4 | 对应 `TopicState/Type/TopState/BestState/AllowedViewerState/ContentType`；补 `Lottery = 5` |
| Post 状态字段 | `state/contentType` 为 `number`，like 为 `0 \| 1 \| 2` | `PostState`、`PostContentType`、`LikeState` |
| User/Session 状态字段 | `gender/lockState/topicViewMode` 为 `number` | 复用 user owner 的 `UserGender/UserState/UserTopicViewMode` |
| Board 状态字段 | `anonymousState/internalState` 为 `number` | `AnonymousState/BoardInternalState` |
| Notification `type` | `number` | `NotificationType` |
| Site content `type/visibility` | `number` | `ForumIndexColumnType/ForumIndexColumnVisibility`；热门主题 `type` 改为正确的 `TopicType` |
| service 请求参数 | rating、topic top、user view mode 等为无类型参数或数字 | 参数收窄为相应 enum，请求 wire 数值不变 |

本批只收窄已经存在的字段，没有补加后端 DTO 字段；因此 `TargetWindow`、`UserRateState`、`BoardPosterOnlyState` 当前只有 owner 导出，避免把 Phase 2/3 揉入本 diff。

## 3. 被替换的 magic number

| 协议 | 被替换位置 |
| --- | --- |
| Topic state/top/best | `BoardTopicListItem`、`BoardContent`、`BoardTopicToolbar`、`TopicManagementDialog`、`TopicPage`、moderation service |
| Topic/Post content | `TopicCard`、`EditorPage`、`TopicReplyComposer`、`TopicReplyContent`、`TopicReplyList` |
| Topic type | `EditorPage`、site-content topic 投影 |
| Like state | `TopicReplySignature` |
| Lottery status/mode | `TopicReplyContent` |
| Post/user operation、rating | moderation service、post-rating service/dialog、`UserPunishmentForm` |
| User gender/state/view mode | user fallback/profile、session authentication、board/topic 权限展示、`NewTopicsPage`、user-preference service |
| Board anonymous state | `EditorPage`、`TopicReplyComposer` |
| Forum index column type/visibility | `SiteAdvertisementEditor` 与 site-content model |
| Topic sort | followee topic query 的 `order=0` |

请求 URL、method、headers、body casing、调用顺序和错误处理均未改变；替换后的 enum 仍序列化为原数字。

## 4. 明确保留的非业务数字 / allowlist

| 保留项 | 理由 |
| --- | --- |
| `response.status` 的 200/400/401/402/403/404/500 | HTTP 状态码，不是业务 enum |
| Editor 与 TopicReplyComposer 的 `mode` 0/1 | 编辑器本地 UBB/Markdown UI mode；不冒充 `PostContentType` |
| Notification service 的 section 1/2/3 | 页面分区协议；不是 `NotificationType` |
| favorite topic `order=0/1/2` | Controller 接收裸 `int`，语义不等同 `TopicSortMode` |
| TopicCard `case 1..6` | 图片数量布局 switch，不是 enum |
| `SiteAdvertisementEditor.type = 0` | “尚未选择栏目”的本地 sentinel；后端 `ForumIndexColumnType` 从 1 开始 |
| `foundation/storage/web-storage.ts` 的 `lockState === 1 || 2` | 遗留存储基础层副作用边界；foundation 不能反向运行时依赖 user module。本批不移动 Storage/登录行为，登记待 Session/User 边界阶段处理 |
| dormant `modules/posting/api/service.ts` 的 `contentType: 1` | service 无真实消费者，不用不可达代码推断或扩张本批契约 |
| id、page/from/size/count/floor、阈值、日期格式 mode、DOM/CSS 数值 | 普通数值或本地显示协议 |

## 5. 已知不确定项

- `ITopic`、`IPost`、`IBoard` 的字段完整性、nullable 和加工字段仍按审计结果登记，Phase 1 未提前修改。
- `TargetWindow`、`UserRateState`、`BoardPosterOnlyState` 已建立准确 enum，但前端对应 wire 字段尚缺；移除“仅导出”状态的条件是 Phase 2/3 完成 DTO 对齐。
- `foundation/storage` 的锁定状态判断必须在不引入 foundation → module 反向依赖、且不改变清缓存/跳转时序的方案下才能移除数字。
- PostRatingDialog 的字符串 tab key `"0"/"1"/"2"` 是 Ant Design Menu 的本地选择状态；传给 API 的 query/body 已改为 `RatingType`。

## 6. 修改文件

| 类别 | 文件 |
| --- | --- |
| enum owner | `src/modules/{topic,post,user,board,notification,site-content}/model/enums.ts` |
| model 与出口 | 六个 owner 的 `model/types.ts`（notification/site-content/topic/post/user/board）和 `index.ts`；`src/modules/session/model/types.ts` |
| service 边界 | `modules/moderation/api/service.ts`、`modules/post-rating/api/service.ts`、`modules/topic/api/service.ts`、`modules/user-preference/api/service.ts`、`modules/user/api/service.ts`、`modules/session/api/authentication.ts` |
| 消费者 | board、editor、new-topics、site-management、topic detail、user profile 下本报告第 3 节所列 UI 文件 |
| 审计记录 | `docs/api-contract-alignment/read-only-audit.md`、本文件 |

逐文件状态以人工审核时的 `git status --short` 为准；没有修改主后端，没有 commit/push。

## 7. 机械检查与未执行验收

最终命令结果：

- `npm run typecheck`：通过。
- `npm run build`：通过；沙箱内首次运行因 Vite 子进程 `spawn EPERM` 失败，获准后在沙箱外原样复跑成功。构建仍输出既有 legacy CSS hack 和 chunk size warning，exit code 为 0。
- `git diff --check`：通过；只有 Git 的 LF→CRLF working-copy 提示，无 whitespace error。
- `git status --short`：仅本批前端修改与新增文件；主后端 status 仍为空。
- 目标 magic number：扫描剩 2 处，恰为第 4 节 allowlist 的 dormant posting `contentType: 1` 与 foundation storage `lockState === 1 || 2`；其余目标命中为 0。
- 废弃后端项目名称引用：在前端源码、文档和脚本范围内为 0。
- `npm run check:architecture`：当前 `package.json` 无此 script，不属于用户规定的最低命令；已记录为不可用，不以其替代 typecheck/build。

未启动主后端，也未执行真实 API、登录态、权限、通知、主题、编辑器或浏览器交互验收；机械检查通过时也不声明这些项目已验收。
