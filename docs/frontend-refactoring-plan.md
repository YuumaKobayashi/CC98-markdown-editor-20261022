# CC98 前端目录重构执行计划

> 状态：R0、R1、F1-A、F1-B、F1-C、F1-D、A1、M1、M2、A2.1–A2.11、M3.1–M3.6、S1.1–S1.3 与 S1.4 第一组的代码实施、机械检查和主代理人工代码审核均已完成，A、M 阶段完成，S1 已启动。浏览器、登录、真实 API、权限、SignalR、跨标签与 UBB 运行验收未执行；当前停在 S1.4 第一组人工验收前，不启动收藏主题组。
>
> 架构依据：`docs/frontend-directory-architecture-inventory.md`。
>
> 本文记录如何从 class → function 完成点重新实施目录迁移，以及当前已经执行的基线恢复和第一轮架构骨架工作。未经单独授权，不迁移具体业务文件、不 commit、不 push。

## 0. 当前执行入口

这是目录重构唯一有效的执行计划。架构清单负责解释目标目录，本文负责记录阶段、下一批范围和完成状态。

当前状态：

```text
R0  恢复 2a69a0f0 代码基线                 已完成
R1  三层目录骨架、alias、架构检查           已完成
F1-A Foundation 核心能力迁址               已完成（含人工验收）
F1-B Foundation 通用 UI 迁址               已完成（含人工验收）
F1-C Foundation 第三方集成迁址             已完成（含人工验收）
F1-D 类型、基础样式和主题入口迁址           已完成（含人工验收）
A1   Application Shell 迁址                 已完成（含人工验收）
M1   核心数据模块迁址                       已完成（含人工验收）
M2   明确边界的交互模块迁址                 已完成（含人工验收）
A2.1 低耦合 Route 入口迁址                  已完成（含人工验收）
A2.2 Home、Search、Site Management          已完成（含人工验收）
A2.3 User Profile                           已完成（人工代码审核通过；运行验收未执行）
A2.4 User Center                            已完成（人工代码审核通过；运行验收未执行）
A2.5 Message Center                         已完成（人工代码审核通过；运行验收未执行）
A2.6 Focus                                  已完成（人工代码审核通过；运行验收未执行）
A2.7 Topic Discovery                        已完成（人工代码审核通过；运行验收未执行）
A2.8 Board                                  已完成（owner 拆分单独人工审核通过；运行验收未执行）
A2.9 Topic Detail                           已完成（人工代码审核通过；运行验收未执行）
A2.10 Editor                                已完成（按用户规则直接审核通过；运行验收未执行）
A2.11 Route 迁址收口                        已完成（人工代码审核通过；运行验收未执行）
M3.1 Account Service                        已完成（主代理逐函数审核通过；运行验收未执行）
M3.2 Reactions Service                      已完成（主代理逐函数审核通过；运行验收未执行）
M3.3 Moderation Service                     已完成（主代理逐函数审核通过；运行验收未执行）
M3.4 Posting Service                        已完成（主代理逐函数审核通过；运行验收未执行）
M3.5 Message 与 Notification                已完成（主代理逐函数审核通过；运行验收未执行）
M3.6 Site Content                           已完成（主代理逐函数审核通过；运行验收未执行）
S1.0 Redux 消费与 Storage 合同审计          已完成（仅计划细化；未实施代码）
S1.1 Session 与跨标签同步                   已完成（人工代码审核通过；运行验收未执行）
S1.2 用户偏好                               已完成（人工代码审核通过；运行验收未执行）
S1.3 Notification 未读计数                  已完成（人工代码审核通过；运行验收未执行）
S1.4 第一组：主题与回复                     已完成（人工代码审核通过；运行验收未执行）
```

### 当前停点：S1.4 第一组代码与机械检查已完成；停在人工验收前，不启动收藏主题组

### M3.1–M3.6 实施记录（2026-07-30）

实施基线：

```text
dev20260716  3ce2d08c  docs(a2): record route relocation completion
```

owner 与合同拆分：

- M3.1 将旧 Account Service 的 9 个函数按合同拆入 Session、Daily Signin、Site Content、Wealth、User Preference 与 Annual Review；AnnualReview 页面、Router 与页面行为继续冻结；
- M3.2 将点赞/点踩合同归入 Reaction，将奖惩财富合同归入 Post Rating；
- M3.3 将评分、评价标签与 `PostRatingDialog` 归入 Post Rating，Moderation 仅保留审核管理合同；
- M3.4 将发帖/编辑归入 Posting，将上传函数归入 Upload；原文件中的整段注释代码与中文注释完整保留；
- M3.5 将私信数据、类型与 UI 归入 Message，将通知数据、类型、UI、SignalR 与标题闪烁归入 Notification；路由字符串解析仍由 Application 持有，只通过 Notification 根入口绑定导航；
- M3.6 将首页和站点管理页的共享站点配置请求归入 Site Content；首页 localStorage/sessionStorage 缓存、60 秒 TTL、热点聚合、管理页请求竞态保护与 UI 状态仍留在对应 Route。

保真与人工审核：

- 六个子阶段均由独立子代理实施，主代理在每批后逐函数核对 URL、方法、Headers、body、返回值、异常协议、调用点、生命周期及完整注释，发现的 owner 越界、遗漏函数与 EOF 行尾漂移均在该批通过前修正；
- Message、Notification 与 Post Rating 的整文件迁址按 blob 或逐行差异复核；类型字段及注释、SignalR 事件名和启停顺序、浏览器通知点击路径、上传 localStorage 键和值、首页缓存键与失效时机均保持不变；
- 迁移只调整 owner、公共入口和必要 import；未改写业务逻辑、权限判断、Redux/Storage 协议、DOM/CSS、公开 URL 或 Router 序列；
- 新文件采用所在目录既有文本格式；三个迁入文件中的行尾空格来自原文件并为逐字节保真而保留，不视为新增格式清理。

机械证据：

- `npm run check:architecture`：通过，286 个源码文件、1158 个 import、30 个既有 allowlist；
- `npm run typecheck`：modern 与 legacy 均通过；
- 各子阶段 `npm run build` 均通过，最终为 3987 modules transformed；沙箱内因既知 `spawn EPERM` 失败的批次均在允许子进程的环境原样重跑成功；
- `git diff --check` 对当时已跟踪改动无命中；未跟踪新文件额外空白审计仅命中上述 3 处原文件行尾空格保真例外；旧 compat/legacy service 与深层 import 闭包、Router 路径序列复核、BOM/CRLF/LF/EOF 及注释检查均通过；
- 构建仍只有既有 Sass `@import`、Spectrum/Lightning CSS 和 chunk-size 警告。

人工检查与停点：

- M3.1–M3.6 均已通过主代理人工代码审核；M 阶段至此完成；
- 浏览器直达与交互、登录态、真实 API、管理员/非管理员权限、SignalR 多标签与通知权限、上传、编辑器、UBB 及缓存运行行为均未执行，不记为通过；
- 本批未 commit、未 push，未修改用户本地 `.vscode/`；
- M3 批次结束时停止在 S1.1 前；后续 S1.1 已获单独授权并完成，当前停点见上文。

### A2.3–A2.11 当前实施记录（2026-07-30）

代码检查点：

```text
A2.3  User Profile             3733694b（对应文档检查点 5b20bebb）
A2.4  User Center              b35d9bf9
A2.5  Message Center           cb2f0b87
A2.6  Focus                    38af6e31
A2.7  Topic Discovery          2bec49cc
A2.8  Board                    25f67f89
A2.9  Topic Detail             cf8b4008
A2.10 Editor                   b58d2dce
A2.11 Route 迁址收口           01df3f50
```

保真与结构证据：

- User Profile、User Center、Message Center、Focus、Topic Discovery、Board、Topic Detail 与 Editor 的 Route owner 已迁入 `src/application/routes`；A2.8 的 Board 与 Legacy Board List 两个 Route owner 拆分由主代理单独人工审核；
- 迁址批保持既有注释、目录结构、组件逻辑、相对路径、default/named export、兼容 facade 及公开 URL 合同；旧 owner 和对应 `@pages/*` 活跃引用逐批闭包；
- A2.11 删除空的 `src/pages`，移除 TypeScript、Vite 与架构检查器中的 `@pages` alias；活跃源码和配置中的 `@pages`、`src/pages` 使用均为 0，历史文档叙述保留；
- Router 的 45 个动态 import 全部指向 `@application/routes/*` 公共入口；从 Router 提取的 55 项 `path`、`index` 与 `Navigate to` 序列相对 `2a69a0f0` 差异为 0；
- A2.10 的 9 个迁址文件均为 `R100`，另只有 4 行必要引用替换，按用户“机械移动后引用改动不超过 10 行可直接通过”的规则由主代理直接审核通过；
- A2.3–A2.11 未实施 M3、S1、UBB 或 AnnualReview 迁移，未修改业务逻辑、API、权限、Redux、Storage、DOM/CSS 或公开 URL。

机械证据：

