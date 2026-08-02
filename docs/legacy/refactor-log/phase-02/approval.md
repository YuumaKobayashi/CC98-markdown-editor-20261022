# P02 人工确认

> 当前状态：已授权按“静态资源、构建配置、文档”三批提交；提交后停止，不进入 P03

## 待确认内容

- authored static assets 的维护源已从 `dist/static` 改为 `public/static`；
- IIS 配置维护源已从 `dist/web.config` 改为 `deploy/iis/web.config`；
- Webpack 仍生成相同的 `/static/*`、reset、index、主题和脚本部署结构；
- `dist/` 现在是被忽略的纯构建输出；
- P02 未引入 Vite、未修改业务代码、依赖声明、lockfile 或私有库内容；
- `npm ci` 的既有 package/lock 不一致问题明确留给 P03。

## 提交门禁

人工明确确认 P02 前，不提交、不 push、不开始 P03。人工确认后只提交 P02 的资源迁移、IIS 配置迁移、必要 Webpack 调整、说明更新和 `docs/refactor-log/phase-02/**`。

## 确认记录

2026-07-17，用户明确要求将 P02 拆为三个提交：先提交静态资源与 IIS 配置迁移，再提交 Webpack 构建配置，最后提交说明和审计文档。未勾选的人工页面抽查项仍保留在检查清单中，不以提交代替功能确认。
