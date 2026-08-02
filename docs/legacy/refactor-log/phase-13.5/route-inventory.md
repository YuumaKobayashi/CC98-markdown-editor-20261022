# P13.5 路由事实清单

> 实施基线：`9392e6a4`（`docs(p13.5): define router preparation phase`）。开始实施时除未跟踪 `.vscode/` 外工作树干净；该目录不属于本阶段。

## 根 Router 与 App 壳层

`Components/App.tsx` 仍使用 `ConnectedRouter history={history} store={store}`。`Header`、全局 `ErrorControl` route、页面 `Switch` 和 `Footer` 都位于该 Router 内；P13.5 未改 root/provider、history、Store 或渲染顺序。

当前根 `Switch` 按以下顺序首次匹配：

| 顺序 | 公开 path | 当前 owner | 代表 URL / 备注 |
|---|---|---|---|
| 1 | `/`（exact） | `MainPage` | `/` |
| 2–4 | `/topic/hot-monthly`、`/topic/hot-weekly`、`/topic/hot-history`（exact） | 三个 hot topic 页面 | `/topic/hot-weekly` |
| 5 | `/topic/:topicid/:page?`（exact） | `ShowTopic` | `/topic/12345/2` |
| 6 | `/topic/:topicId/postid/:postId/:page?`（exact） | `CurUserPost` | `/topic/12345/postid/67890/2` |
| 7 | `/list/:boardId/:type?/:page?` | legacy `BList` | `/list/81`；非 exact |
| 8 | `/boardlist`（exact） | `BoardList` | `/boardlist` |
| 9 | `/usercenter` | `UserCenter` | `/usercenter/mytopics/2`；前缀 owner |
| 10 | `/message` | `Message` | `/message/response/2`；前缀 owner |
| 11 | `/focus` | `Focus` | `/focus/board`；前缀 owner |
| 12–13 | `/newtopics`、`/recommendedtopics` | topic list 页面 | `/newtopics` |
| 14 | `/user/:method/:id` | `User` | `/user/id/123`；非 exact |
| 15 | `/logon`（exact） | `LogOn` | `/logon` |
| 16–17 | `/search`、`/searchBoard` | `Search`、`SearchBoard` | `/search?boardId=0&keyword=test`、`/searchBoard?keyword=test` |
| 18–20 | `/signin`、`/sitemanage`、`/editor/:mode/:id?` | 注册、站务、编辑器 | `/editor/edit/67890` |
| 21 | `/board/:id/:page?` | `Pages/Board/index` | `/board/81/2`；非 exact |
| 22 | `/error/401` | `UnauthorizedBoard` | `/error/401` |
| 23 | `/index` | `Index` | `/index` |
| 24 | 无 path fallback | `PageNotFound` | 任意未匹配 URL |

`/annual-review-2022` 与 `/annual-review-2025` 仍为注释 route，不是当前公开入口。`Pages/Board/index` 会导航到 `/error/404`、`/error/401`、`/error/500`，但根 route 只显式声明 `/error/401`；P13.5 保留这一旧事实。

## 实际嵌套 Router

全仓 JSX 重新核对后，只有下列两个组件真正渲染 `<BrowserRouter>`：

### Message：`Components/Message/Message.tsx`

| 声明顺序 | path | owner | route props |
|---|---|---|---|
| 1 | `/message`（exact） | `MessageResponse` | 无 page 时按第 1 页处理 |
| 2 | `/message/response/:page?`（exact） | `MessageResponse` | `match.params.page` |
| 3 | `/message/attme/:page?` | `MessageAttme` | `match.params.page` |
| 4 | `/message/system/:page?` | `MessageSystem` | `match.params.page` |
| 5 | `/message/message/:page?` | `MessageMessage` | 当前不读取 route props；会读 URL query 的 `id`/`name` |
| 6 | `/message/setting` | `MessageSetting` | 无 route props |

### Focus：`Components/Focus/Focus.tsx`

| 声明顺序 | path | owner | 代表 URL |
|---|---|---|---|
| 1 | `/focus`（exact） | `FocusBoardArea` | `/focus` |
| 2 | `/focus/board` | `FocusBoardArea` | `/focus/board` |
| 3 | `/focus/user` | `FocusUserArea` | `/focus/user` |
| 4 | `/focus/favorite` | `FocusFavoriteArea` | `/focus/favorite` |

其他文件中未被 JSX、表达式或类型引用的 `BrowserRouter as Router` import 已在 P13.5 删除；它们不是运行时嵌套 Router。P14 只需移除上面两个真实实例。

## UserCenter 与 User 子路由

`UserCenter` 本身不创建 Router，直接消费根 Router。`Components/UserCenter/Router.tsx` 没有包住全部声明的总 `Switch`，只有 `myposts` 和 `myfavorites` 各自使用局部 `Switch`：

