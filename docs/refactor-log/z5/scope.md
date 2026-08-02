# Z5 alias、双编译和根目录闭包范围

日期：2026-08-02

实施基线：干净的 `dev20260716@e2979a99`

范围：只实施 Z5；不收窄既有类型、不替换 Markdown、不修复已登记业务缺陷、不 commit、不 push

## 1. 实施前闭包结论

- 活动 `src/**/*.ts(x)` 中 `@legacy`、`@cc98/api`、旧根 Store/Utility/Components/Pages/Props/States/Ubb import 与指向根源码的动态 `require` 均为 0。
- 根级 legacy tracked path 只剩 `tsconfig.legacy.json`；`@types`、`Components`、`IndexedDB`、`Match`、`Pages`、`Props`、`States`、`Styles`、`Utility`、`config` 仅剩无文件的空目录骨架，`Ubb` 已在早先批次中不存在。
- `scripts/architecture-allowlist.json` 已为空，架构检查不存在仍需豁免的 import edge。
- `tsconfig.json` 的 include 仅覆盖 `src/**/*.ts(x)`，已不包含 `@types/@cc98`；业务合同由各 Module owner 解析。

## 2. 本批完成项

- 从 `tsconfig.base.json` 和 Vite resolve alias 删除 `@legacy/*`；删除 `tsconfig.legacy.json` 与 `typecheck:legacy`，`npm run typecheck` 只执行唯一现代配置。
- Vite TypeScript 插件只加载 `tsconfig.json`，删除按源码路径选择 legacy compiler options 的分支；保留活动源码仍需要的静态 `require` 转换，不改变 bundle target。
- 删除空的根级 legacy 源码目录；架构守卫新增根源码回流与 `src` 三层之外源码的硬失败规则。
- 删除空 architecture allowlist 及其加载/失效登记逻辑；样式、动态内容、第三方和 Foundation 守卫的活动扫描根收缩为 `src`。
- 更新根 README、`src`/Application/Modules/Foundation README 和当前架构目录清单；历史 phase 审计记录不回写。

## 3. 明确保留的边界

- 公开 URL、API wire shape、Storage/IndexedDB、DOM/CSS、Session、Notification、SignalR、主题、缓存与 UBB 实现没有改写。
- `legacy-route-props`、`legacy-index` 等名称描述仍在运行的兼容语义，不是根源码 alias，未机械改名。
- Markdown 编辑/预览整体替换仍属于 Z 后独立批次。
- 浏览器、登录、真实 API、权限、SignalR、跨标签、通知、缓存、编辑器、媒体和 UBB 运行验收未执行。

## 4. 当前停点

Z5 配置、守卫、目录和文档闭包已完成，机械检查与主代理逐文件审核通过。本批保持未提交工作树，等待人工验收与单独提交授权。
