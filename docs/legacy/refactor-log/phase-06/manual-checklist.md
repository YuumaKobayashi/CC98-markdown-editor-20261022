# P06 验收清单

## 机械验证

- [x] 基线为干净的 `dev20260716@cdef0e8a`；
- [x] 根 `Main.tsx` 迁至 `src/app/bootstrap/index.tsx`，仓库内无旧入口反向调用者；
- [x] Provider 元素树保持 ErrorBoundary → Redux Provider → AntD LocaleProvider → App；
- [x] TypeScript 与 Vite 同时解析六个目标层别名和 `@legacy/*`；
- [x] `npx tsc --noEmit --skipLibCheck` 成功；
- [x] 获准环境两次 `npm run build` 成功，均有 9449 个文件；
- [x] 两次产物路径加内容聚合 SHA-256 均为 `02764c38ad37d8f0f377dd6a0dd6b0815586d316a6788b9f7535e67f0ebbf190`；
- [x] `public/static` 2513 个文件在 `dist/static` 中零缺失；
- [x] 产物含 29 个主题 CSS、一个 main、一个 vendors、index、reset 和 IIS 配置，首末主题顺序正确；
- [x] reset 与 IIS 产物分别和维护源 SHA-256 一致；
- [x] 隔离 5174 开发服务的新入口、Provider、主题、配置、第三方静态资源和 SPA fallback 检查通过；
- [x] 5174 进程树和临时日志已回收，端口无监听；
- [x] 业务、Store、Router、Utility、config、IndexedDB、Styles、Themes 和 Ubb diff 审计无越界修改；
- [x] `git diff --check` 通过。

## 人工验收

- [ ] 浏览器检查首页可启动且控制台无新的入口/alias 错误；
- [ ] 检查登录态、主题切换和代表性 UBB；
- [ ] 用生产 `dist/` 检查 IIS deep link、reset 和可选生产配置覆盖；
- [ ] 审查 P06 diff 和目录 owner 规则；
- [ ] 授权 P06 提交后再讨论 P07。
