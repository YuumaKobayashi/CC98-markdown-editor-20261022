# 主后端契约到前端 TypeScript 类型系统：只读审计

审计日期：2026-08-02

## 1. 范围与基线

| 仓库 | 路径 | branch | HEAD | status |
| --- | --- | --- | --- | --- |
| 前端 | `C:\Projects\CC98\Forum-frontend-refactor` | `dev20260716` | `ca83375f33cdfc8d59ed11a8c37a865a0c5539b0` | clean，跟踪 `backup/dev20260716` |
| 主后端 | `C:\Projects\CC98\CC98.Api\CC98.Api\CC98.Api` | `master` | `c46f2fa4d340c606b42764a05d106f178d91bc3c` | clean，跟踪 `origin/master` |

- 后端审计根目录固定为上表主后端项目；不读取、不比较、不推断同级废弃项目。
- 未启动任何后端、数据库、Redis、Docker、IIS Express、launch profile 或外部 API。
- 前端调用以可达消费者为准：仅声明而没有任何调用者的 service 函数登记为 dormant，不把其中 URL 当作真实调用。
- JSON wire 命名按 ASP.NET Core `System.Text.Json` Web 默认值理解：CLR PascalCase 属性在 wire 上为 camelCase；数字 enum 默认序列化为数字；`DateTime`、`DateTimeOffset` 和 `DateOnly` 在 JSON 中是字符串。

## 2. 真实调用矩阵

“消费者”列列出全部直接消费该 service 的前端 surface；同一 service 内发生的补充请求在相应行单列。Controller/DTO 后的数字是主后端源码行号。

### 2.1 Board、Topic、Post