- 各批 `npm run check:architecture` 均通过；A2.11 最终结果为 267 个源码文件、1128 个 import、33 个既有 allowlist；
- `npm run typecheck`：modern 与 legacy 均通过；
- `npm run build`：通过，3970 modules transformed；沙箱内因既知 `spawn EPERM` 失败的批次均在允许子进程的环境原样重跑成功；
- `git diff --check`、旧 owner/旧 alias 全仓闭包、Router 入口与 URL 序列检查，以及各迁址批的 blob/BOM/行尾/EOF 检查：通过；
- 构建仍只有既有 Sass `@import`、Spectrum/Lightning CSS 和 chunk-size 警告。

人工检查与停点：

- A2.3–A2.11 各批主代理人工代码审核均已通过；A2.8 owner 拆分单独审核，A2.10 按上述用户规则直接通过；
- 浏览器直达、刷新、back/forward、登录态、真实 API、管理员/非管理员权限、分页与滚动加载、编辑器及 UBB 行为运行验收：均未执行，不记为通过；
- 旧 `/list` 路由仍只保留既有免检结论，不改写为人工验收通过；
- A 阶段至此完成；当前停止，不实施未获授权的 M3。

### F1-A 实施记录（2026-07-29）

基线与范围：

- 基线为 `dev20260716` 的 `53cf8fe0`；
- 14 个源码文件已经从 `src/shared/{api,config,lib,storage,theme}` 保真迁入对应的 `src/foundation/*`；
- 64 个匹配文件中的 import/export 已机械切换为 `@foundation/*`，其中包括 62 个外部消费者和 2 个迁入文件的内部依赖；
- `src/shared/ui`、`@shared` alias、业务模块、UBB、AnnualReview 和 `.vscode/` 均未改动。

文件与 owner 映射：

```text
src/shared/api       → src/foundation/api         1 个
src/shared/config    → src/foundation/config      2 个
src/shared/lib       → src/foundation/lib         7 个
src/shared/storage   → src/foundation/storage     2 个
src/shared/theme     → src/foundation/theme       2 个
```

保真与结构证据：

- 14 个迁移文件逐字节回退 alias 后与原 owner 对比，非路径差异为 0；
- 62 个外部消费者按 Git 文本行尾规则回退 alias 后，非路径差异为 0；
- 五个旧目录和 `@shared/{api,config,lib,storage,theme}/*` import 均为 0；
- `@shared/ui/*` 仍有 25 个消费者，故继续保留 `@shared` alias；
- 未新增 barrel、公开符号、allowlist 或架构例外。

机械证据：

- `npm run check:architecture`：通过，258 个源码文件、1140 个 import、0 个 allowlist 违规；
- `npm run typecheck`：modern 与 legacy 均通过；
- `npm run build`：通过，3939 modules transformed；沙箱内首次运行因既知 `spawn EPERM` 失败，在沙箱外重跑同一命令成功；
- `git diff --check`：通过；
- 14 个新 owner 文件的行尾空白检查：0 个匹配；
- 构建仍只有既有 Sass `@import`、Spectrum/Lightning CSS 和 chunk-size 警告。

人工检查与停点：

- 主题切换：人工审核通过（用户确认）；
- Storage 持久化：人工审核通过（用户确认）；
- 至少一条真实 API 请求：人工审核通过（用户确认）；
- 浏览器登录验收：人工审核通过（用户确认）；
- 本轮 Codex 浏览器环境不可用，不把未执行的自动化浏览器操作记作验收证据，验收结论以用户人工审核为准；
- F1-A 代码已提交于 `096f512c`，未 push；其后 F1-B 已于 2026-07-29 获得单独实施授权。

### F1-B 实施记录（2026-07-29）

基线与范围：

- 基线为 `dev20260716` 的 `3ed05f8b`；
- 7 个源码文件已经从 `src/shared/ui` 保真迁入 `src/foundation/ui`；
- 29 个消费者文件中的 33 条 import/export 已机械切换为 `@foundation/ui/*`，其中包括 4 个根目录兼容转导；
- `src/shared` 已清空删除，TypeScript、Vite 和架构检查器中的 `@shared` alias 已同步移除；
- F1-C、业务模块、UBB、AnnualReview 和 `.vscode/` 均未改动。

文件与 owner 映射：

```text
src/shared/ui/document-title → src/foundation/ui/document-title  2 个
src/shared/ui/feedback       → src/foundation/ui/feedback        3 个
src/shared/ui/pagination     → src/foundation/ui/pagination      2 个
```

保真与结构证据：

- 7 个迁移文件的工作树 blob 与基线旧 owner blob 逐一相同，内容差异为 0；
- 29 个消费者回退 `@foundation/ui` 为 `@shared/ui` 后，与基线相比非 alias 差异为 0；
- 活跃源码和配置中的 `@shared` 使用为 0，`src/shared` 旧 owner 已不存在；
- `@foundation/ui/*` 保持 29 个消费者文件、33 条 import/export；
- 未新增 barrel、公开符号、依赖、allowlist 或架构例外。

机械证据：

- `npm run check:architecture`：通过，258 个源码文件、1140 个 import、0 个 allowlist 违规；
- `npm run typecheck`：modern 与 legacy 均通过；
- `npm run build`：通过，3939 modules transformed；沙箱内首次运行因既知 `spawn EPERM` 失败，在允许子进程的环境重跑同一命令成功；
- `git diff --check`：通过；
- 构建仍只有既有 Sass `@import`、Spectrum/Lightning CSS 和 chunk-size 警告。

人工检查与停点：

- 页面标题更新及默认/具名 `DocumentTitle` 消费：人工审核通过（用户确认）；
- Pager 首尾、前后、跳页链接与 `#1` 锚点：人工审核通过（用户确认）；
- NoticeMessage、SendTopicNoticeMessage、MessageBar 的 DOM/样式：人工审核通过（用户确认）；
- 4 个根目录兼容转导：人工审核通过（用户确认）；
- F1-B 人工验收结论由用户于 2026-07-29 确认；F1-C 未授权，不自动进入下一批。

### F1-C 实施记录（2026-07-29）

基线与范围：

- 基线为 `dev20260716` 的 `74ca59b2`；
- 4 个源码文件已经从 `src/integrations/{charts,markdown-editor}` 保真迁入 `src/foundation/integrations/*`；
- 4 个消费者的 import 已机械切换为 `@foundation/integrations/*`，其中包括 2 个活跃 Application 消费者和 2 个冻结的 AnnualReview 消费者；
- `src/integrations` 已清空删除，TypeScript、Vite 和架构检查器中的 `@integrations` alias 及临时目录判定已同步移除；
- 播放器、水印、直接第三方包调用、Upload、UBB、AnnualReview 页面实现、路由、F1-D 和 `.vscode/` 均未改动。

文件与 owner 映射：

```text
src/integrations/charts
  → src/foundation/integrations/charts              2 个

src/integrations/markdown-editor
  → src/foundation/integrations/markdown-editor     2 个
```

保真与结构证据：

- 4 个新 owner 文件的工作树 blob 与基线旧 owner blob 逐一相同，内容差异为 0；
- 4 个消费者与基线相比均只有 `@integrations/*` → `@foundation/integrations/*` 的 alias 差异；
- 活跃源码和可执行配置中的 `@integrations`、`src/integrations` 使用均为 0，旧 owner 目录已不存在；
- `MarkdownEditor`、`MarkdownEditorProps`、`IntervalChart`、`IntervalChartProps` 的公开入口和合同保持不变；
- 未新增根级 barrel、依赖、allowlist 或架构例外。

机械证据：

- `npm run check:architecture`：通过，258 个源码文件、1140 个 import、0 个 allowlist 违规；
- `npm run typecheck`：modern 与 legacy 均通过；
- `npm run build`：通过，3939 modules transformed；沙箱内首次运行因既知 `spawn EPERM` 失败，在允许子进程的环境重跑同一命令成功；
- `git diff --check`：通过；
- 构建仍只有既有 Sass `@import`、Spectrum/Lightning CSS 和 chunk-size 警告。

人工检查与停点：

- 独立编辑页的 Markdown 输入、预览、任务列表、图片上传和自动高度：人工审核通过（用户确认）；
- 主题回复编辑器的同组行为：人工审核通过（用户确认）；
- AnnualReview 继续冻结，仅由 legacy typecheck 覆盖两个图表消费者，不恢复路由或图表渲染；
- F1-C 人工验收结论由用户于 2026-07-29 确认，并已获得本地提交授权；F1-D 未授权，不自动进入下一批。

### F1-D 实施记录（2026-07-30）

基线与范围：

- 基线为 `dev20260716` 的 `19c736b3`；
- 3 个环境/第三方声明已从 `@types` 迁入 `src/foundation/types`；
- `Styles/{Site,spectrum}.scss` 已迁入 `src/foundation/styles`，29 个主题已从 `Themes` 迁入 `src/foundation/theme/themes`；
- `@types/@cc98` 的 19 个业务 API 声明和 `Styles/{MainPage,UbbEditor,UserCenter,Vote}.scss` 均保留原位；
- TypeScript 文件发现和主题 manifest 已同步更新，根目录 `Themes` 已清空删除，`.vscode/` 未改动。

文件与 owner 映射：

```text
@types/{images,react-18-compat,third}.d.ts
  → src/foundation/types                            3 个

Styles/{Site,spectrum}.scss
  → src/foundation/styles                           2 个

Themes/*.scss
  → src/foundation/theme/themes                    29 个
```

保真与结构证据：

