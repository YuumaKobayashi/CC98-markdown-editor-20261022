# P03 已知问题与保留项

## `BUILD-DEV-001`：生成目录中的 MathJax TypeScript 导致开发编译失败

- 三套 Webpack 配置都将整个 `node_modules/mathjax-full` 复制到输出目录，其中包含 374 个 `ts/**` 源文件；
- 修正前根 `tsconfig.json` 没有 `include`/`exclude`，ts-loader/watch 会把已经复制到 `dist` 或 `vscodeConfig/dist` 的第三方源码纳入项目；
- 一次性 Webpack 构建会先清空输出目录，TypeScript 初次扫描时看不到这些文件，随后才由 CopyWebpackPlugin 写入，因此命令可能以 0 退出；开发服务器下一轮 watch 则会扫描它们并失败；
- 用户日志记录了 119 个 `ERROR in` 并以 `Failed to compile` 结束；在当前 `dist` 上直接运行 `tsc --noEmit --skipLibCheck` 可复现 145 条错误；
- 错误包括 MathJax package-import alias 无法解析、ES5 target 下的 iterable 限制和上游源码类型错误；不能用 `skipLibCheck` 掩盖，因为目标文件是 `.ts` 而不是 `.d.ts`；
- 根 tsconfig 已排除 `node_modules`、`dist`、`vscodeConfig/dist`；当前工作区即使两个输出目录都各含 374 个 MathJax TS，VS Code Webpack 有界构建和随后 typecheck 仍通过；
- 已经运行的 Webpack Dev Server 可能保留旧 TypeScript program，必须停止并重启后才能完成 watch 路径人工确认。

## `BUILD-PEER-001`：旧 React/UI peer 树依赖 legacy 解析

- npm 10 按严格 peer 语义解析时，Bootstrap 缺少 `@popperjs/core`，React Bootstrap 的旧依赖链还要求 Enzyme 相关 peer 包；
- P03 用 `.npmrc` 显式固定 `legacy-peer-deps=true`，使 clean install 与生成 lockfile 的解析策略一致；
- 这是当前 React 16/UI 兼容簇的过渡契约，不代表 peer 冲突已修复；
- 后续 P12/P13 解除 peer 阻塞后应重新评估并移除该配置，不能把它当作最终状态。

## `BUILD-LOCK-001`：Git 依赖 integrity 不提供 registry tarball 级保证

- 水印依赖仍由完整 commit `b268ef6d5868689e25f0b8f0d58d203bf1f032d5` 固定；
- npm 10 重建 lockfile 时更新了该 Git 打包结果的 integrity；
- `npm ci` 明确提示跳过 Git dependency 的 integrity check，因此可复现边界主要是 Git commit 与私有仓库可访问性；
- P03 没有修改 commit，也没有将库内容复制进仓库。

## `BUILD-NPM-001`：clean install 的 Windows 瞬时清理失败

- 最终 lockfile 的首次完整 `npm ci` 在删除旧 `mathjax-full` 目录时出现一次 `ENOTEMPTY`；
- 未修改文件或 lock，原命令直接重试成功；
- 当前没有证据表明这是稳定复现的仓库缺陷，若持续出现再单独定位文件占用。

## `BUILD-NPM-002`：三个 optional 包被 npm ls 标为 extraneous

- clean install 后 `bindings`、`file-uri-to-path`、`nan` 被 npm 10 标为 extraneous optional；
- 三项存在于 lockfile 且由 `npm ci` 安装，`npm ls --depth=0` 仍以退出码 0 完成；
- P03 不通过修改业务依赖或手工删除 lock 条目处理该 npm 树形表现。

## 依赖弃用/安全债

clean install 仍报告旧依赖的 deprecated 警告，包括 React Router Redux、旧 Core-JS、旧 jQuery、SignalR 等。P03 只建立可复现基线，不在同一阶段升级这些兼容簇。

Node `20.20.0` 在 P03 中作为旧 Webpack 工具链的临时兼容基线，但 Node 20 已结束维护；后续构建迁移阶段需要在受支持的 Node 版本上重新验证。`packageManager`/`engines` 当前用于记录目标版本，未形成不可绕过的版本硬校验。

## 新发现的业务缺陷

无业务缺陷；新增的是阻塞 P03 的构建缺陷 `BUILD-DEV-001`。
