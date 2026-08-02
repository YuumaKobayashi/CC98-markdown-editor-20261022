# P06 已知问题与保留项

## 迁移期 legacy 桥

- 新 bootstrap/providers 仍需连接根目录的 Store、App、ErrorBoundary、Utility、config 和 IndexedDB；
- `@legacy/*` 因此是明确的迁移期技术债，不代表允许新业务继续依赖旧聚合入口；
- 这些依赖分别由 P07、P09、P14/P15 和后续领域阶段收口。

## 沿用的构建警告

- 29 个主题仍报告 Sass `@import` 弃用警告，归 P20；
- Spectrum 的旧 IE 星号 hack 仍触发 Lightning CSS 恢复性警告；
- main 和 vendors 仍超过 chunk 建议阈值，代码分割归后续 Router/依赖阶段；
- 沙箱内 Vite/Rolldown 加载配置仍会触发 Windows `spawn EPERM`，获准环境下两次构建成功。

## 可选生产配置

- `/static/config.Production.json` 仍是部署时可选且未跟踪的覆盖配置；
- P06 没有创建该文件或改变 `Components/Constant.tsx` 的加载行为。

## 未自动验证

- 浏览器视觉、控制台、登录态、主题切换和代表性 UBB；
- 生产 `dist/` 的浏览器运行、IIS 实际部署、deep link 和生产配置覆盖；
- HTTP 200、类型检查和构建成功不替代上述人工验收。
