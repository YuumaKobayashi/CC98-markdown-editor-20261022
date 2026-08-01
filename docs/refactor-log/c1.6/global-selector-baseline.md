# C1.6.0 业务 `:global(...)` 基线清单

## 范围与方法

本批只重新生成并冻结 C1.5 终态的业务 global 基线，不移动样式、不改 selector、不改 DOM、组件 props、脚本查询、Router、API、Redux、Storage、主题或视觉值，也不提前实施 C1.6.1。

审计覆盖：

- `src` 中全部 `*.module.scss`，逐项提取 `:global(...)` 并保留重复出现次数；
- `src` 与根 `Components` 的 CSS Module 默认导入，确认实际样式 consumer；
- `src`、`Components`、`Pages`、`Template.ejs` 与 `public` 中的固定 `className`、`id`、动态字符串和第三方组件，追踪 DOM producer；
- jQuery、`querySelector`、`getElementById`、`getElementsByClassName`、`classList`、原生事件/ref、React Router 状态和通知显隐逻辑，区分视觉 selector 与行为查询合同；
- C1.5 风险登记中的 Portal、UBB/Markdown、Ant Design、休眠 producer 与仓外合同边界。

C1.6.0 结果为 42 个真实 CSS Module 中有 16 个文件包含合计 120 处 `:global(...)`。`global(fadeIn)`、`global(fadeOut)` 是 CSS Modules 动画值转义，不计入 selector 基线。下表保留 C1.6.0 历史快照；机器基线位于 `scripts/style-global-baseline.json`，已随 C1.6.3 更新为当前 59 个真实 CSS Module、10 个文件和 47 处 selector。`npm run check:styles` 会校验文件集合、逐文件出现次数和按源码顺序计算的 selector 指纹，禁止未登记新增或静默改写。

## Selector / producer / consumer / 行为查询清单

