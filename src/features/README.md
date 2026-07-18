# features

登录、关注、收藏、发帖和管理等用户动作的 owner。每个 feature 只暴露窄入口，禁止建立全仓 giant barrel。

`features` 可以依赖 `entities`、`shared` 和必要的 `integrations`，不得依赖 `app` 或 `pages`。
