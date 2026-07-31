# Modules

这里承载可被多个页面或入口复用的完整业务能力，例如 Topic、User、Favorite、Board 和 Post。模块按业务能力划分，而不是按页面划分。

依赖边界：

- 可以依赖 `foundation` 和第三方包；
- 不得依赖 `application`；
- 跨模块调用必须经过目标模块的公开入口，不能直接引用其内部文件；
- 迁移期对旧实现的依赖必须进入架构检查 allowlist，并写明移除条件。

## 缓存与草稿边界

- Foundation Storage 只提供 IndexedDB、localStorage、sessionStorage 与编码驱动，不拥有业务键或 TTL；
- User、Board、Topic 与 Daily Signin 分别拥有公共用户资料、版面、标签和当日签到缓存；
- Posting 拥有 Editor 内容、回复草稿、失败回复内容及 Markdown 图片上传恢复状态；
- Application 页面只通过 Module 根入口读写这些缓存和草稿，不直接拼接业务 Storage 键。
