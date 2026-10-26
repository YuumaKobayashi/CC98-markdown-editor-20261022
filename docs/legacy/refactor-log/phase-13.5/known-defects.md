# P13.5 已知问题与保留项

## `P13.5-CONTEXT-001`：TypeScript 声明不等于运行时 context

- `declare context: { router: any }` 只影响类型检查，不创建或订阅 Router context；
- 当前目标调用链传入的 Router 参数均需从函数体和内部转发证明是否真实使用；
- P13.5 删除假的依赖，不用 `any` 扩大新的 Router 合同。

## `P13.5-EFFECT-001`：请求错误副作用不由形参 Router 提供

- 目标 service 当前通过 `throwLegacyError` 和 `legacy-utility-effects` 端口呈现错误；
- 删除 Router 参数时不得移动、合并或重写状态码分支；
- 登录失效的 `logOffAndNavigate` 仍依赖 app history，该真实导航端口留给 P14。

## `P13.5-NESTED-001`：Message/Focus 嵌套 BrowserRouter 风险保留

- 嵌套 Router 可能导致外层位置、前进后退与内部导航不同步；
- P13.5 只登记和建立人工基线，不改变运行时；
- P14 在单 Router route tree 中移除嵌套实例。

## `P13.5-MATCH-001`：Router 4 与现代匹配规则不同

- 当前 `Switch` 依赖声明顺序首次匹配；现代 Router 选择最佳分支；
- Board、UserCenter、User、可选 page 参数和 fallback 必须有代表 URL；
- P13.5 不修复现有遮蔽或大小写问题，只记录当前可观察行为。

## `P13.5-BOARD-001`：Board 存在双 owner 与旧子 route 可达性疑点

- 根 `/board/:id/:page?` 当前挂载 `Pages/Board/index.tsx`，根 `/list/:boardId/:type?/:page?` 挂载 legacy `BList`；
- `BList` 内部仍声明 `/board/*` 的 tag/best/save/record/普通列表 `Switch`，但仓内未发现除 `/list/*` 根 route 外的 `BList` 挂载点；
- P13.5 只固化该事实，不判断或修复旧分支可达性；P14 改写 Board route 前必须以代表 URL 做浏览器基线核对。

## `P13.5-ERROR-001`：错误导航目标与显式 route 不完整对应

- `Pages/Board/index.tsx` 会导航到 `/error/404`、`/error/401`、`/error/500`；
- 根 route 当前只显式声明 `/error/401`，其余目标会落入最终 404 fallback；
- P13.5 不补 route、不改错误页，P14 必须保持现状或另行申请缺陷修复授权。

## `P13.5-CLASS-001`：class route props 仍需过渡合同

- 多个 class 组件读取 `match.params`、`location` 和 `history`；
- P14 不能顺便把复杂 lifecycle 全部函数化；
- 若建立临时 route props bridge，只能实现源码实际使用的最小能力，并明确在 P15 删除。

## `P13.5-BASELINE-001`：不得从未接受的 P13 工作树起步

- P13.5 的基线必须是 P13 实现、机械门禁和人工验收均得到用户明确接受后的状态；
- P13 已得到用户明确接受并提交为 `276d0ec0`；P13.5 开始时仍须另行记录当时的 HEAD 与工作树状态；
- 用户已授权 P13.5 实现；实施起点为阶段规划提交 `9392e6a4`，开始时仅有未跟踪 `.vscode/`；
- P13.5 不吸收或提交任何未获批准的 P13 代码。

## `P13.5-BASELINE-002`：继承 P13 暂停的 Math UBB

- `MathTagHandler` 与 `MathTextHandler` 已在 P13 从 UBB engine 取消注册，模块以 `@ts-nocheck` 标记为暂时禁用；
- `[math]` 与 `[m]` 在 React 18 与 MathJax 兼容验证完成前不可用；
- P13.5 不恢复或重写该功能，后续恢复必须单独审核类型、渲染和 MathJax 运行时行为。
