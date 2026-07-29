# Application

这里承载页面、路由、布局、应用启动和入口编排。纯 SPA 可以在统一路由下按页面结构组织；未来若拆分多个站点或入口，再在本层增加相应子目录。

依赖边界：

- 可以组合 `modules`、`foundation` 和第三方包；
- 页面只负责入口编排，不重复实现可复用业务能力；
- Topic Detail、User Center 等页面可以同时消费同一个 Topic 或 Favorite 模块。
