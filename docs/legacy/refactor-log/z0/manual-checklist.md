# Z0 检查与验收清单

## 1. 主代理静态审核

- [x] 基线为干净 `dev20260716@de6eca90`，未混入用户工作区修改。
- [x] `git ls-files` 覆盖根级旧 owner、配置、模板、部署与 public 资源；根级 legacy 总数为 273。
- [x] 从 bootstrap 建立静态/lazy import 图，分别记录 loaded、runtime reachable 与 direct call。
- [x] 现代源码 82 条 `@legacy/*` 直接 import 已按目标 owner 聚合；27 条 Module 例外与 allowlist 对齐。
- [x] Router、Vite、Template、IIS、独立 HTML、dynamic import/require、CSS/SCSS/JSON/图片/字体/媒体入口已纳入审计。
- [x] 16 个历史 P21 候选逐项复核；5 项已删除、11 项保留，Z0 未新增删除。
- [x] UBB Engine/Handler 注册、禁用 Math/Sandbox、editor/renderer/style manifest 已核对。
- [x] AnnualReview 无主 Router/模板/部署入口，但内部 API/style/chart/assets 依赖已登记。
- [x] URL/API/Storage/IndexedDB/UBB/Session/Notification/SignalR/theme/cache 合同已冻结。
- [x] 未实施 Z1、未修改运行时代码、未 commit、未 push。

## 2. 机械检查

- [x] `npm run check:architecture`：通过；327 个现代源码文件、1356 条 import、27 条 allowlist；116 个真实 CSS Module、29 个主题；18 条动态内容 consumer、63 条活动 UBB 注册；第三方与 Foundation 样式守卫均通过。
- [x] `npm run typecheck`：modern 与 legacy 均通过。
- [x] `npm run build`：通过；4124 modules transformed。受限环境首次命中既有 Vite `spawn EPERM`，在获准环境重跑同一窄命令成功；保留既有 Sass/Spectrum、plugin timing 与大 chunk 警告。
- [x] `git diff --check`：通过。
- [x] 新文件 UTF-8、BOM、行尾、EOF 与未跟踪/生成产物检查：8 个本批 Markdown 与 1 个 tracked path 快照均为 UTF-8 无 BOM、CRLF、单一 EOF newline；未发现 dist 或其他生成产物进入状态，变更仅为总计划和 `docs/refactor-log/z0/`。

执行结果在完成命令后回填；机械通过不替代以下运行验收。

## 3. 未执行的运行验收

- [ ] 浏览器所有公开 Route 的 deep link、refresh、back/forward 与 404。
- [ ] IIS 上 `list.asp`/`dispbbs.asp`/`dispuser.asp` 的真实 redirect。
- [ ] 登录/退出/token refresh、真实 API 成功失败、权限与分页。
- [ ] localStorage/sessionStorage/IndexedDB TTL、序列化、失效和跨标签。
- [ ] SignalR 连接/重连、四类未读、标题闪烁和浏览器通知权限。
- [ ] UBB/Markdown/editor、权限标签、图片/上传/音视频/Bilibili/公式/sandbox。
- [ ] 29 主题、默认/暗色、动态内容、第三方组件与视觉。

以上项目均为**未执行、未验收**，不得由 typecheck/build 或静态审计替代。

## 4. 人工门禁

- [ ] 用户接受 Z0 file/owner/consumer map 与历史候选结论。
- [ ] 用户接受合同冻结范围和未执行项。
- [ ] 用户另行授权提交；未授权前不暂存、不 commit。
- [ ] Z0 提交并再次授权后才可进入 Z1。