| 当前样式 owner | 基线 | Selector（重复项标乘数） | DOM producer 与样式 consumer | 行为查询/状态合同 | 后续归属 |
| --- | ---: | --- | --- | --- | --- |
| `application/routes/board/Board.module.scss` | 1 | `.ant-pagination-options-quick-jumper` | Ant Design `Pagination` 生成内部 DOM；Board Module 有 7 个 Route 组件 importer，规则受本地 `.board-pagination` 限定 | 本仓没有按该 class 查询 DOM；属于第三方 DOM 结构合同 | C1.6.5 复核后移交 C1.7 第三方边界 |
| `application/routes/editor/EditorLegacyForm.module.scss` | 1 | `.createTopicBoardName` | 5 个 Editor/legacy importer 保证 chunk 加载；仓内 TS/TSX、模板与静态入口未找到当前 producer | 未找到行为查询；属于休眠/仓外 producer 候选，不能据此删除 | C1.6.4 独立休眠规则审计 |
| `application/routes/editor/EditorTopic.module.scss` | 10 | `#sendTopic`、`#sendTopic-options`、`#sendTopic-input`、`.editor__menu`×2、`.editor__menu--bold`、`.wmd-spacer1`、`#sendTopic-send`、`#quoteOverflow`、`.userDetails` | 仅 `EditorPage` 直接导入；仓内 TS/TSX、模板与静态入口未找到这些固定 producer，可能来自冻结 UBB/editor 或历史 DOM | 未找到本仓按这些 selector 的活动查询；不得为维持样式制造空 DOM | C1.6.4 审计固定 ID/休眠项；第三方或 UBB DOM 移交 C1.7 |
| `application/routes/legacy-board-list/LegacyBoardList.module.scss` | 1 | `#commentsAmount` | `LegacyBoardTopicItem` 固定生产；同一 Module 有 3 个 Legacy Board importer | 没有按该 ID 查询；当前是纯视觉 ID | C1.6.4 改为 producer 自有 class |
| `application/routes/legacy-board-list/LegacyBoardListItemTail.module.scss` | 3 | `#disliked`×2、`#changeTopColor` | `LegacyBoardTopicItem` 固定生产 `disliked`，并按 `topState` 在 `changeColor`/`changeTopColor` 间选择；该组件是唯一 importer | 高亮另以动态 `#title${id}` 执行 jQuery 样式写入，不能与这三个视觉 ID 混为同一合同 | C1.6.4 本地 class/状态映射 |
| `application/routes/legacy-board-list/LegacyBoardRoot.module.scss` | 1 | `#boardTopics` | 3 个 Legacy Board importer；仓内 TS/TSX、模板与静态入口未找到 producer | 未找到行为查询，属于休眠/仓外合同候选 | C1.6.4 独立审计，不猜测删除 |
| `application/routes/login/Login.module.scss` | 1 | `#loginMessage` | `LoginPage` 固定生产并同时使用局部 `login-message` class；该页是唯一 importer | 登录反馈由 React state 更新；摇动动画通过 element ref 与局部 Module class 控制，不查询该 ID | C1.6.4 删除视觉 ID 依赖，保留确有外部合同才保留 ID |
| `application/routes/message-center/MessageCenter.module.scss` | 31 | `.active`、`.message-right`、`.message-message-person`、`.message-message-pPortraitUrl`、`.message-message-pInfo`、`.message-message-pName`、`.message-message-pMessage`、`.message-counterPerson`、`.message-message-wc`、`.message-message-wcTime`、`.message-message-wcSender`、`.message-message-wcPortraitUrl`×2、`.message-message-wcContent`×5、`.message-message-wcReceiver`、`.message-message-wcText`、`.message-system-box`、`.message-system-box-bar`、`.message-system-box-title`、`.message-system-box-date`、`.message-system-box-content`、`.message-response-box`、`.message-response-box-middle`、`.message-response-box-middle1`、`.message-response-box-middle-title`、`.message-response-box-middle-date`、`.message-response-box-middle-content` | 7 个 Message Route importer；固定类由 `modules/message` 的 `MessagePerson`/`MessageSender`/`MessageReceiver` 和 `modules/notification` 的 system/response/att-me box 生产；`.message-right` 同时有 Route 局部 producer；当前导航状态由 `MessageLayout` 计算 `message-nav-focus`，未找到 `.active` 字符串 producer | 消息/通知组件未按这些固定 class 查询；未读/路由状态走 Redux 与 pathname。`.active` 是历史 Router 状态边界，当前 producer 需在拆分批确认 | C1.6.1 下沉到 Message/Notification 组件；Route 只留编排 |
| `application/routes/message-center/MessageSettings.module.scss` | 4 | `.message-setting`、`.message-settingbox`、`.radioTitle`、`.message-setting-btn` | 唯一 importer 为 `MessageSettingsPage`；固定类全部由 `modules/notification/ui/MessageSetting` 生产 | 组件用 jQuery 查询 radio 的固定 ID/name/checked 状态，不按这四个视觉 class 查询；迁移不得改这些表单合同 | C1.6.1 下沉到 Notification `MessageSetting` |
| `application/routes/new-topics/NewTopics.module.scss` | 1 | `.ant-collapse-content-box` | Ant Design `Collapse.Panel` 生成内部 DOM；3 个 New Topics importer，规则受本地 collapse 根限定 | 本仓没有按该 class 查询；播放器与 sticky 查询是其他独立合同 | C1.6.5 复核后移交 C1.7 第三方边界 |
| `application/routes/search/Search.module.scss` | 1 | `.displaynone` | Board/Topic Search 两个 importer；Topic Search 在空/错状态把全局 `displaynone` 与局部结果根组合 | 状态来自 React `status`，没有 DOM 查询；这是 Route 自身状态，不应长期依赖全局工具 class | C1.6.4 改为局部状态 class/条件表达 |
| `application/routes/topic/TopicDetail.module.scss` | 40 | `#authormes`、`#authorName`×2、`#fans`、`#title`、`#topicTitleProp`、`#essay1`、`#essayTitle`、`#essayProp`、`#like`、`#tags`、`#essayGrow`、`#onlike`、`#time`×2、`#viewtimes`、`#followCount`、`#liked`、`#ads`×2、`#commentlike`、`#commentliked`×2、`#commentunliked`×2、`#checkbox`、`#option1`、`#replierMes`×2、`.reply-floor`×2、`.reply-floor-lz`、`.reply-floor-small`、`#clockimg`、`#operation`、`#rpymes`、`#ListImg`、`#noticeName`、`#topicsNumber`、`#pager` | 6 个 Topic Detail importer；活动 producer 包括 `TopicHeader`、`TopicReplySignature`、`TopicReplier` 与 `modules/post/ui/FloorSize`；`Components/Topic/Post` 仍生产 `checkbox`/`option1`；其余若干固定 ID 在当前仓内无活动 producer | Topic 页面脚本查询的 `#sendTopicInfo`、回复动态 ID、hash 楼层和图片 class 与本表固定视觉项分属不同合同；迁移必须逐 producer 核对，不可批量删 ID | C1.6.2 按 Post/Topic/FloorSize/Header/Reply 子组件拆分；无 producer 项独立冻结审计 |
| `application/routes/topic/TopicNotices.module.scss` | 2 | `.send-topic-notice-success`、`.send-topic-notice-success.noticeDisplaynone` | `foundation/ui/feedback/NoticeMessage` 固定生产第一项并组合全局 `displaynone`；唯一样式 importer 为 `TopicReplyComposer` | Notification service 通过通知节点动态 ID 添加/移除 `noticeDisplaynone`，直接控制 3 秒 fade-out；这是明确行为合同 | C1.6.1/C1.6.2 边界批共同确认 owner，迁移时保持 ID 与 class 切换时序 |
| `application/routes/user-center/UserCenter.module.scss` | 18 | `.user-post-info`×2、`.user-post-board`、`.user-post-date`、`.user-post-like-count`、`.user-post-content`、`.fa-thumbs-o-up`、`.fa-thumbs-o-down`、`.user-center-myfollowings-user`、`.user-follow`、`.user-message`、`.user-center-myfollowings-user-id`、`.user-center-myfollowings-user-posts`、`.user-center-myfollowings-user-fans`、`#selector`、`#resize`、`#cover`、`#userCenterPageCount` | 25 个 User Center/Profile/legacy importer；固定类由 `UserRecentPostItem`、`UserRecentTopicItem`、`UserCenterFavoriteTopicItem`、`UserFollowCard` 生产；头像三个 ID 由 `UserCenterAvatarSettings` 生产；分页 ID 由 `UserCenterPager` 生产；Font Awesome 两项只存在于注释 producer | 头像逻辑通过 refs 绑定原生鼠标监听，并用节点 `id` 区分 move/resize；分页与共享卡片 class 无 DOM 查询。头像迁移必须先把行为身份与视觉 class 分离 | C1.6.3 下沉到 Post/Topic/Follow/Avatar/Pager owner；注释/休眠 Font Awesome 项单独审计 |
| `modules/user/ui/ConfigSignature.module.scss` | 1 | `#signature` | `ConfigSignature` 唯一 producer/importer | 表单由 React value/onChange 控制，不按 ID 查询；仍需确认可访问性/仓外合同后再决定是否删 ID | C1.6.3 改为组件局部 class，必要时保留非视觉 ID |
| `modules/user/ui/UserProfile.module.scss` | 4 | `#userId`、`#unfollow`、`#userIntroducion`、`#userGenderAndBirthday` | `modules/user/ui/UserProfile` 与 `UserProfileDetails` 两个 producer/importer | 关注状态由 React 条件 ID 表达但没有 DOM 查询；其余为固定视觉 ID。不得顺手修正既有 `userIntroducion` 拼写 | C1.6.3 改为组件局部 class/状态映射 |

