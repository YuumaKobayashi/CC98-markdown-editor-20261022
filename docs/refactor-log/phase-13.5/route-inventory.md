# P13.5 路由事实清单

> 状态：计划基线；P13.5 实施时必须从接受后的 P13 源码重新生成并逐项核对。

## 当前根路由

当前 `Components/App.tsx` 在 `ConnectedRouter` 下声明以下公开入口：

- `/`；
- `/topic/hot-monthly`、`/topic/hot-weekly`、`/topic/hot-history`；
- `/topic/:topicid/:page?`；
- `/topic/:topicId/postid/:postId/:page?`；
- `/list/:boardId/:type?/:page?`、`/boardlist`、`/board/:id/:page?`；
- `/usercenter`、`/user/:method/:id`；
- `/message`、`/focus`；
- `/newtopics`、`/recommendedtopics`；
- `/logon`、`/signin`；
- `/search`、`/searchBoard`；
- `/sitemanage`、`/editor/:mode/:id?`；
- `/error/401`、`/index` 与最终 404 fallback。

年度报告路由以 P13 最终接受状态为准；P13.5 不恢复或重新设计图表功能。

## 当前嵌套路由

### Message

- `/message`；
- `/message/response/:page?`；
- `/message/attme/:page?`；
- `/message/system/:page?`；
- `/message/message/:page?`；
- `/message/setting`。

当前由 `Components/Message/Message.tsx` 内部 `BrowserRouter` 承载；P13.5 只记录风险，P14 才迁为根 Router 下的 layout route。

### Focus

- `/focus`；
- `/focus/board`；
- `/focus/user`；
- `/focus/favorite`。

当前由 `Components/Focus/Focus.tsx` 内部 `BrowserRouter` 承载；P13.5 不移除。

### UserCenter、User 与 Board

这些区域同时存在子 `Switch`、`Redirect`、可选参数和重叠路径。P13.5 必须补齐逐 route 的 owner、当前匹配顺序、route props 消费者和代表 URL，P14 不允许仅凭组件名机械改写。

## P14 必须保持的行为

- 地址栏、刷新、分享链接和 IIS SPA fallback 使用完全相同的公开 URL；
- 浏览器 back/forward 与页内 `Link/NavLink` 指向同一 Router history；
- 同一组件只改变 route params 时，既有重新取数时机不被静默改变；
- Header/Footer 在页面切换时保持持久；
- 登录失效、发帖/编辑成功、搜索和用户中心筛选的程序化跳转保持原目标与 push/replace 语义；
- Router 4 `Switch` 的首次匹配与现代 Router 的最佳分支匹配差异逐项人工核对。
