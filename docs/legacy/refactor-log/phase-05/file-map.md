# P05 文件映射

| P04 状态 | P05 状态 |
|---|---|
| `dev:shadow` / `build:shadow` | 删除；改为唯一接口 `dev` / `build` |
| `scripts/build-vite-shadow.mjs` | `scripts/build-vite.mjs`，生成正式 `dist/` 并复制部署依赖 |
| `vite.config.mjs` 输出 `dist-vite/` | 输出 `dist/` |
| 两份根 Webpack 配置 | 删除 |
| `vscodeConfig` 的开发与分析 Webpack 配置 | 删除，空目录一并移除 |
| 模板合同同时适配 Webpack/Vite | 删除 Webpack 参数适配，只保留主题名和 HTML 渲染 |
| Webpack loaders/plugins/CLI/dev server 直接依赖 | 从 manifest/lock 删除 |
| `.gitignore`、`tsconfig` 同时列出两套产物 | 只保留 `dist/` |

没有移动或修改业务源码；`public/static`、`deploy/iis`、主题 manifest 和模板继续作为维护源。
