# P07 已知问题与保留项

## 迁移期 facade 和 effect 端口

- 根 `Utility.ts`、旧 `Utility/**`、`config/**`、`IndexedDB/**` 和 `Components/Constant.tsx` 仍是兼容 shim，计划在 P21 按引用证据删除；
- legacy effect 端口必须由 app bootstrap 在 render 前注册；当前唯一应用入口已注册，独立调用 owner service 时若绕过 bootstrap 会明确抛错；
- 118 个旧 barrel 消费者没有在 P07 批量改 import，避免把组件所有权迁移提前带入本阶段。

## 依赖方向的阶段性例外

- 当前 Board、Topic、Message 和 User entity API 为复用旧鉴权行为，仍直接依赖 `features/auth/api/session`；auth feature 又依赖 User entity 的当前用户存储，因此在目录层级上暂时存在 `entities ↔ features` 双向依赖；
- 多个 feature service 也直接依赖 auth feature，`features/follow` 还依赖 `features/account` 的 `refreshUserInfo`，尚未达到 P06 约定的最终单向依赖形态；
- P07 只保证 `Utility.tsx` 的机械拆分、三个已确认运行时环的解除和旧行为保留，不在本阶段重组鉴权、当前用户刷新或调用方编排；
- 后续应在用户与认证能力迁移或单独获批的阶段，将 `getToken`、`formAuthorizeHeader` 等底层鉴权传输能力下沉到 `shared/api` 或 `integrations/auth`，并由上层编排注销导航、当前用户刷新和全局错误呈现。在完成前不得把 P07 解释为所有 `entities/features` 依赖规则已经满足。

## 沿用的业务和构建问题

- 原请求函数的空 catch、混合错误处理、router 参数和直接 DOM/jQuery 行为保持不变；
- storage 中锁定用户时跳转固定 CC98 登录地址的旧行为未修改；
- 主题仍依赖全局 `themeNames` ABI 和现有 29 个主题编号；
- Sass `@import`、Spectrum 恢复性警告和大 chunk 警告继续沿用 P05/P06 记录。

## 安装与构建环境

- 初次 `npm ci` 因遗留的本仓库 `npm run dev → Vite → dart-sass` 进程树占用 Sass 目录而两次报 `EBUSY`；按 PID 和命令行确认后只停止该进程树，clean install 随后成功；
- clean install 仍报告无法清理 `sass-embedded-all-unknown` 内部 Sass 目录的 EPERM warning，但退出码为 0；
- 沙箱内 Vite config load 仍触发 Windows `spawn EPERM`，在获准环境构建成功；
- 正式构建转换 2,336 个模块，输出 9,449 个文件、29 个主题 CSS、main/vendors/runtime、index、reset 与 IIS 配置。

## 未自动验证

- 不访问真实 CC98/OpenID，不验证登录、token 刷新、真实读写 API、消息或管理操作；
- 不新增自动测试、lint、循环依赖工具、视觉截图或 artifact comparator；
- `convertHotTopic` 只依据 tracked source 的零调用证据移除，未把它视为对外 npm/public package API。

## Dev-only reset 路径

- P07 本地 HTTP 检查中 `/static/reset.html` 返回 404；
- 当前 Vite dev middleware 只显式提供主 HTML 和源码/`public` 资源，根 `reset.html` 仅由 `scripts/build-vite.mjs` 在正式构建时复制；
- P06 的 dev-server 合同未包含 reset，P07 没有修改 Vite 路由；正式构建中的 `dist/static/reset.html` 存在；
- 是否让 dev server 同时提供 reset 属于构建入口行为调整，不在 Utility 解环阶段顺手处理。
