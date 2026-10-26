# Z0 全量清单、可达性与合同冻结范围

日期：2026-08-02

实施基线：干净的 `dev20260716@de6eca90`

范围：仅 Z0 审计与冻结记录；不实施 Z1–Z5，不删除或迁移运行时代码，不 commit、不 push

## 1. 本批完成项

- 以 `git ls-files` 建立根级 legacy tracked file map；根级候选共 273 个 tracked 文件。
- 从 `src/application/bootstrap/index.tsx` 出发，覆盖静态 import/export、Router lazy `import()`、`require()` 和 alias 解析，建立加载与运行时可达图。
- 对现代源码到 `@legacy/*` 的 82 条直接 import 建立 consumer map；其中 27 条 Module 到 legacy 的架构例外继续由 `scripts/architecture-allowlist.json` 精确守卫。
- 复核 Router、Vite/Template、IIS rewrite、独立 HTML、样式/资源 manifest、UBB Handler 注册与 AnnualReview 独立入口。
- 逐项复核历史 16 个零调用/P21 候选，并分别记录“被加载”“运行时可达”“存在直接调用”。
- 冻结 URL、API、Storage/IndexedDB、UBB、SignalR/Notification/Session、主题和缓存合同；机械检查与运行验收分开记录。

## 2. 明确不做

- 不因零静态调用删除文件、symbol、注释、样式或资源。
- 不迁移 `@types/@cc98`、Props/States/Match、UBB、Components/Pages/Utility，也不建立临时兼容 facade。
- 不改变 Router、API URL/method/body、Storage 键/TTL/编码、UBB 注册顺序、DOM/CSS、主题 manifest 或 IIS rewrite。
- 不修复既有缺陷，不把 typecheck/build 当作浏览器、真实 API、权限、媒体、跨标签或通知验收。

## 3. 输出

- `file-map.md`：tracked file map 与阶段分配。
- `tracked-files.txt`：当前基线 273 个根级 legacy tracked path 的逐文件快照。
- `owner-consumer-map.md`：活动加载图、直接 consumer 与目标 owner。
- `candidate-reachability.md`：16 个历史候选逐项证明。
- `contract-baseline.md`：行为合同冻结基线。
- `known-defects.md`：审计中确认但本批不处理的边界与缺陷。
- `manual-checklist.md`：机械证据、主代理审核与未执行项。

## 4. 停点

Z0 完成后停止，等待用户人工验收和单独提交授权；不自动进入 Z1。
