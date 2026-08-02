# P05 人工确认

> 当前状态：实现与机械验证完成；人工已授权两批提交，不 push、不开始 P06

## 待确认内容

- 接受 Vite 成为唯一开发和发布构建系统；
- 接受稳定命令接口只有 `npm run dev` 和 `npm run build`；
- 接受仓库自有 Webpack 配置、命令、模板适配和直接依赖全部删除；
- 接受 Git 恢复 P04 作为唯一回滚方式；
- 接受 Sass、Spectrum、chunk、optional extraneous 和未运行时验证继续作为保留项；
- 接受人工验收后拆成“构建切换与清理”和“P05 文档证据”两个提交。

## 提交门禁

未经人工确认不创建提交、不 push、不开始 P06。建议提交：

1. `build(p05): switch exclusively to Vite`；
2. `docs(p05): record Vite cutover evidence`。

## 确认记录

2026-07-18：P05 实现、clean install、类型检查、两次正式构建、完整产物复现和 subagent 开发 HTTP 链路验证完成。随后人工发现 Markdown 的 `process.cwd` 浏览器兼容缺口；已同时修复生产构建和开发依赖预打包，重跑类型/构建并核对 5173/5174 实际下发模块。等待人工刷新原页面并完成最终验收。

2026-07-18：用户回复“写一下提交吧”，授权按“构建切换与清理 / P05 文档证据”两批提交；未勾选的浏览器视觉、Markdown 页面刷新和 IIS 实际部署项不视为已完成。
