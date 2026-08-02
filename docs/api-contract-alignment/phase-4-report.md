# Phase 4：Service 类型闭包与剩余类型债务

审计日期：2026-08-03

本报告只覆盖 Phase 4。wire 契约源固定为主后端 `master` 的 `c46f2fa4d340c606b42764a05d106f178d91bc3c`；未修改或启动后端，未读取同级废弃项目。Phase 3 经用户明确通过后才开始本批。

## 1. 结论

- 28 个 `api` 目录 TypeScript 文件中的所有可达导出函数均已有显式参数和返回类型；静态 AST 门禁结果为 `reachableDebt=[]`，没有可达的隐式参数、缺失显式返回类型或推导 `Promise<any>`。
- 所有可达 `response.json()` 已在读取边界约束 raw DTO。未约束的 6 个边界全部属于既有 dormant 函数，未因本批修改 URL、导出或可达性。
- Topic vote、Message、Favorite Topic、Moderation、Post Rating、Wealth 和通用分页包装均已建立 owner 类型；nullable、字符串/数字哨兵、`Response`、`null/undefined` 和异常吞噬按现有运行时协议保留。
- 重复且零引用的旧类型出口已删除或合并；仍有消费者的 `IUser/ITopic/IPost/IBoard/ISignIn` 兼容出口继续保留。
- 全仓剩余显式 `any/unknown` 已逐项登记在第 6 节。本批没有扩张到 UI、Redux、路由、播放器、编辑器插件、storage 或 dormant service 重构。

## 2. Service 闭包与 dormant 清单

静态门禁扫描 28 个 `api` 目录 TypeScript 文件、162 个导出函数声明（重载声明分别计数）。19 个 dormant 出口全部仍存在：

| owner | dormant 导出 | 保留原因与移除条件 |
| --- | --- | --- |
| Foundation HTTP | `getApiUrl` | 无活动消费者；只有单独完成调用图及固定入口审计后才能删除。 |
| User | `getUserDetails`、`getPortraitUrl` | 无活动消费者；不以其中 URL 补建 wire 契约。 |
| Board | `syncGetBoardNameById`、`getBoardId` | 无活动消费者；保留 legacy cache 读取及既有返回形状。 |
| Topic | `getCurUserTopic`、`getCurUserTotalReplyPage`、`getAnonymousTraceTopics`、`getPostInfo`、`getBasicPostsInfo`、`getThisPostInfo` | helper 无活动消费者；匿名追踪 endpoint 在固定后端也已注释，不改变双重不可达状态。 |
| Post Rating | `getAwardInfo`、`plus1`、`minus1` | 无活动消费者；不删除、不补写其响应合同。 |
| Posting | `sendTopic`、`editPost` | 无活动消费者；不改变导出或请求实现。 |
| Upload | `clickUploadIcon` | 无活动消费者；不改第三方上传触发边界。 |
| Reaction | `getLikeStateAndCount`、`getLikeState` | 无活动消费者；保留未约束 JSON 和原返回协议。 |

未约束的 dormant `response.json()` 精确位于 `modules/board/api/service.ts:121`、`modules/post-rating/api/service.ts:80`、`modules/reaction/api/service.ts:95,118`、`modules/topic/api/service.ts:217`、`modules/user/api/service.ts:132`。其余可达 JSON 边界均有 raw 类型。

## 3. 新增或收口的公开合同

| owner | 合同 | 对齐结果 |
| --- | --- | --- |
| Foundation API | `ResultWithCount<T>` | 使用后端完整 `data/count/from/size/extra/errorCode` 包装，`data` 与 `extra` 正确 nullable；收藏分组、浏览历史、管理历史复用。 |
| Topic | `VoteInfo/VoteItem/VoteRecord`、`TopicBasicLookupFallback` | `voteRecords` 与 `myRecord` 正确 nullable；页面私有 vote 类型已移入 Topic owner。 |
| Message | `MessageInfo`、`RecentContactUserInfo`、`MessageViewModel` | raw DTO 与原地追加的 `showTime/message/lastContent` 分离；消息排序和联系人加工顺序不变。 |
| Favorite Topic | `FavoriteTopicGroup`、`FavoriteTopicOrder` | 收藏分组使用分页包装；排序不再误复用 `TopicSortMode`。 |
| Moderation | `PostWithIpInfo`、`TopicManageHistory`、`ModerationResult` | IP 信息、管理历史包装和原字符串结果显式化。 |
| Post Rating | `RatingReason`、`PostOperationResult` | 评分标签 raw 数组与既有操作结果显式化。 |
| Wealth | `RewardDailyRecordInfo`、`RewardType` | 查询结果正确建模为 nullable；转账成功用户名数组显式化。 |
| Editor/Post | `EditorTopicRequest`、`EditorPostRequest`、`NewPostInfo`、`PostLikeInfo` | 发帖、回帖、编辑、投票各用对应请求 DTO；`atUsers` 收窄为字符串数组。 |

