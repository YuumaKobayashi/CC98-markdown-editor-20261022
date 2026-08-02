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

第三方样式边界：Ant Design、Spectrum 与 Markdown Editor 的上游样式或必要覆盖只由 `styles/vendors` 加载；CC98 override 必须由 `cc98-vendor-*` 可控根限界，业务 CSS Module 不得直接命中第三方内部全局类。当前 import、Portal、Router、Spectrum 挂载与 Markdown Editor 根合同由 `scripts/third-party-boundary.json` 和架构检查冻结。

`styles/Site.scss` 是 29 个主题共同加载的纯 Foundation 导入入口，只允许按 `scripts/foundation-style-boundary.json` 登记的顺序加载 reset、document/root、限界 vendor 与布局原语，不承载业务 selector，也不反向导入 legacy 目录。活动 UBB renderer/editor 的固定生成类暂由其相邻 legacy owner 直接加载，并分别登记为到 Z2 为止的动态内容例外。

固定且跨 owner 共享的十个语义色由 `styles/tokens/_semantic-colors.scss` 作为编译期 Sass Module 集中声明，本身不输出 CSS；13 个登记 owner 必须通过带命名空间的 `@use` 消费，不得把同一语义重新内联成分散字面量。29 主题的八个构建期 token 与 `--cc98-*` 合同仍由 `theme/tokens` 独立负责。
