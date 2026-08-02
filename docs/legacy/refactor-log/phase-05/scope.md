# P05 范围

## 唯一大事

将 P04 已验证的 Vite 影子构建提升为仓库唯一开发与发布构建系统，并删除仓库自有的 Webpack 回滚链。

## 允许范围

- `npm run dev` 改为 Vite 开发服务器，`npm run build` 改为唯一正式构建；
- 正式产物从 `dist-vite/` 切换到部署目录 `dist/`；
- 删除旧 Webpack 配置、命令、模板适配和直接依赖；
- 更新 lock、README、总计划和阶段记录；
- 保持 `/static/*`、IIS、reset、主题编号和现有入口行为。

## 禁止范围

- 不修改 React 组件、路由、Redux、API 或业务行为；
- 不升级或替换播放器等业务依赖；
- 不处理 P20 的 Sass 迁移和旧 Spectrum CSS hack；
- 不提交、不 push、不进入 P06。

## 完成条件

1. 稳定命令接口只有 `npm run dev` 和 `npm run build`；
2. `npm run build` 生成可部署的 `dist/`；
3. 仓库无自有 Webpack 配置、直接依赖或构建命令；
4. 安装、类型检查、双构建复现、产物合同和开发 HTTP 链路均有证据；
5. 浏览器视觉、登录态、UBB 与 IIS 实际部署仍明确留给人工。
