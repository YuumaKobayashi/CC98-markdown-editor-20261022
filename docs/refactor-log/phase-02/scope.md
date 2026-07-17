# P02 静态资源与构建产物分离范围

> 状态：实施和机械验证已完成，已授权按三批提交；提交后停止，不推送、不开始 P03

## 本阶段唯一大事

将手工维护的公开资源、IIS 部署配置和 Webpack 生成物分开，同时保持现有 `/static/*` URL、reset 页面与 IIS rewrite 行为不变。

## 允许操作

- 将 `dist/static/**` 中 2,513 个 authored assets 原样迁至 `public/static/**`；
- 将 `dist/web.config` 原样迁至 `deploy/iis/web.config`；
- 只调整现有三套 Webpack 配置的复制源和完整输出目录清理规则；
- 将 `dist/` 整体声明为忽略的构建产物；
- 更新路径说明并新增 P02 审计文档；
- 安装依赖并运行 debug/release 构建，不启动长期服务。

## 禁止操作

- 不修改业务源码、API、路由、主题顺序、UBB 或运行时行为；
- 不引入 Vite，Vite 仍属于 P04；
- 不升级依赖、不修订 package/lock 不一致问题；
- 不创建或提交 `config.Production.json`；
- 不提交私有水印库内容；
- 人工确认前不提交、不 push、不开始 P03。

## 实际完成

1. 2,513 个静态资源移动到 `public/static`，相对路径和内容未变；
2. IIS 配置移动到 `deploy/iis/web.config`，内容未变；
3. release、debug、VS Code 三套 Webpack 配置改从新维护源复制资源和 IIS 配置，并在构建前清空各自的完整输出目录；
4. `dist/` 改为整体忽略，并通过 debug/release 构建从空目录重建；删除或重命名资源后不会残留旧产物；
5. README 和 V2 计划中的维护源路径已同步；
6. 没有修改 package.json、package-lock.json 或业务代码。
