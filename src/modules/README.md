# Modules

这里承载可被多个页面或入口复用的完整业务能力，例如 Topic、User、Favorite、Board 和 Post。模块按业务能力划分，而不是按页面划分。

依赖边界：

- 可以依赖 `foundation` 和第三方包；
- 不得依赖 `application`；
- 跨模块调用必须经过目标模块的公开入口，不能直接引用其内部文件；
- 迁移期对旧实现的依赖必须进入架构检查 allowlist，并写明移除条件。