- 3 个声明和 `spectrum.scss` 与基线原 owner 内容一致；
- `Site.scss` 只有 4 条业务/UBB 样式相对路径修正，其他内容与基线一致；
- 29 个主题均只修改 `Site.scss` 导入行，其中 `new_year_2026_light.scss` 同步清理该行原有的一个尾随空格；原 BOM、行尾和 EOF 状态保持；
- manifest 仍为连续 id 1–29，key、顺序和 SCSS 文件名均与基线一致，首项 `css_blue`、末项 `css_cc98_23rd_light`；
- 未新增公开导出、alias、依赖、allowlist 或架构例外。

机械证据：

- 保真审计：通过，覆盖 3 个声明、`Site.scss`、`spectrum.scss`、29 个主题及 manifest 合同，并只放行批准的路径与单行尾随空格差异；
- `npm run check:architecture`：通过，261 个源码文件、1141 个 import、0 个 allowlist 违规；
- `npm run typecheck`：modern 与 legacy 均通过；
- `npm run build`：通过，3939 modules transformed，生成 29 个主题 CSS；沙箱内首次运行因既知 `spawn EPERM` 失败，在允许子进程的环境原样重跑成功；
- `git diff --check`：通过；
- 构建仍只有既有 Sass `@import`、Spectrum/Lightning CSS 和 chunk-size 警告。

人工检查与停点：

- 默认主题和“沧海启明”主题的 CSS 请求、切换与刷新持久化：人工审核通过（用户确认）；
- Header、Board、Topic、用户中心和编辑器的基础布局：人工审核通过（用户确认）；
- `P12-CSS-001` 为既有缺陷，不在本批修复或验收为新增回归；
- F1-D 人工验收结论由用户于 2026-07-30 确认，并已获得本地提交授权；A1 未授权，不自动进入下一批。

### A1 实施记录（2026-07-30）

基线与范围：

- 基线为 `dev20260716` 的 `0e49e1ee`；
- `src/app` 下 18 个源码文件已完整迁入 `src/application`，其中 `legacy` 改名为 `compatibility`；
- 原 `src/app/README.md` 的 Router、Store 和 Provider 边界已合并到 `src/application/README.md`，旧空目录已删除；
- 34 个活跃源码消费者和根 `Store.tsx` facade 已切换到新路径，`.vscode/` 未改动。

文件与 owner 映射：

```text
src/app/{bootstrap,providers,router,store,layouts}
  → src/application/{bootstrap,providers,router,store,layouts}

src/app/legacy
  → src/application/compatibility
```

保真与结构证据：

- 18 个迁址源码在逆归一化路径后与基线 blob 完全一致，注释、BOM、行尾和 EOF 均保持；
- 34 个消费者只修改 `@app/*` import，根 Store facade 只修改说明和 re-export 路径；
- Router 路径数组、lazy 声明、Provider 顺序、Store reducer 结构和 CrossTabSync 内容未改；
- 活跃源码和配置中的 `@app/*`、`src/app/*` 均为 0，物理 `src/app` 不存在；
- Vite `main`、`createRoot`、`createBrowserRouter` 和 `RouterProvider` 均保持唯一。

机械证据：

- 保真审计：通过，覆盖 18 个迁址源码、34 个纯 import 消费者和根 Store facade；
- `npm run check:architecture`：通过，261 个源码文件、1141 个 import、0 个 allowlist 违规；
- `npm run typecheck`：modern 与 legacy 均通过；
- `npm run build`：通过，3939 modules transformed；沙箱内首次运行因既知 `spawn EPERM` 失败，在允许子进程的环境原样重跑成功；
- `git diff --check`：通过；
- 构建仍只有既有 Sass `@import`、Spectrum/Lightning CSS 和 chunk-size 警告。

人工检查与停点：

- 首页与深链接刷新、lazy 路由切换、Header/Footer、登录/登出导航、错误恢复和双标签页既有行为：人工审核通过（用户确认）；
- A1 人工验收结论由用户于 2026-07-30 确认，并已获得本地提交授权；
- M1 未授权，不自动进入下一批。

### M1 实施记录（2026-07-30）

基线与范围：

- 基线为 `dev20260716` 的 `3e39037b`；
- `src/entities/{board,topic,post,user,message}` 下 34 个源码文件已迁入对应 Module，并新增 Board、Message 两个根公共入口；
- User 查询缓存归入 `cache`，`getMyInfo` 暂存于 `compat`；Message 保持完整混合实现并落入 `message/compat`；
- 89 个含旧路径的活跃源码、兼容 facade 和模块内部文件完成机械切换，`.vscode/` 未改动。

保真与结构证据：

- 34 个迁址文件按批准的 import/export 变换生成期望内容后逐字节一致，注释、BOM、行尾和 EOF 保持，其中 `board-info.ts` 原有无末尾换行状态保留；
- Board、Topic、Post、User、Message 均有根 `index.ts`，模块内部不从自己的 barrel 反向导入；
- 活跃源码与 TypeScript、Vite、架构检查配置中的 `@entities` 为 0，物理 `src/entities` 已删除；
- 旧兼容 facade 的原导出名和 default export 保持；User 缓存同名查询通过 `getCachedUserInfo`、`getCachedUsersInfo` 在根入口区分，再由旧 IndexedDB facade 映射回原名；
- `States/**`、`Props/**`、UBB、AnnualReview、Router、Reducers、API 合同、Storage 键和缓存失效时机未迁移或重构。

架构与机械证据：

- `npm run check:architecture`：通过，263 个源码文件、1133 个 import、26 个逐条登记的临时 allowlist；
- 26 条中，25 条对应 M1 明确冻结的旧类型/Props/UBB 合同，1 条对应 Auth → User current-user 的临时深路径；每条均有原因和删除条件；
- `npm run typecheck`：modern 与 legacy 均通过；
- `npm run build`：通过，3941 modules transformed；沙箱内因既知 `spawn EPERM` 失败，在允许子进程的环境原样重跑成功；
- `git diff --check`：通过；构建仍只有既有 Sass `@import`、Spectrum/Lightning CSS 和 chunk-size 警告。

已知问题与审核结论：

- 与 `3e39037b` 临时基线产物对照后，单一根 barrel 使初始静态共享图增加 `57,891` 字节，并把 TopicCard/APlayer/DPlayer、UserProfile/UBB 与相应 API 合并进共享 chunk；
- 多级公开 API 子入口可以恢复更细的 lazy 边界，但会改变 M1 已确认的“唯一根入口”规则，因此未擅自实施；
- 用户于 2026-07-30 审核确认接受当前 chunk 重组，并授权记录该问题和创建本地提交；
- M2 未授权，不自动进入下一批。

### M2 实施记录（2026-07-30）

基线与范围：

- 基线为 `dev20260716` 的 `bc554763`，代码检查点为 `7d331868`；
- 26 个 Feature 实现文件及 `current-user.ts` 按 owner 迁入 Session、User、Favorite Topic、Follow、Reaction、Moderation、Posting 和 Notification；
- 68 个兼容 facade/消费者文件及 User 根入口完成批准范围内的 import/export 机械切换，73 个文件中的 97 处 `@features/*` 引用归零；
- `src/features`、TypeScript/Vite/架构检查器中的 `@features` alias 已删除，`.vscode/` 未改动；
- ConfigSignature 归 User；current-user 归 Session；Account、Reactions、Moderation、Posting、Feature Message 的混合合同保持完整，未执行 M3。

保真与结构证据：

- 27 个迁址文件按批准的 import/export 变换生成期望内容后与 `bc554763` blob 逐字节一致，0 个非路径差异；
- 68 个兼容 facade/消费者文件及 User 根入口按同样规则回退后，0 个非路径差异；
- 原有逻辑、注释、API、错误行为、Storage/缓存时机、BOM、CRLF/LF 和 EOF 均保持；默认导出和旧 `Utility*`、`Components/*` facade 合同不变；
- 八个涉及的 Module 均以根 `index.ts` 作为唯一公共入口；模块内部相对导入、跨模块根入口导入，Module 深导入、自 barrel 导入和循环依赖扫描均为 0；
- `/message/setting` 仍使用原 URL 和 `MessageSetting` 名称，仅将 lazy import 切换到 Notification 根入口；
- NotificationController 保持未挂载状态；AnnualReview、UBB、Redux schema、Router URL 和 API wire shape 未进入本批。

架构与机械证据：

- `npm run check:architecture`：通过，266 个源码文件、1128 个 import、33 个逐条登记的临时 allowlist；
- 删除 2 条过时条目并新增 9 条：Session current-user → legacy `MyInfo` 1 条、Follow UI → Application/legacy 3 条、NotificationController → Application/legacy 5 条；每条均记录现存原因及由 S1、M3 或 Legacy 阶段删除的条件；
- `npm run typecheck`：modern 与 legacy 均通过；
- `npm run build`：通过，3969 modules transformed；沙箱内因既知 `spawn EPERM` 失败，在允许子进程的环境原样重跑成功；
- `git diff --check` 与未跟踪新文件额外空白检查：通过；
- 构建仍只有既有 Sass `@import`、Spectrum/Lightning CSS 和 chunk-size 警告。

已知问题与审核结论：