## 数量闭包

| 文件 | `:global(...)` 数量 | CSS Module importer 数量 |
| --- | ---: | ---: |
| `Board.module.scss` | 1 | 7 |
| `EditorLegacyForm.module.scss` | 1 | 5 |
| `EditorTopic.module.scss` | 10 | 1 |
| `LegacyBoardList.module.scss` | 1 | 3 |
| `LegacyBoardListItemTail.module.scss` | 3 | 1 |
| `LegacyBoardRoot.module.scss` | 1 | 3 |
| `Login.module.scss` | 1 | 1 |
| `MessageCenter.module.scss` | 31 | 7 |
| `MessageSettings.module.scss` | 4 | 1 |
| `NewTopics.module.scss` | 1 | 3 |
| `Search.module.scss` | 1 | 2 |
| `TopicDetail.module.scss` | 40 | 6 |
| `TopicNotices.module.scss` | 2 | 1 |
| `UserCenter.module.scss` | 18 | 25 |
| `ConfigSignature.module.scss` | 1 | 1 |
| `UserProfile.module.scss` | 4 | 2 |
| **合计** | **120** | **69 次显式默认导入** |

Importer 数量按文件静态导入计数，表示样式加载入口，不表示每条 global selector 都有活动 producer。无 producer 或第三方 producer 的项已在上表单独标记，后续必须先复核运行边界，不能用 importer 存在替代 selector consumer 证明。

