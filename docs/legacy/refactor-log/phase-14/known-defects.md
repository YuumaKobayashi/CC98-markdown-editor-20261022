# P14 已知缺陷与非阻断项

## 明确保留的旧行为

- `/list/*` 与 `/board/*` 仍有两个 Board owner；legacy `Components/Board/Board.tsx` 内部 `/board/*` 分支在其 `/list/*` owner 下仍不可达。P14 只迁语法，不借机改变公开路由归属。
- `/error/404` 与 `/error/500` 仍没有专用 route；通配路径仍落到 `PageNotFound`，只有 `/error/401/*` 显式映射。
- `NotificationController` 仍未在 AppShell 挂载；只迁移其潜在导航依赖，不启用功能。
- 冻结 UBB 文件继续从 `react-router-dom` import `Link`，因此保留同版本兼容包；未修改冻结业务代码。

## 仍需人工验证

- 真实登录态、真实 API、页面内容、交互和视觉行为；
- back/forward、同组件参数变化、刷新与 IIS deep link；
- Header/Footer/Provider/Store 在站内导航时是否保持实例；
- Message、Focus、UserCenter/User 的默认页与子页切换；
- 登录失效跳转与编辑内容的站内离开/刷新阻断。

当前环境没有可用的应用内浏览器实例，所以只能完成 route matching、Vite 转换和 browser-like HTTP 检查；不能据此宣称浏览器验收通过。

P13.5 原有的 Message、Focus、搜索与 Topic 真实页面验收也尚未被用户勾选；P14 清单覆盖并继续保留这些门禁。

## 既有构建警告

- Dart Sass `@import` 弃用提示；
- legacy Spectrum CSS 的 IE hack 被 lightningcss 报告为意外分号；
- 共享 vendor chunk 超过 500 kB。

这些警告未导致构建失败，也不是 P14 引入的 Router 行为缺陷。

依赖安装结束时 npm 仍报告 `45` 项 audit finding（`7 low / 15 moderate / 18 high / 5 critical`）。P14 未运行 `npm audit fix`，避免把无关依赖升级混入 Router 阶段；该数字仅是当前依赖树报告，不等于本阶段新增 45 个问题。