- 相对 `bc554763`，初始静态 JS 增加 `69,280` 字节；`/message/setting` 对应 chunk 增加 `7,464` 字节并进入初始静态共享图；
- 不为规避该 chunk 重组新增深层公开入口，也未改变 M2 的“唯一根入口”规则；
- 用户于 2026-07-30 完成登录态/token、当前用户、收藏、关注、反应、管理评分、发帖编辑上传、消息与通知相关人工审核并确认通过；
- A2、M3 均未授权，不自动进入下一批。

## 1. 实施结论

已经按照用户确认，直接在当前 `dev20260716` 工作目录回到 `2a69a0f0`，不创建新分支或 worktree。

实际执行结果：

```text
当前目录 dev20260716
        │
        ├─ HEAD 回到 2a69a0f0
        ├─ 丢弃已提交 D1 和未提交 D2 迁移结果
        ├─ 保留获批调研/实施文档与本地编辑器配置
        └─ 在同一目录按 foundation / modules / application 重新实施
```

本轮边界：

- D1/D2 不再作为实现来源或只读对照；
- 第一轮只建立目录、alias 和依赖检查；
- 第一轮不移动业务文件，不改变运行时行为；
- 后续迁移仍按独立小批审核和授权；
- 不自动 commit 或 push。

## 2. 基线选择

### 2.1 代码完成点

```text
93f5666f refactor(p15): migrate editor and remaining live pages
```

这是最后一批 live 非年度回顾 class → function 的代码提交。

### 2.2 推荐迁移基点

```text
2a69a0f0 docs(p15): record remaining live migration checkpoint
```

`2a69a0f0` 是 `93f5666f` 的直接后继，只增加 P15 记录，不改变业务代码。选择它可以同时保留：

- class → function 完成后的代码；
- P15 文件映射；
- 已知缺陷；
- 机械检查记录；
- 尚未执行或被免除的人工验收边界。

因此重新迁移应以 `2a69a0f0` 为基点，而不是 `93f5666f`。

### 2.3 基点之后的提交

回退前 HEAD 为：

```text
4b7cbc56 refactor(d1): relocate app foundation and low-coupling modules
```

`2a69a0f0..HEAD` 一共有 5 个提交：

```text
a996495f update doc
cd0cf598 docs(plan): revise post-p15 migration roadmap
b7a03be6 docs(p15.5): record user module ownership audit
42861142 docs(plan): simplify post-p15 refactoring roadmap
4b7cbc56 refactor(d1): relocate app foundation and low-coupling modules
```

当前分支已经回到 `2a69a0f0`，不再继承这 5 个提交。需要的调查结论重新以已批准的目录架构清单为准，避免把旧的 D1 目录判断带回新方案。

## 3. 当前工作目录处理方式

### 3.1 已确认决策

用户明确确认：

```text
复用当前目录
不创建 worktree
不保留 D1/D2 迁移结果
直接回到 2a69a0f0
```

因此实际执行：

```powershell
git reset --hard 2a69a0f0
```

并仅删除确认属于未提交 D2 的目录：

```text
src/modules/board
src/modules/topic
src/modules/post
```

### 3.2 保留范围

回退前先核对文件范围和内容哈希，回退后保留：

```text
docs/frontend-directory-architecture-inventory.md
docs/frontend-refactoring-plan.md
.vscode/settings.json
```

旧版目录重构计划已经删除，不再作为历史审核材料保留。没有创建备份分支或 worktree；D1 的旧提交对象可能暂时仍可从 reflog 找到，但不把它视为需要保留的迁移线。

## 4. 重新迁移的起始状态

`2a69a0f0` 下现代代码主体为：

```text
src/
├─ app/
├─ entities/
├─ features/
├─ integrations/
├─ pages/
└─ shared/
```

目标为：

```text
src/
├─ foundation/
├─ modules/
└─ application/
```

目标依赖：

```text
application ───────────────→ foundation
application → modules ─────→ foundation
```

迁移期间保留 `@legacy`，用于未迁移根目录代码和兼容出口；它不是最终第四层。

## 5. 实施原则

### 5.1 一批只解决一种问题

以下工作不能混在同一批：

```text
目录迁址
业务逻辑重构
API 合同改造
状态所有权改造
缓存策略改造
样式系统改造
删除旧代码
```

目录迁址批只允许：

- 移动完整文件；
- 更新 import/export；
- 建立公共入口；
- 更新 Router、Vite、TypeScript alias；
- 增加架构检查；
- 修复因移动产生的编译问题。

### 5.2 先迁址，后拆边界

对混合 service 不在迁址时按函数猜测拆分。

先将完整文件落到明确的临时 owner：

```text
legacy-service.ts
compat-service.ts
```

再在独立合同批中：

- 列出端点；
- 列出调用方；
- 列出请求/响应类型；
- 列出缓存和副作用；
- 分函数移动；
- 删除临时 service。

### 5.3 页面与业务模块允许同时出现同一业务名

例如：

```text
modules/topic                 Topic 能力
application/routes/topic      Topic 页面
```

这不是重复 owner：

- Modules 回答“Topic 能做什么”；
- Application 回答“页面怎样组合 Topic、Post、Reaction、Posting”。

### 5.4 不用“出现两次”作为抽取标准

是否进入 Modules 同时判断：

- 是否表达稳定业务语义；
- 是否有独立后端合同；
- 是否有独立状态或缓存生命周期；
- 是否被多个页面消费；
- 是否可以脱离某个具体 Route 解释。

页面私有布局和路由状态即使代码较大，也可以继续位于 Application。

### 5.5 保留 P15 行为合同

重新迁移不等于重新实现。

必须保留：

- 公开 URL；
- API 路径、方法、参数和调用顺序；
- Redux schema 与现有行为；
- Local/Session Storage 键；
- DOM/CSS 合同；
- UBB/Markdown；
- 权限和匿名行为；
- 已登记且未获授权修复的缺陷。

## 6. 实施总览

```text
R0  恢复代码基线
R1  架构骨架与依赖检查
F1  Foundation 迁址
A1  Application Shell 迁址
M1  核心数据模块迁址
M2  明确边界的交互模块迁址
A2  Route 入口迁址
M3  混合业务 Service 合同拆分
S1  状态与缓存归位
C1  样式与主题归位
LEGACY  兼容出口和旧代码收口
```

每一阶段由多个可独立审核的小批组成，不以阶段名称自动授权后续批次。

## 7. R0：恢复代码基线

### R0.1 当前目录直接回退

已完成：

- 分支继续使用 `dev20260716`；
- 当前目录直接回到 `2a69a0f0`；
- 已提交 D1 和未提交 D2 均不保留；
- 未创建新分支、备份分支或 worktree。

回退后检查：

```powershell
git rev-parse HEAD
git status --short
git branch --show-current
```

结果：

```text
HEAD = 2a69a0f0
tracked diff = 0
src/modules/board、topic、post 不存在
```

### R0.2 保留获批文档和本地配置

当前工作目录保留：

```text
docs/frontend-directory-architecture-inventory.md
docs/frontend-refactoring-plan.md
.vscode/settings.json
```

旧版目录重构计划不再保留，也不参与本方案的目录判断。

### R0.3 重新建立基线证据

已执行：

```powershell
npm run typecheck
npm run build
git diff --check
```

记录：

- HEAD：`2a69a0f0`；
- typecheck：现代和 legacy 均通过；
- build：通过；首次在受限环境遇到 `spawn EPERM`，以相同命令在允许构建子进程后通过；
- Router：单一 `createBrowserRouter`；
- 启动：单一 `createRoot`；
- 现有目录 alias：`@app`、`@pages`、`@features`、`@entities`、`@shared`、`@integrations`、`@legacy`。

P15 完成口径继续记录为：

```text
34 个 React class declaration
0 个 React class expression
```

其中：

```text
17 个 AnnualReview
16 个零调用/P21 候选
1 个 ErrorBoundary
```

这不是把未执行人工项补记为通过，只是重新迁移的结构基线。

## 8. R1：架构骨架与依赖检查

### R1.1 建立目标目录和 alias

建立：

```text
src/foundation/
src/modules/
src/application/
```

新增 alias：

```text
@foundation/*
@modules/*
@application/*
```

暂时保留：

```text
@app/*
@pages/*
@features/*
@entities/*
@shared/*
@integrations/*
@legacy/*
```

旧 alias 只在对应迁移完成前存在，每删除一个旧目录就同步删除对应 alias。

### R1.2 增加基于 TypeScript AST 的架构检查

新增本地脚本检查：

```text
Foundation 不得 import Modules/Application/Legacy
Modules 不得 import Application
Modules 跨模块只能走目标模块 index.ts
Application 可以 import Modules/Foundation
Route 不得深层 import Module 内部文件
```

迁移期确实无法立即清除的违规使用显式 allowlist：

```text
源文件
目标 import
存在原因
owner
删除条件
```

不允许用整个目录跳过检查。

### R1.3 公共入口规则

```text
foundation/<capability>/index.ts
modules/<module>/index.ts
application/routes/<route>/index.ts
```

禁止：

- 一个总 `modules/index.ts` 导出全部模块；
- Module 从自己的 barrel 反向导入；
- Route 对外暴露内部页面组件之外的大量实现；
- 通过 `Utility.ts` 新增现代代码依赖。

## 9. F1：Foundation 迁址

### F1-A 通用 API、配置、工具、存储和主题运行时

机械迁移：

