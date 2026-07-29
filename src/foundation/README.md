# Foundation

这里承载与具体论坛业务无关、可被整个前端复用的基础能力，例如 API 基础设施、通用组件、运行时配置、构建常量和底层工具。

当前已归位的跨应用资源：

- `types` 只承载环境和第三方声明，`@cc98/api` 业务声明仍留待 Modules 合同迁移；
- `styles` 承载全局样式入口和第三方修正；
- `theme/themes` 承载 29 个构建期主题入口，主题 id、key、顺序和输出文件名合同不变。

依赖边界：

- 可以依赖第三方包和 `foundation` 内部能力；
- 不得依赖 `modules`、`application` 或旧版业务实现；
- 不承载 Topic、User、Favorite 等具体业务语义。

迁移期例外：`styles/Site.scss` 只为保持现有 CSS 编译顺序，继续导入尚未归位的业务样式和冻结的 UBB 编辑器样式；不得在此新增业务规则，后续随各 owner 的样式迁移收口。
