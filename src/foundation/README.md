# Foundation

这里承载与具体论坛业务无关、可被整个前端复用的基础能力，例如 API 基础设施、通用组件、运行时配置、构建常量和底层工具。

当前已归位的跨应用资源：

- `types` 只承载环境和第三方声明，业务 API 合同由对应 Module 公共入口拥有；
- `styles` 承载全局样式入口和第三方修正；
- `theme/themes` 承载 29 个构建期主题入口，主题 id、key、顺序和输出文件名合同不变。

依赖边界：

- 可以依赖第三方包和 `foundation` 内部能力；
- 不得依赖 `modules`、`application` 或旧版业务实现；
- 不承载 Topic、User、Favorite 等具体业务语义。

通用界面组件由 `foundation/ui` 自有实现并持有全部样式。Base UI 只允许在这些自有组件内部提供无样式交互原语，业务代码不得直接依赖；Spectrum 与 Markdown Editor 的必要上游样式或覆盖只由 `styles/vendors` 加载，并由 `cc98-vendor-*` 可控根限界。

`styles/Site.scss` 是 29 个主题共同加载的纯 Foundation 导入入口，只加载 reset、document/root、链接与列表基础规则以及限界 vendor，不承载业务 selector。活动 UBB renderer/editor 的固定生成类由 `modules/ubb` 和 `modules/ubb-editor` 的相邻 owner 直接加载。

固定且跨 owner 共享的十个语义色由 `styles/tokens/_semantic-colors.scss` 作为编译期 Sass Module 集中声明，本身不输出 CSS；现有 owner 通过带命名空间的 `@use` 消费，不得把同一语义重新内联成分散字面量。29 主题的八个构建期 token 与 `--cc98-*` 合同仍由 `theme/tokens` 独立负责。
