# Z1 source → destination 清单

基线：`dev20260716@2fb2a54f`

## 1. `@types/@cc98` ambient 合同

| 原声明 | 目标 owner | 结果 |
| --- | --- | --- |
| `IBoard`、`IBoardGroup`、`IBoardMasterTitle` | `modules/board` | 按原字段、可选性和注释迁移 |
| `IBasicTopic`、独立 `IHotTopic`、`ITopic`、`ITag/ITagGroup` | `modules/topic` | 按原字段、字面量和注释迁移 |
| `IAward`、`ILike/ILikeState`、`IPost` | `modules/post` | 保留六个未知字段的 `any` |
| `IBasicUser`、`IUser` | `modules/user` | 不与 `UserInfo` 或 `CurrentUser` 强行合并 |
| `IMessageContent`、`IRecentMessage` | `modules/message` | 与既有 Message DTO 同 owner |
| `ISignIn` | `modules/daily-signin` | 原样迁移；不覆盖活动页面的冲突类型 |
| `IConfig`、`IIndex`、`IRecommendationReading`、`ISite` | `modules/site-content` | 首页内嵌热门主题重命名为 `IIndexHotTopic`，保留匿名作者可空性 |

`IHotTopic.d.ts` 的 `authorName: string` 与 `IIndex.d.ts` 的 `authorName: string | null` 属不同端点合同；前者保留为 Topic `IHotTopic`，后者保留为 Site Content `IIndexHotTopic`。

## 2. 活动 `Props/States` 合同

| 原声明 | 目标 owner | 活动消费者处理 |
| --- | --- | --- |
| `FocusBoard` | `modules/board` | Focus、Board Search 改用 Board 根入口 |
| `FocusTopic`、`MediaTopicContent`、`TopicContentType`、`RandomTopic`、`RecommendedTopic` | `modules/topic` | Focus/New/Hot/Search/Recommended 与 Topic UI 改用 Topic 根入口 |
| `UserInfo`、`ChangeUserInfo` | `modules/user` | User、Follow、User Profile/User Center 改用 User 根入口 |
| `MyInfo` | 现有 `modules/session.CurrentUser` | New Topics 不再复制当前用户类型 |
| `ThemeSetting` | `modules/user-preference` | User Center Theme 改用偏好合同；不改 Foundation 私有运行时 shape |
| `UserRecentTopic` | `modules/topic` | Topic/Favorite Topic/User Center/Profile 消费者统一切换 |
| `UserRecentPost` | `modules/post` | Post 和 User Center 消费者统一切换 |
| `UserFavoritesBoardInfo` | `modules/board` | Board API 和自定义版面页面统一切换 |
| `TransferWealthInfo` | `modules/wealth` | 作为转账 body 的显式类型，不改变序列化字段和顺序 |
| `BoardMasterTitle` | `modules/board.IBoardMasterTitle` | 与同 shape ambient 合同合并，两个原注释块均保留 |
| `BoardEvent` | Board Route 私有 model | 唯一 Board Moderation Record 消费者改用相邻入口 |

## 3. 零消费者删除

- `Props/AppProps` 与 `Match/Match` 的 `HotTopic`、`ListPagerProps`、`topicSet`、`MessageMatch` 只形成自引用死链，删除。
- `Props` 中 Message re-export/重复 props、`MessageWindowProps`、`PageModelProps` 无活动消费者；Message/Notification 的真实合同已在 Module 内，删除旧 facade。
- `States/AppState` 中除上表迁移项外的应用壳、Topic/Post/Board/Login/Pager 等旧 state 均无活动消费者，删除；不把不同字段的旧 `ContentState` 冒充现代 Topic Reply 合同。
- `FocusBoardAreaState`、`FocusTopicAreaState`、`MessageMessageState`、`MessageResponseState`、`MessageSystemState`、`MessageWindowState`、`NewTopicAreaState`、`RandomTopicAreaState`、`RecommendedTopicAreaState`、`SearchState` 无活动消费者，删除。
- `States/UbbEditorState.tsx` 属 Z2，原文件、注释、class 和 legacy include 均保留。

## 4. 注释专项核对

- 对 19 个 ambient 文件、6 个活动 Props 文件、`BoardEvent` 及 `AppState.tsx` 第 260 行后的全部迁移声明提取 JSDoc、块注释和行注释，逐条与目标 owner 比较。
- 比较时只忽略缩进和行尾格式，不忽略注释正文；结果为 0 条缺失。
- `FIXME: 不知道有什么用` 与 `不知道有什么用` 两个来源注释均保留在 `IBoardMasterTitle.boardMasterLevel`。