| endpoint | Controller action / 请求 / 响应 | 前端 service | 全部直接消费者 |
| --- | --- | --- | --- |
| `GET /board/all` | `BoardController.GetAllBoardInfoAsync` (`BoardController.cs:43`) → `BoardCategoryInfo[]` | `modules/board/getBoards`；`BoardListPage` 直接调用 | New Topics sidebar、Topic page、Topic management、Board list |
| `GET /board/search?keyword=` | `BoardController.SearchBoardAsync` (`BoardController.cs:67`) → `BoardSimpleInfo[]` | `modules/board/getSearchBoard` | BoardSearchPage |
| `GET /board?id=...` | `BoardController.GetMultiBoardsAsync` (`BoardController.cs:252`) → `BoardInfo[]` | `modules/board/getCurrentUserFavoriteBoards` | UserFavoriteBoards |
| `GET /board/{id}` | `BoardController.GetBoardInfoAsync` (`BoardController.cs:171`) → `BoardInfo` | 两个 board service 的 `getBoardInfo/getBoardName`；editor `getEditorBoard` | BoardPage、TopicPage、TrackedTopicPage、EditorPage、Focus/Search/topic enrichment、moderation |
| `GET /board/{id}/tag` | `ConfigController.GetBoardTagsAsync` (`ConfigController.cs:281`) → `BoardTagInfo[]` | route board `getTags` | BoardContent |
| `GET /board/{id}/tag-v2` | `ConfigController.GetBoardTagsV2Async` (`ConfigController.cs:267`) → `BoardTagInfoV2` | `modules/board/getBoardTagV2` | EditorPage |
| `GET /board/{id}/stop-post-user` | `BoardController.GetBoardStopPostUsers` (`BoardController.cs:299`) → `BoardStopPostUserInfo[]` | `modules/board/getTpUsers` | BoardFooterActions |
| `GET /board/{id}/events` | `BoardController.GetBoardEventsAsync` (`BoardController.cs:109`) → `BoardEventInfo` | route board `getBoardRecords` | BoardModerationRecordList |
| `PUT /board/{id}/big-paper` | `ManageController.ChangeBoardBigPaper` (`ManageController.cs:949`), `NewBoardBigPaperInfo` → empty | route board `editBigPaper` | BoardAnnouncement |
| `GET /board/{id}/topic` | `TopicController.GetBoardTopics` (`TopicController.cs:1135`), query `TopicSortMode` → `TopicInfo[]` | route board `getNormalTopics/getTopics`；topic `getFocusTopic` | BoardContent、FocusTopicArea |
| `GET /topic/best/board/{id}` / `save/board/{id}` | `GetBoardBestTopics` (`TopicController.cs:752`) / `GetBoardSaveTopics` (`:802`) → `BoardBestSaveTopicsInfo` | route board `getBestTopics/getSaveTopics` | BoardContent |
| `GET /topic/search/board/{id}/tag` | `TopicController.GetBoardTopicsByTags` (`TopicController.cs:1213`) → `TagTopicsInfo` | route board `getTagTopics` | BoardContent |
| `GET /topic/TopTopics` | `TopicController.GetTopTopics` (`TopicController.cs:1469`) → `TopicInfo[]` | route board `getTopTopics` | BoardContent |
| `GET /topic/{id}` | `TopicController.GetTopicInfo` (`TopicController.cs:333`) → `TopicInfo` | `modules/topic/getTopicInfo` | Header Search、EditorPage、TopicPage、TrackedTopicPage |
| `GET /topic/{id}/post` | `PostController.GetTopicPosts` (`PostController.cs:81/427`) → `PostInfo[]` | route board `getShortTopic`；topic `getTopic/getTopicContent` | BoardTopicPreviewCard、Reaction、EditorPage、TopicReplyList |
| `GET /topic/{id}/hot-post` | `PostController.GetHotPosts` (`PostController.cs:495`) → `PostInfo[]` | topic `getHotReplyContent` | TopicReplyList |
| `GET /post/topic/user` | `PostController.GetSpecificUserPosts` (`PostController.cs:805`) → `SpecificUserPostInfo[]` | topic `getCurUserTopicContent` | TopicReplyList |
| `GET /post/topic/specific-user` | `PostController.GetSpecificUserPostsByPostIdAsync` (`PostController.cs:687`) → `PostInfo[]` | topic `getTraceTopicsCount/getTraceTopics` | TrackedTopicPage、TopicReplyList |
| `GET /topic/new` / `new-media` | `GetNewTopicsAsync` (`TopicController.cs:857`) / `GetNewMediaTopicsAsync` (`:880`) → `TopicInfo[]` | topic `getAllNewTopic` | NewTopicsPage |
| `GET /topic/random-recommendation` | `GetRandomRecommendedTopicsAsync` (`TopicController.cs:1059`) → `RecommendedTopicInfo[]` | topic `getRandomRecommendedTopic` | RecommendedTopicsPage |
| `GET /topic/random-recent` | `GetRandomRecentTopicsAsync` (`TopicController.cs:1090`) → `TopicInfo[]` | topic `getRandomTopic` | RandomRecentTopics |
| `GET /topic/hot-weekly` / `hot-monthly` | `GetWeeklyHotTopics` (`TopicController.cs:922`) / `GetMonthlyHotTopics` (`:940`) → `TopicInfo[]` | topic `getMonthlyHotTopic` | HotTopicPage |
| `GET /topic/search` / `search/board/{id}` | `SearchAllPublicTopics` (`TopicController.cs:551`) / `SearchBoardTopics` (`:520`), query `SearchResultOrder` → `SearchedTopicInfo[]` | topic `getSearchTopic` | TopicSearchPage |
| `GET /topic/basic?id=...` | `TopicController.GetTopicBasicInfos` (`TopicController.cs:1294`) → `TopicBasicInfo[]` | topic `getBasicTopicsInfo` | Notification enrichment |
| `POST /board/{id}/topic` | `TopicController.PostTopic` (`TopicController.cs:2088`), `NewTopicInfo` → topic id | editor `createEditorTopic` | EditorPage |
| `POST /topic/{id}/post` | `PostController.Post` (`PostController.cs:1234`), `NewPostInfo` → post id | topic detail `submitTopicReply` | TopicReplyComposer |
| `GET /post/{id}/original` | `PostController.GetOriginalPost` (`PostController.cs:1539`) → `PostInfo` | editor `getOriginalEditorPost` | EditorPage |
| `PUT /post/{id}` | `PostController.EditPost` (`PostController.cs:1581`), `NewPostInfo` → empty | editor `updateEditorPost` | EditorPage |
| `PUT /post/{id}/like` / `GET /post/{id}/like` | `SetUserLikeState` (`PostController.cs:2015`), body `LikeState`; `GetPostLikeState` (`:2036`) → `PostLikeInfo` | reaction `like/dislike/refreshLikeState` | TopicReplySignature、UserRecentPostItem |
| `GET /topic/{id}/vote` / `POST /topic/{id}/vote` | `GetTopicVoteInfoAsync` (`TopicController.cs:251`) → `VoteInfo`; `UserVoteAsync` (`:166`), `NewUserVoteInfo` | topic detail vote service | TopicReplyContent、TopicVote |
| `DELETE /post/{id}` | `PostController.DeletePost` (`PostController.cs:2102`), `ManageOperationInfo` | moderation `deletePost` | PostManagementDialog |
| `POST /post/{id}/operation` | `PostController.PostPostOperation` (`PostController.cs:2192`), `PostUserOperationInfo` with `PostUserOperationType` | moderation/post-rating operation services | PostManagementDialog |
| `GET /post/rating-reason` | `PostController.GetRatingReasonsAsync` (`PostController.cs:974`), query `RatingType` → `RatingReason[]` | post-rating `getJudgeTags` | PostRatingDialog |
| `PUT /post/{id}/rating` / `rating-v2` | `RatePost` (`PostController.cs:1105`), `PostAwardInfo`; `RatePostV2Async` (`:986`), `PostRatingInfo` | post-rating rating services | PostRatingDialog |
| topic moderation endpoints | `ManageController.cs:821,1017,1105,1164,1223,1292,1357,1470,1558,1602,1648,1697,1744,1786` | route board batch service；modules/moderation | BoardBatchManager、TopicManagementDialog |
| `GET /topic/{id}/look-ip` / `event` | `GetAllPostsWithIp` (`TopicController.cs:1534`) → `PostWithIpInfo[]`; `GetTopicManageEventAsync` (`:80`) → `ResultWithCount<BoardEvent>` | moderation `findIP/getManageHistory` | TopicReplyComposer、TopicManagementHistoryDialog |

