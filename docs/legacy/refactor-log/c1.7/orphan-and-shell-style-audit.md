# C1.7.4 孤儿源码与样式 owner 收口审计

日期：2026-08-02
实施基线：干净的 `dev20260716@37dffb03`
范围：仅 C1.7.4；不实施 C1.7.5、Z，不 commit、不 push

## 1. 删除闭包与可达性证明

实施前对候选文件名、导出名、相对路径、alias 路径和主要 DOM/行为字符串执行了全仓检索，并覆盖 `src/`、`Components/`、`Pages/`、Router/barrel、动态 `import()`/`require()`、模板、`public/`、构建与部署入口。仓库是私有应用包，没有供仓外源码消费的 `exports` 合同；用户另行确认不存在仓外源码级消费者。

| 删除实现 | 仓内可达性结论 | 活动实现或边界 |
| --- | --- | --- |
| `Components/Edit.tsx` | 无静态/动态调用、barrel 或 Router 入口；其 facade 导出只在本文件内聚合 | 活动 Editor 公共入口仍为 `@application/routes/editor` |
| `Components/FindIP.tsx` | 无静态/动态调用、barrel 或 Router 入口 | 活动 IP 管理由当前 Topic Route owner 提供 |
| `Components/Topic/Topic-Judge.tsx` | 无静态/动态调用、barrel 或 Router 入口 | 不改当前 Topic Detail 的判断与权限逻辑 |
| `Components/Topic/Topic-PostManagement.tsx` | 无静态/动态调用、barrel 或 Router 入口 | 不改当前 Topic Detail 的帖子管理逻辑 |
| `Components/Topic/Topic-TopicManagement.tsx` | 无静态/动态调用、barrel 或 Router 入口 | 不改当前 Topic Detail 的主题管理逻辑 |
| `Components/UserCenter/ExactActivitiesPosts.tsx` | 无静态/动态调用、barrel 或 Router 入口 | 不改当前 User Center Route、请求或分页 |

旧 `Edit` facade 的 `Category`、`ShowEdit`、`TagNotice`、`InputTitle`、`Tmp`、`Tags`、`Options` 导出随 facade 一并删除；其他公开接口未改。README 中仅删除上述失效入口。没有新增兼容 facade、空实现或重定向 Route。

仅由这些休眠实现消费的四份 Module 同步删除：

- `EditorLegacyForm.module.scss`
- `TopicManagement.module.scss`
- `TopicManagementActions.module.scss`
- `TopicManagementIP.module.scss`

`ExactActivitiesPosts` 没有独立 Module，因此未伪造第五份样式删除项。最终复核未发现删除候选的残留源码引用或孤儿 Module。

## 2. selector owner 收口

| 实际 JSX producer | 新 owner | 保留的行为边界 |
| --- | --- | --- |
| Application Shell | `src/application/layouts/app-shell.module.scss` | Error/Shell 条件、DOM 层级和主题背景不变 |
| Footer | `src/application/layouts/footer.module.scss` | Footer 文案、链接和布局不变 |
| Header | `src/application/layouts/header/ui/Header.module.scss` | 首页/非首页结构、logo、灰度伪元素和事件不变 |
| Header Search | `src/application/layouts/header/ui/Search.module.scss` | 固定 `id="search"`、输入和提交行为不变 |
| Header UserMenu | `src/application/layouts/header/ui/UserMenu.module.scss` | 登录菜单、隐私头像、未读数 ID/事件不变 |
| TopicVote | `src/application/routes/topic/detail/ui/TopicVote.module.scss` | `vote-message`、bar、total/current/info/buttons 六组活动规则归位，投票逻辑不变 |
| TopicReplySignature | `src/application/routes/topic/detail/ui/TopicReplySignature.module.scss` | 激活赞踩状态红色规则归真实 producer |
| Annual Review V1/V2 | `Pages/AnnualReview/AnnualReview.scss` | 两个无 Route 的冻结入口显式加载；8 组、共 9 个活动 selector 随 Z4 整体删除 |

