# P15 首批人工确认

> 当前状态：首批已在 `6ab4c465` 提交；无 Redux 简单组件组已形成 `016ca083`/`dd514178` 检查点；用户已授权实施无 Redux 轻状态与导航组件组，本组保留未暂存 diff，P15 尚未完成，不提交、不 push、不自动进入下一组

## 已确认边界

- [x] 首批仅迁移 `MyTopics`、`MyPosts`；
- [x] 允许在目标组件范围内按 hooks 职责优化旧 lifecycle 逻辑；
- [x] 默认使用 `useEffect`，不使用 `isFirstCommit` 模拟 class lifecycle；
- [x] 保留 API、Redux、URL、展示、冻结 UBB/editor 与阶段门禁。
- [x] 无 Redux 简单组件组采用三个内部批次连续实施，整组完成后统一停止；
- [x] 零调用 legacy class 只登记为 P21 候选，不为清零数量而迁移。
- [x] 无 Redux 轻状态与导航组件组以 `dd514178` 为基线，迁移 9 个 class；
- [x] 通用 Pager 可保留一个轻量 `useState`，不迁移请求、Redux 或复杂 Focus 数据生命周期；
- [x] Focus 页签由 pathname 声明式派生，移除该路径的 `useLayoutEffect` 和 jQuery class mutation；
- [x] 本组完成后保留未暂存 diff，等待统一人工验收。

## 待确认内容

- [x] 首批最终机械验证完成并已形成 `6ab4c465`；
- [x] 无 Redux 简单组件组最终机械验证完成；
- [x] 无 Redux 轻状态与导航组件组最终机械验证完成；
- [ ] 用户完成真实页面/API 验收；
- [ ] 用户审核本轮未提交代码与文档 diff；
- [ ] 用户授权本轮代码与文档形成阶段性本地提交；
- [ ] 用户另行授权下一批。