```text
src/shared/api       → src/foundation/api
src/shared/config    → src/foundation/config
src/shared/lib       → src/foundation/lib
src/shared/storage   → src/foundation/storage
src/shared/theme     → src/foundation/theme
```

要求：

- 文件内容不做业务重构；
- Storage 键调用保持不变；
- HTTP 行为保持不变；
- 迁移完更新全仓 import；
- `src/shared/ui` 尚未迁移，因此保留 `@shared` alias。

### F1-B 通用 UI

机械迁移：

```text
src/shared/ui        → src/foundation/ui
```

要求：

- 组件 props 和导出名保持不变；
- Router Link 行为不变；
- 本批结束后 `rg` 证明 `@shared` 为零，才删除旧 alias。

### F1-C 第三方集成

机械迁移：

```text
src/integrations/charts
  → src/foundation/integrations/charts

src/integrations/markdown-editor
  → src/foundation/integrations/markdown-editor
```

只迁第三方适配，不迁 Upload、UBB、Topic 等业务。

迁移完：

- `@integrations` 为零；
- 删除旧 alias；
- 页面继续获得同样的组件和 props 合同。

### F1-D 类型、基础样式和主题入口

分开处理：

```text
@types 中的环境/第三方声明
  → src/foundation/types

Styles 中真正的全局基础样式
  → src/foundation/styles

Themes
  → src/foundation/theme/themes
```

业务页面 SCSS 不因“是样式”进入 Foundation。

根目录 `build/`、`scripts/`、`deploy/`、`public/` 不迁入 Foundation。

## 10. A1：Application Shell 迁址

机械迁移：

```text
src/app/bootstrap
  → src/application/bootstrap

src/app/providers
  → src/application/providers

src/app/router
  → src/application/router

src/app/store
  → src/application/store

src/app/layouts
  → src/application/layouts

src/app/legacy
  → src/application/compatibility
```

同时更新：

- Vite 主入口；
- TypeScript paths；
- Vite alias；
- Provider imports；
- Router imports；
- 根 Store imports。

边界：

- Router 路径数组不改；
- lazy 行为不改；
- Provider 顺序不改；
- reducer 结构不改；
- CrossTabSync 行为不改；
- ErrorBoundary 保持 class。

完成条件：

```text
src/app 不存在
@app 使用为 0
Vite 仍只有一个主应用入口
React Root 仍只有一个
Browser Router 仍只有一个
```

## 11. M1：核心数据模块迁址

这一步只处理 owner 已经明确、可以整体移动的内容。

### M1.1 Board

```text
src/entities/board
  → src/modules/board
```

拥有：

- Board 类型；
- Board 基础 API；
- Board 基础展示；
- Board 缓存策略。

`src/pages/board` 暂时不动，等待 Route 阶段。

### M1.2 Topic

```text
src/entities/topic
  → src/modules/topic
```

拥有：

- Topic 类型和基础 API；
- TopicCard 等跨页面 UI；
- Topic 标签缓存策略。

Topic Detail 页面仍留在 Pages，后续迁入 Application。

### M1.3 Post

```text
src/entities/post
  → src/modules/post
```

拥有 Post 类型、基础查询和可复用楼层展示。

### M1.4 User

```text
src/entities/user
  → src/modules/user
```

其中：

```text
api/              公共用户查询
cache/            UserInfo 一小时缓存策略
ui/               公共用户资料展示
```

底层 IndexedDB/localStorage 只从 Foundation 使用。

### M1.5 Message 基础类型

`src/entities/message` 先完整落入：

```text
src/modules/message/compat/
```

原因是当前 service 同时包含：

- 私信；
- 通知；
- Topic/Board/User 补全；
- 页面 URL 解析。

合同拆分前不把它误称为纯 Message owner。

## 12. M2：明确边界的交互模块迁址

### M2.1 Session

```text
src/features/auth
  → src/modules/session
```

先保持完整 API 和 token 行为。

当前用户读取与刷新仍有 Account/User/Legacy 依赖，先登记 allowlist，合同拆分阶段再收口。

### M2.2 Favorite Topic

```text
src/features/favorites
  → src/modules/favorite-topic
```

保留：

- 分组 API；
- 收藏状态；
- Modal 回调合同；
- 旧错误行为。

### M2.3 Follow

```text
src/features/follow
  → src/modules/follow
```

保留用户关注、Board 收藏和现有缓存失效行为。

### M2.4 Reaction

`src/features/reactions` 先整体落到：

```text
src/modules/reaction/api/legacy-service.ts
```

其中 Like/Dislike 属于 Reaction，财富奖励属于 Post Rating。此批不拆函数。

### M2.5 Moderation

`src/features/moderation` 先整体落到：

```text
src/modules/moderation/
```

PostRatingDialog 和部分评分 API 暂时保留兼容位置，M3 再拆。

### M2.6 Posting

`src/features/posting` 先整体落到：

```text
src/modules/posting/api/legacy-service.ts
```

发帖/编辑与上传暂不混在迁址批拆开。

### M2.7 Message 与 Notification

`src/features/message` 先整体落到：

```text
src/modules/notification/compat/
```

私信、通知设置、实时通知和标题闪烁在 M3 按真实调用链拆分。

### M2.8 Account 混合能力

`src/features/account` 不直接改名为某个最终模块。

先移动完整文件到：

```text
src/modules/session/compat/account-service.ts
```

M3 按函数分别归入：

```text
session
daily-signin
wealth
site-content
user-preference
annual-review
```

## 13. A2：Route 入口迁址

Route 迁移顺序按运行闭环划分，每批都更新 Router lazy import，并保持 URL 不变。

### A2.1 低耦合入口

```text
src/pages/auth/login
  → src/application/routes/login

src/pages/daily-signin
  → src/application/routes/daily-signin

src/pages/legacy-index
  → src/application/routes/legacy-index
```

### A2.2 Home、Search、Site Management

```text
src/pages/home
  → src/application/routes/home

src/pages/search/topics
  → src/application/routes/search/topic

src/pages/search/boards
  → src/application/routes/search/board

src/pages/site-manage
  → src/application/routes/site-management
```

Home 与 Site Management 共享的公告/广告合同等 M3 再提取到 Site Content。

### A2.3 User Profile

```text
src/pages/user-profile/layout
  → src/application/routes/user-profile/layout

src/pages/user-profile/overview
  → src/application/routes/user-profile/overview

src/pages/user-profile/manage
  → src/application/routes/user-profile/manage
```

保持：

- `/user/:method/:id`；
- name/id 规范化；
- 管理权限合同；
- 最近主题/发言分页。

### A2.4 User Center

```text
src/pages/user-center/*
  → src/application/routes/user-center/*
```

子目录保持：

```text
layout
overview
followings
fans
topics
history
posts
favorites
settings
custom-boards
wealth-transfer
theme
```

页面继续消费 Modules，不在 Route 迁址时重写 Redux 或分页。

### A2.5 Message Center

```text
src/pages/message/*
  → src/application/routes/message-center/*
```

子目录：

```text
layout
responses
mentions
system
private-messages
settings
```

通知列表与私信会话继续分开。

### A2.6 Focus

```text
src/pages/focus/*
  → src/application/routes/focus/*
```

子目录：

```text
layout
boards
users
favorites
```

Focus 的页面级滚动和聚合缓存留在 Route；Follow 能力来自 Modules。

### A2.7 Topic Discovery

```text
src/pages/new-topics
  → src/application/routes/new-topics

src/pages/recommended-topics
  → src/application/routes/recommended-topics

src/pages/hot-topics
  → src/application/routes/topic/hot
```

TopicCard 等跨页面 UI 来自 `modules/topic`。

### A2.8 Board

```text
src/pages/board-list
  → src/application/routes/board-list

src/pages/board
  → src/application/routes/board

src/pages/board/legacy-list
  → src/application/routes/legacy-board-list
```

当前 `/board` 与旧 `/list` 保持两个 Route owner。

旧 `/list` 的免检记录不能改写为“人工通过”。

### A2.9 Topic Detail

```text
src/pages/topic
  → src/application/routes/topic/detail
```

普通页和 Tracked 页可以位于同一 Route 组：

```text
detail/page.tsx
tracked/page.tsx
```

页面组合：

```text
topic
post
reaction
post-rating
moderation
favorite-topic
follow
posting
ubb
```

### A2.10 Editor

```text
src/pages/editor
  → src/application/routes/editor
```

页面专用：

- mode/id 路由参数；
- 页面布局；
- 页面初始化；
- 标签选择 UI 编排。

业务能力：

- create/edit/reply → Posting；
- upload → Upload；
- UBB → UBB；
- Board/Topic/Post 查询 → 对应 Modules。

### A2.11 Route 迁址收口

完成后：

```text
src/pages 不存在
@pages 使用为 0
Router 所有 lazy import 指向 Application Route 公共入口
全部公开 URL 与 2a69a0f0 相同
```

## 14. M3：混合 Service 合同拆分

这一步才允许按函数拆文件。

### M3.1 Account Service

```text
refreshUserInfo
  → modules/session

signin
getSigninInfo
  → modules/daily-signin

getGlobalConfig
  → modules/site-content

queryWealth
getUserWealth
  → modules/wealth

setUserTopicViewMode
  → modules/user-preference

getAnnualReview
getAnnualReviewV2
  → modules/annual-review
```