`EditorPostRequest.tag1/tag2` 暂保留 `number | false`：既有异步标签查询可能把 `false` 原样写回并交给 `JSON.stringify`。本批不改变 body；只有后端与 UI 一起建立失败分支后才能进一步收窄。

## 4. 消费者收窄与行为审核

- 未修改 endpoint、HTTP method、Headers、query、`JSON.stringify` 输入、status 分支、异常吞噬、Redux/Storage、缓存键或请求时机。
- Board 列表继续把字符串失败哨兵写入既有宽类型 state 并按原分支展示；分页、默认值和数组顺序不变。
- Message 继续原地追加展示字段，时间间隔判定、联系人补入和排序逻辑不变。
- Topic 列表仍按原顺序原地补充用户、版面、标签和媒体信息；新增 staged 类型只描述这个既有加工过程。
- 财富接口返回 `null` 时保留页面当前默认额度；版面名继续来自当前 `BoardInfo`，不再假定 nullable 响应含有后端不存在的 `boardName`。
- `Response`、`null`、`undefined`、布尔值、`0/-1` 和字符串错误哨兵均保留在公开联合返回类型中，没有统一错误处理或包装异常。

## 5. 重复类型出口清理

- Message 的 `MessageProps/IMessageContent/IRecentMessage` 已合并为 owner 中的 raw DTO、ViewModel 和组件模型，旧 `MessageProps.ts` 删除。
- Topic 页面私有 vote interface 已删除，消费者统一使用 Topic owner 的 `VoteInfo`。
- 零引用的 `IBasicUser`、`IBoardGroup`、`RandomTopic` 已删除；实际消费者改用明确 owner 类型。
- 零引用的旧 Site Content `IConfig` 与 `IRecommendationReading` 已删除，其中 `recommendationFunction: any[]` 随重复合同消失。
- `BoardEvent` 从 Route 私有文件迁入 Board owner；旧 Route 类型文件删除。
- `IUser/ITopic/IPost/IBoard/ISignIn` 仍有兼容消费者，继续保留，不作无授权清理。

## 6. 剩余 `any/unknown` 台账

下表登记当前 `src` 中所有语义上的显式 `any/unknown`；注释、JSDoc 文本和字符串字面量不计。相同 owner、同一来源和同一移除条件的命中合并为一行，但位置逐项列出。

