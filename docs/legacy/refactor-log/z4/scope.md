# Z4 AnnualReview 完整移除范围

日期：2026-08-02

实施基线：干净的 `dev20260716@07e1a3b4`

范围：只实施 Z4；不删除 `@legacy` alias 或 `tsconfig.legacy.json`，不改根 README 终态目录，不替换 Markdown，不 commit、不 push、不进入 Z5

## 1. 删除前可达性结论

- 主 Router、lazy/dynamic import、bootstrap、Vite、HTML/EJS、IIS 与活动源码均没有 AnnualReview 入口；两个页面树是 Z3 后仅由 legacy typecheck 保留的休眠实现。
- `src/modules/annual-review` 只被根 `Utility.ts` 转导，`Utility.ts` 的 4 个剩余导出只被两棵 AnnualReview 页面消费；页面删除后整个 facade 可删除。
- `src/foundation/integrations/charts` 只被 AnnualReview V1/V2 各一个页面消费；实现是为休眠页面保留、返回 `null` 的 React 18 兼容 stub，不是其他业务共享能力。
- `public/static/images/annual-review` 的 4 个资源只有 AnnualReview 页面或专属 SCSS 引用；未发现仓外独立部署清单或其他业务消费者。

## 2. 本批完成项

- 删除 `Pages/AnnualReview/**` 9 个 path 与 `Pages/AnnualReviewV2/**` 11 个 path，包括专属全局 SCSS。
- 删除 `src/modules/annual-review/**` 2 个 path及 `/me/annual-review-2022`、`/me/annual-review-${year}` 休眠 API 实现。
- 删除根 `Utility.ts`，不保留 AnnualReview 空 facade；Session 与 Board 原真实 owner 不受影响。
- 删除 AnnualReview 唯一消费的 `foundation/integrations/charts` 2 个兼容 stub path，以及 4 个专属公开静态资源。
- 从 style owner、Foundation style 与 third-party 指纹清单移除只属于上述已删页面的登记；其余第三方边和 3 个 vendor style owner 保持。

## 3. 明确保留的边界

- 不恢复 AnnualReview Route，不建立新的 Application、Module、重定向或空兼容入口。
- `@legacy` alias、`tsconfig.legacy.json`、Vite legacy compiler options、根 README 与空根目录的最终闭包留给 Z5。
- Markdown 编辑器、29 主题、主 Router、首页、登录、Session、Board、UBB、API 与公开静态资源目录中的其他内容均不改写。

## 4. 当前停点

代码删除、consumer/资源闭包、守卫、modern/legacy typecheck 和正式 build 已完成。AnnualReview 功能本身按计划不要求运行验收；主 Router、首页、登录、主题和其余公开资源的浏览器验收未执行。本批保持未提交工作树，等待人工验收与单独提交授权。