### 2.2 User、Session、Follow、Message、Notification

| endpoint | Controller action / 请求 / 响应 | 前端 service | 全部直接消费者 |
| --- | --- | --- | --- |
| `GET /user/{id}` / `name/{name}` | `UserController.GetUserInfoById/Name` (`UserController.cs:362/380`) → `UserInfo` | user `getUserInfo` | Header Search、UserProfileLayout、topic/user caches、topic enrichment |
| `GET /user?id=...` / `user/name?name=...` | `GetUserInfosById/Name` (`UserController.cs:323/342`) → `UserInfo[]` | user `getUsersInfo` | TopicAwardList、follow/topic enrichment、user caches |
| `GET /user/basic?id=...` / `basic/{id}` | `GetUserBasicInfosById` (`UserController.cs:477`) / `GetUserBasicInfo` (`:526`) → `UserBasicInfo` | user/message services | Message pages、topic enrichment |
| `GET /me` | `MeController.GetMyInfo` (`MeController.cs:1170`) → `UserInfo`，不是 `MyInfo` record | session `refreshUserInfo/refreshCurrentUserInfo` | 登录流程、Header、User Center、follow、wealth、daily signin |
| `PUT /me` | `MeController.ChangeInfo` (`MeController.cs:1363`), `ChangeUserInfo` | settings page direct call | UserCenterSettingsPage |
| `PUT /me/topic-view-mode?mode=` | `MeController.ChangeTopicViewModeAsync` (`MeController.cs:1117`), query `UserTopicViewMode` | user-preference | NewTopicsPage |
| `PUT /me/browsing-history` / `GET /me/browsing-record` | `ChangeBrowsingHistoryEnabledAsync` (`MeController.cs:193`); `GetMyBrowsingRecordAsync` (`:165`) → `ResultWithCount<UserBrowsingTopicInfo>` | session/topic services | UserCenterHistoryPage |
| `GET /me/recent-topic` / `recent-post` / `hot-post` | `GetRecentTopics` (`MeController.cs:580`) → `TopicInfo[]`; `GetRecentPosts` (`:517`) / `GetMyHotPostsAsync` (`:829`) → `ResultWithCount<PostInfo>` | topic/post services | MyTopics、overview activity、MyPosts |
| `GET /user/{id}/recent-topic` | `TopicController.GetUserRecentTopics` (`TopicController.cs:474`) → `SearchedTopicInfo[]` | profile page direct call | UserRecentTopics |
| `GET /user/{id}/post` | `ManageController.GetUserPost` (`ManageController.cs:317`) → `ManageUserPostInfoWithCount` | profile manager direct call | UserRecentPostsManager |
| `DELETE /user/{id}/topic|post` / `PUT /user/{id}/operation` | `ManageController.DeleteUserTopic/DeleteUserPost/UserOperation` (`ManageController.cs:349/404/488`) | profile management direct calls | DeleteRecentUserContent、UserPunishmentForm |
| `GET /me/followee` / `follower` | `MeController.GetUserFollowers/GetUserFans` (`MeController.cs:868/891`) → user id arrays | follow service | MyFollowings、MyFans |
| `PUT|DELETE /me/followee/{id}` | `MeController.FollowUser/UnfollowUser` (`MeController.cs:915/960`) | follow + topic detail services | UserProfileDetails、UserFollowCard、TopicReplier |
| `PUT|DELETE /me/custom-board/{id}` | `MeController.AddCustomBoard/RemoveCustomBoard` (`MeController.cs:601/634`) | follow service + card direct call | BoardAnnouncement、UserFavoriteBoardCard |
| `GET /me/signin` / `POST /me/signin` | `GetUserSignInStateInfo` (`MeController.cs:1410`) → `UserSignInStateInfo`; `SignIn` (`:1669`) → int | daily-signin | DailySigninPage、Header menu、ReSignCalendar |
| `GET /me/signin-in-month` / `POST /me/make-up-missed-signin` | `GetSigninInMonthAsync` (`MeController.cs:1445`) → `UserSignInDailyInfo[]`; `MakeUpMissedSignIn` (`:1491`) → `ResultSingle<int>` | ReSignCalendar direct calls | ReSignCalendar |
| `PUT /me/portrait` / `POST /file/portrait` | `ChangeUserPortrait` (`MeController.cs:1138`), string; `FileController.PostPortrait` (`FileController.cs:473`) → string array | avatar page direct calls | UserCenterAvatarSettings |
| `PUT /me/theme` / `theme-setting` | `ChangeTheme` (`MeController.cs:1607`); `ChangeThemeSetting` (`:1641`), `ThemeSetting` | theme page direct call | UserCenterThemePage |
| `GET /message/recent-contact-users` / `message/user/{id}` | `MessageController.GetResentContactUsers/GetMessages` (`MessageController.cs:147/44`) | message service | PrivateMessagesPage、PrivateConversationWindow |
| `POST /message` | `MessageController.SendMessage` (`MessageController.cs:81`), `NewMessageInfo` | message service | PrivateConversationWindow |
| `GET /me/all-message-count` / `unread-count` | `MeController.GetUserAllNotificationAndMessageCountInfo/GetUserUnreadCountInfo` (`MeController.cs:689/718`) → `UserNotificationAndMessageCountInfo` | notification service/store | 三个通知页面、全局 unread refresh |
| `GET /notification/system` | `NotificationController.GetUserSystemNotification` (`NotificationController.cs:368`) → `SystemNotificationInfo[]` | notification `getMessageSystem`，追加 `floor` | MessageSystemPage |
| `GET /notification/reply` / `at` | `GetUserReplyNotification/GetUserAtNotification` (`NotificationController.cs:440/480`) → `ReplyAtNotificationInfo[]` | notification service，追加 topic/title/board/floor/user 字段 | MessageResponsesPage、MessageMentionsPage |
| `PUT /notification/read-all-{reply|at|system}` | `NotificationController.cs:234/212/257` | notification `readAll` | MessageLayout |
| `POST /notification/at` | `NotificationController.AtUser` (`NotificationController.cs:304`), string array + query ids | editor/topic detail services | EditorPage、TopicReplyComposer |

