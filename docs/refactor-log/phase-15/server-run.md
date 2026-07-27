# P15 首批开发服务器记录

本批未启动 Node dev/preview server，因此没有 PID、端口或回收事项。

原因：实现范围可通过 TypeScript、生产构建和静态审计完成机械验证；真实登录态、API、分页、back/forward 和滚动行为保留给用户人工验收。未以构建成功替代浏览器验收。

## 构建环境记录

- 沙箱内首次运行 `npm run build` 时，Vite 加载配置阶段因 Windows 子进程策略报 `spawn EPERM`；
- 在允许子进程的同一工作树重跑成功，共转换 3,870 个模块；
- 生成独立的 `my-topics`（约 1.27 kB）和 `my-posts`（约 2.50 kB）动态块；
- 既有 Sass `@import`、Spectrum 旧 CSS 与大 chunk 警告继续存在，本批未修改。

## 无 Redux 简单组件组构建

- 本组未启动 Node dev/preview server，没有 PID、端口或回收事项；
- 沙箱内正式构建在 Vite 配置加载阶段因 Windows 子进程策略报 `spawn EPERM`；
- 在允许子进程的同一工作树重跑成功，共转换 3,880 个模块；
- 生成新的/更新后的 `document-title`、`feedback`、`focus layout`、`site-manage`、`post`、`topic` 等动态块；
- 既有 Sass `@import`、Spectrum 旧 CSS、plugin timing 与大 chunk 警告继续存在，本组未修改。

## 无 Redux 轻状态与导航组件组构建

- 本组未启动 Node dev/preview server，没有 PID、端口或回收事项；
- 沙箱内正式构建在 Vite 配置加载阶段因 Windows 子进程策略报 `spawn EPERM`；
- 在允许子进程的同一工作树重跑成功，共转换 3,882 个模块；
- 生成/更新 `pagination`、`topic`、`focus`、Board、Message 和用户中心相关动态块；
- 既有 Sass `@import`、Spectrum 旧 CSS、plugin timing 与大 chunk 警告继续存在，本组未修改。

## 用户中心 Redux 页面与壳层组构建

- 本组未启动 Node dev/preview server，没有 PID、端口或回收事项；
- 沙箱内正式构建在 Vite 配置加载阶段因 Windows 子进程策略报 `spawn EPERM`；
- 在允许子进程的同一工作树重跑成功，共转换 3,886 个模块；
- 生成/更新 `layout`、`overview`、`my-followings`、`my-fans` 与 `custom-boards` 动态块；
- 既有 Sass `@import`、Spectrum 旧 CSS、plugin timing 与大 chunk 警告继续存在，本组未修改。

## 用户中心交互叶子组构建

- 本组未启动 Node dev/preview server，没有 PID、端口或回收事项；
- 沙箱内正式构建在 Vite 配置加载阶段因 Windows 子进程策略报 `spawn EPERM`；
- 在允许子进程的同一工作树重跑成功，共转换 3,887 个模块；
- 生成新的 `follow` 动态块，并更新 `layout`、`custom-boards`、`my-followings` 与 `my-fans` 块；
- 既有 Sass `@import`、Spectrum 旧 CSS、plugin timing 与大 chunk 警告继续存在，本组未修改。

## 热门主题同构页面组构建

- 本组未启动 Node dev/preview server，没有 PID、端口或回收事项；
- 沙箱内正式构建在 Vite 配置加载阶段因 Windows 子进程策略报 `spawn EPERM`；
- 在允许子进程的同一工作树重跑成功，共转换 3,889 个模块；
- 生成独立的 `weekly`、`monthly`、`history` 入口块和共享 `HotTopicPage` 块；
- 既有 Sass `@import`、Spectrum 旧 CSS、plugin timing 与大 chunk 警告继续存在，本组未修改。

## 首页、搜索与站务组件组构建

