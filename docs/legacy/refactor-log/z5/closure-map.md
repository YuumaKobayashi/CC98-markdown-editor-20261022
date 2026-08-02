# Z5 根目录与配置闭包清单

日期：2026-08-02

| 闭包项 | 实施前 | 终态 | 证据 |
| --- | --- | --- | --- |
| TypeScript alias | `@application/*`、`@modules/*`、`@foundation/*`、`@legacy/*` | 只保留前三项 | 活动源码 `@legacy` import 为 0；modern typecheck 通过 |
| TypeScript 编译 | modern + legacy 两份配置 | 唯一 `tsconfig.json` | `tsconfig.legacy.json` 删除；`npm run typecheck` 通过 |
| Vite TS 转译 | 按 `src`/根路径选择两套 compiler options | 所有浏览器源码使用 `tsconfig.json` | 4124 modules 正式构建通过 |
| 架构例外 | 空 `architecture-allowlist.json` 与 allowlist 代码 | 无 allowlist，所有违规直接失败 | 396 source files、1556 imports、0 violations |
| 守卫扫描根 | `src` 加多个已空 legacy 根 | 唯一活动扫描根 `src` | style/dynamic/third-party/Foundation 守卫通过 |
| 根级源码目录 | 10 个无文件空目录；`Ubb` 已不存在 | 11 个计划目标均不存在 | 删除前 10 个目录递归文件数均为 0；终态逐路径 `Test-Path=False` |
| 业务 ambient 类型 | modern config 无 `@types/@cc98` include | 各 Module 公共类型 owner | `@cc98/api` 活动引用为 0；modern typecheck 通过 |
| 当前架构文档 | 仍描述迁移桥和根 legacy owner | 三层源码终态 | 根与四层 README、架构 inventory 已更新 |

## Z1 临时 `any` 对账

Z5 不收窄类型。`docs/refactor-log/z1/type-debt.md` 登记的 6 项均在唯一 owner 中精确存在一次：

| 登记项 | 当前路径 | 数量 | 处置 |
| --- | --- | ---: | --- |
| `IConfig.recommendationFunction` | `src/modules/site-content/model/types.ts` | 1 | 移交独立类型查明批次 |
| `ITopic.highlightInfo` | `src/modules/topic/model/types.ts` | 1 | 移交独立类型查明批次 |
| `IPost.allowedViewers` | `src/modules/post/model/types.ts` | 1 | 移交独立类型查明批次 |
| `IPost.awardInfo` | `src/modules/post/model/types.ts` | 1 | 移交独立类型查明批次 |
| `IPost.lastUpdateAuthor` | `src/modules/post/model/types.ts` | 1 | 移交独立类型查明批次 |
| `IPost.lastUpdateTime` | `src/modules/post/model/types.ts` | 1 | 移交独立类型查明批次 |

源码中其他既有 `any` 不是 Z1 搬移新增项，Z5 不将它们伪登记为已查明或顺手改型。`ISignIn.lastSignInTime` 的 string/number 合同冲突也继续保留到取得真实 `/me/signin` 响应证据后的独立批次。
