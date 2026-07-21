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

## 无 Redux 轻状态与导航组件组机械检查

- [x] 三个内部批次实现完成；
- [x] 每批 `npm run typecheck` 成功；
- [x] 每批 `git diff --check` 成功；
- [x] 每批目标静态审计无 class、Redux/Store、`connect`、legacy route props、`React.FC`、`isFirstCommit` 或 `useLayoutEffect`；
- [x] Focus 页签路径不存在 jQuery DOM class mutation；
- [x] AST 确认 class 总数从 136 降到 127，9 个目标符号全部为 0；
- [x] 整组最终 `npm run build` 成功；受限沙箱因 `spawn EPERM` 失败，在允许子进程的同一工作树重跑成功；
- [x] 构建后最终 `npm run typecheck` 与 `git diff --check` 成功。

## 无 Redux 轻状态与导航组件组人工验收

- [ ] Board、Topic、Message 的当前页、首尾页、前后页和超过 20 页时的 Go 输入正常；非法 Go 输入不改变目标页；
- [ ] 用户中心主题、回复、关注、粉丝、收藏和历史分页在总页数小于等于 7、起始段、中间段、末尾段时正常；keyword 与 `hasTotal=false` 合同不变；
- [ ] Focus、搜索、新主题、每周/月度/历史热门和推荐主题中的实名/匿名、标签/无标签、空标题、版面链接及最后回复锚点正常；
- [ ] `/focus`、`/focus/board`、`/focus/user`、`/focus/favorite` 首次进入、deep link 与 back/forward 始终只有一个正确页签高亮；
- [ ] Topic 普通阅读与 trace 页的 breadcrumb 首次显示完整，首页/版面/主题链接正确；
- [ ] 评分信息中的头像和用户名均导航到原用户 URL，评分内容与理由显示正常；
- [ ] 真实 API、登录态、主题、CSS 和父级 class 组件行为无回归。

## 用户中心 Redux 页面与壳层组机械检查

- [x] 三个内部批次实现完成；
- [x] 每批 `npm run typecheck` 成功；
- [x] 每批 `git diff --check` 成功；
- [x] 每批目标静态审计无 class、`connect`、Store 直接读取、legacy route props、`React.FC`、`isFirstCommit` 或 `useLayoutEffect`；
- [x] AST 确认 class 总数从 127 降到 122，5 个目标符号全部为 0；
- [x] 整组最终 `npm run build` 成功；
- [x] 构建后最终 `npm run typecheck` 与 `git diff --check` 成功。

## 用户中心 Redux 页面与壳层组人工验收

- [ ] 未登录访问 `/usercenter` 保持原未登录页面、标题和登录链接；登录后壳层标题、侧栏、Outlet 和 Footer 正常；
- [ ] `/usercenter` 个人主页资料、头像、近期主题/回复、loading 与真实刷新请求正常，当前页签为 profile；
- [ ] `/usercenter/myfollowings`、`/2`、非法页码、back/forward 均只按当前页请求，首次进入和翻页后回到顶部；
- [ ] `/usercenter/myfans`、`/2`、非法页码、back/forward 均只按当前页请求，首次进入和翻页后回到顶部；
- [ ] 两页的空态、分页 URL、`hasTotal` 显示、用户卡片和 follow mutation 行为不变；
- [ ] `/usercenter/mycustomboards` 的 loading、空态、卡片、分隔线、关注/取关操作和真实 API 正常；
- [ ] 快速切换用户中心页面时无可观察的陈旧请求覆盖或异常 loading；该风险仍需结合真实 API 人工确认。

## 用户中心交互叶子组机械检查

- [x] 三个目标 class 均迁为具名函数，旧路径只保留 default re-export；
- [x] `npm run typecheck`、`git diff --check` 与目标静态审计通过；
- [x] AST 确认 class 总数从 122 降到 119，3 个目标符号全部为 0；
- [x] 整组最终 `npm run build` 成功；
- [x] 构建后最终 `npm run typecheck` 与 `git diff --check` 成功。

## 用户中心交互叶子组人工验收

- [ ] 用户中心所有侧栏链接、active class、滚动超过/低于 234px 时的按钮 class 和 500ms 回顶动画正常；
- [ ] 关注版面卡片的版面图片、名称、版主/主题数、关注/取关成功与失败文案正常；
- [ ] 关注/粉丝卡片的头像、用户名、帖子/粉丝数、hover 文案、私信链接及关注成功/上限/失败状态正常；
- [ ] 用户取关请求成功后才显示“重新关注”并更新列表 Redux；请求失败时显示“取关失败”且仍保持关注；
- [ ] 分页、back/forward 和快速切页后各卡片状态与对应用户 id 一致，无跨项残留。

## 退出门禁

- [x] 用户已授权 P15 首批实现与目标组件内的逻辑优化；
- [x] 用户已授权连续完成无 Redux 简单组件组；
- [x] 用户已授权连续完成无 Redux 轻状态与导航组件组；
- [x] 用户已授权连续完成用户中心 Redux 页面与壳层组；
- [x] 用户已授权继续完成用户中心交互叶子组；
- [ ] 用户已完成人工验收；
- [x] 用户审核本轮未提交代码与文档 diff；
- [x] 用户授权本轮代码与文档形成阶段性本地提交；
- [ ] 用户另行授权下一批。

阶段性提交不表示 P15 完成；机械检查不能替代真实浏览器、登录态与 API 验收。
