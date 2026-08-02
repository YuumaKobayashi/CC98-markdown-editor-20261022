# P04 前后对照

## 原状态

- 默认和唯一生产构建是 Webpack 4，29 个主题入口在三个配置中重复；
- `Template.ejs` 按 HtmlWebpackPlugin 返回的 CSS 顺序隐式构造 `themeNames`；
- `dist/` 同时承担当前发布产物与构建验证目标，无法安全试跑新 bundler；
- 旧 namespace import、TypeScript namespace、Sass 路径和 Spectrum hack 被 Webpack 容忍，但会阻断 Vite 8。

## 现状态

- 默认 Webpack 命令和 `dist/` 发布路径不变；`build:shadow` 单独生成 `dist-vite/`；
- 主题 id 1–29、key 和 SCSS 入口由显式 manifest 固定，两套构建生成相同索引顺序；
- Webpack HTML 继续加载 classic scripts；Vite HTML 加载 `main` module，由其引用 `vendors` 和 Rolldown runtime；
- 2513 个维护型公开文件在两套输出中均无缺失，reset 与 IIS 配置和维护源字节一致；
- Vite 输出 29 个主题 CSS、`main`、`vendors` 和 runtime chunk，不生成 Webpack 的 29 个无业务意义主题 JS stub。

## 行为与接口变化

新增开发接口 `npm run build:shadow`。运行时保留现有全局 `themeNames: string[]` 和主题数字语义；没有主动改变业务行为。默认发布、开发服务器和部署入口均仍为 Webpack。

## 回滚原则

人工不接受 P04 时，撤销 Vite/build/script、manifest、模板合同、import 兼容、Sass 路径、依赖/lock、忽略项及本目录文档的未提交 diff。`dist/` 可由原 `npm run build:release` 重建；禁止使用 `git reset --hard`。
