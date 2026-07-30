# 源码边界

`src` 承载逐阶段归入目标架构的新源码。旧业务代码继续留在仓库根目录，直到其所属阶段。

## 依赖方向

目标依赖方向固定为：

```text
application → modules → foundation
```

- `src/application` 是 Application Shell owner，`src/pages` 仍是迁移期 Route owner；业务能力统一由 `src/modules` 承载；
- 第三方适配已经归入 `src/foundation/integrations`；
- 环境/第三方声明、全局样式入口和 29 个主题已经分别归入 `src/foundation/{types,styles,theme/themes}`；
- `@types/@cc98` 和 `Styles/{MainPage,UbbEditor,UserCenter,Vote}.scss` 仍由后续业务阶段处理；
- Foundation 不得依赖 Modules 或 Application，Modules 不得依赖 Application；
- `@legacy/*` 是迁移期兼容桥，只允许已迁入模块连接尚未归位的旧实现，不得作为新业务代码的默认依赖入口；
- `Ubb/` 与 `Components/UbbEditor/` 继续原地冻结。

## 路径别名

目标 alias 为 `@application/*`、`@modules/*`、`@foundation/*`。迁移期继续保留 `@pages/*`；`@legacy/*` 临时对应仓库根目录。
