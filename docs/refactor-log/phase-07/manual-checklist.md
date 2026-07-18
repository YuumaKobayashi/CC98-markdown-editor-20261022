# P07 验收清单

## Codex 机械检查

- [x] 开始时位于 `dev20260716`，工作区干净，P06 已提交；
- [x] 根 `Utility.tsx` 已替换为无 JSX 的兼容 `Utility.ts`；
- [x] 旧 159 个 facade 导出保留 158 个，唯一差异为零 tracked caller 的 `convertHotTopic`；
- [x] `npx tsc --noEmit --skipLibCheck` 成功；
- [x] 三个已知环的禁止 runtime import 均已移除；
- [x] `src/shared` 未 import app、feature、entity、legacy、Store、Router 或业务组件；
- [x] UBB、UbbEditor、样式、package 和 lockfile 无 diff；
- [x] `npm ci --no-audit --no-fund` 成功；初次被遗留 Vite/Sass 树锁定，精确回收后成功；
- [x] `npm ls --depth=0` 成功，沿用 optional/extraneous 展示；
- [x] `npm run build` 成功，生成 9,449 个文件和 29 个主题 CSS；
- [x] dev server 由 subagent 启动；主入口、配置、Vite client 和 P07 模块链为 200，完整进程树已回收且 5173 无监听；
- [x] `git diff --check` 成功，package/lock、冻结岛、样式和 Store 配置无 diff；

## 人工验收

- [ ] 接受 Utility owner 划分和 root/subpath facade 保留至 P21；
- [ ] 接受当前 `entities ↔ features/auth` 及 feature 间依赖为已记录的阶段性例外，后续在用户与认证能力迁移或单独获批阶段解决，不在 P07 顺手调整；
- [ ] 接受 `convertHotTopic` 的零调用移除证据；
- [ ] 在允许的测试环境核对登录失效、主题切换、Board/Topic、消息、上传/发帖和管理路径；
- [ ] 接受真实 API 行为没有由 Codex 自动访问；
- [ ] 接受 dev-only `/static/reset.html` 404 作为既有构建合同缺口，本阶段不修复；
- [ ] 授权 P07 提交后再讨论 P08。
