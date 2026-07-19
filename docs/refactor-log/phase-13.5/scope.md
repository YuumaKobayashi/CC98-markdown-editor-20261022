# P13.5 Router 去伪依赖与迁移清单范围

> 状态：P13 已人工接受并提交为 `276d0ec0`；P13.5 阶段文档已建立但尚未实施，仍须用户明确授权开始；不 push、不开始 P14

## 唯一大事

在 React 18.3 与现有 React Router 4、`ConnectedRouter`、Redux Store、公开 URL 和请求行为保持不变的前提下，删除已证明未被读取的 Router 参数与 `this.context.router` 类型假声明，并形成 P14 可逐项执行的路由事实清单。

## 允许范围

- 对 `FocusTopicArea`、Message、Search、`Topic-ReplierSignature` 中现有 `this.context.router` 调用链做逐函数语义核对；
- 仅当函数体和所有内部转发均未读取 Router 时，删除对应 service 参数、内部转发参数、调用参数与 `declare context`；
- 删除已证明无引用的旧 Router import，但不改变任何实际导航调用；
- 记录当前顶层 `ConnectedRouter`、Message/Focus 嵌套 `BrowserRouter`、UserCenter/Board 子路由和全部公开 URL；
- 记录 class 组件实际依赖的 `match.params`、`location` 与 `history.push/replace/go/length`，作为 P14 临时兼容桥的最大合同；
- 写明 P14 的单 Router、持久 AppShell、嵌套路由、Redux Router 清理和 P15 兼容桥退出边界；
- 执行两套 TypeScript、正式构建、diff 检查和代表路径人工验收。

## 禁止范围

- 不升级或替换 `react-router`、`react-router-dom`、`react-router-redux`、`history` 及其类型包；
- 不将 `ConnectedRouter` 改为 `BrowserRouter`，不删除 router reducer/middleware/history 单例；
- 不将 `Switch` 改为 `Routes`，不改变 `Route component`、`Redirect`、`withRouter` 或 route 匹配规则；
- 不移除 Message/Focus 的嵌套 `BrowserRouter`；该运行时切换属于 P14；
- 不新增 `withLegacyRouteProps` 等运行时适配器，不函数化 class 组件；
- 不改变 API URL、请求参数、返回值、错误 key、Redux action、storage key、DOM、样式、主题或 timer 顺序；
- 不修改冻结的 `Ubb/**`、`Components/UbbEditor/**`；
- 不顺便修复路由遮蔽、大小写路径、参数变化不重新取数或其他旧缺陷；
- 不混入尚未完成的 P13 runtime 修复，不提交、不 push、不开始 P14。

## 完成条件

1. 目标调用链中不存在 `this.context.router` 或对应 `declare context`；
2. 被删除的每个 `router` 参数均有“函数体未读取、内部转发未使用、调用顺序不变”的证据；
3. 请求 URL、headers、body、状态码分支、`throwLegacyError` 和返回值保持原顺序；
4. `route-inventory.md` 覆盖顶层公开 URL、嵌套路由、导航消费者与 P14 风险；
5. 当前 Router 4、`ConnectedRouter`、Store 和依赖清单没有变化；
6. `npm run typecheck`、`npm run build` 与 `git diff --check` 通过；
7. Message、Focus、Search 和 Topic reaction 代表路径经人工确认；
8. 用户逐批审核实现和文档后，才允许创建本地提交；P14 仍需单独授权。
