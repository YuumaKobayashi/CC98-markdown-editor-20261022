# P08 前后对照

## TypeScript 依赖

- 之前：manifest 声明 `^4.8.4`，lockfile 和本机实际安装 4.9.5；
- 之后：manifest 限定 `~5.9.3`，lockfile 和 clean install 实际版本统一为 5.9.3。

## 编译配置

- 之前：单一配置使用 ES5、旧 Node resolution 和 classic JSX，但 Vite 插件另行硬编码 ES2015，IDE/typecheck 与构建存在漂移；
- 之后：共享配置集中 alias 和兼容开关；根配置为 ES2022/Bundler/automatic JSX，legacy 配置为 ES2015/Node10/classic JSX；
- 之后：Vite 直接读取两套 tsconfig 的解析结果，以规范化文件路径选择选项，不再复制 target/JSX 常量。

## 输出与运行时边界

- `src/**` 可以使用 ES2022 和 automatic JSX，由 Vite 在正式构建末端统一降至 ES2015；
- 根遗留源码和冻结 UBB 继续使用 classic JSX，冻结岛源文件与注册顺序未变；
- 业务 API、Redux、Router、React 版本、29 个主题、固定 URL 和 IIS/reset 合同均未主动改变。

## 验证结果

- 三个 typecheck 接口全部通过；
- 正式构建成功，模块数由 2,336 增至 2,344，产物文件仍为 9,449；
- 不带 `skipLibCheck` 时仍能复现三类旧声明错误，已保留为 `BUILD-TYPE-001`。
