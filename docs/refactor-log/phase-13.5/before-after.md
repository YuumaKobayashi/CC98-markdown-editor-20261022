# P13.5 前后对照

> 本文件描述计划合同；P13.5 尚未实施。

## 请求调用链

- 之前：多个 class 组件把 `this.context.router` 传给 Utility facade，再传入 entity/feature service；目标 service 实际通过 `cc98Fetch`、`throwLegacyError` 和既有 effect port 完成请求与错误处理，没有读取该 Router 对象。
- 之后：组件只传真实业务参数，service 签名也只保留真实业务参数；请求 URL、headers、body、状态码分支、错误副作用和返回值不变。
- 原因：先去掉假的跨层依赖，避免 P14 误以为 entity/feature 请求层必须依赖 Router。

## 组件类型

- 之前：9 个 class 组件用 `declare context: { router: any }` 让 React 18 类型检查接受 `this.context.router`；该声明不创建或订阅运行时 context。
- 之后：对应调用参数删除后，一并删除 `declare context`；组件仍是原 class，state、lifecycle、DOM 和事件顺序不变。
- 不会在 P13.5 把它们改为 hooks 或加入 `withRouter`。

## Router 运行时

- 之前：顶层使用 `ConnectedRouter`；Message 与 Focus 各自创建嵌套 `BrowserRouter`；class 页面依赖 Router 4 自动注入的 `match/history/location`。
- P13.5 之后：运行时仍完全相同，只新增可审核的事实清单。
- P14 之后的目标才是：单一现代 Router、持久 Header/Footer、嵌套路由、无 Redux 路由副本；尚未函数化的 class 只通过有明确删除阶段的窄兼容桥接收实际使用的 route props。

## 明确不变

- 公开 URL、IIS deep link、前进后退语义；
- Router/History/Redux 依赖版本；
- 登录失效导航和全局错误呈现；
- API、storage、主题、UBB、样式和业务组件 owner。