### 2.3 Site content、upload、wealth 与非主后端资源

| endpoint | Controller action / 请求 / 响应 | 前端 service | 全部直接消费者 |
| --- | --- | --- | --- |
| `GET /config/global` | `ConfigController.GetGlobalConfigInfoAsync` (`ConfigController.cs:88`) → `GlobalConfigInfo` | site-content public/auth variants | DailySigninPage、SiteAnnouncementEditor |
| `PUT /config/global/announcement` | `SuperManageController.SetGlobalAnnouncement` (`SuperManageController.cs:2193`), `AnnoucementInfo` → bool | site-content | SiteAnnouncementEditor |
| `GET /config/index` / `PUT /config/index/update` | `ConfigController.GetIndexInfoAsync/UpdateIndexAsync` (`ConfigController.cs:125/109`) → `IndexInfo` / empty | site-content | HomePage、SiteAnnouncementEditor |
| `GET /config/global/advertisement` | `ConfigController.GetAdvertisementAsync` (`ConfigController.cs:307`) → `ForumIndexColumnInfo[]` 投影 | site-content | HomeAdvertisementCarousel |
| `GET /{index-column-path}/all` | `SuperManageController.cs:1974,1988,2002,2016,2030` → `ForumIndexColumn[]` | site-content dynamic service | SiteAdvertisementEditor |
| `POST /index/column` / `PUT /index/column/{id}` | `ManageController.AddIndexColumn/ChangeIndexColumn` (`ManageController.cs:254/181`), `PostForumIndexColumnInfo` | site-content dynamic service | SiteAdvertisementEditor |
| `GET /config/global/alltag` | `ConfigController.GetAllTagsAsync` (`ConfigController.cs:136`) → `Tag[]` | topic tag cache | BoardPage、EditorPage、TopicHeader |
| `GET /config/global/all-user-title` | `ConfigController.GetAllUserTitleAsync` (`ConfigController.cs:294`) → `UserTitle[]` | profile/settings direct calls | UserProfileAvatar、UserCenterProfileSettings |
| `GET /config/now` | `ConfigController.GetNow` (`ConfigController.cs:171`) → `ResultSingle<string>` | ReSignCalendar direct | ReSignCalendar |
| `POST /file` / `file/portrait` | `FileController.Post/PostPortrait` (`FileController.cs:366/473`) → string arrays | upload/UBB/avatar | Message composer、editor image upload、avatar settings |
| `GET /manage/reward-daily-record` | `ManageController.GetUserRewardDailyRecord` (`ManageController.cs:145`) → nullable `RewardDailyRecordInfo` | wealth | TopicReplyList |
| `PUT /me/transfer-wealth` | `MeController.TransferWealth` (`MeController.cs:769`), `TransferWealthInfo` → string array | wealth | TransferWealthPage |
| `/connect/token` | 身份服务，不属于本次主后端源码 | session authentication | LoginPage |
| `/static/config.json`、`portrait.json`、`boardinfo.json` | 静态前端资源，不属于后端 API | runtime config / UI fallback | bootstrap、avatar/topic/board UI |