- `/usercenter/`（exact）→ `Exact`；
- `/usercenter/myfollowings/:page?`、`/myfans/:page?`、`/mytopics/:page?`、`/myhistory/:page?`；
- `/usercenter/myposts/ishot/:ishot/:page?`，`/usercenter/myposts` 重定向到 `/usercenter/myposts/ishot/0`；
- `/usercenter/myfavorites/order/:order/group/:group/:page?`（exact），`/usercenter/myfavorites` 重定向到 `/usercenter/myfavorites/order/0/group/0`；
- `/usercenter/config`、`/usercenter/mycustomboards`、`/usercenter/transferwealth`、`/usercenter/theme`。

`Components/UserCenter/User/Router.tsx` 声明：

- `/user/:method/:id?`（exact）→ `UserExactWithRouter`；
- `/user/:method/:id/manage` → `UserManage`。

根 route `/user/:method/:id` 不带 `exact`，因此仍负责承载 `/manage` 子路径；P13.5 不调整可选参数或匹配顺序。

## Board 双路径事实

- 根 `/board/:id/:page?` 当前 owner 是 `Pages/Board/index.tsx`，实际公开读路径为 `/board/<id>/<page?>`；它读取 `match.params.id/page`，错误时使用 `history.push`。
- 根 `/list/:boardId/:type?/:page?` 当前 owner 是 legacy `BList`。
- `BList` 内仍保留一个按顺序匹配 `/board/*` 的 `Switch`：双 tag、tag1、tag2、best、save、record、普通列表；但根 `/board/*` 当前先交给 `Pages/Board/index`，仓内也没有发现其他 `BList` 挂载点。该旧分支的可达性问题只记录，不在 P13.5 修复。
- `/error/404`、`/error/500` 缺少显式根 route，以及同组件参数变化时的取数行为，继续作为旧缺陷保留。

## class route props 消费者

以下是从实施基线源码按实际读取能力归并的 P14 兼容桥清单：

| 能力 | 当前消费者 |
|---|---|
| `match.params` | `Pages/Board/index`、`Components/Edit`、legacy `Components/Board/Board` 各 route class、Message 的 Attme/Response/System、UserCenter 的 MyFollowings/MyFans/MyTopics/MyPosts/MyHistory/MyFavoritesPosts、User Router/Manage、Topic/Topic-Trace |
| `location.pathname` | `ErrorControl` |
| `location.search` | `MyFavoritesPosts` |
| `history.push` | `Header`、`Pages/Board/index` 与 `Body`、`Edit`、`MyPosts`、`MyFavoritesPosts`、`Topic`、`Topic-Trace`、`Topic-AwardInfo`、`Topic-ReplierSignature` |
| `history.replace` | `UserCenter/User/Router`、`MyFavoritesPosts` |
| `history.length` | `LogOn` |

`LogOn` 中的 `history.push` 与 `history.go` 仅存在于注释，当前实际跳转使用 `document.location.href`，所以它们不进入临时桥合同。除此之外还有两个不属于 class route props 的应用级 history 消费者：

- `src/app/legacy/register-utility-effects.ts` 在登录失效后执行 `history.push("/logon")`，这是 P14 必须保留的真实导航端口；
- `Components/NotificationController.tsx` 在浏览器通知点击时执行 `history.push("/message/response")`。其 App 挂载点当前已注释，但文件仍参与编译；P14 删除 Store 的旧 history 导出时必须显式迁移或删除该消费者，并记录未挂载状态。

## P14 临时兼容桥与退出清单

如 P14 不能同时函数化复杂 class，桥的最大合同只能包含：

- `match.params`；
- `location.pathname`、`location.search`；
- `history.push`、`history.replace`、`history.length`。

P14 还必须逐项完成：单一 Router、根 route tree、Message/Focus layout route、Redux router reducer/middleware/`ConnectedRouter` 清理、Header/Footer 持久壳层和上述应用级 history effect 迁移。桥不得复制完整 History API；P15 删除桥并将实际消费者迁为现代 route hooks/props。

## P14 必须保持的行为

- 地址栏、刷新、分享链接和 IIS SPA fallback 使用完全相同的公开 URL；
- 浏览器 back/forward 与页内 `Link`/`NavLink` 指向同一 history；
- 同一组件只改变 route params 时，既有重新取数时机不被静默改变；
- Header/Footer 在页面切换时保持持久；
- 登录失效、发帖/编辑成功、搜索和用户中心筛选的程序化跳转保持原目标与 push/replace/整页跳转语义；
- Router 4 `Switch` 的首次匹配与现代 Router 的最佳分支匹配差异逐项人工核对。
