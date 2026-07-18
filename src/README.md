# 源码边界

`src` 承载逐阶段迁入的新源码。P06 只建立边界并迁入应用启动链，旧业务代码继续留在仓库根目录，直到其所属阶段。

## 依赖方向

主依赖方向固定为：

```text
app → pages → features → entities → shared
```

- 下层不得反向 import 上层；
- `integrations` 只依赖第三方包和 `shared`，不得依赖 `app`、`pages`、`features` 或 `entities`；
- 上层通过 `integrations` 的窄接口使用第三方能力；
- `@legacy/*` 是迁移期兼容桥，只允许已迁入模块连接尚未归位的旧实现，不得作为新业务代码的默认依赖入口；
- `Ubb/` 与 `Components/UbbEditor/` 继续原地冻结。

## 路径别名

`@app/*`、`@pages/*`、`@features/*`、`@entities/*`、`@shared/*`、`@integrations/*` 分别对应同名目录；`@legacy/*` 临时对应仓库根目录。