## 3. Reachability 排除与已知断链

| 项目 | 证据 | 结论 |
| --- | --- | --- |
| `modules/posting/sendTopic`、`editPost` | 全仓无调用者 | dormant；其 URL 不计入真实调用，不据此建立契约 |
| reaction 的 `getLikeStateAndCount/getLikeState`、post-rating `getAwardInfo`、若干 topic/user helper | 全仓无调用者 | dormant；保留源码但不驱动本批 enum/DTO |
| `GET /post/topic/anonymous/user` | 前端 `getAnonymousTraceTopics` 自身也 dormant；主后端 `PostController.cs:525` action 已注释 | 双重不可达，不作为有效 endpoint |
| `GET /post/topic/user` 的 `getCurUserTopic` | helper 无消费者；同 endpoint 的 `getCurUserTopicContent` 可达 | endpoint 仍纳入，前者不算独立消费者 |
| `NotificationType` 与 `getTotalPage(type=1/2/3)` | 前者是 wire enum；后者是页面 section selector | 两套协议不得合并 |
| 收藏主题 `order=0/1/2` | 后端 action 参数是裸 `int`，语义与 `TopicSortMode` 不同 | 单独保留 `FavoriteTopicOrder`（若在 Phase 4 收窄），不得复用 `TopicSortMode` |

