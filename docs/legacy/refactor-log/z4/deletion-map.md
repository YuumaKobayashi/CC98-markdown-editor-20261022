# Z4 删除项与消费者闭包

日期：2026-08-02

| 删除 owner/path | 删除数 | 删除前消费者/入口 | 闭包证据 |
| --- | ---: | --- | --- |
| `Pages/AnnualReview/**` | 9 | 无 Router/动态入口；内部页面互引 | 整棵 V1 页面与专属 SCSS 同批删除 |
| `Pages/AnnualReviewV2/**` | 11 | 无 Router/动态入口；内部页面互引 | 整棵 V2 页面与共享专属 SCSS 同批删除 |
| `src/modules/annual-review/**` | 2 | 仅根 `Utility.ts` 转导 | 页面和 facade 同批删除后零消费者 |
| 根 `Utility.ts` | 1 | 仅两棵 AnnualReview 页面 | 4 个剩余兼容导出均随页面失去消费者；真实 Session/Board owner 保留 |
| `src/foundation/integrations/charts/**` | 2 | AnnualReview V1/V2 各一处 | 唯一消费者删除；该兼容 stub 返回 `null`，无其他图表调用方 |
| `public/static/images/annual-review/**` | 4 | AnnualReview cover 与专属 SCSS | 资源字符串、样式引用和部署入口复核后无其他消费者 |

共删除 29 个 tracked path。另修改 3 份守卫清单：AnnualReview legacy global style 登记归零，Ant Design import 指纹只移除两棵页面带来的 4 条 import/consumer edge。

全仓活动代码复核中，`AnnualReview`、`annual-review`、`getAnnualReview*`、`IntervalChart`、AnnualReview 四个资源名与 `@foundation/integrations/charts` 均无剩余命中；历史计划与审计记录保留，不回写为活动引用。
