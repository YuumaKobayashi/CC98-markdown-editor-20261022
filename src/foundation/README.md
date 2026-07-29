# Foundation

这里承载与具体论坛业务无关、可被整个前端复用的基础能力，例如 API 基础设施、通用组件、运行时配置、构建常量和底层工具。

依赖边界：

- 可以依赖第三方包和 `foundation` 内部能力；
- 不得依赖 `modules`、`application` 或旧版业务实现；
- 不承载 Topic、User、Favorite 等具体业务语义。
