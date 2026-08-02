# P03 人工确认

> 当前状态：人工已接受保留项并授权提交 P03；提交后不 push、不开始 P04

## 已确认内容

- lockfile 已按 P03 开始时的本地依赖版本从 v2 重建为 v3；
- manifest 中没有任何 dependency/devDependency 声明变化，也没有直接依赖大版本升级；
- Node/npm 基线记录为 `20.20.0` / `10.8.2`；当前约束主要用于版本声明和复现说明，不把它表述为不可绕过的强制校验；
- `.npmrc` 暂时固定 `legacy-peer-deps=true`，直至后续 React/UI peer 阻塞阶段解除；
- 水印版本与完整 Git commit 不变，Git 打包 integrity 有变化；
- 仓库没有新增私有库内容；
- clean install 成功；`npm ls --depth=0` 退出码为 0，同时保留 3 个已登记的 extraneous optional 包；
- 用户此前的开发服务器日志以 MathJax 生成目录错误结束；根 tsconfig 现已排除依赖和两套输出目录；
- 两套输出目录同时存在时，VS Code Webpack 有界构建和随后 TypeScript 检查均通过；实际开发服务器未重启复核，该项作为未自动验证保留；
- 人工接受 P03 同时包含生成目录排除修正，并接受 Node 20 已结束维护这一临时兼容基线风险。

## 提交门禁

2026-07-17，人工明确接受上述风险并授权提交当前 P03 修改。提交后停止，不 push、不开始 P04。

## 确认记录

2026-07-17：通过。开发服务器 watch 重启复核仍标记为未验证，不影响本次 P03 提交授权。
