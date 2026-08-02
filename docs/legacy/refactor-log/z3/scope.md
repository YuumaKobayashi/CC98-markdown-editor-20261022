# Z3 Pages、Components 与根级适配器收口范围

日期：2026-08-02

实施基线：干净的 `dev20260716@7bf2b5cd`

范围：只实施 Z3；不删除 AnnualReview，不删除 `@legacy` alias 或 `tsconfig.legacy.json`，不替换 Markdown，不 commit、不 push、不进入 Z4

## 1. 本批完成项

- 将应用根错误边界迁入 `src/application/providers/error-boundary.tsx`；保留原 `componentDidCatch`、`window.errorInfo`、`error-template` 与 `root.replaceWith` 合同，删除零 symbol consumer 的测试 `ErrorEmitter`。
- 将补签日历实现及两份同名 CSS Module 迁入 Daily Signin Route；`CC98Calendar` 与两份样式文本保持，`ReSignCalendar` 只切换 owner import。
- 将 13 条活动 `src/** -> @legacy/**` 边切到已有 Module/Foundation/Application owner；活动 TypeScript 中 `@legacy` import 归零。
- 删除 115 个旧 `Components` path、11 个非 AnnualReview `Pages` facade，以及 12 个 `Utility/IndexedDB/config/Store/SignalR` 适配 path；其中 5 个活动实现/样式 path 完成迁址，其余均在零 inbound consumer 复核后删除。
- 根 `Utility.ts` 从 29 组通配导出收缩为 AnnualReview 休眠页面所需的 4 个精确导出：`getAnnualReview`、`getAnnualReviewV2`、`getMyInfo`、`syncGetBoardNameById`；留待 Z4 与两棵页面整体删除。
- `tsconfig.legacy.json` 仅继续编译根 `Utility.ts` 与 `Pages/AnnualReview*`；双编译与 alias 本身留到 Z5。

## 2. 明确保留的边界

- `Pages/AnnualReview/**`、`Pages/AnnualReviewV2/**`、`src/modules/annual-review/**`、其全局 SCSS 与静态资源均不动。
- 公开 URL、Router、API path/wire shape、Storage/IndexedDB 键与序列化、Session/Notification/SignalR、DOM/ID/ref、29 主题及 UBB/Markdown 合同不重写。
- 根 README 的终态目录清单、`@legacy` alias、legacy compiler 分支与空目录属于 Z5；本批只修正与已删除 Store/Status facade 直接相关的 Application owner 文档。

## 3. 当前停点

代码、consumer 闭包、样式/第三方指纹、modern/legacy typecheck 和正式 build 已完成。浏览器、真实 API、权限、登录、SignalR、跨标签、通知、补签、主题和响应式验收未执行。本批保持未提交工作树，等待人工验收与单独提交授权。
