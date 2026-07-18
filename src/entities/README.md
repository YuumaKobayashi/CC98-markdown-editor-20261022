# entities

board、topic、post、user、message 和 tag 等领域对象的 owner。这里可以包含领域数据、类型和展示，但不直接控制页面跳转或全局错误 UI。

`entities` 可以依赖 `shared` 和必要的 `integrations`，不得依赖 `app`、`pages` 或 `features`。
