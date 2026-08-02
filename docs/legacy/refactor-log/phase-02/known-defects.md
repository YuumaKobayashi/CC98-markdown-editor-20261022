# P02 已知问题与保留项

## `BUILD-DEP-001`：package 与 lockfile 不同步

- `package.json` 声明 `moment@2.30.1`，package-lock.json 仍解析为 `moment@2.22.2`；
- `npm ci` 因此失败，当前依赖环境不可复现；
- P02 不重写 lockfile、不升级依赖，留给 P03 统一处理；
- 为验证 P02 构建，使用了不写 lockfile 的临时安装，debug/release 均成功。

## `BUILD-CONFIG-001`：可选生产配置的大小写约定

- 运行时代码读取 `/static/config.Production.json`；
- 该文件当前不存在且从未被跟踪，属于部署时可选覆盖配置；
- P02 没有创建、提交或更改该配置的加载行为；
- 部署侧若提供此文件，应在构建后注入 `dist/static/config.Production.json`。

## `DATA-BOARD-001`：版面数据数量不一致

- `Utility/boardInfoJson.ts` 与 `public/static/boardinfo.json` 的既有数量不一致，TS 数据独有 board id 788；
- 本阶段只移动 JSON，不修复或统一数据。

## 构建环境记录

- release 构建在受限环境中首次因 Terser/Jest worker `spawn EPERM` 失败；允许子进程后同一命令成功；
- 这是验证环境限制，不是 P02 源码或 Webpack copy 配置缺陷。

## 新发现的业务缺陷

无。P02 没有修改或运行页面业务行为。
