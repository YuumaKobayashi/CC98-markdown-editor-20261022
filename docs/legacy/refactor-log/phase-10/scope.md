# P10 纯展示叶子组件函数化范围

> 状态：13 个组件实现与有界机械验证完成；等待人工页面验收，不提交、不 push、不开始 P11

## 唯一大事

在 React 16.14 上将 13 个无 state、lifecycle、Redux、Router、DOM、fetch 或 storage 的在用展示 class 改为具名函数，同时归入 `pages` 或 `entities` owner。

## 允许范围

- 迁移首页 7 个、消息 5 个、帖子 1 个展示组件；
- 将这些组件直接使用的首页和消息 props/model 归位；
- 为已知调用方切换窄入口，并保留旧路径 re-export；
- 通过 `@legacy` 继续调用未改动的 `UbbContainer`/UBB 实现；
- 记录逐组件前后对照、机械门禁和人工验收路径。

## 禁止范围

- 不迁移含 state、lifecycle、Redux、Router、DOM、fetch 或 storage 的组件；
- 不创建 `shared/ui`，不处理 Header/Footer/App shell；
- 不改变请求、Store、Router、storage、样式、主题或依赖版本；
- 不修改 `Ubb/**`、`Components/UbbEditor/**` 或既有 UBB 选项；
- 不修复迁移中发现的旧缺陷；
- 不提交、不 push、不进入 P11。

## 完成条件

1. 13 个目标符号均由具名函数实现，旧路径只保留兼容导出；
2. 两套 TypeScript 配置、聚合 typecheck、正式构建和 diff 检查通过；
3. 正式产物仍为 9,449 个文件、29 个主题，并保留 index/reset/IIS；
4. 有界开发 HTTP 链验证新入口可转换，测试进程完整回收；
5. 首页、Topic 和登录消息路径由人工审核后才允许提交。
