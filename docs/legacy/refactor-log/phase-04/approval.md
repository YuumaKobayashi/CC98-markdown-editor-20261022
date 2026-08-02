# P04 人工确认

> 当前状态：实现、审查修复和机械验证完成；已授权按四批提交，不 push、不开始 P05

## 确认内容

- 接受显式主题 manifest 作为构建期唯一主题顺序来源；
- 接受 `build:shadow`、`dist-vite/` 及 Vite module-script 输出合同；
- 接受 `dev:shadow` 作为端口 `5173` 的独立本地查看入口，不替换默认 Webpack `dev`；
- 接受 Webpack 继续作为默认开发/发布构建，P04 不切换部署；
- 接受 import/Sass 路径机械兼容修改没有主动业务语义变化；
- 接受 `known-defects.md` 中的 Sass、Spectrum、chunk、optional package、第三方类型和未运行时验证保留项；
- 接受将共享构建合同、源码兼容改写、Vite 影子构建和 P04 文档拆成四个独立提交，并在提交后停止等待 P05 授权。

## 提交门禁

2026-07-18，人工已授权准备：

1. `build(p04): centralize theme and template contract`；
2. `refactor(p04): make legacy imports bundler-compatible`；
3. `build(p04): add Vite shadow build`；
4. `docs(p04): record shadow-build evidence`。

提交授权不把未勾选的浏览器人工项视为已完成。不自动 push，不自动开始 P05。

## 确认记录

2026-07-17：实现与初轮机械验证完成，等待人工确认。

2026-07-18：Codex 审查发现开发服务器播放器 CSS source map 404、注释文件无效改动和两批提交过粗；修复并重跑 clean install、TypeScript、Webpack release、Vite shadow、产物与 HTTP 链路门禁后，用户回复“去执行吧”，授权按上述四批提交。浏览器视觉与交互项继续保留为未验证。
