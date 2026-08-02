# P02 人工检查清单

## Codex 已核对

- [x] 当前分支为 `dev20260716`，实施前工作区干净；
- [x] 2,513 个静态资源的相对路径数量一致；
- [x] 2,513 个迁移后文件与迁移前 Git blob 全部一致；
- [x] `deploy/iis/web.config` 与原 `dist/web.config` Git blob 一致；
- [x] `public/static` 未被忽略，`dist/` 已整体忽略；
- [x] 三套 Webpack 配置均从 `public/static` 和 `deploy/iis/web.config` 复制；
- [x] 三套 Webpack 配置均在构建前清空各自的完整输出目录，避免已删除或重命名的资源残留；
- [x] 三套 Webpack 配置通过 `node --check`；
- [x] debug 构建从空 `dist` 成功重建；
- [x] release 构建成功；受限环境中的首次 `spawn EPERM` 在允许 Terser worker 后消失；
- [x] debug 和 release 输出均包含 29 个主题 CSS、main/vendors、index、reset 与 IIS 配置；
- [x] 两套构建输出中的 2,513 个 authored assets 均逐文件 SHA-256 一致；
- [x] `reset.html` 和 IIS 配置的构建输出与维护源 SHA-256 一致；
- [x] package.json 与 package-lock.json 未被修改；
- [x] 验证后的 `dist` 生成物已清理，可由已通过的构建命令恢复；
- [x] 验证阶段没有启动 Node server；提交前没有 push。

## 未通过但已登记

- [ ] `npm ci`：现有 `package.json` 要求 `moment@2.30.1`，lockfile 仍为 `moment@2.22.2`，npm 拒绝 clean install；留给 P03。
- [ ] 可复现依赖验证：本阶段仅使用 `npm install --package-lock=false --legacy-peer-deps` 建立未写 lockfile 的临时构建环境。

## 待人工确认

- [ ] 抽查 `/static/98icon.ico`、`config.json`、`boardinfo.json`、`portrait.json`；
- [ ] 抽查中文文件名、主题背景和 UBB 表情路径；
- [ ] 确认 `/reset`、`/static/*` 排除规则及其他 IIS redirect/rewrite 未变；
- [ ] 接受 `dist/` 不再承载 tracked 源文件；
- [ ] 接受 package/lock 不一致延后到 P03；
- [x] 已授权按“静态资源、构建配置、文档”三批提交 P02。

人工确认时间与结论：2026-07-17，用户已授权按三批提交；未勾选的人工页面抽查项继续保留，不以提交代替功能确认。
