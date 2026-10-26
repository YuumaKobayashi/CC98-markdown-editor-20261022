# P07 文件与导出映射

## 基础设施与兼容路径

| 旧位置 | 新 owner | 兼容方式 |
|---|---|---|
| `Components/Constant.tsx` | `src/shared/config/runtime-config.ts` | 原文件 re-export |
| `config/index.ts` | `src/shared/config/platform.ts` | 原文件 re-export |
| `Utility/fetchUtility.ts` | `src/shared/api/http.ts`、`src/features/auth/api/session.ts` | 原文件 re-export |
| `Utility/storageUtility.ts` | `src/shared/storage/web-storage.ts`、`src/entities/user/storage/current-user.ts` | 原文件 re-export |
| `IndexedDB/IndexedDB.ts` | `src/shared/storage/indexed-db.ts` | 原文件 re-export |
| `IndexedDB/UserStorage.ts` | `src/entities/user/storage/user-cache.ts` | 原文件 re-export |
| `Utility/Fetch/getUserInfo.ts`、`getUsersInfo.ts` | `src/entities/user/api/get-user-info.ts`、`get-users-info.ts` | 原文件 re-export |
| `Utility/boardInfoJson.ts` | `src/entities/board/model/board-info.ts` | 原文件 re-export |
| `Utility/timeZoneUtility.ts` | `src/shared/lib/time-zone.ts` | 原文件 re-export |
| `Utility/blinkTitle.ts` | `src/features/message/title-blinker.ts` | 原文件 re-export |
| `Utility.tsx` | owner modules below | replaced by `Utility.ts` facade |

## Root facade export ownership

| Owner module | Existing facade exports moved there |
|---|---|
| `entities/topic/api/service` | `getBoardTopicAsync`, `getTopic`, `getTopicContent`, `getHotReplyContent`, `getCurUserTopic`, `getCurUserTopicContent`, `getRandomRecommendedTopic`, `getAllNewTopic`, `getFocusTopic`, `GetTopTopics`, `getBestTopics`, `getSaveTopics`, `getSearchTopic`, `getCurUserTotalReplyPage`, `getTraceTopicsCount`, `getTraceTopics`, `getAnonymousTraceTopics`, `getTopicInfo`, `getPostInfo`, `getTagInfo`, `getNewTagInfo`, `getTagIdbyName`, `getTagNamebyId`, `getTopicByOneTag`, `getTopicByTwoTags`, `getBasicPostsInfo`, `getThisPostInfo`, `getBasicTopicsInfo`, `getThisTopicInfo`, `getMonthlyHotTopic`, `getRandomTopic` |
| `entities/board/api/service` | `syncGetBoardNameById`, `getBoardName`, `getSearchBoard`, `getBoards`, `getBoardId`, `getBoardInfo`, `getBoardTag`, `getBoardTagV2`, `getBoardRecord`, `getTpUsers`, `isMaster` |
| `entities/user/api/service` | `getThisUserInfo`, `getThisUserInfobyName`, `getUserDetails`, `getPortraitUrl`, `getBasicUsersInfo`, `updateUserInfo` |
| `entities/message/api/service` | `getRecentContact`, `getRecentMessage`, `sortRecentMessage`, `sortContactList`, `getMessageSystem`, `getMessageResponse`, `getMessageAttme` |
| `features/reactions/api/service` | `like`, `dislike`, `getLikeStateAndCount`, `getLikeState`, `refreshLikeState`, `awardWealth`, `deductWealth`, `getAwardInfo` |
| `features/posting/api/service` | `sendTopic`, `uploadFile`, `clickUploadIcon`, `uploadEvent`, `editPost` |
| `features/follow/api/service` | `followUser`, `unfollowUser`, `isFollowThisBoard`, `followBoard`, `unfollowBoard` |
| `features/favorites/api/service` | `setFavoriteTopic`, `getFavoriteAllTopic`, `deleteFavoriteTopic`, `getFavState`, `createFavGroup`, `updateFavGroup`, `deleteFavGroup` |
| `features/message/api/service` | `sendMessage`, `readAll`, `noticeMessageShow` |
| `features/moderation/api/service` | `plus1`, `minus1`, `positiveJudge`, `negativeJudge`, `addPrestige`, `deductPrestige`, `deletePost`, `stopBoardPost`, `cancelStopBoardPost`, `addBoardTopTopic`, `removeBoardTopTopic`, `getTotalPage`, `deleteTopic`, `lockTopic`, `upTopic`, `unLockTopic`, `setBestTopic`, `cancelBestTopic`, `setDisableHot`, `cancelDisableHot`, `setHighlight`, `findIP`, `moveTopic`, `mutliLock`, `mutliDelete`, `getManageHistory`, `getJudgeTags` |
| `features/account/api/service` | `signin`, `getSigninInfo`, `getGlobalConfig`, `refreshUserInfo`, `queryWealth`, `getAnnualReview`, `getAnnualReviewV2`, `getUserWealth`, `setUserTopicViewMode` |
| `features/auth/api/session` | `getToken`, `formAuthorizeHeader`, `isLogOn` |
| `shared/api/http` | `cc98Fetch`, `getApiUrl` |
| `shared/storage/web-storage` | `setStorage`, `getStorage`, `removeStorage`, `setLocalStorage`, `getAccessToken`, `getLocalStorage`, `removeLocalStorage`, `autoClearLocalStorage` |
| `entities/user/storage/current-user` | `getMyInfo` |
| `shared/lib/time` | `transerTime`, `transerRecentTime`, `transerTimeToYearMonthDay` |
| `shared/lib/page` | `getListTotalPage`, `getTotalPageof10`, `getTagLayer` |
| `shared/lib/dom` | `getScrollTop`, `getScrollHeight`, `getWindowHeight`, `isBottom`, `copyToClipboard` |
| `shared/lib/text` | `atHanderler`, `atUserUbbUrl`, `atUserMdUrl`, `replaceHttpToHttps`, `quoteJudger` |
| `shared/lib/async` | `pDebounce` |
| `shared/theme/runtime` | `changeTheme`, `checkThemeToChange`, `getRealThemeNumber`, `isBrowserDayNightModeSupported` |
| dedicated user APIs | `getUserInfo`, `getUserInfoByName`, `getUsersInfo`, `getUsersInfobyNames` |

`convertHotTopic` was the 159th previous export. It imported `TopicTitleAndContent` from Board, had zero tracked callers, and is intentionally not exported after P07. Rendering remains owned by Board.