AnnualReview 只归档合同，不自动迁移页面或恢复路由。

### M3.2 Reactions Service

```text
like
dislike
getLikeStateAndCount
getLikeState
refreshLikeState
  → modules/reaction

awardWealth
deductWealth
getAwardInfo
  → modules/post-rating
```

### M3.3 Moderation Service

保留在 Moderation：

- 删除、锁定、置顶、精华、高亮、移动；
- IP；
- 管理记录；
- 封禁；
- 批量操作。

移入 Post Rating：

- plus/minus；
- prestige；
- judge；
- PostRatingDialog。

### M3.4 Posting Service

```text
sendTopic
editPost
  → modules/posting

uploadFile
clickUploadIcon
uploadEvent
  → modules/upload
```

localStorage 中的编辑器上传状态必须作为既有合同登记，不在本批改写。

### M3.5 Message 与 Notification

Message：

- 最近联系人；
- 会话消息；
- 发送私信；
- 会话排序和消息展示规则。

Notification：

- 回复；
- @；
- 系统通知；
- 未读计数；
- read-all；
- SignalR；
- 标题闪烁；
- 浏览器通知；
- 通知设置。

Route URL 解析应移回 Application Route model，不保留在 Module API。

### M3.6 Site Content

从 Home、Site Management、Account 中整理：

- 公告读取/编辑；
- 广告读取/编辑；
- 首页推荐内容；
- 后端首页刷新动作。

首页 localStorage 聚合响应仍属于 Home Route cache，不能因共享 API 就全部移入 Site Content。

## 15. S1：状态与缓存归位

这一步在目录迁址和 API owner 稳定后执行。S1 只调整状态、持久化和缓存 owner，不改变公开 URL、API wire shape、权限、DOM/CSS、Storage 键与 TTL、分页规则或用户可见时序。

目标终态：

- Redux 只保留真正跨页面共享的 `session` 与 `notification` 两个业务 slice；
- 全局错误、用户偏好、公开资料页导航、转账和用户中心远端列表退出 Redux；
- `application/store` 只负责 Store 装配，业务 state、action、selector 归对应 Module；
- 页面状态继续由 Application Route 持有；
- 现存直接 mutation、共享 loading 等缺陷只登记，不在迁移批顺手修复；
- 每个子批独立实施、检查和人工验收，未经授权不自动进入下一批。

### S1.0 Redux 消费与 Storage 合同基线

状态：已完成只读消费审计和计划细化；未实施任何 Redux、缓存或组件代码。

当前 Store 仍有三个 legacy reducer 分支：

```text
error
userInfo
message
```

当前共有 30 个组件源码直接读取 Redux 或 dispatch Redux action：

```text
Application 壳层与错误
  AppShell
  NavigationErrorReset
  EditorPage

Session、当前用户与用户偏好
  Header
  LoginPage
  NewTopicsPage
  TopicVote
  UserCenterLayout
  UserCenterOverview
  UserCenterSettingsPage
  UserCenterAvatarSettings
  UserCenterThemePage

公开用户资料页
  UserProfileLayout
  UserProfileNavigation
  UserProfileOverview
  UserProfileManagePage

用户中心远端数据与页面操作
  UserRecentTopicsActivityList
  MyTopics
  MyPosts
  UserCenterFavoriteTopicsPage
  UserFavoriteBoards
  UserCenterHistoryPage
  MyFollowings
  MyFans
  TransferWealthPage

Message 与 Notification
  MessageLayout
  PrivateConversationWindow
  NotificationController

Module UI 与 legacy 零调用组件
  UserFollowCard
  ExactActivitiesPosts
```

其中：

- `NotificationController` 只有 Module 和根兼容入口导出，当前没有运行挂载点；S1 只迁移其状态接口，不擅自启用 SignalR Controller；
- `ExactActivitiesPosts` 仓内零调用，S1 将其改为等价的非 Redux 兼容组件，但继续保持不可达，不在本批删除；
- `createAppRoot` 只提供 Redux Provider，不计入业务消费者；
- `registerLegacyUtilityEffects` 通过 `store.dispatch/getState` 桥接全局错误、登出、当前用户更新和消息计数，属于必须闭合的非组件消费者。

当前旧 thunk 合同包括：

```text
refreshCurrentMessageCount
refreshCurrentUserInfo
getRecentTopics / getRecentPosts / getHotPosts
getFavoritePosts
getCurrentUserFavoriteBoards
getHistoryPosts / setBrowsingHistoryEnabled
getUserFollowingsInfo / getUserFansInfo
sendWealth
```

这些 thunk 目前共享 `userInfo.isLoading/isError/errorMessage`、`hasTotal`、`totalPage` 和 `currentUserCenterPage`，部分代码还直接修改 `getState()` 返回的数组或字段。实施时必须整体迁移“数据、分页、完成状态、loading/error、请求动作”，不能只移动数组或顺手修复直接 mutation。

S1 必须保持的 Storage 合同：

```text
Session
  accessToken
  refresh_token
  userInfo
  shouldNotRefreshUserInfo
  logOnRedirectUrl
  usePWA
  对应的 *_expirationTime

Notification
  messageCount
  signalr
  noticeSetting

User Preference / Theme
  showCardUser
  user-set-theme
  use-theme
  defaultEmojiType

User / Board / Topic / Daily Signin cache
  userId_${id}
  userName_${name}
  boardsInfo
  boardInfo
  tagInfo
  signin_${userId}

Posting / Editor drafts
  contentCache
  temporaryContent
  temporaryContent-${topicId}
  react-mde-imageurl
  react-mde-imageurl-status
```

Home、New Topics、Recommended Topics、Random Topics 和 Focus 的既有页面私有 cache 继续由对应 Application Route 持有，不因 S1 移入 Redux 或领域全局状态；其中包括 `mainPageData`、`mainPageHotTopic`、`mainAds-v2`、`AllNewTopic`、`AllNewMediaTopic`、`CurrentRandomTopics`、`LastRandomTopics`、`CurrentRecommendedTopics`、`LastRecommendedTopics`、`focusBoardList`、`currentFocusBoard` 和 `focusBoard_${boardId}`。

### S1.1 Session 与跨标签同步

状态：代码实施、机械检查和主代理人工代码审核已完成；浏览器、登录、真实 API、锁定用户与双标签运行验收未执行，当前停在人工验收前。

实施结果：

- Session Module 已建立 `model`、`persistence` 和 `sync`，根入口统一公开登录、登出、当前用户更新、刷新、selector 与现有非 Redux Session 兼容接口；
- Application Store 已注册 Session reducer；legacy `userInfo` 不再保存 `isLogOn` 或 `currentUserInfo`，旧 thunk 和组件的对应消费均已迁移；
- 当前标签页写入 `userInfo` 后立即更新 Session，其他标签页由唯一的 `CrossTabSync` 处理；Header 仅暂留 S1.2 才迁移的 `showCardUser` listener；
- 保留现有 Storage 键、编码、TTL、锁定用户处理、登录提示、100ms 返回、刷新时机、四类清理范围、主题复位与页面跳转；
- `npm run check:architecture` 通过（292 个源码文件、1194 个 import、29 个有条件 allowlist），modern/legacy typecheck、正式 build（3992 modules transformed）和 `git diff --check` 均通过；构建只有既有 Sass、Lightning CSS 与 chunk-size 警告。

目标目录：

```text
modules/session/model
modules/session/persistence
modules/session/sync
```

实施要求：

- 建立 Session slice、action、selector、persistence 和 sync，统一 token、当前用户、refresh、登录状态和跨标签事件；
- Session Module 根入口公开登录、登出、当前用户更新、刷新及 selector，不允许消费者深导入；
- 保持 `accessToken`、`refresh_token`、`userInfo` 的现有编码、TTL、锁定用户处理、登录返回地址和刷新时机；
- 迁移 Header、LoginPage、UserCenterLayout、UserCenterOverview、用户设置/头像/主题页、TopicVote 和公开资料导航中的当前用户消费；
- `storage` 事件只处理其他标签页；当前标签页写入持久化后必须立即 dispatch 本地 Session 更新；
- 将 Header 中的 `userInfo` listener 迁入唯一的应用级 `CrossTabSync`，禁止 Header 和 User Center 各自维护当前用户真相源；
- 登录、登出、资料修改、头像修改和主题修改必须在所有标签页保持一致；
- 不改变登录成功/失败提示、100ms 返回时机、退出清理项、Session Storage 清空、主题复位和页面跳转。

本批结束时，`userInfo` reducer 中只允许暂存尚未迁移的页面/业务字段，不再作为 Session 的 owner。

### S1.2 用户偏好

状态：代码实施、机械检查和主代理人工代码审核已完成；浏览器、登录与双标签运行验收未执行，当前停在人工验收前。

实施结果：