- 本组未启动 Node dev/preview server，没有 PID、端口或回收事项；
- 沙箱内正式构建在 Vite 配置加载阶段因 Windows 子进程策略报既知 `spawn EPERM`；
- 在允许子进程的同一工作树重跑成功，共转换 3,893 个模块；
- 生成新的 `HomePage`、`topics`、`boards` 入口块，并更新 `site-manage` 与共享 advertisement 块；
- 既有 Sass `@import`、Spectrum 旧 CSS、plugin timing 与大 chunk 警告继续存在，本组未修改。

## 消息与私信组件组构建

- 本组未启动 Node dev/preview server，没有 PID、端口或回收事项；
- 沙箱内正式构建在 Vite 配置加载阶段因 Windows 子进程策略报既知 `spawn EPERM`；
- 在允许子进程的同一工作树重跑成功，共转换 3,899 个模块；
- 生成独立的 layout、responses、mentions、system、private-messages 入口块；通知页面之间只复用普通页码计算函数，不再共享配置驱动组件；
- 既有 Sass `@import`、Spectrum 旧 CSS、plugin timing 与大 chunk 警告继续存在，本组未修改。

## Header、登录、通知与错误控制组构建

- 本组未启动 Node dev/preview server，没有 PID、端口或回收事项；
- Header、登录、通知/错误三个内部批次的两套 TypeScript 与 diff 检查已通过；
- 受限沙箱首次构建在 Vite 配置加载阶段命中既知 `spawn EPERM`，在允许子进程的同一工作树重跑成功，共转换 3,900 个模块；
- 生成独立 `login` 动态块；Header 与错误重置进入持久应用壳，停用通知 owner 因无运行时引用未进入执行路径；
- 既有 Sass `@import`、Spectrum 旧 CSS、plugin timing 与大 chunk 警告继续存在，本组未修改；
- 构建不替代真实登录态、跨标签页、搜索、错误路由及“通知保持停用”的浏览器验收。

## 公共用户详情页迁移组构建

- 本组未启动 Node dev/preview server，没有 PID、端口或回收事项；
- 页面壳/路由数据与用户展示/近期主题两个内部批次的两套 TypeScript、diff 与静态检查已通过；
- 受限沙箱首次构建在 Vite 配置加载阶段命中既知 `spawn EPERM`，在允许子进程的同一工作树重跑成功，共转换 3,903 个模块；
- 生成独立 `layout`、`overview` 与 `profile-avatar` 动态块，公共用户 manage 子页仍保持原入口；
- 既有 Sass `@import`、Spectrum 旧 CSS、plugin timing 与大 chunk 警告继续存在，本组未修改；
- 构建不替代真实登录态、用户 API、关注、头像配置、滚动、UBB 与浏览器验收。

## 版面列表与展示叶子迁移组构建

- 本组未启动 Node dev/preview server，没有 PID、端口或回收事项；
- 版面列表、版面页展示叶子、topic breadcrumb 三个内部批次的两套 TypeScript、diff 与静态检查已通过；
- 受限沙箱首次构建在 Vite 配置加载阶段命中既知 `spawn EPERM`，在允许子进程的同一工作树重跑成功，共转换 3,913 个模块；
- `/boardlist` 生成独立 `board-list` 动态块；Board 主页面、新帖和随机精选仍保持各自原路由入口；
- 既有 Sass `@import`、Spectrum 旧 CSS、plugin timing 与大 chunk 警告继续存在，本组未修改；
- 构建不替代真实登录态、版面 API、图片、标签分页、广告、操作记录 hover 和浏览器验收。

## 公共用户管理子页迁移组构建

- 本组未启动 Node dev/preview server，没有 PID、端口或回收事项；
- 四个目标组件的两套 TypeScript、diff 与静态检查已通过；
- 受限沙箱首次构建在 Vite 配置加载阶段命中既知 `spawn EPERM`，在允许子进程的同一工作树重跑成功，共转换 3,913 个模块；
- `/user/:method/:id/manage` 生成独立 `manage` 动态块，公共用户 layout 与 overview 继续保持各自窄入口；
- 既有 Sass `@import`、Spectrum 旧 CSS、plugin timing 与大 chunk 警告继续存在，本组未修改；
- 构建不替代真实管理员登录态、用户/管理 API、权限、分页和浏览器验收。

