# P13.5 前后对照

> 实施基线：`9392e6a4`。代码已实施，机械门禁结果记录于 `server-run.md`；浏览器人工验收仍待用户完成。

## 请求调用链

- 之前：9 个 class 组件把 `this.context.router` 传给 Utility facade，再传入 entity/feature service；`sortContactList` 又把它透传给 4 个 `getRecentMessage` 调用。
- 现在：组件只传真实业务参数，service 签名和内部调用也只保留真实业务参数。
- 为什么等价：逐函数核对确认被删值只用于下一层实参位置，最终函数体从未读取它；`Utility.ts` 是通配 re-export，不包装调用。
- 保持不变：其余实参的求值顺序和调用次数，API URL、headers、body、状态码分支、错误 key、错误 effect 端口、返回值及 catch 行为。

## 无调用遗留导出

- 之前：`sendTopic`、`getLikeStateAndCount`、`getLikeState` 仍声明一个未读取的 Router 末尾形参。
- 现在：仓内调用审计确认三者只有定义和 facade re-export，没有调用点；仅删除末尾 Router 形参。
- 保持不变：导出名、其余参数、函数体和 facade 可见性；没有启用、删除或重写遗留业务。

## 组件类型与 Router import

- 之前：9 个 class 组件用 `declare context: { router: any }` 让 React 18 类型检查接受 `this.context.router`；该声明不创建或订阅运行时 context。
- 现在：对应调用参数删除后，一并删除全部 9 个 `declare context`；组件仍是原 class，state、lifecycle、DOM、timer 和事件顺序不变。
- 之前：多个组件保留从未引用的 `BrowserRouter as Router`，部分同一 import 还有未引用的 `Route`、`Link` 或 `withRouter`。
- 现在：只清理无引用 specifier；`Topic-ReplierSignature` 的 `withRouter` 等真实 route props 来源继续保留。

## Router 运行时

- 之前与现在：顶层均使用 `ConnectedRouter`；Message 与 Focus 各自创建一个嵌套 `BrowserRouter`；class 页面仍依赖 Router 4 注入的 `match/history/location`。
- 新增证据：`route-inventory.md` 固化 root route 顺序、两个实际嵌套 Router、UserCenter/User 子 route、Board 双路径事实、class route props 消费者和 P14/P15 退出项。
- P13.5 没有把 class 改为 hooks、加入新 `withRouter`、建立兼容桥或改变 Router 匹配。

## 明确不变

- 公开 URL、IIS deep link、前进后退语义；
- Router/History/Redux 依赖版本、lockfile、router reducer/middleware/history；
- 登录失效导航和全局错误呈现；
- API、storage、主题、UBB、样式和业务组件 owner。
