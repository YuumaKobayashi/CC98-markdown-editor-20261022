# P13.5 文件与调用链映射

> 本清单是实施上限，不表示文件已经修改。

## 直接 `this.context.router` 调用方

| 组件 | 目标调用 | P13.5 计划 |
|---|---|---|
| `Components/Focus/FocusTopicArea.tsx` | `getFocusTopic` | 删除 Router 实参与 `declare context` |
| `Components/Search/Search.tsx` | `getSearchTopic` | 删除 Router 实参与 `declare context` |
| `Components/Search/SearchBoard.tsx` | `getSearchBoard` | 删除 Router 实参与 `declare context` |
| `Components/Message/MessageAttme.tsx` | `getMessageAttme` | 删除 Router 实参与 `declare context` |
| `Components/Message/MessageResponse.tsx` | `getMessageResponse` | 删除 Router 实参与 `declare context` |
| `Components/Message/MessageSystem.tsx` | `getMessageSystem` | 删除 Router 实参与 `declare context` |
| `Components/Message/MessageMessage.tsx` | `getRecentContact`、`sortContactList` | 删除 Router 实参与 `declare context` |
| `Components/Message/MessageWindow.tsx` | `getRecentMessage`、`sendMessage` | 删除 Router 实参与 `declare context` |
| `Components/Topic/Topic-ReplierSignature.tsx` | `like`、`dislike` | 删除 Router 实参与 `declare context`；保留现有 `withRouter` 给真实 route props 消费者 |

## 对应 service

| 文件 | 待核对并收窄的函数 |
|---|---|
| `src/entities/topic/api/service.ts` | `getFocusTopic`、`getSearchTopic` |
| `src/entities/board/api/service.ts` | `getSearchBoard` |
| `src/entities/message/api/service.ts` | `getRecentContact`、`getRecentMessage`、`sortContactList`、`getMessageSystem`、`getMessageResponse`、`getMessageAttme` |
| `src/features/message/api/service.ts` | `sendMessage` |
| `src/features/reactions/api/service.ts` | `like`、`dislike` |
| `Utility.ts` | 只作为 re-export facade 复核，不新增 Router 适配逻辑 |

`sendTopic`、`getLikeStateAndCount`、`getLikeState` 等其他带 `router` 形参的遗留导出先进入源码引用审计；只有调用者、内部转发和运行时语义均被证明后，才可作为独立小批次加入，不能因名字相似顺便修改。

## 仅盘点、P13.5 不改运行时的文件

- `Components/App.tsx`：顶层 `ConnectedRouter`、公开 route 顺序、Header/Footer 壳层；
- `src/app/providers/create-app-root.tsx`：P14 单 Router 的候选 provider 位置；
- `src/app/store/store.ts`、`legacy-types.ts`：router reducer/middleware/history/RootState 分支；
- `src/app/legacy/register-utility-effects.ts`：登录失效时唯一 app history 导航端口；
- `Components/Message/Message.tsx`、`Components/Focus/Focus.tsx`：嵌套 `BrowserRouter`；
- `Components/UserCenter/Router.tsx`、`Components/UserCenter/User/Router.tsx`、`Components/Board/Board.tsx`：子路由和重叠路径；
- Header、Edit、LogOn、Signin、Topic、UserCenter 与 `Pages/Board`：真实 `history/match/location` 消费者。

## P14 临时兼容桥最大合同

只记录当前源码真实使用的能力：

- `match.params`；
- `location.pathname`、`location.search`；
- `history.push`、`history.replace`、`history.go`、`history.length`。

P13.5 不实现该桥；P14 若确需建立，必须只覆盖上述合同并在 P15 删除，不复制完整旧 History API。