- User Preference Module 已在 `persistence` 中公开 `showCardUser` 的读取、写入、订阅 hook 和跨标签同步接口，未新增 Redux slice；
- Header 和 NewTopicsPage 已改用公共 hook 与写入接口，legacy `userInfo` 中的偏好字段、action、action type、reducer 分支和 Header 私有 listener 已删除；
- 当前标签页写入后主动通知所有订阅者，其他标签页由唯一的 `CrossTabSync` 处理 `storage` 事件；
- 保留缺省显示、`str-true`/`str-false` 编码、永不过期和登出删除行为；主题、Topic 浏览模式、通知设置与 Emoji 分类未改动；
- `npm run check:architecture` 通过（293 个源码文件、1198 个 import、29 个有条件 allowlist），modern/legacy typecheck、正式 build（3993 modules transformed）和 `git diff --check` 均通过；构建只有既有 Sass、Lightning CSS 与 chunk-size 警告。

目标目录：

```text
modules/user-preference/persistence
```

实施要求：

- 提供 `showCardUser` 的读取、写入和订阅 hook；
- 同标签页写入后主动通知订阅者，其他标签页由统一 `CrossTabSync` 响应 `storage` 事件；
- 迁移 Header 和 NewTopicsPage，删除其 `showCardUser` Redux selector/action 及 Header 私有 listener；
- 保持 `showCardUser` 缺省为显示、字符串布尔编码、永不过期和退出时删除的行为；
- 主题、Topic 浏览模式、通知设置、Emoji 分类继续保留原键、默认值、API 调用和失效时机；
- 不把整份用户偏好或当前用户对象复制进新的 preference slice。

### S1.3 Notification 未读计数

状态：代码实施、机械检查和主代理人工代码审核已完成；浏览器、真实 API、SignalR、跨标签与通知权限运行验收未执行，当前停在人工验收前。

实施结果：

- Notification Module 已建立四个必填数值字段的 unread slice，根入口统一公开 `UnreadCount`、reducer、整体替换 action、selector 和 `refreshUnreadCount`；
- Application Store 已注册 `notification` reducer，legacy `message` reducer、action、thunk、action type 和出口均已删除；Utility 兼容桥改由 Notification 公共 selector/action 读取和清零；
- Header、MessageLayout、PrivateConversationWindow 与 NotificationController 已改用 Notification 公共合同，保持原请求时机、四类计数、消息页清零和私信已读后条件刷新；
- `/me/unread-count`、`messageCount` 的无 TTL `obj-` 编码、SignalR 事件、跨标签替换、标题闪烁和浏览器通知逻辑均保持；NotificationController 继续只有导出、没有运行挂载点；
- `npm run check:architecture` 通过（296 个源码文件、1211 个 import、26 个有条件 allowlist），modern/legacy typecheck、正式 build（3993 modules transformed）和 `git diff --check` 均通过；构建只有既有 Sass、Lightning CSS 与 chunk-size 警告。

目标目录：

```text
modules/notification/model
```

目标接口：

- Notification slice 使用四个非可选数值字段：`systemCount`、`atCount`、`replyCount`、`messageCount`；
- Module 根入口公开未读计数 selector、整体替换 action 和 `refreshUnreadCount`；
- `application/store` 只注册 Notification reducer，不拥有其业务 action 或 selector。

实施要求：

- 将 legacy `message` reducer、action 和 `refreshCurrentMessageCount` thunk 迁入 Notification；
- 迁移 Header、MessageLayout、PrivateConversationWindow 和 NotificationController；
- 保持 `/me/unread-count`、`messageCount` Storage 键、请求时机、消息页清零、SignalR 事件、跨标签刷新、标题闪烁和浏览器通知行为；
- 保持 NotificationController 未挂载，不因迁移新增启动点；
- Utility 兼容桥改为调用 Notification 公共接口，不再直接读取 `state.message`。

### S1.4 用户中心远端数据本地化

状态：第一组“主题与回复”的代码实施、机械检查和主代理人工代码审核已完成；浏览器、登录与真实 API 运行验收未执行，当前停在第一组人工验收前，不启动收藏主题组。

第一组实施结果：

- Topic 与 Post Module 根入口已公开当前用户主题/回复分页请求，保持 `/me/recent-topic`、`/me/recent-post`、`/me/hot-post`、授权头、`size=11` 探测、前 10 条展示、顺序补充 `boardName`、非 200 `statusText` 错误及回复 `Math.floor(count / 10) + 1` 总页数算法；
- UserRecentTopicsActivityList、MyTopics 与 MyPosts 已分别持有数据、分页、完成状态和 loading/error；Overview 与 MyTopics 不共享跨 Route 缓存，MyTopics 保留稀疏页缓存，MyPosts 保留 recent/hot 切换时的同页覆盖与 count 分页行为；
- UserCenterOverview 不再写入 `currentUserCenterPage`，但继续通过 Session 刷新当前用户；ExactActivitiesPosts 已转为无 Redux 的本地状态兼容组件，保留默认导出、零调用状态及原无参 thunk 实际对应的 hot-post 请求；
- legacy recent-topic/recent-post/hot-post thunk 文件、对应 action、ActionType、reducer 数据字段和已闭合分页分支已删除；后五组仍使用的 currentUserCenterPage、共享 loading/error 与通用分页 action 暂时保留；
- `npm run check:architecture` 通过（297 个源码文件、1206 个 import、27 条有条件 allowlist），modern/legacy typecheck、正式 build（3993 modules transformed）和 `git diff --check` 均通过；受限环境首次 build 因 `spawn EPERM` 失败，按原命令在允许子进程的环境重跑成功，构建只有既有 Sass、Lightning CSS 与 chunk-size 警告。

用户中心各子页分别拥有自己的数据、分页、完成状态和 loading/error，不建立汇总所有子页状态的 `UserCenterLayout` Route Context；当前 tab 与页码从 URL 派生，不再由 Redux 记录 `currentUserCenterPage`。

按以下六组分开实施和验收：

```text
主题与回复
  UserCenterOverview
  UserRecentTopicsActivityList
  MyTopics
  MyPosts
  ExactActivitiesPosts

收藏主题
  UserCenterFavoriteTopicsPage

收藏版面
  UserFavoriteBoards

浏览历史
  UserCenterHistoryPage

关注
  MyFollowings
  UserFollowCard

粉丝
  MyFans
  UserFollowCard
```

实施要求：

- 保持每个接口的 URL、参数、11 条探测规则、每页 10 条展示、空数组、越界、前后翻页和错误行为；
- Overview 与 MyTopics 分别管理并请求各自的最近主题状态，不共享跨 Route 缓存；切换子路由后按目标页面自身生命周期重新请求；
- 页面级 loading/error 不再共用一个全局布尔值，但 DOM、提示文本和可见时机必须与旧行为一致；
- `browsingHistoryEnabled` 更新当前用户 Session 字段，同时由历史页 owner 管理列表清空和重新请求；
- UserFollowCard 通过回调通知关注/粉丝列表 owner，不再 dispatch 修改两份全局数组；
- ExactActivitiesPosts 转为等价的非 Redux 兼容组件，继续保持零调用，不删除其公开导出；
- 每完成一组即停止检查，不把六组合成一个不可审核的大批次。

### S1.5 页面与壳层状态

公开用户资料页：

- 删除 `currentVisitingUserPage`、`currentVisitingUserId`、`currentVisitingUserIsExisted`；
- 当前 exact/manage 模式和用户标识从路由参数派生；
- 用户存在性、加载结果及页面级错误由 `UserProfileLayout` Route Context 持有；
- 保持管理员权限、ID/用户名访问、不存在用户、重定向和返回行为。

财富转账：

- TransferWealthPage 本地管理 loading、error、errorMessage 和成功用户名；
- 保持 `/me/transfer-wealth`、请求 body、部分成功名单和错误提示；
- 成功后只通过 Session 公共接口更新当前用户财富值，不直接修改 Store 对象。

Application Error：

- 将 `error` reducer 迁为 Application 壳层 Error Provider；
- 保持现有 `errorKeys`、`Status` 组件映射、AppShell 条件渲染和路由切换清除；
- Editor 和 legacy Utility 通过统一命令式上报适配进入 Provider；
- 不把 HTTP 异常统一化、Router errorElement 或错误文案重构混入本批。

### S1.6 缓存与草稿归位

用户资料缓存：

```text
owner       modules/user/cache
对象        公共 UserInfo
键          userId_${id} / userName_${name}
TTL         3600 秒
介质        IndexedDB，保留现有 localStorage 回退
失效条件    用户资料修改、头像修改及既有显式清理点
```

其他领域缓存：

```text
modules/board/cache          boardsInfo / boardInfo
modules/topic/cache          tagInfo
modules/daily-signin/cache   signin_${userId}
```

草稿与上传恢复：

```text
modules/posting/drafts
```

- 接管回复草稿、发帖失败缓存和 Editor 内容恢复；
- 保持 `contentCache`、`temporaryContent`、`temporaryContent-${topicId}`、`react-mde-imageurl`、`react-mde-imageurl-status` 的键、编码、写入、读取和删除时机；
- 不修改 `autoClearLocalStorage` 的保留白名单；
- 不将页面私有缓存泛化为全局 cache，也不引入 RTK Query 或新的持久化库。

### S1.7 Redux 闭包

目标 `RootState`：

```text
{
  session,
  notification
}
```

闭包要求：

