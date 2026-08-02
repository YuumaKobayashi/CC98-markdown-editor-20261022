# Z3 验证与人工验收清单

日期：2026-08-02

## 已执行的机械证据

- [x] `npm run check:architecture`：400 个 source files、1561 条 imports、0 architecture violations。
- [x] style guard：132 个真实 CSS Module、29 主题、0 未登记 global occurrence、2 条冻结 legacy style edge。
- [x] dynamic-content guard：18 条直接 consumer edge、63 条活动 UBB 注册、16 个 style boundary。
- [x] third-party guard：113 条登记 import edge、33 条 Ant Design portal/config consumer edge、3 个 vendor style owner。
- [x] Foundation style guard：12 个登记文件、86 个 layout consumer、1 份冻结 AnnualReview global style。
- [x] `npm run typecheck`：modern 与 legacy 均通过。
- [x] `npm run build`：受限沙箱首次因 `spawn EPERM` 失败；在获准的非受限环境原命令重跑通过，Vite 8.1.4 转换 4124 个 modules。
- [x] `git diff --check`：通过；仅有 Git 的 LF→CRLF 工作区提示，无 whitespace error。
- [x] `src/**/*.ts(x)` 中 `@legacy` 边为 0；根 legacy 工作区只剩 20 个 AnnualReview path 与 `Utility.ts`。
- [x] `CC98Calendar.tsx`、`CC98Calendar.module.scss`、`ReSignCalendar.module.scss` 迁址前后 blob/逐行内容一致；`ReSignCalendar.tsx` 仅有 import owner 差异；`ErrorBoundary` 仅删除零消费 `ErrorEmitter`。

## 未执行的运行验收

- [ ] 浏览器首页、Board、Topic Detail、User Center/Favorites、User Profile、Daily Signin 路由验收。
- [ ] 真实登录/API/权限、补签卡、通知、SignalR 和跨标签验收。
- [ ] 29 主题、日夜切换、响应式与视觉对比。
- [ ] UBB/Markdown 编辑、预览、上传、媒体和草稿恢复回归。

## 阶段门禁

- [x] AnnualReview 与其 Module/样式/资源未删除。
- [x] `@legacy` alias、`tsconfig.legacy.json` 与 Vite legacy compiler branch 未删除。
- [x] 未 commit、未 push、未进入 Z4。
