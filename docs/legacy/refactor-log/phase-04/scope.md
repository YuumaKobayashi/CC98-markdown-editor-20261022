# P04 Vite 影子构建范围

> 状态：实现、审查修复和机械验证完成；已授权按四批提交，不 push、不开始 P05

## 本阶段唯一大事

在不改变默认 Webpack 开发/发布命令的前提下，新增 Vite 8 生产影子构建与独立开发查看入口，并把 29 个主题的数字顺序从构建产物枚举改为显式 manifest。生产影子构建写入 `dist-vite/`，开发入口只提供本地即时转换和查看能力。

## 允许操作

- 增加 Vite、浏览器 `path` 兼容包和隔离的现代 Sass 编译器；
- 增加影子构建配置、脚本、输出忽略规则和构建期主题 manifest；
- 增加独立的 `dev:shadow` 命令，但不替换 Webpack `dev`；
- 让 Webpack 和 Vite 从同一主题 manifest 生成入口与 `themeNames`；
- 对 Vite 已证明不兼容的 callable namespace import 和 Sass 相对路径做机械修正；
- 运行 clean install、TypeScript、Webpack、Vite 和静态产物核对。

## 禁止操作

- 不切换 `dev`、`build:debug`、`build:release`；
- 不把 `dist-vite/` 当作正式发布目录或提交到 Git；
- 不修改 API、路由、Redux、组件行为、主题样式语义、水印接口或 UBB；
- 不升级 React、TypeScript、旧 Sass 或其他业务依赖；
- 未获人工授权前不提交；P04 提交后不 push、不开始 P05。

## 实际完成

1. `npm run build:shadow` 使用 Vite `8.1.4` 生成独立 `dist-vite/`；
2. `npm run dev:shadow` 在 `127.0.0.1:5173` 启动独立 Vite 开发服务器；现有 `npm run dev` 仍使用 Webpack；
3. 29 个主题以显式 id/key/SCSS 入口 manifest 固定顺序，三个 Webpack 配置与 Vite 共用；
4. `Template.ejs` 改为接收显式脚本类型、脚本清单和主题清单；Webpack 使用 classic script，Vite 使用 module script；
5. Vite serve 模式将旧源码中的静态 `require("包名")` 即时转换为 ESM import：有返回值的调用使用 default import，独立调用使用 side-effect import；同时将既有 `/static/**` 运行时路径映射到源码、public 或依赖文件；
6. 旧 TypeScript 由构建插件转译，旧 Sass `1.43.3` 继续服务 Webpack，Vite 单独使用 `sass-embedded@1.100.0`；
7. `moment`、jQuery、`url-parse` 的 callable namespace import 改为默认 import；`Styles/Site.scss` 的 UBB editor 路径改为真实相对路径；
8. clean install、依赖树、旧 Webpack release、Vite shadow、Vite dev HTTP 资源链路和 P03 TypeScript 基线均通过；开发链路额外验证两份播放器 CSS source map 返回 200；
9. 审查清理了注释文件中的无效 import 改动，并把原两批提交边界细分为共享构建合同、源码兼容改写、Vite 影子构建和 P04 文档四批。
