# P14 验证与人工验收清单

> Codex 已完成机械验证；以下未勾选项必须在真实浏览器与可用后端环境中由用户验收。

## Codex 机械检查

- [x] `npm run typecheck:modern` 成功；
- [x] `npm run typecheck:legacy` 成功；
- [x] 聚合 `npm run typecheck` 成功；
- [x] `npm run build` 成功（受限沙箱会 `spawn EPERM`，在允许子进程的同一工作树重跑成功）；
- [x] `git diff --check` 成功；
- [x] 代表公开路径经 Router route matching 审计；
- [x] 代表 deep link 使用 `Accept: text/html` 请求均返回 SPA HTML；
- [x] 根 router 与代表 lazy 模块的 Vite 转换请求成功；
- [x] 运行依赖中没有 `react-router-redux` 或直接 `history`；
- [x] 运行时 JSX 没有嵌套 `BrowserRouter`、legacy `Switch`、`Prompt` 或 `Redirect`；
- [x] 未跟踪 `.vscode/` 未修改、未纳入 P14。

## 人工页面验收

- [ ] `/`、`/topic/hot-weekly`、`/topic/:id/:page?` 与 post trace 首次进入正常；
- [ ] `/list/:boardId`、`/boardList`、`/board/:id/:page?` 与刷新正常；
- [ ] `/usercenter` 默认页、topics/posts/favorites/config 等子页正常；
- [ ] `/message` 默认页、response/attme/system/message/setting 子页正常；
- [ ] `/focus` 默认页与 board/user/favorite 子页正常；
- [ ] `/user/id/:id`、`/user/name/:name` 与 manage 子页正常；
- [ ] `/logon`、`/signin`、`/search`、`/searchBoard`、`/editor/*` 正常；
- [ ] 未知路径与 `/error/401` 状态页行为符合旧基线；
- [ ] 站内 Link、浏览器 back/forward、地址栏直达与刷新正常；
- [ ] 同一 route 组件参数变化会触发现有刷新逻辑；
- [ ] 普通站内导航期间 Header、Footer、Provider 与 Store 保持挂载；
- [ ] 登录失效跳到 `/logon`，返回路径/请求行为与旧基线一致；
- [ ] 编辑器有内容时站内离开会确认，取消留在原页，确认后离开；刷新/关闭也有浏览器提示；
- [ ] 真实 API、登录态、主题、样式和主要交互无回归。

## 退出门禁

- [x] 用户已授权执行 P14；
- [x] P14 实现与机械证据已完成；
- [ ] 用户已完成上述人工验收；
- [ ] 用户已审核未提交 diff；
- [ ] 用户已另行授权本地提交；
- [ ] 用户已另行授权进入 P15。

类型检查、构建、route matching 或 HTTP 200 均不等同于浏览器交互验收完成。
