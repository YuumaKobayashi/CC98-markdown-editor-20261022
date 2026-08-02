# P03 人工检查清单

## Codex 已核对

- [x] 当前分支为 `dev20260716`，实施前工作区干净；
- [x] Node 为 `20.20.0`，npm 为 `10.8.2`；
- [x] `package.json` 未修改任何 dependency/devDependency 声明；
- [x] lockfile 根依赖与 manifest 同步，`moment` 为 `2.30.1`；
- [x] 11 个直接解析版本变化均在原 manifest 范围内，没有直接依赖大版本升级；
- [x] 水印仍为 `2.0.9`，Git commit 仍为 `b268ef6d5868689e25f0b8f0d58d203bf1f032d5`；
- [x] Git 未跟踪 `node_modules`、vendor 水印包、私有源码或匹配的 `.node/.dll/.wasm/.exe`；
- [x] 最终 lockfile 执行完整 `npm ci --no-audit --no-fund` 成功；
- [x] `npm ls --depth=0` 退出码为 0；
- [x] 修正前 `tsc --noEmit --skipLibCheck` 在构建产生 `dist` 后复跑出现 145 条错误；修正后在两个输出目录均含 374 个 MathJax `.ts` 文件时复跑成功；
- [ ] `npm run build:debug`：一次性命令退出码为 0，但其输出会导致后续 TypeScript/watch 编译失败，不能计为完整通过；
- [ ] `npm run build:release`：一次性命令退出码为 0，但其输出会导致后续 TypeScript/watch 编译失败，不能计为完整通过；
- [x] `git diff --check` 成功；
- [x] Codex 没有启动 Node server，没有 push，没有提交；用户提供的开发服务器日志已作为失败证据记录。

## 已观察但不在 P03 修复

- [x] 首次完整 `npm ci` 在 Windows 删除旧 MathJax 目录时遇到一次 `ENOTEMPTY`，相同命令重试成功；
- [x] npm 对 Git 依赖提示跳过 integrity 检查；水印仍由完整 Git commit 固定；
- [x] `npm ls` 将 `bindings`、`file-uri-to-path`、`nan` 标为 extraneous optional 包，但命令退出码为 0；它们由 clean install 生成，P03 不改依赖声明清理它们；
- [x] 关闭 `legacy-peer-deps` 后，当前 lock 缺少 Bootstrap/React Bootstrap 旧 peer 树要求的包，不能作为同一安装契约使用。
- [x] 用户提供的 Webpack Dev Server 日志包含 119 个 `ERROR in` 并以 `Failed to compile` 结束；主要来自 `dist/static/scripts/lib/mathjax-full/ts/**`；
- [x] 当前 `dist` 含 374 个由 CopyWebpackPlugin 复制的 MathJax `.ts` 文件；修正前 `tsconfig.json` 没有排除生成目录；
- [x] `tsconfig.json` 已应用 `exclude: ["node_modules", "dist", "vscodeConfig/dist"]`；当前工作区的 VS Code Webpack 配置退出码为 0，随后 TypeScript 检查成功；

## 人工确认与保留项

- [ ] 停止现有 Webpack Dev Server，重新执行 `npm run dev`，确认不再出现 MathJax `ERROR in`；
- [x] 审查并接受 lockfile v2 → v3 的整体 diff；
- [x] 接受以 P03 开始时本地依赖版本为当前锁定基准；
- [x] 接受在 React/UI peer 阻塞解除前保留 `legacy-peer-deps=true`；
- [x] 接受水印 commit 不变但 Git 打包 integrity 更新；
- [x] 接受 npm 版本声明并非不可绕过的硬校验、Node 20 已结束维护、3 个 extraneous optional 包以及 P03 内的生成目录排除修正；
- [x] 基于 clean install、依赖树退出码和有界编译检查授权提交 P03；提交后仍不 push、不开始 P04。

人工确认时间与结论：2026-07-17，通过；实际开发服务器 watch 重启复核仍标记为未验证。