## C1.6.1 Message/Notification 收口

- 删除 `MessageCenter.module.scss` 的 31 处和 `MessageSettings.module.scss` 的 4 处 global；当前基线从 16 个文件/120 处降为 14 个文件/85 处，Message/Notification 范围没有新增 `:global(...)`。
- Route 样式拆到 Message Layout、私信列表和私信窗口；Message producer 样式归入联系人与共享收发气泡 Module；Notification producer 样式归入系统通知、共享回复/@通知及消息设置 Module。原两份总样式由 8 个真实 owner Module 替代，CSS Module 总数从 42 增至 48。
- NavLink 当前态和未读计数改由 Message Layout 局部映射；私信加载、完成、错误、提示和消息时间/未读点使用原生 `hidden`，不再依赖消息范围内的全局 `displaynone`。`message-nav-focus`、React Router `.active` 和 Foundation `.message-counterNav` 不再作为业务全局样式合同。
- radio 固定 ID/name/checked 与 jQuery 查询、通知提示 ID、`displaynone`/`noticeDisplaynone` class 切换及定时器、消息动态 ID、URL、UBB options、API、Redux、Storage、Router 和 DOM 层级均未改；`TopicNotices.module.scss` 留待 C1.6.2/C1.7 既定边界。
- 未确认仓外 producer 的 `.message-message-wcRead1`/`.message-message-wcRead2` 及原注释规则保留在私信窗口 Module，没有制造 DOM 或空锚点；浏览器、真实 API/权限、主题和响应式验收仍待执行。

## C1.6.2 Topic/Post 收口