- 全仓业务组件不再读取 `state.userInfo`、`state.message`、`state.error`；
- 除 Application Store 装配外，不再存在业务 `connect`、旧 Redux thunk、直接 `store.getState/dispatch` 或从根 Store 聚合 legacy `Actions` 的调用；
- `application/store` 只保留 `configureStore`、reducer 注册、middleware、typed hooks、`AppDispatch` 和 `RootState`；
- Session、Notification 的 slice、action 和 selector 只由各自 Module 根入口公开；
- 根 `Store.tsx` 仅作为兼容转导保留至 LEGACY；
- 旧 Actions、Reducers、AsyncActions 只有在全仓静态引用、动态入口、TypeScript 配置和兼容消费者全部归零后才删除；
- 更新 Application/Module README、架构 allowlist、文件地图和本计划状态；
- 不启动 C1，不 commit，不 push。

### S1 验证与人工验收

每个子批必须运行：

```text
npm run check:architecture
npm run typecheck
npm run build
git diff --check
```

同时检查：

- modern/legacy typecheck 均通过；
- 未跟踪新文件的空白和文本格式；
- Module 根入口、深导入、自 barrel、循环依赖和架构 allowlist；
- `@legacy/Actions`、`@legacy/AsyncActions`、`@legacy/Reducers`、根 `Store` 和旧相对路径的全仓引用闭包；
- 30 个直接组件消费者和 Utility 桥均有明确迁移结果；
- 未修改 `.vscode/`、AnnualReview、UBB、公开 URL、API wire shape、DOM/CSS 或未授权业务逻辑。

人工验收边界：

```text
Session
  登录成功/失败、登出、refresh、锁定用户
  同标签页更新
  双标签登录/登出/资料/头像/主题同步

Notification
  四类未读数、消息页刷新、私信已读
  SignalR 更新、标题闪烁、跨标签刷新
  NotificationController 继续未挂载

User Center
  深链页码、前后翻页、空结果、越界、刷新、返回
  热门回复、收藏筛选/分组、历史开关、关注/取关和错误路径

页面与错误
  公开资料 exact/manage、管理员权限、不存在用户
  发帖错误页、路由切换清错、转账部分成功

缓存与草稿
  TTL、失效、跨标签偏好、编辑器恢复和失败缓存
```

构建和 typecheck 只算机械证据。浏览器、登录、真实 API、权限、SignalR、缓存和手工验收必须分别记录；未执行不得记为通过。每批完成机械检查和主代理代码审核后停止，等待人工验收及单独提交授权。

### S1 固定边界

- Redux 终态采用 Session 与 Notification unread 两个业务 slice；Application Error 退出 Redux；
- 采用严格保真迁移，已知缺陷单独登记；
- AnnualReview、UBB、公开 URL、API wire shape、DOM/CSS、Storage 键/TTL 和 `.vscode/` 不进入 S1 修改范围；
- S1.1–S1.3 与 S1.4 第一组已按单独授权完成代码与机械检查；当前停在第一组人工验收前，未经授权不启动收藏主题组。

## 16. C1：样式与主题归位

样式阶段不与组件迁址混做。

### C1.1 Foundation 样式

```text
foundation/styles/reset
foundation/styles/base
foundation/styles/vendors
foundation/styles/mixins
foundation/styles/variables
```

### C1.2 业务组件样式

跟随 Module：

```text
modules/topic/ui/*.module.scss
modules/user/ui/*.module.scss
```

### C1.3 页面样式

跟随 Route：

```text
application/routes/home/*.module.scss
application/routes/user-center/*.module.scss
```

### C1.4 主题

```text
foundation/theme/registry
foundation/theme/runtime
foundation/theme/tokens
foundation/theme/themes
```

29 个现有主题入口和生成文件名合同必须保持。

## 17. Legacy 和兼容出口收口

### Legacy.1 删除条件

旧 facade 或 `@legacy` 文件必须同时满足：

- 仓内 import 为 0；
- Router 不可达；
- 动态 import/require 为 0；
- 构建模板无引用；
- 外部固定 URL 已核对；
- typecheck/build 通过；
- 对应人工检查完成或用户明确免除。

### Legacy.2 Utility.ts

禁止新代码继续通过 `Utility.ts` 总门面调用现代能力。

收口顺序：

```text
列出每个导出
定位直接调用方
改为 Module/Foundation 公共入口
证明导出为 0
删除单个导出
```

不能整文件直接删除。

### Legacy.3 P21 候选

16 个零调用 class/P21 候选必须重新做引用证明，不能因为从旧基点重开就直接删除。

### Legacy.4 AnnualReview

继续冻结：

```text
Pages/AnnualReview
Pages/AnnualReviewV2
```

除非用户单独授权：

- 是否仍有外部入口；
- 是否独立站点；
- 是否进入 Application Route；
- 是否形成独立 application。

### Legacy.5 UBB

目标 owner 是 `modules/ubb`，但 UBB 源码迁移单独审核：

- Tag Handler；
- UbbContainer；
- UbbEditor；
- 权限标签；
- Math/Media；
- DOM/CSS；
- 内容安全。

在专门验收前继续冻结，其他目录迁移通过公共兼容入口使用。

## 18. 每批必做检查

### 18.1 变更前

```text
明确基线 HEAD
列出目标文件
列出旧 owner
列出新 owner
列出全部直接调用方
列出 API/Redux/Storage/URL/DOM/CSS 合同
列出不允许顺手修改的内容
```

### 18.2 机械检查

```powershell
npm run typecheck
npm run build
git diff --check
```

新文件额外检查行尾空白，因为普通 `git diff --check` 不覆盖全部未跟踪文件。

### 18.3 架构检查

```text
旧 alias 使用数
旧 owner import 使用数
跨层逆向 import
Module 深层 import
Module 循环依赖
Router lazy 入口
公开 index.ts
Legacy allowlist
```

### 18.4 行为检查

按批选择：

- 无登录/已登录；
- deep link；
- refresh；
- back/forward；
- API 成功/失败；
- 权限；
- 分页；
- cache/storage；
- 跨标签页；
- UBB/Markdown；
- 图片、音频、视频；
- Modal；
- 键盘和滚动；
- 主题。

### 18.5 文档检查

每批记录：

- file map；
- owner map；
- before/after；
- known defects；
- mechanical evidence；
- manual checklist；
- 未执行项。

未执行项只能写“未执行”或“用户免除”，不能写“通过”。

## 19. 提交策略

仍采用代码和文档分离的本地检查点：

```text
refactor(...): <单一迁移批>
docs(...): record <同一迁移批>
```

要求：

- 显式路径暂存；
- 不使用宽泛 `git add .`；
- 排除 `.vscode/`；
- 检查 cached name-status/stat/check；
- 用户授权前不 commit；
- 不 push。

## 20. 每阶段停止条件

立即停止并审核：

- 需要改变 API 合同；
- 需要改变 URL；
- 出现 Module 循环依赖；
- 一个文件无法确定唯一 owner；
- 必须同时修改业务逻辑才能编译；
- Storage 键或缓存失效时机不明；
- 旧 facade 可能有外部消费者；
- UBB/AnnualReview 被意外纳入；
- build/typecheck 失败且不能确认是环境问题；
- 工作区出现不属于本批的新变更。

## 21. 第一轮实施范围

用户已授权第一轮，范围只包括：

```text
R0  当前目录直接回到 2a69a0f0                  已完成
R0  丢弃旧 D1/D2、保留获批文档和本地配置       已完成
R0  重新跑基线检查                             已完成
R1  建立三个目标目录和 alias                    已完成
R1  增加架构检查脚本                            已完成
```

第一轮不移动任何业务文件。

第一轮交付：

- 当前工作目录的基线 HEAD；
- 基线检查证据；
- 目标 alias；
- 依赖规则；
- 临时违规 allowlist；
- 新目录空骨架；
- 检查脚本结果；
- 无业务行为变化证明。

骨架和本计划确认后，F1-A、F1-B、F1-C、F1-D、A1、M1、M2、A2.1–A2.11、M3.1–M3.6、S1.1–S1.3 与 S1.4 第一组均已完成代码实施、机械检查和主代理人工代码审核，A、M 阶段完成，S1 已启动。浏览器、登录、真实 API、权限、SignalR、跨标签与 UBB 运行验收未执行，旧 `/list` 仍仅适用既有免检结论。当前停在 S1.4 第一组人工验收前，不启动收藏主题组。

## 22. 已确认决策与后续边界

已经确认：

1. 采用 `2a69a0f0` 作为重新迁移基点；
2. 在当前目录直接回退，不创建 worktree；
3. 丢弃 D1/D2 迁移结果，不保留只读对照；
4. 第一轮只建骨架、alias 和检查脚本，不迁业务文件；
5. M1 使用五个 Module 根入口，并接受已记录的共享 chunk 重组；
6. S1 Redux 终态只保留 Session 与 Notification unread 两个业务 slice，Application Error 退出 Redux；
7. S1 采用严格保真迁移，已知缺陷只登记，不顺手修复；
8. 未经用户要求，不 commit、不 push。

后续仍需单独授权或审核：

1. S1.1–S1.3 与 S1.4 第一组人工验收，以及 S1.4 后五组至 S1.7 状态与缓存归位的代码实施授权和每批人工验收；
2. A2.3–A2.11 与 M3.1–M3.6 尚未执行的浏览器、登录、真实 API、权限、分页、SignalR、通知权限、上传、编辑器、缓存与 UBB 运行验收；
3. 旧 `/list` 免检边界是否继续保留；
4. AnnualReview 与 UBB 是否继续冻结。
