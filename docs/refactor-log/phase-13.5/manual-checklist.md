# P13.5 验证与人工验收清单

> P13.5 已实施且 Codex 机械检查已完成；浏览器交互仍须用户人工验收。

## 开始门禁

- [x] P13 实现、typecheck、build 与人工页面验收已完成，接受基线为 `276d0ec0`；
- [x] 用户已明确授权开始 P13.5；
- [x] 已记录开始 HEAD `9392e6a4`，工作树仅有未跟踪 `.vscode/`；
- [x] P13.5 代码与当前未跟踪 `.vscode/`、冻结 UBB 和无关用户改动隔离。

## Codex 机械检查

- [x] 目标组件中无 `this.context.router` 和对应 `declare context`；
- [x] 目标 service 中无已经证明未使用的 Router 参数或内部透传；
- [x] 每个调用点的其余参数求值顺序和调用次数不变；
- [x] API URL、headers、body、状态码分支、错误 key 与返回值 diff 无变化；
- [x] `react-router*`、`history`、Store、root provider 和 lockfile 无变化；
- [x] `route-inventory.md` 已从实施基线重新核对；
- [x] `npm run typecheck:modern` 成功；
- [x] `npm run typecheck:legacy` 成功；
- [x] 聚合 `npm run typecheck` 成功；
- [x] `npm run build` 成功（受限环境首次 `spawn EPERM`，在允许子进程的同一工作树重跑成功）；
- [x] `git diff --check` 成功；
- [x] 未修改冻结 UBB、样式、主题或业务合同。

## 人工验收

- [ ] `/message`、回复我的、@ 我的、系统通知、私信列表和私信发送正常；
- [ ] `/focus/board`、`/focus/user`、`/focus/favorite` 首次加载与继续加载正常；
- [ ] `/search` 全站/版内搜索与增量加载正常；
- [ ] `/searchBoard` 版面搜索正常；
- [ ] Topic 点赞、点踩和状态提示正常；
- [ ] 未登录访问上述需要登录的路径时，错误/登录处理与 P13 基线一致；
- [ ] 浏览器 back/forward、刷新和地址栏未因本阶段变化。

## 退出门禁

- [x] 用户已审核 P13.5 实现；
- [ ] 用户已完成人工页面验收；
- [x] 用户已明确授权 P13.5 两笔本地提交；
- [x] 用户已另行授权开始 P14。

机械检查、构建成功或 HTTP 200 均不等同于浏览器交互验收完成。
