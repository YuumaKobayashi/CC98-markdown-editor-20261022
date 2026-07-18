# pages

路由级页面编排层。页面负责组合 feature 和 entity，不承载可复用业务动作、通用基础设施或全局 Store 实现。

`pages` 可以依赖 `features`、`entities`、`shared` 和必要的 `integrations`，不得依赖 `app`。
