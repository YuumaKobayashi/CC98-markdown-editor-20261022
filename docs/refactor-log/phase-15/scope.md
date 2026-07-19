# P15 函数组件 C 范围

> 当前状态：首批 `MyTopics`/`MyPosts` 已在 `6ab4c465` 提交；无 Redux、无 local state 的简单组件组已形成阶段性代码提交 `016ca083`，P15 尚未完成，等待人工验收与后续批次授权

## 唯一大事

将仍依赖 Redux、Router 或复杂 lifecycle 的 React class 按风险分组迁为函数组件，并随批次归入 `app/pages/features/entities/shared` owner。当前已完成首批 route-aware 页面和第二组 13 个无 Redux 简单 class，但 P15 尚未完成。

## 本轮允许范围

- 迁移 11 个在用文件中的 13 个无 Redux、无 local state class；
- 按 entity 展示、共享/app 展示、无状态页面组合分三个内部批次；
- 保留旧路径 facade，并把已迁移模块与少量直接 owner 调用方切到窄入口；
- `DocumentTitle` 使用 `useEffect`；修复 `MessagePerson` 修改 props 和用户生日格式异常时的空匹配崩溃；
- 建立逐组件对照、class 清单、文件映射、静态证据和人工清单。

## 禁止范围

- 不迁移 Redux、local state、timer、请求、Modal mutation、复杂 lifecycle 或本轮外 class；
- 不删除全局 `legacy-route-props`、`RouteComponent` 或 `navigation-prompt`；
- 不改变公开 URL、API、Redux state、样式、主题、依赖或冻结 UBB/editor；
- 不使用 `isFirstCommit`、previous-props 模拟器、无依据的 `useLayoutEffect`、`React.FC` 或组件级箭头函数；
- 不修改 `.vscode/`，除用户授权的阶段性检查点提交外不额外提交，不 push，不自动进入下一组。

## 完成条件

1. 本轮 13 个目标 class 均由具名函数承接，旧文件只保留兼容导出；
2. 新 owner 没有 Redux/Store 依赖或 local state；
3. 每个内部批次两套 TypeScript、diff 与静态审计通过，整组正式构建通过；
4. AST class 总数从 149 降到 136；
5. 形成阶段性代码与文档检查点后停止，等待真实页面/API 验收和后续批次授权。
