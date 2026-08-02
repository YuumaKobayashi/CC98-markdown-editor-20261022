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
- `Ubb/` 与 `Components/UbbEditor/` 继续原地冻结；C1.7.7 仅把活动 renderer/editor 的固定全局样式共置到 legacy owner 并改读既有 `--cc98-*`，UBB 内容、palette、回调与公开接口不变，完整迁址仍属于 Z2。

## 路径别名

目标 alias 为 `@application/*`、`@modules/*`、`@foundation/*`；`@legacy/*` 临时对应仓库根目录。
