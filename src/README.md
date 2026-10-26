# 源码边界

`src` 是浏览器业务源码的唯一根边界，只包含 `application`、`modules` 和 `foundation`。

## 依赖方向

目标依赖方向固定为：

```text
application → modules → foundation
```

- `src/application` 是 Application Shell 与 Route owner；业务能力统一由 `src/modules` 承载；
- 第三方适配已经归入 `src/foundation/integrations`；
- 环境/第三方声明、全局样式入口和 29 个主题已经分别归入 `src/foundation/{types,styles,theme/themes}`；
- 业务 API/DTO 类型已归对应 Module，环境与第三方声明位于 `foundation/types`；
- Foundation 不得依赖 Modules 或 Application，Modules 不得依赖 Application；
- UBB Container、engine 与 tag 由 `modules/ubb` 承载，Editor 与状态由独立的 `modules/ubb-editor` 承载；业务消费者只经各自 Module 根入口使用，Handler 注册链和编辑器合同由模块内守卫冻结。

## 路径别名

有效 alias 为 `@application/*`、`@modules/*`、`@foundation/*`。仓库根目录不再是 TypeScript 源码解析边界。
