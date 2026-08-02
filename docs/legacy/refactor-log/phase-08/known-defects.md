# P08 已知问题与保留项

## `BUILD-TYPE-001`：旧第三方声明继续依赖 `skipLibCheck`

- 在 TypeScript 5.9.3 下显式执行 `--skipLibCheck false`，现代和 legacy 配置都以退出码 2 失败；
- 当前错误来自旧 `@types/jquery` 的事件键约束、旧 `@types/node` 的 `Buffer`/`Uint8Array` 继承以及旧 `@types/react-router-dom` 的泛型约束；
- P08 将 `skipLibCheck: true` 固化在共享配置中，不升级这些类型依赖，也不把声明错误伪装成已经修复；
- P23 严格化前需结合 React/Router/Node 类型升级重新评估。

## `BUILD-TS-002`：现代 typecheck 仍会读取部分 legacy 图

- `src/app` 和少量 entity 类型仍通过 `@legacy` 桥接旧 App、Store、Action 或 state 类型；
- TypeScript 会沿 import 图读取被引用的 legacy 文件，因此两个 typecheck program 不是完全互斥；
- P08 的根文件入口和 Vite 实际转译已经分区，不在本阶段提前迁移这些 owner 或伪造声明边界。

## `BUILD-TS-003`：automatic JSX runtime 增加转换模块

- P07 基线为 2,336 个转换模块，P08 为 2,344 个；
- 差异发生在仅 `src/**` 启用 `react-jsx` 后，React 16.14 提供对应 `react/jsx-runtime`；
- 产物文件总数仍为 9,449，主题数仍为 29；main/vendors hash 和体积变化属于编译方式变更的预期结果。

## 沿用的构建警告

- Sass `@import` 弃用、Spectrum 旧 CSS hack 恢复性警告和大 chunk 警告继续存在；
- 本阶段不迁移样式、不升级 UI 依赖、不调整 code splitting。

## 安装环境

- 第一次 clean install 因本仓库遗留 `npm run dev → Vite → dart-sass` 进程锁住 Sass 目录而报 `EBUSY`；
- 按 PID/命令行确认后只停止该仓库进程树，重试 clean install 成功；
- `npm ls --depth=0` 继续以退出码 0 显示 P04 已登记的 `@parcel/watcher`、Win32 watcher 及其 optional 依赖为 extraneous；这些包来自现有 lockfile 的平台 optional 安装形态，不是 P08 新增依赖；
- npm 的旧依赖 deprecated warnings 与私有 Git 包跳过 integrity 检查均为既有依赖现状。

## 未自动验证

- 未启动新的 dev/preview server，未访问真实 CC98/OpenID；
- 未验证真实登录、token、读写 API、UBB 交互或主题视觉；
- 未增加自动测试、lint、截图、artifact comparator 或 bundle analyzer。