| 位置 | 来源与消费者 | 保留原因、风险和移除条件 |
| --- | --- | --- |
| `modules/board/api/service.ts:120`；`modules/topic/api/service.ts:218,741,1018` | dormant Board/Topic helper | 无消费者且返回投影不可靠；风险被不可达性隔离。只有重新启用并逐 endpoint 对齐后移除。 |
| `modules/board/cache/board-cache.ts:12,16,20,39`；`modules/topic/cache/tag-cache.ts:13`；`modules/posting/drafts/draft-storage.ts:22` | JSON/localStorage/cache 泛型边界 | 存量缓存可能来自旧版本，伪造确定 DTO 会隐藏兼容风险。需独立 storage 版本化、迁移和运行时校验后收窄。 |
| `foundation/storage/web-storage.ts:4,48`；`foundation/theme/runtime/index.ts:223` | 全站 legacy Storage API 及主题读取 | 公共桥接承载异构值；错误类型会跨 owner 扩散。需按 key 建立 schema/泛型映射并迁移全部消费者。 |
| `modules/session/sync/session-sync.ts:37,41`；`foundation/lib/legacy-utility-effects.ts:9,11,31,39` | Redux thunk 与 legacy 副作用桥接 | 旧 Dispatch/Store 签名不完整；风险是 action 形状未校验。需统一 AppDispatch 和移除 legacy bridge 后收窄。 |
| `application/router/legacy-route-props.tsx:16,17,53,54`；`application/router/app-router.tsx:18,23,35` | React Router lazy module/legacy HOC | 模块导出和 navigation state 天生动态；错误 key 在运行时暴露。需建立逐 route module map 并删除 legacy HOC 后收窄。 |
| `application/providers/cross-tab-sync.tsx:29,35`；`application/providers/create-app-root.tsx:17` | React 元素兼容签名 | 保留任意 props 元素以承接当前 provider 链。可在 React root/provider 公共合同独立收口后改为更窄节点类型。 |
| `modules/ubb-editor/utility.ts:64,71`；`modules/ubb-editor/IConfig.ts:93`；`modules/ubb/tag/AudioTagHandler.tsx:3,42`；`modules/ubb/tag/BiliTextHandler.tsx:58`；`modules/ubb/tag/BiliTagHandler.tsx:83`；`modules/ubb/tag/MathTagHandler.tsx:97`；`modules/ubb/tag/VideoTagHandler.tsx:38,48` | jQuery Spectrum、APlayer、Hls、DPlayer、动态 UBB 插件 | 第三方全局实例或插件 payload 缺少稳定声明；伪造 DTO 会掩盖真实动态行为。需升级/补齐第三方声明并逐插件验收。 |
| `modules/topic/ui/TopicVideoPlayer.tsx:27`；`modules/topic/ui/TopicAudioPlayer.tsx:23`；`modules/topic/model/types.ts:260,296` | 动态媒体播放器与 `mediaContent` | 内容随 UBB/media 类型变化；风险为运行时形状错误。需建立 discriminated union 并覆盖播放器分支后收窄。 |
| `modules/topic/ui/TopicAwardInfo.tsx:6,11`；`application/routes/board/ui/BoardActionsAndAdvertisement.tsx:14` | 未闭合 UI props | 上游仍传递混合标识或动态广告值；需在对应 UI owner 批次追踪所有 producer 后移除。 |
| `modules/notification/ui/MessageSystembox.tsx:17`；`MessageAttmebox.tsx:17`；`MessageResponsebox.tsx:17` | 通知楼层临时计算变量 | 实际为数值但不属于 service 闭包；风险低。可在通知 UI 类型清理批次直接改为 `number`。 |
| `modules/moderation/ui/PostManagementDialog.tsx:109`；`TopicManagementDialog.tsx:55,56,62,65,66` | 版务弹窗表单和列表 state | Ant Design 表单/树选择值尚未建模；错误值可能推迟到请求前才暴露。需先闭合组件事件和值域。 |
| `application/routes/new-topics/ui/RandomRecentTopics.tsx:17,18,43,82`；`NewTopicsBoardSidebar.tsx:37,65,145,163` | New Topics 页面本地聚合数据 | 直接 UI fetch 与分组投影未归入本批 service；需建立 route ViewModel 后收窄。 |
| `application/routes/home/ui/HomePage.tsx:56,69`；`Announcement.tsx:5`；`AnnouncementComponent.tsx:5` | 首页缓存和站点内容 UI | 首页缓存是异构持久化对象，公告 props 未建模；需独立首页 DTO/cache 迁移。 |
| `application/routes/daily-signin/ui/ReSignCalendar.tsx:24` | 补签日历 state | 直接 UI fetch 返回尚未形成 owner DTO；需迁入 Daily Signin service 并做真实 API 验收。 |
| `application/routes/editor/ui/HousingTemplateDialog.tsx:18`；`EditorVoteSettings.tsx:33`；`EditorTagNotice.tsx:8`；`EditorPage.tsx:54,61,65,282` | 编辑器表单、路由 state 和提交结果 | 动态表单值与编辑/发帖多模式共享页面；错误类型影响编辑器交互。需编辑器 UI 专项重构，不在请求边界批次强制断言。 |
| `application/routes/board/ui/BoardBatchManager.tsx:24,25`；`BoardFooterActions.tsx:26`；`BoardContent.tsx:27,28,46,47`；`BoardModerationRecordList.tsx:23`；`BoardTopicPreviewCard.tsx:19`；`BoardTopicListItem.tsx:98,99,100,120` | Board 页面 selection、列表、错误哨兵和样式临时值 | 一个 state 同时承载数据与字符串失败哨兵，另有 AntD 选择值；需先拆 union/ViewModel，不能在本批改变错误展示。 |
| `application/routes/topic/detail/model/quote-context.ts:7,8`；`TopicPage.tsx:39-46,48,49,75,170-174`；`TrackedTopicPage.tsx:31-37,147-151` | Topic Detail class state、route 参数、引用上下文 | legacy 页面合同跨路由、分页、追踪模式；错误类型可能遮蔽调用链。需 Topic Detail 页面专项 owner 收口。 |
| `application/routes/topic/detail/ui/TopicReplier.tsx:11-15`；`TopicReplyList.tsx:36`；`TopicReplyComposer.tsx:558`；`TopicReplySignature.tsx:22-31,63`；`TopicHeader.tsx:20-24` | Topic Detail 组件 props/callback | 由上项 legacy 页面宽合同向下传播；需与页面 state 一次性收窄，避免局部伪造类型。 |
| `application/routes/topic/detail/ui/TopicAwardList.tsx:11-13,18,46` | 旧评分列表和批量用户加工 | 仍走 dormant 评分 helper 的旧投影；需先重新启用并对齐评分 endpoint 或删除整条不可达消费者链。 |
| `application/routes/site-management/ui/SiteAdvertisementEditor.tsx:45` | 动态表格单元格编辑值 | 值由列类型决定；需建立列 key 到值类型的映射后收窄。 |
| `foundation/lib/time.ts:28,32,36,40,44,69,91,95` | legacy 时间格式化的数字/字符串复用变量 | `any` 承载补零前数字和补零后字符串；风险局限于格式化。需改为独立格式化变量并回归所有时间展示。 |
| `foundation/lib/async.ts:2` | 通用 debounce options | 第三方风格动态 options 未声明；需定义选项 interface 并补全隐式 `fn/wait`，属 Foundation 清理。 |

