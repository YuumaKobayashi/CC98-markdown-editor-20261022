# P03 前后对照

## 原状态

- `package.json` 要求 `moment@2.30.1`，lockfile 和 `npm ci` 却仍要求 `2.22.2`；
- README 要求 Node 16 或更早，本地实际使用 Node `20.20.0` / npm `10.8.2`；
- npm 解析策略未入库，现代 npm 无法按当前 lock 直接复现旧 React 16 peer 树；
- P02 只能使用 `npm install --package-lock=false --legacy-peer-deps` 建立临时环境。

## 现状态

- `package.json`、lockfile 和 clean install 均使用根 `moment@2.30.1`；
- `.nvmrc`、`packageManager` 和 `engines` 固定 Node `20.20.0` / npm `10.8.2`；
- `.npmrc` 将当前旧依赖树所需的 `legacy-peer-deps=true` 变成显式安装契约；
- `npm ci` 可从最终 lockfile 重建依赖树；
- 水印版本和 Git commit 未变，只有 npm 10 重打 Git 依赖包后记录的 integrity 发生变化。

## lock diff 摘要

- lockfile：v2 → v3；
- 包记录数：1,864 → 1,912；
- 直接依赖解析变化：11 项，全部在原 manifest 范围内，没有直接依赖大版本升级；
- 主要直接变化：`moment 2.22.2 → 2.30.1`、`@aspnet/signalr 1.0.27 → 1.1.4`、`better-react-mathjax 2.0.3 → 2.3.0`、Bootstrap/类型包等 minor/patch 更新；
- 水印：`2.0.9` 和 commit `b268ef6d...` 均不变；integrity 由 npm 10 按当前 Git 打包结果重写。

## 行为与接口变化

无业务源码或公开接口变化。依赖树可以由新 lockfile clean install。根 tsconfig 现已排除依赖和两套输出目录；在两个输出目录都保留 MathJax TS 时，有界 Webpack 与 typecheck 已通过。实际 Webpack Dev Server 仍需停止并重启，以确认 watch program 不再保留旧文件集合。

## 回滚原则

人工不接受 P03 时，撤销 `package.json`、`package-lock.json`、`.nvmrc`、`.npmrc`、README 和本目录文档的未提交 diff。禁止使用 `git reset --hard`。
