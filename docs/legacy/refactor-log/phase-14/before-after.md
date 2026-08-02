# P14 前后对照

## 应用结构

```text
之前
Provider -> ConnectedRouter -> App
                           -> Header
                           -> Switch 页面
                           -> Message BrowserRouter
                           -> Focus BrowserRouter
                           -> Footer

现在
Provider -> RouterProvider -> AppShell（持续挂载）
                              -> Header
                              -> ErrorControl
                              -> Outlet（route lazy 页面）
                              -> Footer
```

## 行为映射

- 公开路径保持原形；Router 7 route 默认前缀匹配与旧非 `exact` route 的差异，通过显式 `/*` 表达。
- Message、Focus、UserCenter、User 的局部选择逻辑成为父 route + child route；layout 本身不再创建 history。
- Header 不再直接读取全局 `location`，由持久壳层根据 Router location 传入 pathname。
- class 仍看到旧式 route props，但对象只包含经 P13.5 证明实际使用的字段。
- 登录失效与通知跳转不再 dispatch `react-router-redux` action，而调用当前 Router 的 navigation port。
- 编辑页站内离开由 Router blocker 确认，刷新/关闭由 `beforeunload` 保护。
- Redux 从四个 legacy 分支变为 `error`、`userInfo`、`message` 三个分支；路由状态以 Router location 为唯一事实源。
- 页面实现由静态 import 改为 route `lazy`；业务 service 与组件 lifecycle 保持原 owner。

## 产物结果

最终生产构建生成各页面独立动态块；入口 `main` 块约 `38.40 kB`，代表块包括 `MainPage 15.27 kB`、`Message 1.98 kB`、`UserCenter 2.64 kB`。共享 vendor 仍约 `1.78 MB`，属于后续性能工作，不在 P14 扩 scope。
