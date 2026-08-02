# P08 人工与机械检查清单

## 已完成机械检查

- [x] `npm ci --no-audit --no-fund --offline=false --prefer-offline=false` 成功，新增 753 个安装包；私有 watermark 仍从原 Git 引用安装，未 vendor；
- [x] `npm ls --depth=0` 退出码为 0；继续显示 P04 已登记的 watcher 及其 optional 依赖为 extraneous，lockfile 中除 TypeScript 节点外无依赖 diff；
- [x] `node --version` 为 20.20.0，`npm --version` 为 10.8.2；
- [x] `tsc --version` 和 `npm ls typescript --depth=0` 均确认 5.9.3；
- [x] `npm run typecheck:modern` 成功；
- [x] `npm run typecheck:legacy` 成功；
- [x] `npm run typecheck` 聚合命令成功；
- [x] TypeScript API 抽查确认 `src/app/providers/create-app-root.tsx` 生成 `react/jsx-runtime`，`Components/UbbContainer.tsx` 仍生成 `React.createElement`；
- [x] `npm run build` 成功，转换 2,344 个模块并生成 9,449 个文件、29 个主题 CSS、3 个 JS chunk；
- [x] `dist/static/index.html`、`dist/static/reset.html`、`dist/web.config` 均存在；
- [x] `git diff --check` 成功；
- [x] 冻结 UBB 路径、`src/**` 和其余业务源码均无 diff；`.vscode/` 仍是原有未跟踪目录。

## 待人工验收

- [ ] 启动应用并确认普通页面 JSX 渲染与 P07 基线一致；
- [ ] 查看公告、主题回复、签名或消息中的 UBB 展示；
- [ ] 打开 UBB Editor，确认输入、按钮和预览；
- [ ] 接受构建模块数因 automatic JSX runtime 从 2,336 增至 2,344；产物文件总数仍为 9,449；
- [ ] 接受真实登录、API、写操作和主题视觉未自动验证。
