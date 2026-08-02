# P04 文件映射

| 范围 | P04 前 | P04 后 |
|---|---|---|
| 构建命令 | 只有 Webpack `dev`、debug、release | 新增 `dev:shadow`、`build:shadow`；原三个命令不变 |
| 构建配置 | 三份 Webpack 配置各自重复 29 个主题入口 | Webpack/Vite 共用 `build/theme-manifest.cjs`；新增 `vite.config.mjs`，serve 模式额外提供 HTML、主题和旧静态依赖映射 |
| HTML 合同 | `Template.ejs` 从 HtmlWebpackPlugin 产物顺序推导脚本/主题 | 模板接收显式 `scriptType`、`jsFileNames`、`themeNames` |
| 输出目录 | `dist/` 是 Webpack 产物 | `dist/` 保持；新增忽略且独立的 `dist-vite/` |
| 静态/部署复制 | Webpack CopyPlugin | Vite 复制 `public/static`，影子脚本复制现有第三方运行时、reset 和 IIS 配置 |
| TS/模块兼容 | Webpack/ts-loader 容忍 callable namespace import | 相关 import 机械改为默认 import；两套构建共用源码 |
| Sass | Webpack 使用 `sass@1.43.3` | Webpack 不变；Vite 使用隔离的 `sass-embedded@1.100.0` |
| 文档 | 无 P04 记录 | 新增 `docs/refactor-log/phase-04/**` |

没有移动或转换 React 组件，没有建立 P06/P20 的目标源码目录。`dist/`、`dist-vite/` 和 `node_modules/` 都不进入待提交文件。
