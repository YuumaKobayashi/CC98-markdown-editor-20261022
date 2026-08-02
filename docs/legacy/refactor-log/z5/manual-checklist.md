# Z5 验证与人工验收清单

日期：2026-08-02

## 已执行的机械与静态证据

- [x] 活动源码中 `@legacy`、`@cc98/api`、旧根源码 import/dynamic require 为 0；配置与脚本中不存在 `tsconfig.legacy`、legacy compiler options、architecture allowlist 或 `typecheck:legacy` 活动引用。
- [x] 10 个根级 legacy 空目录删除前递归文件数均为 0；加上早已不存在的 `Ubb`，11 个计划目标路径均不存在。
- [x] `npm run check:architecture`：396 个 source files、1556 条 imports、0 violations；132 个真实 CSS Module、29 主题；18 条动态内容 consumer edge、63 条 UBB 注册；109 条第三方 import edge、3 个 vendor style owner；12 份 Foundation 样式文件。
- [x] `npm run typecheck`：唯一 modern TypeScript 配置通过。
- [x] `npm run build`：受限沙箱首次因既知 `spawn EPERM` 失败；允许子进程后原命令重跑通过，Vite 8.1.4 转换 4124 个 modules。
- [x] 正式产物为 9559 个文件、97 个 CSS、29 个主题 CSS；聚合 SHA-256 为 `56f5e1f0f45f476cdc7da9ebad0313b4cf94d50a5538927d4f382b7e46f2e124`。
- [x] Z1 类型债务的 6 个临时 `any` 均与清单一一对应且各出现一次；未在 Z5 收窄。
- [x] `git diff --check`、BOM/EOL/EOF、未跟踪文件和生成产物检查通过。

## 未执行的运行验收

- [ ] 浏览器 Shell、Home、Board、Topic、Message、Search、Editor、User Center/Profile、Login 与 Signin 回归。
- [ ] 登录、真实 API、权限、SignalR、跨标签同步、通知、缓存和 Storage/IndexedDB 场景。
- [ ] UBB/Markdown 切换、预览、emoji、上传、媒体、数学公式与内容安全场景。
- [ ] 29 主题、响应式、Portal、hover/focus/disabled、打印/降级和前进后退。

## 阶段门禁

- [x] 未回写历史 phase 记录为通过，未替换 Markdown，未修复已登记业务缺陷。
- [x] 未 commit、未 push、未进入 Z 后独立批次。
