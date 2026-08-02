# 源码边界

`src` 承载逐阶段归入目标架构的新源码。旧业务代码继续留在仓库根目录，直到其所属阶段。

## 依赖方向

目标依赖方向固定为：

```text
application → modules → foundation
```

- `src/application` 是 Application Shell 与 Route owner；业务能力统一由 `src/modules` 承载；
- 第三方适配已经归入 `src/foundation/integrations`；
- 环境/第三方声明、全局样式入口和 29 个主题已经分别归入 `src/foundation/{types,styles,theme/themes}`；
- `@types/@cc98` 仍由后续业务阶段处理；根 `Styles/` 已在 C1.7.7 完成 owner 归位并清空，禁止重新建立；
- Foundation 不得依赖 Modules 或 Application，Modules 不得依赖 Application；
- `@legacy/*` 是迁移期兼容桥，只允许已迁入模块连接尚未归位的旧实现，不得作为新业务代码的默认依赖入口；
- UBB Container、engine 与 tag 由 `modules/ubb` 承载，Editor 与状态由独立的 `modules/ubb-editor` 承载；业务消费者只经各自 Module 根入口使用，Handler 注册链和编辑器合同由模块内守卫冻结。

## 路径别名

目标 alias 为 `@application/*`、`@modules/*`、`@foundation/*`；`@legacy/*` 临时对应仓库根目录。
