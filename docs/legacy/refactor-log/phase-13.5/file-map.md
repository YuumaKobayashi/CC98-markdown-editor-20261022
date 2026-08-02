# P13.5 文件与调用链映射

> 实施基线：`9392e6a4`。下列代码变更均为删除未读取参数、对应透传或无引用 import；未移动文件、未改变 owner。

## `this.context.router` 调用链

| 组件 | service | P13.5 实施结果 |
|---|---|---|
| `Components/Focus/FocusTopicArea.tsx` | `getFocusTopic` | 2 个调用删除 Router 实参与 `declare context` |
| `Components/Search/Search.tsx` | `getSearchTopic` | 2 个调用删除 Router 实参与 `declare context` |
| `Components/Search/SearchBoard.tsx` | `getSearchBoard` | 1 个调用删除 Router 实参与 `declare context` |
| `Components/Message/MessageAttme.tsx` | `getMessageAttme` | 1 个调用删除 Router 实参与 `declare context` |
| `Components/Message/MessageResponse.tsx` | `getMessageResponse` | 1 个调用删除 Router 实参与 `declare context` |
| `Components/Message/MessageSystem.tsx` | `getMessageSystem` | 1 个调用删除 Router 实参与 `declare context` |
| `Components/Message/MessageMessage.tsx` | `getRecentContact`、`sortContactList` | 3 个调用删除 Router 实参与 `declare context` |
| `Components/Message/MessageWindow.tsx` | `getRecentMessage`、`sendMessage` | 4 个调用删除 Router 实参与 `declare context` |
| `Components/Topic/Topic-ReplierSignature.tsx` | `like`、`dislike` | 2 个调用删除 Router 实参与 `declare context`；保留 `withRouter`，因为 `history.push` 仍被实际读取 |

对应签名收窄位于：

- `src/entities/topic/api/service.ts`：`getFocusTopic`、`getSearchTopic`；
- `src/entities/board/api/service.ts`：`getSearchBoard`；
- `src/entities/message/api/service.ts`：`getRecentContact`、`getRecentMessage`、`sortContactList`、`getMessageSystem`、`getMessageResponse`、`getMessageAttme`；
- `src/features/message/api/service.ts`：`sendMessage`；
- `src/features/reactions/api/service.ts`：`like`、`dislike`。

`sortContactList` 内 4 个 `getRecentMessage` 调用同步删除透传。`Utility.ts` 继续只做 `export *` facade，没有新增 Router 适配逻辑。

## 无仓内调用的遗留导出

源码引用审计证明以下导出除定义与 `Utility.ts` 的通配 re-export 外没有调用者，函数体也不读取 Router：

- `src/features/posting/api/service.ts`：`sendTopic(topicId)`；
- `src/features/reactions/api/service.ts`：`getLikeStateAndCount(topicid, postid)`；
- `src/features/reactions/api/service.ts`：`getLikeState(topicid)`。

P13.5 只删除它们的无效 Router 形参，保留导出名、其余参数、函数体和 facade 可见性。未借此启用或删除这些遗留导出。

## 无引用 Router import

全仓核对只有 `Components/Message/Message.tsx` 与 `Components/Focus/Focus.tsx` 实际使用 `BrowserRouter as Router` 标识符；它们渲染的两个嵌套 `BrowserRouter` 均原样保留。`Components/App.tsx` 实际使用的是独立导入的 `ConnectedRouter`，其无引用 `BrowserRouter` alias 已删除。

P13.5 从下列文件删除未被 JSX、表达式或类型读取的 `BrowserRouter as Router` 及同一 import 中一并证明无引用的 `Route`/`Link`/`withRouter` specifier：

- `Components/App.tsx`、`Components/Edit.tsx`、`Components/Focus/CardBoard.tsx`；
- `Components/Search/Search.tsx`、`Components/Search/SearchBoard.tsx`；
- `Components/Topic/Topic-Hot-{Weekly,Monthly,History}.tsx`、`Topic-New.tsx`、`Topic-Recommended.tsx`、`Topic-Reply.tsx`、`Topic.tsx`；
- `Components/UserCenter/UserCenter.tsx`、`ExactActivities.tsx`、`User/User.tsx`。

`Components/Topic/Post.tsx` 中相似文本位于整块注释内，不是 import 声明，本阶段不改。

## 仅盘点、P13.5 不改运行时

- `Components/App.tsx`：顶层 `ConnectedRouter`、route 顺序、Header/Footer 壳层；
- `src/app/providers/create-app-root.tsx`：P14 单 Router 的候选 provider 位置；
- `src/app/store/store.ts`、`legacy-types.ts`：router reducer/middleware/history/RootState；
- `src/app/legacy/register-utility-effects.ts`：登录失效时的应用级 history 导航端口；
- `Components/NotificationController.tsx`：当前挂载点已注释，但源码仍通过应用级 history 导航到 `/message/response`，P14 删除旧 history 导出时必须显式迁移或删除；
- `Components/Message/Message.tsx`、`Components/Focus/Focus.tsx`：两个实际嵌套 `BrowserRouter`；
- `Components/UserCenter/Router.tsx`、`Components/UserCenter/User/Router.tsx`、`Components/Board/Board.tsx`：子 route、局部 `Switch` 与重叠路径；
- Header、Edit、LogOn、Topic、UserCenter 与 `Pages/Board`：真实 route props 消费者。

P14 的最大兼容桥合同和退出项见 `route-inventory.md`；P13.5 未实现任何运行时桥。