## 4. 后端 enum 清单（仅真实 endpoint 契约）

| owner | enum | wire 值 | 主后端来源 | 前端真实使用面 |
| --- | --- | --- | --- | --- |
| topic | `TopicState` | Normal=0, Locked=1, Deleted=2, Temporary=3 | `Data/TopicState.cs:6` | `TopicInfo/TopicBasicInfo`、board/topic UI、moderation |
| topic | `TopicType` | Normal=0, SchoolEvent=1, AcademicInfo=2 | `Data/TopicType.cs:6` | topic/index DTO |
| topic | `TopicTopState` | None=0, BoardTop=2, DistrictTop=3, AllTop=4 | `Data/TopicTopState.cs:6` | topic list、moderation；非连续值不可重编号 |
| topic | `TopicBestState` | None=0, Best=1, Save=2 | `Data/TopicBestState.cs:6` | topic list、moderation |
| topic | `TopicAllowedViewerState` | Forbid=0, Stop=1, Allow=2 | `Data/TopicAllowedViewerState.cs:6` | `TopicInfo.allowedViewerState` |
| topic | `TopicContentType` | Normal=0, VoteTopic=1, VideoTopic=2, AudioTopic=3, ImageTopic=4, Lottery=5 | `Data/TopicContentType.cs:6` | topic cards/detail；当前前端缺 Lottery |
| topic | `LotteryTopicStatus` | Waiting=1, Finished=2, FinishedWithoutDrawing=3 | `Data/LotteryTopicDetail.cs:31` | lottery detail UI |
| topic | `LotteryMode` | SingleCC98Account=1, SingleZJUInfoId=2 | `Data/LotteryTopicDetail.cs:41` | lottery detail UI |
| topic | `SearchResultOrder` | ByCreationTime=0, ByLastPostTime=1 | `Models/SearchResultOrder.cs:6` | topic search query |
| topic | `TopicSortMode` | CreateTime=0, LastReplyTime=1 | `Models/TopicSortMode.cs:6` | board/follow/custom-board topic query |
| post | `PostState` | Normal=0, Deleted=2 | `Data/Post.cs:174` | `PostInfo.state`；非连续值 |
| post | `PostContentType` | Ubb=0, Markdown=1 | `Data/PostContentType.cs:6` | post DTO、editor/detail request |
| post | `LikeState` | None=0, Like=1, Dislike=2 | `Data/LikeState.cs:5` | like body/response/UI |
| post | `PostUserOperationType` | Bonus=0, Punishment=1 | `Models/Manage/PostUserOperationType.cs:6` | post operation body |
| post | `RatingType` | Add=1, Subtract=2 | `Data/RatingReason.cs:21` | rating reason query、rating-v2 body/response |
| user | `UserGender` | Male=1, Female=0 | `Data/UserGender.cs:3` | UserInfo/ChangeUserInfo |
| user | `UserState` | Normal=0, Locked=1, Shielded=2, StopPost=3 | `Data/UserState.cs:6` | UserInfo/session/storage/UI |
| user | `UserTopicViewMode` | Classic=0, Card=1, CardMediaOnly=2 | `Data/UserTopicViewMode.cs:6` | `/me` 与 query `mode` |
| user | `TargetWindow` | CurrentWindow=0, NewWindow=1 | `Data/TargetWindow.cs:6` | `UserInfo` wire 字段 |
| user | `UserRateState` | None=0, Warning=1, Stop30Days=2, StopPermanent=3 | `Data/UserRateState.cs:6` | `UserInfo` wire 字段 |
| user | `ForumUserOperationType` | Cancel=0, Do=1 | `Models/Manage/ForumUserOperationType.cs:3` | `/user/{id}/operation` body |
| board | `AnonymousState` | NotAllowed=0, Force=1, Allowed=2, OnlyPosterAllowed=3 | `Data/AnonymousState.cs:6` | BoardInfo、editor/reply UI |
| board | `BoardInternalState` | None=0, InternalOnly=1, NeedReview=2 | `Data/BoardInternalState.cs:3` | BoardInfo |
| board | `BoardPosterOnlyState` | Forbid=0, Stop=1, BandMaster=2, AllUser=3 | `Data/BoardPosterOnlyState.cs:10` | BoardInfo `allowPostOnly` |
| board | `BoardPrivacyState` | flags: None=0, NotHot=1, NotSearchable=2, NotNewTopic=4 | `Data/BoardPrivacyState.cs:9` | BoardInfo `privacyState`；Phase 2 补记 |
| board | `ViewerFilterState` | Forbidden=0, NotEnabled=1, EnabledByAdmin=2, Enabled=3 | `Data/ViewerFilterState.cs:6` | BoardInfo `viewerFilterState`；Phase 2 补记 |
| board | `BoardProtectionLevel` | None=0, RequireLogOn=1, RequireSpecifiedUser=2, Hidden=3 | `Data/BoardProtectionLevel.cs:6` | BoardInfo `protectionLevel`；Phase 2 补记 |
| topic | `TopicSpecialStyle` | Normal=0, GrayScale=1 | `Data/TopicSpecialStyle.cs:6` | TopicInfo `specialStyle`；Phase 2 补记 |
| post | `PostAwardType` | OldVersion=0, Bonus=1, Punishment=2, UserRating=3 | `Data/PostAwardType.cs:8` | PostInfo `awards[].type`；Phase 2 补记 |
| site-content | `ForumIndexColumnType` | 1..7：RecommendationReading, RecommendationFunction, SchoolNews, Advertisement, ManualTopHotTopic, ManualBottomHotTopic, SpecialOffer | `Data/ForumIndexColumnType.cs:6` | index DTO、site management UI |
| site-content | `ForumIndexColumnVisibility` | Always=0, OnlyLogOn=1, OnlyNotLogOn=2 | `Data/ForumIndexColumn.cs:89` | site management DTO/UI |
| notification | `NotificationType` | AllUser=0, System=1, Reply=2, At=3 | `Data/NotificationType.cs:6` | notification DTO |

