# P15 首批人工确认

> 当前状态：前四组已形成至 `312abe27` 的检查点；用户中心交互叶子组代码检查点为 `607289f3`，文档本地提交已获授权；真实页面/API 验收仍独立开放，P15 尚未完成、不 push、不自动进入下一组

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
- [x] 用户中心交互叶子组以 `312abe27` 为基线，迁移 `Navigation`、`MyFavoritesBoard`、`MyFollowingsUser`；
- [x] 允许修复用户取关请求漏写 `await`，并明确记录失败行为变化；
- [x] 保留导航 URL/DOM/回顶动画、卡片 API/文案/CSS 与关注 Redux action；
- [x] 本组完成后保留未暂存 diff，等待人工验收。
- [x] 用户中心 Redux 页面与壳层组以 `594215b7` 为基线，迁移 5 个 class；
- [x] 允许目标 page 使用 typed Redux hooks、路由参数和真实依赖 effect；
- [x] 关注/粉丝页首次进入滚动到顶部，非正页码统一回退第 1 页；
- [x] 保留 thunk、API、`isLoading` 共享状态、`hasTotal={true}` 及未迁移 mutation 子组件；
- [x] 本组完成后保留未暂存 diff，等待统一人工验收。

## 待确认内容

- [x] 首批最终机械验证完成并已形成 `6ab4c465`；
- [x] 无 Redux 简单组件组最终机械验证完成；
- [x] 无 Redux 轻状态与导航组件组最终机械验证完成；
- [x] 用户中心 Redux 页面与壳层组最终机械验证完成并形成代码检查点 `32ff97d8`；
- [x] 用户中心交互叶子组最终机械验证完成并形成代码检查点 `607289f3`；
- [ ] 用户完成真实页面/API 验收；
- [x] 用户审核本轮未提交代码与文档 diff；
- [x] 用户授权本轮代码与文档形成阶段性本地提交；
- [x] 用户已另行授权当前交互叶子组；下一组仍需另行授权。