- `TopicDetail.module.scss` 删除活动 Topic Header 8 处、Reply Signature `#commentlike` 1 处和 FloorSize 4 处 global；Header、Replier、Reply Signature、Reply List、Vote 与 FloorSize 各自由 producer 直接消费局部映射，固定 Header/`commentlike`/动态楼层 ID 及公开接口保持。
- 当前 `TopicDetail.module.scss` 冻结 27 处：`#authormes`、`#authorName`×2、`#fans`、`#title`、`#essayTitle`、`#like`、`#essayGrow`、`#onlike`、`#liked`、`#ads`×2、`#commentliked`×2、`#commentunliked`×2、`#checkbox`、`#option1`、`#replierMes`×2、`#clockimg`、`#operation`、`#rpymes`、`#ListImg`、`#noticeName`、`#topicsNumber`、`#pager`。`Components/Topic/Post` 仍生产 `checkbox`/`option1` 但没有活动调用点，其余未找到活动 producer；这些规则继续随 Reply Content 的真实 Module 消费加载，留待 C1.6.5 的仓外/休眠审计，不制造 producer、不猜测删除。
- 删除 `TopicNotices.module.scss` 的 2 处 global；`SendTopicNoticeMessage` 由 Foundation 自有 Module 生产局部根，并以局部根的 `[class~="noticeDisplaynone"]` 匹配原 Notification service 状态。固定/动态 ID、全局 `displaynone`、1ms class 切换、3 秒 `fadeOut` 及 `animation-fill-mode` 不变，值级 `global(fadeOut)` 留待 C1.7 动画边界收口。
- 当前基线从 C1.6.1 的 14 个文件/85 处降为 13 个文件/70 处，CSS Module 总数从 48 增至 53；活动 Topic/Post 目标范围没有新增 selector 级 `:global(...)`，机器基线同步记录 `TopicDetail.module.scss` 的 27 处及新指纹。
- 浏览器运行时没有可用实例；默认/暗色主题、普通/追踪 Topic、FloorSize、投票、赞踩、签名、Markdown、通知、真实 API/权限、响应式和前进后退仍待执行，不能由机械检查替代。

## C1.6.3 User/Post/Topic 共享卡片与 User Center/Profile 收口

- `UserRecentPostItem`、`UserRecentTopicItem` 与 `UserCenterFavoriteTopicItem` 分别直接导入并消费自有 Module；卡片信息栏、版面、时间、赞踩计数和正文不再由 User Center Route 反向命中。Route 仍拥有列表、分隔线和操作栏编排，没有扩展组件 props 或模块公开导出。
- `UserFollowCard`、`UserCenterAvatarSettings` 与 `UserCenterPager` 分别接管卡片、头像裁剪器和分页样式。头像 `cover`、`selector`、`resize` 的固定 ID、refs、原生监听及按 ID 区分拖动/缩放的行为保持，只增加局部视觉 class；纯视觉 `userCenterPageCount` ID 已删除。
- `ConfigSignature`、`UserProfile` 与 `UserProfileDetails` 改为组件局部 class；无脚本、可访问性或锚点消费者的 `signature`、`userId`、`unfollow`、`userIntroducion`、`userGenderAndBirthday` 视觉 ID 已删除，既有 `userIntroducion` 拼写未改。三个 recent-item JSX 中的 Font Awesome 注释保持原样，仅删除没有活动 producer 的两条休眠样式。
- User 范围 23 处 selector 级 `:global(...)` 全部清零，当前基线从 13 个文件/70 处降为 10 个文件/47 处，真实 CSS Module 从 53 增至 59；没有新增 global，机器基线保留其余 10 个文件的既有 selector 指纹。
- 浏览器连接器没有可用实例；默认/暗色主题、用户中心概览/帖子/主题/历史/收藏/关注/粉丝/设置、公开用户主页、头像拖动/缩放/上传、分页前进后退、真实 API/权限和响应式仍待执行，不能由机械检查替代。

## 冻结与停点

- C1.6.0 不删除任何休眠规则，也不为无 producer 规则制造节点或空锚点。
- 后续每个 C1.6 子批必须同步更新机器基线与本清单，并解释数量减少、owner 改变及行为查询是否迁移；只减少数字不构成验收。
- 本批没有执行浏览器视觉、主题切换、真实 API、权限、Portal、UBB/editor 或跨 Route 运行验收；机械检查不能替代这些场景。
- C1.6.0 已提交为 `bee0dd05`，C1.6.1 已提交为 `61b4d5db`/`ff9702be`；C1.6.2 用户人工审核通过后，代码已提交为 `ad1db0e7`，本清单随单独文档 checkpoint 提交。C1.6.3 用户人工审核通过后，代码已提交为 `788da9e7`，本清单随单独文档 checkpoint 提交；未 push，不自动启动 C1.6.4、C1.7 或 Z。
