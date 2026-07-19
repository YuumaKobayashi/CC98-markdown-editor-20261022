# P15 首批验证与人工验收清单

## Codex 机械检查

- [x] P15 首批实现完成；
- [x] 首次聚合 `npm run typecheck` 成功；
- [x] 最终 `npm run typecheck` 成功；
- [x] `npm run build` 成功；受限沙箱首次因 `spawn EPERM` 失败，在允许子进程的同一工作树重跑成功；
- [x] `git diff --check` 成功；
- [x] 两个 owner 无 class、`connect`、legacy route props、`isFirstCommit`、`useLayoutEffect` 或 `React.FC`；
- [x] 旧文件只有兼容 re-export；
- [x] `.vscode/`、UBB/editor 与依赖清单未修改。

## 无 Redux 简单组件组机械检查

- [x] 三个内部批次实现完成；
- [x] 每批 `npm run typecheck` 成功；
- [x] 每批 `git diff --check` 成功；
- [x] 每批目标静态审计无 class、Redux/Store、`React.FC`、`isFirstCommit` 或 `useLayoutEffect`；
- [x] AST 确认 class 总数从 149 降到 136，13 个目标符号全部为 0；
- [x] 整组最终 `npm run build` 成功；受限沙箱因 `spawn EPERM` 失败，在允许子进程的同一工作树重跑成功；
- [x] 构建后最终 `npm run typecheck` 与 `git diff --check` 成功；

## 人工页面验收

- [ ] `/usercenter/mytopics` 首次进入，页签、loading、空态和数据列表正常；
- [ ] `/usercenter/mytopics/2` 及 Pager 前后翻页只请求目标页并滚动到顶部；
- [ ] `/usercenter/myposts/ishot/0` 显示全部回复并能切到热门；
- [ ] `/usercenter/myposts/ishot/1` 显示热门回复并能切回全部；
- [ ] 回复分页、热门切换、back/forward 使用正确 `page/ishot`，每次有效参数变化只有一次目标请求；
- [ ] 首次进入及参数变化后滚动行为自然，没有陈旧页面闪烁；
- [ ] 真实登录态、API 返回、主题和样式无回归。

## 无 Redux 简单组件组人工验收

- [ ] 用户中心主题、回复、主页资料、近期动态和签名配置正常；
- [ ] 私信联系人头像、名称、最近 UBB 内容与未读点正常，且列表缓存对象未被展示组件修改；
- [ ] Focus 三个导航与 Outlet 正常，SiteManage 公告/广告正常；
- [ ] Header/Footer 持久壳层、Footer 链接和年份正常；
- [ ] 首页、Board、Topic、Message、Focus、UserCenter 等代表页标题正常更新；
- [ ] 发帖/回复/收藏/消息设置中的 Notice 仍由原 DOM id/CSS/jQuery 合同显示；
- [ ] 生日、签名 UBB、权限颜色和用户资料字段显示正常。

## 退出门禁

- [x] 用户已授权 P15 首批实现与目标组件内的逻辑优化；
- [x] 用户已授权连续完成无 Redux 简单组件组；
- [ ] 用户已完成人工验收；
- [x] 用户已审核本轮代码 diff；
- [x] 用户已授权本轮代码与文档形成阶段性本地提交；
- [ ] 用户另行授权下一批。

阶段性提交不表示 P15 完成；机械检查不能替代真实浏览器、登录态与 API 验收。