`TopicAuthorPermissions` 在数据库是 `[Flags]`，但 `BoardInfo.FromItem` 已在服务端投影成 `string[]`，`TopicInfo` 也公开 `string[]`；前端 wire contract 不是位掩码，因此本批不建立 numeric enum，也不做位运算替换。其来源为 `Data/TopicAuthorPermissions.cs:8`，投影证据为 `Models/BoardInfo.cs:147,183`。

## 5. 前端数字与类型债务扫描

原始静态扫描得到：99 处 JSON 读取、169 行 `any`、40 个名称疑似业务状态的 `number` 声明、19 行数字字面量联合。原始命中包含 HTTP 状态、UI mode、分页、主题注册顺序等，以下按协议分类。

| 分类 | 明确命中 | 处理 |
| --- | --- | --- |
| 后端正式 enum | topic state/type/top/best/content；post state/content/like/operation；user gender/state/view mode；board anonymous/internal；site column type/visibility；lottery status/mode | Phase 1 建 enum、收窄字段/参数并替换比较与请求数字 |
| 后端裸 int 但稳定领域值 | 收藏 order；通知页面 section | 不与同值 enum 合并；能从 action 分支静态闭合者后续建立协议专属类型，否则登记不确定项 |
| HTTP 状态码 | 所有 `response.status`、`mes.status` 的 200/400/401/402/403/404/500 | 明确保留，不换业务 enum |
| 普通数字 | id、board id、page/from/size、count、floor、days、阈值 10/11/20/500、主题/theme order、DOM/CSS 尺寸、TopicCard 图片数量 switch | 明确保留，不换业务 enum |
| 本地 UI 协议 | Editor `mode`、通知 section、Theme registry order、TopicCard 图片数量 | 明确保留或建立本地专属类型；不得冒充后端 enum |