## Focus 页面剩余壳层迁移组构建

- 本组未启动 Node dev/preview server，没有 PID、端口或回收事项；
- 两个目标组件的 modern/legacy TypeScript、diff 与静态检查通过；
- 受限沙箱首次构建在 Vite 配置加载阶段命中既知 `spawn EPERM`，在允许子进程的同一工作树重跑成功，共转换 3,913 个模块；
- Focus index、board、user、favorite 子路由共用 `pages/focus` 动态块；`/newtopics` 卡片视图继续保持原入口；
- 既有 Sass `@import`、Spectrum 旧 CSS、plugin timing 与大 chunk 警告继续存在，本组未修改；
- 构建不替代真实登录态、关注 API、sessionStorage、触底加载、快速切换、回顶和浏览器验收。

## 主题发现页与卡片视图迁移组构建

- 本组未启动 Node dev/preview server，没有 PID、端口或回收事项；
- 七个目标组件的 modern/legacy TypeScript、diff、静态审计与 AST 统计通过；
- 受限沙箱首次构建在 Vite 配置加载阶段命中既知 `spawn EPERM`，在允许子进程的同一工作树重跑成功；
- `/newtopics`、`/recommendedtopics` 生成独立动态块，主题卡片和播放器从 `entities/topic` 共享；
- 既有 Sass `@import`、Spectrum 旧 CSS、plugin timing 与大 chunk 警告继续存在，本组未修改；
- 构建不替代真实登录态、主题/版面 API、sessionStorage、滚动、图片、DPlayer/APlayer 和浏览器验收。

## 用户中心资料、主题与转账设置迁移组构建

- 本组未启动 Node dev/preview server，没有 PID、端口或回收事项；
- 六个目标组件的 modern/legacy TypeScript、diff、静态审计与 AST 统计通过；
- 受限沙箱首次构建在 Vite 配置加载阶段命中既知 `spawn EPERM`，在允许子进程的同一工作树重跑成功，共转换 3,920 个模块；
- `/usercenter/config`、`/usercenter/theme`、`/usercenter/transferwealth` 分别生成 `settings`、`theme`、`transfer-wealth` 动态块；
- 既有 Sass `@import`、Spectrum 旧 CSS、plugin timing 与大 chunk 警告继续存在，本组未修改；
- 构建不替代真实登录态、资料/头像/主题/转账 API、Canvas、文件上传与浏览器验收。

## 用户中心近期动态、收藏与浏览历史迁移组构建

- 本组未启动 Node dev/preview server，没有 PID、端口或回收事项；
- 六个目标组件的 modern/legacy TypeScript、diff、静态审计与双 AST 统计通过；
- 受限沙箱首次构建在 Vite 配置加载阶段命中既知 `spawn EPERM`，在允许子进程的同一工作树重跑成功，共转换 3,925 个模块；
- `/usercenter/myfavorites`、`/usercenter/myhistory` 分别生成 `favorites`、`history` 动态块，overview 直接组合新近期主题 owner；
- 既有 Sass `@import`、Spectrum 旧 CSS、plugin timing 与大 chunk 警告继续存在，本组未修改；
- 构建不替代真实登录态、近期主题/收藏/历史 API、滚动、分页、Modal、back/forward 与浏览器验收。

## 当前公开 Board 页面迁移组构建

- 本组未启动 Node dev/preview server，没有 PID、端口或回收事项；
- 八个目标 class 结构的 modern/legacy TypeScript、静态审计与完整 AST 统计通过；
- 受限沙箱首次构建在 Vite 配置加载阶段命中既知 `spawn EPERM`，在允许子进程的同一工作树重跑成功，共转换 3,925 个模块；
- `/board/:id/:page?/*` 生成新的 `board` 动态块；legacy `/list/:boardId/...` 继续生成原 `Board` 动态块；
- 既有 Sass `@import`、Spectrum 旧 CSS、plugin timing 与大 chunk 警告继续存在，本组未修改；
- 构建不替代真实登录态、Board/topic/tag/大字报/小黑屋/管理 API、权限、分页、hover UBB、back/forward 与浏览器验收。