Header 主题 Sass 值只替换为已有 `--cc98-*` 自定义属性；没有新增主题合同。`MainPage.scss` 只保留原 UBB/editor 规则，Header 规则已移出。`Site.scss` 不再聚合 Vote、Shell、Footer、Annual Review 或激活红色规则。

## 3. 预期 CSS 删除差分

以下差分是本批明确删除的休眠或无 producer 样式，不属于回归：

- PWA redirect：`pwa-redirect-background`、`pwa-redirect-container`、`pwa-redirect-image`、`pwa-redirect-text-container`、`pwa-redirect-button`、`pwa-redirect-button-container` 六组；
- Vote：删除 `Styles/Vote.scss` 及入口导入，不迁移无 producer 的 `vote-content`、`vote-description`、`vote-items`；
- Annual Review：不保留无 producer 的 `annual-review-board-back`、`annual-review-page1-days`、`annual-review-page1-day`；
- 旧组件：删除四份孤儿 Module 中只服务于六个休眠实现的规则；
- 主应用主题产物不再携带 Annual Review 样式及 `bg-cat.jpg`、`bg-rabbit.jpg` 两个静态 URL；Annual Review 自身没有恢复 Route，也没有迁移页面或 API。

基线与当前正式构建各产生 29 份主题 CSS。主题 manifest 源文件、条目顺序、键值、名称及日夜配对无代码差分；29 个主题的自定义属性集合无漂移。静态 URL 差分在每个主题中都精确等于上述两个 Annual Review URL，没有其他 URL 漂移。主题 CSS 每份减少 10131–10151 字节；当前产物中 Annual/PWA selector 为 0，Header/Footer/Shell 规则位于主入口 chunk，Vote 与激活红色规则位于 Topic Detail chunk。

## 4. 守卫与机械验证

- `npm run check:architecture`：通过；327 个现代源码文件、1348 条 import、27 条既有 allowlist。
- 样式守卫：通过；110 个真实 Module、0 个过渡 partial、29 个主题、2 个文件中的 2 处既有第三方 global、0 条休眠 owner 边、2 条 Annual Review 冻结样式边。
- `frozenInactiveImports` 已清零；守卫会拒绝失效冻结边。Annual Review 样式精确登记两个允许 importer，根样式 allowlist 已移除 `Vote.scss`。
- modern/legacy typecheck：通过。
- 正式 `npm run build`：通过；转换 4116 个模块。受限环境首次触发 `spawn EPERM`，以同一窄命令获准重跑后成功；只保留既有 Sass `@import`、Spectrum/Lightning CSS、插件耗时和大 chunk 警告。
- `git diff --check`：通过。
- 所有新增/修改文本文件按 UTF-8、无 BOM、CRLF、单一 EOF newline 检查；未跟踪文件已纳入检查，未发现 `.vscode/` 或生成产物进入变更集。

## 5. 整批人工审核与未验收项

静态整批审核确认 Router、API、Redux/Storage、URL、固定 ID、事件处理、DOM 条件、主题合同和业务逻辑没有改变；没有进入 C1.7.5，也没有混入 C1.7.3 已登记的 New Topics 跨 Module 查询缺陷修复。

本地 Vite 根入口 `http://127.0.0.1:5173/` 返回 HTTP 200，但当前运行时没有可连接的浏览器实例。因此以下浏览器场景均为**未执行、未验收**，不能由 build/typecheck 代替：首页/非首页 Header、登录/未登录菜单、搜索、未读数、隐私头像、Footer、Shell/Error、默认/暗色主题，以及 Topic 投票和赞踩激活状态。

Annual Review 当前没有 Route，且等待 Z4 整体删除，不登记运行验收；本批仅验证两个冻结入口、legacy typecheck，以及主应用产物不再携带其样式。

## 6. 停点

C1.7.4 的代码、记录、机械检查和主代理整批人工代码审核已经完成。工作树保持未提交，等待单独审核或提交授权；不自动实施 C1.7.5、Z，不 commit、不 push。