重点 DTO 债务已定位但不提前改入 Phase 1：

- `ITopic.isVote/isPosterOnly` 错为字面量 `false`；`userId/userName/userInfo/lastPostUser/lastPostContent/highlightInfo` 可空性漂移，且缺少完整 `TopicInfo` 字段。
- `IPost.allowedViewers/lastUpdateAuthor/lastUpdateTime` 是 `any`，后端分别为 `string[] | null`、`string | null`、wire `string | null`；前端还含后端 `PostInfo` 不存在的 `awardInfo/isBest/length`，需要区分 wire DTO 与 service 加工 ViewModel。
- `IBoard.isLock` 与 wire `isLocked` 名称不一致；现有消费者读取 `isLock`，需要在 Phase 2 查清 service 是否归一化（当前未见归一化），不能仅改类型名后假装行为等价。
- `IUser`、`UserInfo`、`CurrentUser` 三份重复且字段漂移；后端 `/me` 返回 `UserInfo`，不是轻量 `MyInfo` record。
- `UserSignInStateInfo.lastSignInTime` 后端是 nullable `DateTimeOffset?`，当前前端页面以数字 `0` 初始化。
- `ReplyAtNotificationInfo` / `SystemNotificationInfo` 的 nullable 字段与前端 `Date` 类型均有漂移；service 还追加 `topicTitle/boardName/floor/user`，应区分 wire DTO 与 ViewModel。
- `response.json()` 未约束集中在 topic、notification、message、board legacy service；Phase 4 在 service 边界约束，不向 UI 传播 `any`。

## 6. 分批方案与门禁

### Phase 1：枚举和明确 magic number

- 在 topic/post/user/board/notification/site-content 的 `model` owner 内建立显式 numeric enum，并由模块入口导出。
- 收窄现有对应字段、service 参数和可证明的 request body/query。
- 替换 UI/业务比较：Topic state/top/best/content、Post content/like、User gender/state/view mode、Board anonymous、Lottery、Forum index column。
- 不触碰 HTTP status、本地 Editor mode、通知 section、收藏 order、TopicCard 图片数量和普通数字。
- 输出前后对照、替换清单、allowlist、不确定项与机械检查；停在人审点。

### Phase 2：Topic/Post/Board DTO

- 以 `TopicInfo`、`PostInfo`、`BoardInfo` 及 endpoint 实际投影为准补齐字段名、nullable、数组与 wire 时间字符串。
- 分离 raw wire DTO 与 service 追加用户/版面/格式化字段后的 ViewModel/Pick。
- 处理 `isVote/isPosterOnly`、Topic nullable 字段、Post 三个重点 nullable、`isLocked`/`isLock` 调用链。
- Phase 1 人审前不开始。

### Phase 3：User/Session/Notification/Site Content DTO

- 建立 User 领域唯一可复用 wire 基础，Session `/me` 复用并只保留 session 特有语义。
- 对齐 `UserInfo` 全字段、`UserSignInStateInfo.lastSignInTime`、ForumIndexColumn、两类通知 raw DTO；为通知 service 加工结果命名 ViewModel。
- Phase 2 人审前不开始。

### Phase 4：service 签名、重复类型与剩余 any

- 给可达 API service 补全参数/Promise 返回类型，在 `response.json()` 边界约束 raw response。
- 清理已闭合的重复 DTO；保留不能静态确定的 `unknown/any` 并逐项登记来源、消费者、原因和移除条件。
- dormant service 只登记，不借类型对齐改变其可达性或删除它。
- Phase 3 人审前不开始。

每批机械门禁：`npm run typecheck`、`npm run build`、`git diff --check`、`git status --short`、目标 magic number 归零/allowlist、废弃后端项目引用扫描。所有真实 API、登录态、权限、通知、主题、编辑器和浏览器交互均保持“未执行”，不由机械检查替代。