直接写在 UI/Foundation 且不经过相关 service 的未约束 JSON 边界也按范围约束登记：`foundation/config/runtime-config.ts:45`、`application/routes/user-profile/manage/ui/DeleteRecentUserContent.tsx:45`、`application/routes/user-center/settings/ui/UserCenterProfileSettings.tsx:35`、`application/routes/daily-signin/ui/ReSignCalendar.tsx:53,83,102`、`application/routes/topic/detail/ui/TopicReplier.tsx:96`。它们不迁移、不改造；移除条件是分别进入所属 owner 的 service/DTO 批次并完成真实接口验收。

## 7. 机械检查与未执行验收

- `npm run typecheck`：通过。
- `npm run build`：通过，共转换 4130 个模块；沙箱内首次因 Vite 子进程 `spawn EPERM` 失败，获准后在沙箱外原样复跑成功。仍输出既有 legacy CSS hack、plugin timing 与 chunk size warning，exit code 为 0。
- AST service 门禁：28 个 API 文件、162 个导出声明；`reachableDebt=[]`，19 个 dormant 全部命中且集合不变。可达 API 内显式 `any/unknown` 为 0；6 个未约束 JSON 边界全部属于 dormant。
- `git diff --check`：通过；只有 Git 的 LF→CRLF working-copy 提示，无 whitespace error。
- `git status --short --untracked-files=all`：仅包含 Phase 4 源码、两个旧类型文件删除、总审计和本报告；没有构建产物或其他意外生成物。
- 对 65 个现存受影响文件逐字节检查：混合换行与缺失 EOF 换行均为 0；既有 `MessagePersonInfo.ts` UTF-8 BOM 保持不变，其余文件无新增 BOM。
- 固定主后端当前仍为 `c46f2fa4d340c606b42764a05d106f178d91bc3c` 且工作树干净；前端审计和实现未引用或读取同级废弃后端项目。

未启动主后端，也未执行真实 API、登录态、权限、私信、通知、投票、收藏、版务、评分、财富、主题或浏览器交互验收；机械检查通过时也不声明这些项目已验收。当前停在人审点，不自动提交、推送、删除 dormant service 或开始后续阶段。
