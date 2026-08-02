# Z4 验证与人工验收清单

日期：2026-08-02

## 已执行的机械与静态证据

- [x] 删除前核对 Router、lazy/dynamic import、bootstrap、Vite、HTML/EJS、IIS、公开资源与活动源码；未发现 AnnualReview 运行入口或仓外独立部署合同。
- [x] AnnualReview 两代页面、Module、根 Utility facade、唯一消费图表 stub、专属样式与 4 个公开资源共 29 个 tracked path 完整删除。
- [x] 活动代码中 `AnnualReview`、`annual-review`、`getAnnualReview*`、`IntervalChart`、AnnualReview 资源名与图表入口引用归零。
- [x] `npm run check:architecture`：396 个 source files、1556 条 imports、0 architecture violations；132 个真实 CSS Module、29 主题、0 冻结 legacy style edge；109 条第三方 import edge、3 个 vendor style owner。
- [x] `npm run typecheck`：modern 与 legacy 均通过。
- [x] `npm run build`：受限沙箱首次因既知 `spawn EPERM` 失败；在允许子进程的环境原命令重跑通过，Vite 8.1.4 转换 4124 个 modules。
- [x] `git diff --check`：通过；仅有 Git 的 LF→CRLF 工作区提示，无 whitespace error。

## 未执行的运行验收

- [ ] 浏览器主 Router、首页与登录流程回归。
- [ ] 29 主题切换、刷新持久化及响应式视觉回归。
- [ ] 公开静态资源中非 AnnualReview 内容的请求抽查。

AnnualReview 功能本身已经按产品决定删除，不要求恢复入口或执行页面运行验收。

## 阶段门禁

- [x] 未删除 `@legacy` alias、`tsconfig.legacy.json` 或 Vite legacy compiler options。
- [x] 未修改根 README/架构终态目录，未替换 Markdown。
- [x] 未 commit、未 push、未进入 Z5。
