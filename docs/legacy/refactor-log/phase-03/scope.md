# P03 可复现依赖环境范围

> 状态：依赖安装和有界编译检查通过；人工已接受保留项并授权提交 P03，提交后不 push、不开始 P04

## 本阶段唯一大事

统一 `package.json`、`package-lock.json` 和本地安装树，固定 Node/npm 与 npm 解析策略，并确认私有水印依赖仍指向原 Git commit。

## 允许操作

- 以 P03 开始时的本地依赖版本为基准重建 lockfile；
- 将 `moment` 的 manifest/lock 不一致统一为 `2.30.1`；
- 固定 Node `20.20.0`、npm `10.8.2` 和旧 peer 依赖解析策略；
- 在根 tsconfig 中排除依赖目录和两套生成目录，防止输出中的第三方 TypeScript 被当成项目源码；
- 更新安装说明并新增 P03 审计文档；
- 执行 clean install、依赖树、旧 TypeScript 基线和 debug/release 构建验证。

## 禁止操作

- 不修改业务源码、API、路由、样式或静态资源；除生成目录排除外，不修改其他 TypeScript/Webpack 构建语义；
- 不修改任何业务依赖的 manifest 版本范围；
- 不升级直接业务依赖的大版本；
- 不修改水印依赖的 Git commit、接口或构建方式；
- 不 vendor、不复制、不提交私有库源码、二进制或 `node_modules`；
- 人工确认前不提交、不 push、不开始 P04。

## 实际完成

1. `package-lock.json` 从 npm lockfile v2 重建为 npm 10 使用的 v3，并按阶段开始时的本地版本解析所有 manifest 范围；
2. `moment` 根依赖从错误的 `2.22.2` 统一为 manifest 和本地均使用的 `2.30.1`；
3. `package.json`、`.nvmrc` 固定 Node/npm，`.npmrc` 固定 `legacy-peer-deps=true`；
4. 水印仍为 `2.0.9`、仍指向 `b268ef6d5868689e25f0b8f0d58d203bf1f032d5`，仓库没有新增私有库内容；
5. 最终 lockfile 的完整 `npm ci` 成功；`npm ls --depth=0` 退出码为 0，但仍报告 3 个已登记的 extraneous optional 包。修正前，一次性 debug/release 命令虽然退出码为 0，但会把 MathJax 的 374 个第三方 `.ts` 文件复制到 `dist`，导致后续 TypeScript/watch 编译失败，因此当时的结果不能计为编译门禁通过。
6. `tsconfig.json` 已排除 `node_modules`、`dist` 和 `vscodeConfig/dist`；在根 `dist` 与 VS Code 输出目录各保留 374 个 MathJax `.ts` 文件时，Webpack VS Code 配置和随后执行的 TypeScript 检查均通过。
