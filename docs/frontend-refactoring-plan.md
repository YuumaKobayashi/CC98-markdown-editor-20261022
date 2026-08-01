# CC98 前端目录重构执行计划

> 状态：R0、R1、F1-A、F1-B、F1-C、F1-D、A1、M1、M2、A2.1–A2.11、M3.1–M3.6、S1.1–S1.3、S1.4 六组、S1.5、S1.6、S1.7 与 C1.1–C1.5 的代码实施、机械检查和主代理人工代码审核均已完成，A、M、S1 与 C1 代码实施完成。C1.5.1 与 C1.5.2 已有既有本地提交；本轮 C1.5 收口按授权将剩余 40 个过渡 partial 分 15 批全部转换，终态为 42 个真实 CSS Module、0 个过渡 partial、29 个主题。完整的浏览器、登录、真实 API、权限、SignalR、跨标签、转账、缓存、草稿、UBB 与 C1 样式运行验收仍未全部执行；本轮未 commit、未 push，不自动启动 Z。
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
S1.4 第二组：收藏主题                       已完成（人工代码审核通过；运行验收未执行）
S1.4 第三组：收藏版面                       已完成（用户审批通过；运行验收未执行）
S1.4 第四组：浏览历史                       已完成（用户审批通过；运行验收未执行）
S1.4 第五组：关注                           已完成（用户审批通过；资料页缓存缺陷另记；完整运行验收未执行）
S1.4 第六组：粉丝                           已完成（用户审批通过；完整运行验收未执行）
S1.5 页面与壳层状态                         已完成（用户审批通过；完整运行验收未执行）
S1.6 缓存与草稿归位                         已完成（用户审批通过；完整运行验收未执行）
S1.7 Redux 闭包                            已完成（用户审批通过；完整运行验收未执行）
C1.1 Foundation 样式                       已完成（主代理逐文件审核通过；浏览器运行验收未执行）
C1.2 业务组件样式                           已完成（主代理逐文件审核通过；浏览器运行验收未执行）
C1.3 页面样式                               已完成（用户审批通过；浏览器运行验收未执行）
C1.4 主题                                   已完成（用户审批通过；浏览器运行验收未执行）
C1.5.1 主题变量桥与 CSS Modules 试点         已完成（用户确认验收通过；已有本地提交）
C1.5.2 Board List 剩余样式作用域转换         已完成（人工代码审核通过；浏览器运行验收未执行）
C1.5 剩余 40 个样式作用域与目录收口          已完成（15 批主代理逐批审核；浏览器运行验收未全部执行）
```

### 当前停点：C1.5 已完成代码实施、机械检查、逐批构建、产物审计与主代理人工代码审核；浏览器运行验收未全部执行，未 commit、不 push、不自动启动 Z

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

状态：六组“主题与回复”“收藏主题”“收藏版面”“浏览历史”“关注”“粉丝”的代码实施、机械检查和主代理人工代码审核已完成，第三至第六组已获用户审批；完整的浏览器、登录与真实 API 运行验收未执行；本节完成时停在 S1.5 实施授权前。

第一组实施结果：

- Topic 与 Post Module 根入口已公开当前用户主题/回复分页请求，保持 `/me/recent-topic`、`/me/recent-post`、`/me/hot-post`、授权头、`size=11` 探测、前 10 条展示、顺序补充 `boardName`、非 200 `statusText` 错误及回复 `Math.floor(count / 10) + 1` 总页数算法；
- UserRecentTopicsActivityList、MyTopics 与 MyPosts 已分别持有数据、分页、完成状态和 loading/error；Overview 与 MyTopics 不共享跨 Route 缓存，MyTopics 保留稀疏页缓存，MyPosts 保留 recent/hot 切换时的同页覆盖与 count 分页行为；
- UserCenterOverview 不再写入 `currentUserCenterPage`，但继续通过 Session 刷新当前用户；ExactActivitiesPosts 已转为无 Redux 的本地状态兼容组件，保留默认导出、零调用状态及原无参 thunk 实际对应的 hot-post 请求；
- legacy recent-topic/recent-post/hot-post thunk 文件、对应 action、ActionType、reducer 数据字段和已闭合分页分支已删除；后五组仍使用的 currentUserCenterPage、共享 loading/error 与通用分页 action 暂时保留；
- `npm run check:architecture` 通过（297 个源码文件、1206 个 import、27 条有条件 allowlist），modern/legacy typecheck、正式 build（3993 modules transformed）和 `git diff --check` 均通过；受限环境首次 build 因 `spawn EPERM` 失败，按原命令在允许子进程的环境重跑成功，构建只有既有 Sass、Lightning CSS 与 chunk-size 警告。

第二组实施结果：

- Favorite Topic Module 根入口已公开 `CurrentUserFavoriteTopicPage` 与 `getCurrentUserFavoriteTopics`，保持 `/topic/me/favorite`、`/topic/me/search-favorite`、`from`、`order`、`groupid`、原始 keyword、授权头、非 200 `statusText` 错误和 `size=11` 探测，并只向页面返回前 10 条；
- UserCenterFavoriteTopicsPage 已本地持有收藏主题数组、分页完成状态、总页数和 loading/error；保留 URL 派生 page/order/group、keyword ref、搜索重定向、分组列表失败回退、请求后导航、分组/排序/搜索与 mutation 后刷新、重复请求、失败后 loading、回顶、DOM/CSS、文案和空态；
- legacy GetFavoritePosts thunk、barrel 导出、收藏主题专用 action、ActionType、reducer 数据字段和 `myfavoriteposts` 分页分支已删除；后四组仍使用的 currentUserCenterPage、共享 loading/error 与通用分页 action 暂时保留；
- `npm run check:architecture` 通过（297 个源码文件、1204 个 import、28 条有条件 allowlist），modern/legacy typecheck、正式 build（3992 modules transformed）和 `git diff --check` 均通过；受限环境首次 build 因 `spawn EPERM` 失败，按原命令在允许子进程的环境重跑成功，构建只有既有 Sass、Lightning CSS 与 chunk-size 警告。

第三组实施结果：

- Board Module 根入口已公开 `getCurrentUserFavoriteBoards`，保持空 `customBoards` 不请求、非空 ID 原顺序拼接 `/board/?id=...&id=...`、授权头、仅接受 HTTP 200、非 200 `statusText` 错误和原始 `UserFavoritesBoardInfo[]` 响应合同；
- UserFavoriteBoards 已从 Session 读取首次挂载时的 `customBoards`，并在页面本地持有版面数组、loading/error；非空列表重新进入 Route 时重新请求，不保留跨 Route Redux 缓存，同时保留失败后 loading、空态、卡片顺序、分隔线、DOM/CSS、文案和 UserFavoriteBoardCard 关注/取关 mutation；
- legacy GetCurrentUserFavoriteBoards thunk、barrel 导出、收藏版面专用 action、ActionType、reducer 数据字段与 `myfavoriteboards` 页签写入已删除；后三组仍使用的 currentUserCenterPage、共享 loading/error 与通用分页 action 暂时保留，S1.5 转账仍复用共享 loading/error；
- `npm run check:architecture` 通过（297 个源码文件、1205 个 import、29 条有条件 allowlist），modern/legacy typecheck、正式 build（3991 modules transformed）和 `git diff --check` 均通过；受限环境首次 build 因 `spawn EPERM` 失败，按原命令在允许子进程的环境重跑成功，构建只有既有 Sass、Lightning CSS 与 chunk-size 警告。

第四组实施结果：

- Topic Module 根入口已公开 `CurrentUserBrowsingHistoryPage` 与 `getCurrentUserBrowsingHistory`，保持 `/me/browsing-record`、`from`、`size=11`、授权头、`data/count` 响应、前 10 条展示、原总页数算法、空响应、403 alert 和非 200 `statusText` 错误；Session Module 根入口已公开 `setBrowsingHistoryEnabled`，保持 `/me/browsing-history?enabled=true|false`、PUT 与仅接受 HTTP 200；
- UserCenterHistoryPage 已本地持有历史数组、总页数和 loading/error，并从 Session 读取及更新 `browsingHistoryEnabled`；每次 URL 页码变化仍重新请求并滚顶，不保留跨 Route 缓存，关闭后立即清空列表，开启后固定重取第 1 页且不改 URL，开关提交仍无 pending 锁和局部错误提示；
- legacy GetMyHistoryPosts thunk、历史专用 action、ActionType、reducer 数据/开关/分页字段与 `myhistory` 页签写入已删除；RefreshCurrentUserInfo 不再向 legacy userInfo 镜像开关，后两组仍使用的 currentUserCenterPage、共享 loading/error 与通用分页 action 暂时保留，S1.5 转账仍复用共享 loading/error；
- `npm run check:architecture` 通过（298 个源码文件、1207 个 import、29 条有条件 allowlist），modern/legacy typecheck、正式 build（3991 modules transformed）、`git diff --check` 和新增文件空白/EOF 检查均通过；受限环境首次 build 因 `spawn EPERM` 失败，按原命令在允许子进程的环境重跑成功，构建只有既有 Sass、Lightning CSS 与 chunk-size 警告。

第五组实施结果：

- Follow Module 根入口已公开 `getCurrentUserFollowings`，保持 `/me/followee?from=(page-1)*10&size=10`、授权头、仅接受 HTTP 200、非 200 `statusText` 错误，以及先取得用户 ID 再按原顺序通过 User Module 批量解析 `UserInfo` 的行为；关注列表沿用每页 10 条与 Session `followCount` 总页数，不引入 11 条探测；
- MyFollowings 已本地持有关注用户稀疏分页缓存、总页数和 loading/error；保持零关注不请求、前后翻页仅补取缺失页、重新进入 Route 后重新请求、深链越界空响应清空列表并将总页数置零、失败后 spinner、滚顶、DOM/CSS、文案与分页链接；关注/取关成功只更新本地匹配用户，不删除卡片或调整 Session 计数；
- UserFollowCard 已改为成功后通过回调通知列表 owner，不再依赖 Application Store 或 legacy User Center action；MyFans 仅增加兼容回调，继续由 legacy Redux 持有粉丝列表，粉丝组未实施；legacy GetUserFollowingsInfo thunk、barrel 导出、关注专用 action、ActionType、reducer 数据字段和 `totalPage.myfollowings` 已删除，粉丝组仍需的共享 loading/error、currentUserCenterPage、粉丝数据及 follow/unfollow action 保留；
- 已登记既有缺陷：User Module 的 LocalStorage/IndexedDB 用户缓存会保存与当前登录者相关且可变的 `isFollowing`，UserFollowCard 与公开资料页关注/取关成功后均未失效该缓存，因而跨 Route 访问或刷新 `/user/id/:id` 时可能在最长 3600 秒内显示旧关注状态；该问题在第五组前已存在，本批不顺手修复，后续单独处理缓存失效与资料页强制刷新；
- `npm run check:architecture` 通过（298 个源码文件、1206 个 import、28 条有条件 allowlist），modern/legacy typecheck、正式 build（3990 modules transformed）、`git diff --check`、BOM/换行/EOF、尾随空白与替换字符检查均通过；受限环境首次 build 因 `spawn EPERM` 失败，按原命令在允许子进程的环境重跑成功，构建只有既有 Sass、Lightning CSS 与 chunk-size 警告；用户已在知悉上述缺陷的前提下批准第五组。

第六组实施结果：

- Follow Module 根入口已公开 `getCurrentUserFans`，保持 `/me/follower?from=(page-1)*10&size=10`、授权头、仅接受 HTTP 200、非 200 `statusText` 错误，以及先取得用户 ID 再按原顺序通过 User Module 批量解析 `UserInfo` 的行为；粉丝列表沿用每页 10 条与 Session `fanCount` 总页数，不引入 11 条探测；
- MyFans 已本地持有粉丝用户稀疏分页缓存、总页数和 loading/error；保持零粉丝不请求、前后翻页仅补取缺失页、重新进入 Route 后重新请求、深链越界空响应清空列表并将总页数置零、失败后 spinner、滚顶、DOM/CSS、文案与分页链接；关注/取关成功只更新本地匹配用户，不删除卡片或调整 Session 计数；
- legacy GetUserFansInfo thunk、barrel 导出、粉丝专用 action、ActionType、reducer 数据与分页字段、follow/unfollow action 及 `currentUserCenterPage` 已删除；设置页不再写入已无消费者的旧 tab 状态，S1.5 转账和公开用户资料页仍使用的共享 loading/error、访问状态与转账状态均保留；第五组登记的 `isFollowing` 缓存失效缺陷继续保留，本组不修复缓存、不增加请求取消；
- `npm run check:architecture` 通过（298 个源码文件、1204 个 import、28 条有条件 allowlist），modern/legacy typecheck、正式 build（3987 modules transformed）、`git diff --check`、BOM/换行/EOF、尾随空白与替换字符检查均通过；受限环境首次 build 因 `spawn EPERM` 失败，按原命令在允许子进程的环境重跑成功，构建只有既有 Sass、Lightning CSS 与 chunk-size 警告；主代理已完成整批代码审核，浏览器、登录、真实 API、深链、分页与关注/取关运行验收未执行；用户已在知悉上述边界的前提下批准第六组。

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

状态：代码实施、机械检查和主代理人工代码审核已完成，用户已批准当前检查点并完成本地提交；浏览器、真实 API、管理员权限、转账部分成功和错误页完整运行验收未执行。

实施结果：

- UserProfileLayout 已统一解析 `method/id` 与 exact/manage 模式、请求公共 `UserInfo`、忽略旧响应并保留用户名到 ID 的规范重定向；Layout 通过公开 Route Context 向导航、详情与管理页提供已解析用户，非法参数、未知用户与加载 spinner 均退出 Redux；
- Wealth Module 根入口已公开 `transferWealth`，保持 `/me/transfer-wealth`、PUT、授权头、JSON body、非成功 `statusText` 错误和成功用户名数组；TransferWealthPage 本地持有 loading/error/errorMessage/成功名单，保留输入校验、去重、部分成功文案和按钮状态，成功后只通过 Session `updateCurrentUser` 更新最新当前用户财富；
- Application 已建立 Error Provider、`ApplicationErrorKey` 与 report/clear 命令接口；AppShell 保持 Header/Footer 并以原 Status 映射替换 Outlet，NavigationErrorReset 继续按 pathname 清错，Editor 与 legacy Utility 统一命令式上报；
- legacy `error` reducer/action/ActionType 已删除；公开资料页与转账专用 userInfo 字段、action、ActionType、SendWealth thunk 和出口已删除。`refreshCurrentUserInfo`、其失败 action 与最小 userInfo 错误兼容状态明确留给 S1.7；
- `npm run check:architecture` 通过（300 个源码文件、1199 个 import、28 条有条件 allowlist），modern/legacy typecheck、正式 build（3986 modules transformed）均通过；受限环境首次 build 因 `spawn EPERM` 失败，按原命令在允许子进程的环境重跑成功，构建只有既有 Sass、Lightning CSS 与 chunk-size 警告。

后续调整记录：

- 用户于 2026-07-31 人工审核通过当前 `useUserProfileContext` 与 UserProfileLayout 集中取数方案；该方案是 S1.5 的已批准检查点，不视为永久冻结。后续可在资料缓存归位或 Redux 闭包阶段重新评估 Context 接口形状、加载状态暴露和取数边界，但必须单独授权、重新核对路由与请求行为，不能以此记录自动修改现有逻辑。

实施要求：

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

状态：代码实施、机械检查和主代理逐文件人工代码审核已完成，用户已批准当前检查点并完成本地提交；浏览器、IndexedDB/localStorage 回退、缓存过期与失效、跨零点签到、草稿恢复、失败缓存、图片上传三态和 Storage 容量清理运行验收未执行。

实施基线：

```text
dev20260716  23fc818f  docs(s1.5): record page and shell state localization
```

实施结果：

- User cache 新增统一策略接口，单个/批量公共资料查询和 Application listener 根据平台使用 IndexedDB 或 localStorage 回退；旧 IndexedDB facade 继续保留，`getBasicUsersInfo` 的 localStorage-only 兼容行为不变；
- 用户资料和头像修改成功后先失效 ID/用户名缓存，再沿用既有异步刷新写回最新 `/me`；TopicReplier 的既有显式失效点复用同一接口，未扩大到关注列表和公开资料 Context；
- Board、Topic、Daily Signin 分别接管 `boardsInfo`/`boardInfo`、`tagInfo`、`signin_${userId}`；旧 TopicManagement 和 BoardTopicListItem 的无保护原始解析行为继续通过 Module 兼容接口保留；
- Posting 接管 Editor 内容、按 topic 回复草稿、失败回复内容和 Markdown 图片上传恢复状态；Upload 只保留通用文件上传，Application 页面不再直接拼接这些 Storage 键；
- `contentCache`、`temporaryContent`、`temporaryContent-${topicId}`、`post-cache-${topicId}`、`react-mde-imageurl` 与 `react-mde-imageurl-status` 的编码和读写/删除时机保持；Markdown 成功清理旧无 topic 键、草稿类型赋值分支与 `autoClearLocalStorage` 白名单均未修复或修改；
- `npm run check:architecture` 通过（306 个源码文件、1209 个 import、28 条有条件 allowlist），modern/legacy typecheck、正式 build 和 `git diff --check` 均通过；构建仍只有既有 Sass、Lightning CSS 与 chunk-size 警告。
- 用户于 2026-07-31 人工审核通过当前检查点；代码检查点为 `62bb6fcd refactor(s1.6): localize caches and drafts`，完整运行验收仍按上述边界保留。

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

状态：代码实施、机械检查和主代理人工代码审核已完成，用户已批准当前检查点并完成本地提交；浏览器、登录、真实 API、权限、SignalR、跨标签、通知标题、缓存与草稿完整运行验收未执行。

实施结果：

- Application Store 只注册 Session 与 Notification reducer，`RootState` 和 `AppDispatch` 由实际 Store 推导；legacy `userInfo` reducer、Actions 聚合、action/thunk 联合类型、登录重置 listener 与临时 middleware 检查开关均已删除；
- `refreshCurrentUserInfo` 已归入 Session 公共入口，Header 与四个 User Center 页面改用 Module API；成功时仍刷新 Session，失败时保留页面可观察的静默结束行为，不再写入无人读取的 Redux 错误状态；
- Utility 兼容适配器改由唯一 Store 装配点注入 `dispatch/getState`，错误上报、登录失效跳转、当前用户更新、未读计数读取与清零合同不变；NotificationController 使用显式结构化 state/dispatch 类型，不反向依赖 Application；
- 根 `Actions/`、`AsyncActions/`、`Reducers/`、`ActionTypes.tsx` 与 `application/store/legacy-types.ts` 已在静态引用、动态入口和 TypeScript 配置归零后删除；根 `Store.tsx` 继续作为零活动消费者的兼容转导，其他 legacy 类型与 UBB 依赖不在本批清理；
- `npm run check:architecture` 通过（305 个源码文件、1193 个 import、28 条有条件 allowlist），modern/legacy typecheck 与正式 build（3986 modules transformed）均通过；受限环境首次 build 因 `spawn EPERM` 失败，按原命令在允许子进程的环境重跑成功，构建只有既有 Sass、Lightning CSS 与 chunk-size 警告。

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
- S1.1–S1.3、S1.4 六组、S1.5、S1.6 与 S1.7 已按单独授权完成代码与机械检查，S1.4 第三至第六组、S1.5、S1.6 与 S1.7 已获用户审批并完成本地提交；未经实施授权不启动 C1。

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

#### C1.1 实施记录（2026-07-31）

实施基线：

```text
dev20260716  521713fa  docs(plan): add Z legacy source closure
```

实施范围：

- 保留 `src/foundation/styles/Site.scss` 作为 29 个主题的共同入口，主题 SCSS、manifest、主题 key/id/顺序、静态 URL 和 Sass `@import` 机制均未修改；
- 将原有 15 个非主题变量完整抽入 `foundation/styles/variables`，将 `blockquote`、`body` 与 `#root` 抽入 `foundation/styles/base`；
- 将原 Reset 恢复块和后部全局 `margin/padding: 0` 块分别抽入 `foundation/styles/reset`，并在原位置导入以保持级联顺序；
- 将 Spectrum 完整迁入 `foundation/styles/vendors`，原许可证、注释、BOM/行尾/EOF 状态和内容保持；Ant Design CSS 导入仅由同位置 vendor partial 封装；
- 全仓 SCSS 未发现 `@mixin`、`@function` 或 placeholder，不创建空 mixins 占位文件；
- 其余业务、Route、UBB 与 Application Shell 选择器仍保留在 `Site.scss`；根 `Styles/`、组件源码、className、DOM、主题变量和 `.vscode/` 均未修改。

保真与机械证据：

- 将所有新 partial 按导入位置重新展开并恢复两条 vendor 导入后，与 `HEAD` 的 `Site.scss` 文本完全一致；Spectrum 新旧 owner 内容完全一致；
- 实施前后 29 个主题 CSS 的生成文件名、长度和 SHA-256 逐项完全一致，主题编译输出零漂移；
- `Site.scss` 继续保持 UTF-8 BOM、原有 6 个 bare LF、其余 CRLF 和 EOF 换行；新抽取 partial 使用无 BOM 的 CRLF 与 EOF 换行；
- `npm run check:architecture`：通过，305 个源码文件、1193 个 import、28 个既有 allowlist 违规；
- `npm run typecheck`：modern 与 legacy 均通过；
- `npm run build`：通过，3986 modules transformed；基线构建在沙箱内因既知 `spawn EPERM` 失败，在允许子进程的环境原样重跑成功；
- `git diff --check`：通过；构建仍只有既有 Sass `@import`、Spectrum/Lightning CSS 和 chunk-size 警告。

人工检查与停点：

- 主代理已逐文件核对 `Site.scss`、variables/base/reset/vendors partial 和 Spectrum 搬移，未发现规则、注释、导入顺序或 owner 越界；
- 默认/暗色主题、Header、Board、Topic、用户中心、编辑器、UBB、Spectrum 和 Ant Design 控件的浏览器运行验收未执行；
- C1.1 代码与文档已分别提交为 `1bf366a6`、`123437fc`，未 push；浏览器运行验收仍未执行。

### C1.2 业务组件样式

跟随 Module：

```text
modules/topic/ui/*.module.scss
modules/user/ui/*.module.scss
```

#### C1.2 实施记录（2026-07-31）

实施基线：

```text
dev20260716  123437fc  docs(c1.1): record foundation style split
```

实施范围：

- 将 Topic 组件直接拥有的奖项行、Focus/Search/Recommended 共用主题条目和 Topic Card 规则分别迁入 `TopicAwardInfo.module.scss`、`FocusTopicItem.module.scss` 与 `TopicCard.module.scss`；旧 Focus Topic 备选规则的整段注释一并归入 owner；
- 将 User 组件直接拥有的头像/徽章、资料详情与签名配置规则分别迁入 `UserProfileAvatar.module.scss`、`UserProfile.module.scss` 与 `ConfigSignature.module.scss`；
- 六个 partial 仍由主题共同入口在原级联位置导入。User partial 继续在 `UserCenter.scss` 的原嵌套位置展开，从而保留 `.user-center-body .user-center-router` 等既有父选择器与 specificity；Topic partial 继续在每个主题变量已经声明的 `Site.scss` 内展开；
- `tagSize` 仍被 Topic Header 与 legacy board-list 共用；`focus-topic-area`、`card-topic-area` 和 `user-posts` 由 Application Route 容器直接使用。它们分别留待共享边界或 C1.3，不向 Module 错误归属；
- 组件 TSX、className、DOM、主题变量、29 个主题入口、生成文件名、URL、交互逻辑、根 `Styles/` 的其余规则与 `.vscode/` 均未修改。

保真与机械证据：

- 六个 partial 的全部活动规则、顺序、数值和注释均从原 owner 原样搬移；将三个 User import 在原缩进处展开后，`UserCenter.scss` 与 `HEAD` 文本完全一致；Topic 活动规则在原位置展开后完全一致，旧 Focus Topic 注释仅移动到对应活动规则之后；
- C1.1 构建基线与 C1.2 最终构建的 `dist/static/content` 共 35 个文件逐项同名且 SHA-256 完全一致，其中包括全部 29 个主题 CSS 与 vendor CSS，生成样式零漂移；
- `Site.scss` 保持 UTF-8 BOM、6 个既有 bare LF、其余 CRLF 和 EOF 换行；`UserCenter.scss` 保持 UTF-8 BOM、CRLF 和无 EOF 换行；六个新 partial 使用无 BOM 的 CRLF 与 EOF 换行；
- `npm run check:architecture`：通过，305 个源码文件、1193 个 import、28 个既有 allowlist 违规；
- `npm run typecheck`：modern 与 legacy 均通过；
- `npm run build`：通过，3986 modules transformed；沙箱内仍因既知 `spawn EPERM` 失败，在允许子进程的环境原样重跑成功；
- `git diff --check`：通过；构建仍只有既有 Sass `@import`、Spectrum/Lightning CSS 和 chunk-size 警告。

人工检查与停点：

- 主代理已逐文件核对六个 partial、两个共同入口、组件 className 使用方和 Route/Module owner 边界，未发现活动规则、注释、级联顺序或 owner 越界；
- 默认/暗色主题下的 Focus、Search、Recommended、Topic Card、主题奖项、用户中心/公开资料页头像与资料、签名配置浏览器运行验收未执行；
- C1.2 代码已在用户人工审核通过后提交为 `576721f7`，本实施记录随紧随其后的本地文档 checkpoint 落盘；未 push，不自动启动 C1.3。

### C1.3 页面样式

跟随 Route：

```text
application/routes/home/*.module.scss
application/routes/editor/*.module.scss
application/routes/topic/*.module.scss
application/routes/board/*.module.scss
application/routes/board-list/*.module.scss
application/routes/legacy-board-list/*.module.scss
application/routes/message-center/*.module.scss
application/routes/focus/*.module.scss
application/routes/new-topics/*.module.scss
application/routes/search/*.module.scss
application/routes/login/*.module.scss
application/routes/daily-signin/*.module.scss
application/routes/user-center/*.module.scss
application/routes/user-profile/*.module.scss
```

#### C1.3 实施记录（2026-07-31）

实施基线：

```text
dev20260716  f55447fb  docs(c1.2): record module style relocation
```

实施范围：

- 将 `Site.scss`、`MainPage.scss` 与 `UserCenter.scss` 中具有明确 Route owner 的连续页面规则迁入 14 个 Route 目录下的 34 个 `.module.scss` partial；文件后缀只表达 owner，仍由主题入口通过 Sass `@import` 编译为原全局选择器；
- Home 与 Site Management 共用的公告预览归 Home；Recommended Topics、Search 与 Topic Hot 复用的 Focus 页面骨架保持由 Focus owner 提供；User Center 与 User Profile 共用的页面壳保留在 User Center，公开资料管理规则单独归 User Profile；
- 每个 partial 都在原级联位置替换为导入；`TopicAwardInfo`、`UserProfileAvatar`、`UserProfile`、`ConfigSignature` 等 C1.2 partial 仅修正相对路径，未改变嵌套位置、specificity 或编译次数；
- 根 `Styles/UserCenter.scss` 已完全归位并删除；`Styles/MainPage.scss` 继续保留 Application Shell、PWA 与 UBB 共用规则。`Site.scss` 继续保留 Foundation 通用规则、跨 Route 工具类、Shell/Footer、UBB/React MDE/React Bootstrap 兼容样式和未进入 Application Router 的 Annual Review 规则；复核后已将被误放入 New Topics partial 的跨 Route `.displaynone` 放回 `Site.scss` 原级联位置；
- Route owner 复核后，`#listRoot` 已从 Topic 归入 Legacy Board Root，`boardMessage`/`boardFollow`/`boardDescription`/`boardMasters`/`bigPaper` 等 Legacy Board Header 规则已从 Topic Management 归入 Legacy Board，`chooseTag`/`tagNumber` 已从 Legacy Board 归入当前 Board，`followTopic` 已从 Legacy Board 归入 Topic Header；新增 partial 仍由 `Site.scss` 在原规则位置交错导入，未改变展开后的选择器顺序；
- 后续复核发现 `.board-head-information`、`.tagSize`、`.timeProp` 与 `#changeColor` 存在跨 Route 消费，`.listContentBottom`、`.boardRecordBtn`、`#disliked` 与 `.tagColumn` 存在错归属；这些规则已临时提升到 `foundation/styles/route-compatibility` 全局兼容区，由原 Route partial 在原级联位置导入，等待 DOM/className 语义改名后再归回真实 owner；
- TSX、DOM、`className`、Router、组件接口、主题变量、静态 URL、29 个主题入口与 `.vscode/` 均未修改。

保真与机械证据：

- 将 34 个 Route partial 及 7 个全局兼容 partial 按导入点反向展开并还原必要的相对路径后，`Site.scss`、`MainPage.scss`、`UserCenter.scss` 与实施基线文本分别完全一致；
- 基线与最终构建的 `dist/static/content` 共 35 个文件逐项同名、等长且 SHA-256 完全一致，29 个主题与 vendor CSS 生成输出零漂移；
- owner 纠正前后再次比较 `dist/static/content` 全部 76 个文件的相对路径、长度和 SHA-256 清单，聚合 SHA-256 均为 `123DC97DE7395A3D825CDB5F811CF8683EBA2A6495832EE35DA2D1B9C68CB1F8`，正式产物零漂移；
- 第一项复核纠正前后重新比较 `dist/static/content` 共 35 个文件的相对路径、长度和 SHA-256，逐项完全一致；全局兼容提升未改变任何生成 CSS；
- `Site.scss` 与 `MainPage.scss` 保留原 UTF-8 BOM、行尾和 EOF 合同；`UserCenter.module.scss` 保留原 UTF-8 BOM、1 个既有 bare LF、其余 CRLF 和无 EOF 换行；`TopicManagement.module.scss` 保留从原位置带入的 2 个 bare LF，其余新 partial 使用无 BOM 的 CRLF 与 EOF 换行；
- `npm run check:architecture`：通过，305 个源码文件、1193 个 import、28 个既有 allowlist 违规；
- `npm run typecheck`：modern 与 legacy 均通过；
- `npm run build`：通过，3986 modules transformed；沙箱内仍因既知 `spawn EPERM` 失败，在允许子进程的环境原样重跑成功；
- 提交前重新运行 `npm run check:architecture` 与 modern/legacy typecheck 均通过；正式 build 首次在沙箱内因既知 `spawn EPERM` 失败，在允许子进程的环境原命令重跑成功，3986 modules transformed；
- tracked `git diff --check` 通过；暂存全部新增 partial 后，`git diff --cached --check` 仅报告从原规则块保留的末尾空行和 `MessageCenter` 三处历史注释尾随空格，按反向展开文本保真要求保留并登记，不涉及活动 CSS；构建仍只有既有 Sass `@import`、Spectrum/Lightning CSS 和 chunk-size 警告。

人工检查与停点：

- 主代理已完成整批样式、导入闭包、Route/Module owner 与全局兼容边界复核；跨 Route/错归属选择器已提升到全局兼容区，级联位置和编译次数保持不变，休眠样式、语义命名和真实 CSS Modules 作用域转换明确延期，不阻塞本轮纯归位提交；
- 后续语义改名清单：`.board-head-information` 拆为 Board 与 User Profile/User Center 名称；`.tagSize`、`.timeProp` 拆为 Topic Header/Topic Award 与 Legacy Board 元数据名称；`#changeColor` 拆为当前 Board moderation row 与 Legacy Board topic row class；`.listContentBottom`、`.boardRecordBtn`、`#disliked`、`.tagColumn` 改为 Legacy Board 专属语义名称。`.topicManageBTN`、`.findIP` 与 `.IPContent` 仍留待废弃样式审计；
- 默认/暗色主题下的 Home、Topic、Board、Message、Focus/New Topics、Search、Editor、User Center/User Profile、Login 与 Signin 浏览器运行验收未执行；
- 用户于 2026-08-01 在知悉后续语义改名、真实 CSS Modules/CSS 自定义属性改造和浏览器运行验收边界后批准本批；C1.3 代码已本地提交为 `22f7ed79`，未 push，不自动启动 C1.4。

### C1.4 主题

```text
foundation/theme/registry
foundation/theme/runtime
foundation/theme/tokens
foundation/theme/themes
```

29 个现有主题入口和生成文件名合同必须保持。

#### C1.4 实施记录（2026-08-01）

实施基线：

```text
dev20260716  762d5eda  docs(c1.3): record route style relocation
```

实施范围：

- 将原 `registry.ts` 与 `runtime.ts` 分别归入 `foundation/theme/registry/index.ts` 和 `foundation/theme/runtime/index.ts`，新增 `foundation/theme/index.ts` 作为公开入口；原导出名称、参数、返回值、主题计算、Storage key、jQuery 样式表切换和定时检查逻辑均未修改；
- Application Bootstrap、Session、Login、User Center Theme 与根 `Utility.ts` 兼容 facade 统一经主题根入口消费；runtime 内部继续直接依赖 registry，未建立反向依赖或循环；
- 将 29 个主题入口各自原有的 8 个 Sass 变量完整抽入同名 `tokens/_<theme>.scss` partial，包括 `chongyang_light` 的历史备选值注释；每个 `themes/<theme>.scss` 仍按原求值顺序导入对应 token 和共同 `Site.scss`；
- `build/theme-manifest.cjs`、`build/template-contract.cjs`、Vite 输入、Template 初始主题加载、主题 key/id/顺序、默认占位项、静态 URL、日夜配对及全部主题值均未修改；C1.5 的 CSS 自定义属性、真实 CSS Modules、视觉调整和兼容选择器清理未提前实施。

保真与机械证据：

- 将每个 token 的完整文本与原位置的 `Site.scss` 导入重新组合后，29 个结果均与实施基线中的对应主题入口文本完全一致；29 个 token 均按相同顺序保留 `theme_color_main`、`theme_color_sub`、`theme_color_topbar`、两个背景图片、页面背景、文本框背景和文字颜色共 8 个变量；
- token partial 保留原变量块的 CRLF；`autumn_2022_dark`、`autumn_2022_light` 与 `autumn_orange` 原有 UTF-8 BOM 继续保留，另外 26 个 token 保持无 BOM；所有新主题 entry 与 TypeScript 公开入口使用无 BOM 的 CRLF 与 EOF 换行；
- registry 顺序严格为 0–29，共 30 个显示项；manifest 保持 29 个连续的 1–29 构建项，9 组日夜名称均能解析到 registry，29 组 manifest entry、theme entry 与 token 一一对应；
- 实施前后 `dist/static/content` 共 76 个文件的相对路径、长度和 SHA-256 逐项完全一致，29 个主题 CSS、vendor CSS、固定第三方资源及生成文件名零漂移；
- `npm run check:architecture`：通过，306 个源码文件、1194 个 import、28 个既有 allowlist 违规；
- modern 与 legacy typecheck 均通过；
- `npm run build`：通过，3987 modules transformed；沙箱内基线构建因既知 `spawn EPERM` 失败，在允许子进程的环境原样重跑成功；构建仍只有既有 Sass `@import`、Spectrum/Lightning CSS 和 chunk-size 警告；
- tracked `git diff --check` 通过。

人工检查与停点：

- 主代理已逐文件核对 29 组 token/entry、registry、runtime、根公开入口、manifest、模板初始加载和全部调用点，未发现主题值、注释、顺序、URL、运行逻辑或兼容导出漂移；
- 默认/暗色主题切换、系统默认回退、定时/浏览器日夜切换、登录与跨标签同步、用户中心主题设置及各页面视觉效果的浏览器运行验收未执行；
- 用户于 2026-08-01 批准本批；C1.4 代码与本文档已合并为一个本地提交，不自动启动 C1.5，不 push。

### C1.5 样式作用域与目录收口

C1.1–C1.4 先完成样式 owner 归位和主题合同整理；C1.5 再统一目录与作用域语义。当前“按 owner 分散存放、由主题入口统一编译”的结构可作为保真迁移的过渡态，但不是最终样式架构：Route 与 Module 下的 `*.module.scss` 仍由 `Site.scss` 通过 Sass `@import` 汇总为全局选择器，文件后缀只表达 owner，并不具备 CSS Modules 隔离；同一页面的样式仍可能分布在 owner partial、`Site.scss`、根 `Styles/`、兼容区与 TSX 内联 `style` 中。

#### C1.5 终态目录

```text
src/foundation/styles/
  reset/                  全局 reset 与 restore
  base/                   document、body、root 与全局基础规则
  vendors/                Ant Design、Spectrum 等第三方兼容
  variables/ 或 tokens/   全局 Sass 变量与主题 token
  compatibility/          经清单确认必须跨 owner 的临时兼容规则

src/application/routes/<route>/
  <Route>.tsx
  <Route>.module.scss      仅由该 Route 拥有的页面样式

src/modules/<module>/ui/<component>/
  <Component>.tsx
  <Component>.module.scss  仅由该业务组件拥有的样式
```

根 `Styles/` 不作为终态 owner；其 Application Shell、PWA、UBB、Vote 与其他遗留规则必须分别归入 `application`、对应业务 Module、UBB owner 或明确的 Foundation 全局边界。该目录的最终删除仍与 Z 阶段的根目录 legacy 源码闭包协调，不在 C1.5 未完成 owner/consumer 审计前机械删除。

#### C1.5 归属与作用域规则

- 仅由一个组件消费的规则与组件共置；仅由一个 Route 消费的页面骨架与 Route 共置；跨多个 Route 复用的业务样式归对应 Module，不因“共用”直接进入 Foundation；
- 只有 reset、主题 token、文档根规则、第三方覆盖和经 consumer map 证明必须全局的兼容规则可以进入 `foundation/styles`；`Site.scss` 终态只承担这些全局入口和主题聚合，不继续吸收业务选择器；
- `*.module.scss` 必须具有真实 CSS Modules 语义，由 TSX 显式导入并通过 `styles.<name>` 消费；尚未完成转换、仍依赖全局 className 或 Sass 聚合的文件使用普通 `.scss`/partial 命名，不以 `.module.scss` 冒充作用域隔离；
- 随主题切换的颜色、背景、边框、阴影和图片 token 由每个主题入口从既有 Sass 变量输出为全局 `--cc98-*` CSS 自定义属性，真实 CSS Modules 通过 `var(--cc98-*)` 消费；断点、固定间距、z-index 与 mixin 等非主题编译期 token 可通过 Sass `@use` 显式引入。CSS Modules 只隔离类名，不复制 29 份组件样式，也不依赖主题入口的隐式 Sass 变量作用域；
- TSX 内联 `style` 只保留运行时计算值、用户内容样式或无法静态表达的尺寸/位置/背景；固定颜色、间距、布局与排版规则迁回真实 owner 的样式文件；UBB 用户可控样式和 Annual Review 冻结边界须单独审计，不机械改写；
- `foundation/styles/compatibility` 中每项必须记录 owner、consumer、存在原因和删除条件；完成 DOM/className 语义拆分后归回真实 owner，禁止成为新的长期杂物区；
- 不新增第二套 CSS-in-JS、Tailwind 或其他样式体系；如确需引入，必须另立方案并证明对主题、SSR/首屏、构建产物和 CSP 的影响。

#### C1.5 实施顺序

1. 建立活动样式清单、owner map 与 consumer map，覆盖 Sass import、TS/TSX import、动态 className、UBB 输出、模板静态 CSS、第三方覆盖、图片/字体 URL 和内联 style；
2. 收口根 `Styles/` 与 `Site.scss` 中仍有明确 owner 的规则，但保持 29 个主题入口、变量求值位置、导入次数、级联顺序和生成文件名不变；
3. 先为新组件和低耦合叶子组件采用真实 CSS Modules，再按 Route/Module 小批转换旧的全局 className；不得一次性转换整个站点；
4. 每批清理已失去 consumer 的兼容规则、重复选择器和可静态化的内联 style，并同步收紧架构检查，禁止新增根 `Styles/` 文件、伪 CSS Modules 和无登记的 Foundation 业务规则；
5. 完成全仓零引用、目录闭包和浏览器视觉验收后，再删除空目录与过渡入口；不得仅凭 typecheck 或 build 判定样式迁移完成。

#### C1.5 保真、验收与停点

- 每个小批必须保持公开 URL、DOM 语义、交互、权限、Storage、UBB 输出和主题 key/id/顺序不变；确需修改 className 时，必须在同批完成生产者、全部消费者、测试/脚本和兼容选择器闭包；
- 运行 `npm run check:architecture`、modern/legacy typecheck、正式 build 与 `git diff --check`，并比较全部主题及 vendor CSS 的文件清单、长度和 SHA-256；纯归位批要求生成 CSS 零漂移，作用域转换批必须逐项说明预期差异；
- 至少人工验收默认/暗色主题下的 Shell、Home、Board、Topic、Message、Search、Editor、User Center/User Profile、Login、Signin、Ant Design、Spectrum、UBB 与 Annual Review；响应式断点、hover/focus/disabled、弹层 z-index 和打印/降级页面按实际 consumer 覆盖；
- C1.5 不与组件迁址、业务逻辑重写或主题视觉重设计混做；每个小批经主代理逐文件审核后停止，等待用户人工验收和单独提交授权，不自动进入下一批或 Z。

#### C1.5.1 实施记录（2026-08-01）

实施基线：

```text
dev20260716  ef728864  refactor(c1.4): organize theme contracts
```

实施范围：

- 新增主题自定义属性共享 partial，29 个主题入口均在各自 token 后、`Site.scss` 前输出 `:root`；八个属性逐项映射原 `$theme_color_main`、`$theme_color_sub`、`$theme_color_topbar`、两个背景图片、页面背景、文本框背景和文字颜色，使用 Sass 插值保留原值；
- `Template.ejs`、`themeNames`、`#mainStylesheet`、runtime 切换、日夜定时检查、登录/登出、跨标签同步、Storage key、主题 key/id/顺序及默认回退均未修改；运行时替换主题 stylesheet 后，已挂载及后续懒加载样式均从 `:root` 继承当前值；
- `BoardListHeader.module.scss` 已由 `Site.scss` Sass 聚合移除，改由 `BoardListSection.tsx` 直接导入并通过 `styles.boardListHead` 消费；原 `.row` 全局工具类继续组合使用，布局、点击展开逻辑及空 hover 规则保持；主题主色改为 `var(--cc98-theme-color-main)`；
- 新增 `*.module.scss` 类型声明并纳入 modern/legacy TypeScript；新增样式迁移守卫和清单，当前登记 41 个仍由 Sass 聚合的过渡 partial、1 个真实 CSS Module 和 3 个既有根 `Styles/` 文件，禁止新增未登记伪模块、真实模块重新进入 Sass 聚合或新增根样式文件；
- 其余 41 个过渡 partial、根 `Styles/`、兼容选择器、内联 style、UBB、Annual Review、业务逻辑与 DOM 未进入本批。

机械与产物证据：

- `npm run check:architecture` 通过：307 个源码文件、1195 个 import、28 条既有 allowlist；样式守卫通过：1 个真实 CSS Module、41 个过渡 partial、29 个主题；
- modern 与 legacy typecheck 均通过；正式 build 通过，3988 modules transformed；受限环境首次基线 build 因既知 `spawn EPERM` 失败，在允许子进程的环境按原命令重跑成功；构建仍只有 Sass `@import`、Spectrum/Lightning CSS 和 chunk-size 警告；
- 构建仍生成 29 个主题 CSS 与 30 项 `themeNames`，顺序与 manifest 一致；每份主题 CSS 均恰好包含八个自定义属性，`css_blue` 的编译值与原冬季 token 逐项一致；
- `BoardListHeader` 生成独立的 147-byte `board-list-*.css`，类名已局部化并引用 `var(--cc98-theme-color-main)`；29 个主题 CSS 均不再包含旧 `boardListHead` 选择器；
- 基线与最终 `dist/static/content` 顶层产物分别为 35 与 36 个文件，唯一新增项为预期的 Board List CSS；29 个主题因新增变量和移出试点规则产生预期 hash 变化，其余 6 个 vendor/player 顶层产物的文件名、长度和 SHA-256 均未变化；`git diff --check` 通过。

人工检查与停点：

- 主代理已核对共享变量映射、29 个入口导入顺序、主题 manifest/registry/runtime/模板未改边界、BoardList 单一 consumer、CSS Module 类型覆盖和样式守卫闭包，未发现未说明的主题、路由、业务或 Storage 漂移；
- 用户于 2026-08-01 确认 C1.5.1 已完成验收，无需重复执行；本地提交为 `2d1bbfc5 refactor(c1.5.1): establish theme variable bridge`，未 push；
- C1.5.1 作为 C1.5.2 的实施基线，不自动授权其余过渡 partial。

#### C1.5.2 实施记录（2026-08-01）

实施基线：

```text
dev20260716  2d1bbfc5  refactor(c1.5.1): establish theme variable bridge
```

实施范围：

- `BoardList.module.scss` 已从 `Site.scss` Sass 聚合移除，由 BoardListPage、BoardListSection 与 ChildBoardList 直接导入；Board List 独占类均通过 CSS Module 映射消费，既有全局 `row`、`column` 与 `hiddenContent` 继续保留；
- `$background_color_textarea` 与 `$theme_color_main` 分别改为既有 `--cc98-background-color-textarea` 与 `--cc98-theme-color-main`；其余选择器、注释、空 `.listTitle`、无调用 `.hideBoard`、DOM、动态区域 ID、内联 style、展开/收起、右侧导航、图片回退、公开 URL、API 与主题运行合同均未修改；
- 样式过渡清单删除 Board List 条目，收紧为 40 个仍由 Sass 聚合的过渡 partial、2 个真实 CSS Module 和 3 个既有根 `Styles/` 文件；其余 Route、Module、根样式、兼容选择器、内联 style、UBB 与 Annual Review 未进入本批。

机械与产物证据：

- `npm run check:architecture` 通过：307 个源码文件、1198 个 import、28 条既有 allowlist；样式守卫通过：2 个真实 CSS Module、40 个过渡 partial、29 个主题；modern 与 legacy typecheck、`git diff --check` 均通过；
- 正式 build 通过，3989 modules transformed；基线构建首次在受限环境因既知 `spawn EPERM` 失败，随后在允许子进程的环境按原命令重跑成功；最终构建仍只有既有 Sass `@import`、Spectrum/Lightning CSS 与 chunk-size 警告；
- 基线与最终 `dist/static/content` 顶层产物均为 36 项；Board List 懒加载 CSS 由 147 bytes 增至 1977 bytes，包含局部化后的剩余规则及两个既有主题变量；29 个主题 CSS 仍各含恰好八个自定义属性，并合计移出 47067 bytes 的旧全局 Board List 规则；
- 其余 6 个 vendor/player 顶层产物逐项同名、等长且 SHA-256 完全一致；29 个主题 CSS 未再包含旧 Board List 选择器，源码也未保留旧 Board List `className` consumer。

人工检查与停点：

- 主代理已逐文件核对三个 TSX consumer、两个 Board List CSS Module、主题变量、Sass 聚合入口、样式守卫与生成产物，未发现未说明的 DOM、业务、路由、主题或兼容边界漂移；
- 本地 Vite 根入口 `http://127.0.0.1:25174/` 可返回 200；当前运行环境的浏览器控制运行时未提供可用浏览器实例，无法执行默认/暗色主题、普通/无图片分区、图片回退、展开/收起、导航滚动及前进/后退视觉交互验收，因此不记为通过；直接请求 Vite 开发服务器的 `/boardlist` 返回 404，浏览器应由根入口进入后通过客户端 Router 导航；
- 本批未 commit、未 push、未修改 `.vscode/`，当前停止并等待用户人工验收与提交授权，不自动转换其余 40 个过渡 partial。

#### C1.5 剩余 40 个真实 CSS Modules 收口记录（2026-08-01）

实施基线：

```text
dev20260716  0dc33a29  C1.5.2 完成后的工作树基线
```

实施范围与批次：

- 按 Current Board、Daily Signin、Editor、Focus、Home、Legacy Board Shell/List、Login、Message Center、New Topics、Search、Topic Detail/Header/Management、User Center/Profile 共 15 个串行批次处理剩余 40 个过渡 partial；每批只启用一个独立代理，主代理逐批复核全部 SCSS 与 TS/TSX consumer，并在通过样式守卫、modern/legacy typecheck、`git diff --check` 后亲自执行生产构建；
- 每个 `*.module.scss` 均由业务 TS/TSX 相对导入并实际消费映射；Sass 聚合边与 allowlist 条目全部移除，终态保持 42 个真实 CSS Module、0 个 transitional partial、29 个主题，40 个目标文件均保留，没有通过删除文件降低分母；
- 主题相关 Sass 值只改读 C1.5.1 已建立的八个 `--cc98-*` 自定义属性；非主题 legacy 常量改为显式 `@use`。主题 manifest、29 主题 key/id/顺序、默认主题、URL、日夜配对和模板入口未改；
- 固定 ID、jQuery、UBB/Markdown 动态 HTML、Ant Design/Router/Font Awesome、全局 keyframe 与无 consumer 规则均按最小兼容面处理；每个 selector 级或值级 `:global`、跨 lazy Route 规则、休眠 producer 与浏览器验收项均记录在 `docs/refactor-log/c1.5/css-modules-risk-register.md`；
- 业务 API、Router、Redux、Storage、权限、事件、动态 ID、资源 URL、DOM 层级、注释、BOM/EOL/EOF 合同保持；`.vscode/` 仍为用户自有未跟踪内容，未触碰。

守卫、机械与产物证据：

- `scripts/check-style-migration.mjs` 已收紧为终态守卫：过渡清单必须为空、模块总数必须为 42，CSS Module 必须使用相对默认绑定并在 import 之外实际以属性或索引方式消费；29 主题仍逐项校验 token -> custom-properties -> Site.scss 导入顺序及八个自定义属性声明；
- 15 批生产构建均通过；批次 15 构建为 4027 modules transformed，最终依赖方向收口后构建为 4028 modules transformed。构建仍只报告既有 Sass `@import`、Spectrum/Lightning CSS 与 chunk-size 警告，没有新增构建错误；
- 最终 `npm run check:architecture` 通过：308 个源码文件、1307 个 import、28 条既有 allowlist；Foundation/Modules 不再直接导入 Application Route 样式，禁止新增 props 的跨层固定 class 由 Route Module 逐项精确 global 并登记删除条件；modern/legacy typecheck、样式守卫与 `git diff --check` 均通过；
- 29 份主题 CSS 只移出原先重复编译的业务规则，真实 Module 规则进入对应 route/module 懒加载 CSS；vendor、APlayer、DPlayer、字体与其他静态内容资产保持稳定。完整 SHA-256 清单与每批差分保存在本轮临时审计目录，不进入仓库；
- 主代理已完成全批注释删除审计、Sass 聚合闭包、allowlist JSON、`:global` 风险登记、消费者映射、主题变量、固定 ID/jQuery/Portal/UBB 边界和生成 CSS 抽查；浏览器、真实登录/API/权限、主题视觉、SignalR、跨标签、转账、头像裁剪与复杂 UBB 仍按运行验收边界单独报告，不以 build/typecheck 代替。

停点：

- 本轮按用户授权完成全部 15 批后统一报告；不 commit、不 push、不创建 PR，不启动 Z 或其他后续重构；
- C1.5 代码实施已收口，仍需按最终报告列出的浏览器/真实后端场景执行人工运行验收。

## 17. Z：根目录 legacy 浏览器源码收口

Z 是 C1 之后的最终源码归位阶段。目标不是把根目录旧文件机械搬进 `src`，而是让每个仍保留的运行能力都落到真实 owner，并删除已经失去职责的 facade、ambient 业务声明和双编译配置。

新增本计划不等于授权实施 Z。C1 仍先单独实施和验收；Z0–Z5 每批完成机械检查和主代理逐文件审核后停止，等待用户人工验收及单独提交授权，不自动进入下一批。

### Z 终态

浏览器业务源码只存在于：

```text
src/application
src/modules
src/foundation
```

完成后删除以下根级源码入口或目录：

```text
@types/@cc98
Components
IndexedDB
Match
Pages
Props
States
Styles
Ubb
Utility
config
SignalR.ts
Store.tsx
Utility.ts
tsconfig.legacy.json
```

同时满足：

- `@legacy/*` 使用数为 0，并从 TypeScript、Vite 和架构脚本中移除该 alias；
- 现代 `tsconfig.json` 覆盖全部活动源码，不再维护根目录 legacy include 和双编译分支；
- 根目录只保留构建、部署、文档、模板、公开静态资源和工程配置；
- 旧 `/list` 继续由 `src/application/routes/legacy-board-list` 承接，URL 与现有免检边界不变；除非用户另行授权，不借 Z 删除该公开路由；
- `.vscode/` 始终不进入 Z。

### Z0：全量清单、可达性和合同冻结

实施任何删除前，建立以当前 HEAD 为准的 tracked file map、owner map 和 consumer map，至少覆盖：

```text
静态 import/export
Router lazy 入口
dynamic import / require
UBB handler 注册和反射式构造
Vite、HTML、EJS、部署与公开静态资源入口
CSS/SCSS、JSON、图片、字体和媒体资源引用
外部固定 URL 与独立页面入口
```

每个候选分别标记“被加载”“运行时可达”“存在直接调用”，不能用单次 `rg` 的零调用结果代替可达性证明。旧 facade 或文件只有在仓内 import、Router、动态入口、构建模板、外部固定入口和资源引用全部闭包后才允许删除。

Z0 同时冻结下列行为合同：

- 公开 URL、Router 参数、lazy 边界和旧 `/list` 行为；
- API URL、method、headers、body、response wire shape 和错误语义；
- Storage/IndexedDB 键、TTL、序列化格式、失效与跨标签行为；
- UBB 输出、权限标签、内容安全、DOM、CSS、播放器、数学公式和编辑器行为；
- SignalR、通知、Session、主题和缓存行为。

16 个零调用/P21 候选仍逐项做上述证明；禁止因类名陈旧、文件短或当前无静态调用而批量删除混合文件。

### Z1：业务类型和数据模型按 owner 收口

删除 ambient `declare module '@cc98/api'` 聚合。业务消费者改为从相应 Module 根入口导入类型，Route 私有模型留在对应 Application Route，浏览器/第三方环境声明才允许留在 `foundation/types`。

类型 owner 按下表执行：

| Owner | 迁入合同 |
| --- | --- |
| `modules/board` | `IBoard`、`IBoardGroup`、`IBoardMasterTitle`、`FocusBoard`、版面收藏和版面合同 |
| `modules/topic` | `IBasicTopic`、`IHotTopic`、`ITopic`、`ITag/ITagGroup`、`FocusTopic`、`RecommendedTopic`、`RandomTopic`、主题列表合同 |
| `modules/post` | `IPost`、`IAward`、`ILike/ILikeState`、帖子内容和最近回复合同 |
| `modules/user` | `IBasicUser`、`IUser/UserInfo`、用户资料与修改资料合同 |
| `modules/session` | 当前用户 `MyInfo` 消费者统一改用现有 `CurrentUser` 公共合同，不再复制一份当前用户类 |
| `modules/message` | `IMessageContent`、`IRecentMessage`、私信会话和消息 DTO |
| `modules/notification` | 通知设置、回复通知和系统通知 DTO |
| `modules/daily-signin` | `ISignIn` |
| `modules/site-content` | `ISite`、`IConfig`、`IIndex`、首页栏目和推荐内容 API 合同 |
| `modules/user-preference` | 用户主题偏好合同；不得与 `foundation/theme` 的运行时配置类型混为同一 owner |
| `modules/wealth` | `TransferWealthInfo` 等财富请求合同 |
| 对应 Application Route | 仅该 Route 使用的页面 props/state、Router match 和展示模型 |

同名或重复合同先对照真实 API wire shape 合并；不能因为字段相似就改变可空性、日期表示、字段大小写或废弃字段。`@types/@cc98`、`Props/`、`States/` 和 `Match/` 只有在所有消费者改到真实 owner 后删除。

#### Z1 注释与未知类型保真约束

类型搬移不是重新设计合同。迁移时必须逐声明保留原文件的 JSDoc、行注释、块注释、TODO、FIXME、字段说明、废弃说明和“不知道有什么用”等不确定性记录；只允许为 import、export、owner 路径和 `class` → `interface/type` 的必要语法调整改动代码结构，不得顺手润色、删减、合并或用新解释覆盖原始注释。

原声明没有明确类型，且无法从 API schema、实际 wire shape、稳定调用合同或运行时证据唯一确定时：

- 当批先显式写成 `any`，保持原有宽松语义，不凭字段名猜测类型；
- 不用错误的窄类型、非空断言或类型断言掩盖未知合同；
- 在本批类型债务清单中记录原路径、原 symbol、字段名、当前 owner、活动消费者、未知原因、待核对证据和移除 `any` 的条件；
- 后续另立类型查明批次，结合真实 API、Storage 数据、运行时样本和全部消费者逐项收窄；未经证据不得批量用 `unknown`、`object` 或推断类型替换。

类型迁移批删除旧文件前必须完成专项检查：

```text
原声明与新声明逐 symbol 对照
原始注释逐条存在且文本未漂移
字段名、大小写、可选性、联合值和日期表示未漂移
所有新增显式 any 均能在类型债务清单中反查
旧路径、ambient module 和旧 owner 消费者归零
```

文件被拆到多个 owner 时，按 symbol 建立 source → destination 清单并逐条审核注释；不能仅凭 rename similarity、typecheck 或 build 结果宣称注释保真。Z5 负责核对“源码中的临时 `any`”与债务清单一致，但不在 alias/目录闭包批中顺手收窄类型。

#### Z1 class / interface / type 规则

当前审计结论：`States/`、`Props/`、`Match/` 以及已经进入 `src` 的 Message、Notification、Board、Home 数据模型，绝大多数只承载 JSON、API DTO、React props/state 或 Storage 对象，没有 `instanceof`、原型方法或运行时身份，应在 owner 迁移时消除“伪 class”。

- `interface`：对象 shape、API DTO、React props/state、Storage 记录及需要 `extends` 的公共结构合同；`UserInfo/MyInfo`、`BoardEvent`、`FocusTopic`、Message/Notification DTO 等使用这一类；
- `type`：联合、字面量、元组、函数签名、映射/条件类型和交叉组合；不因“删除 class”就默认改成 `type`；
- `class`：确实依赖构造过程、方法、`private/protected`、继承、`instanceof`、框架生命周期或运行时注册/分派的对象。

只有字段赋值的构造器不构成保留 class 的理由。`PagerState`、`TopicState`、`Board`、`HotTopic`、`RootBoardState`、`ChildBoardState`、`MainPageColumn` 一类改为 `interface`，现有 `new` 改为对象字面量、具名 mapper 或 `createXxx` 工厂；工厂必须保持字段、默认值、序列化结果和调用时机。空构造器直接删除。

以下 class 不在 Z 中机械改写：

- UBB Token、Segment、Engine、Handler 及其继承/注册体系；
- 播放器、数学公式、错误边界等具有实例生命周期或 React error boundary 语义的 class；
- 第三方插件要求继承的 adapter class。

UBB 内部的纯 options/context data 可在逐文件审核后单独改为 `interface`，但不能与 UBB 迁址混做。React class 转函数也不作为 Z 的默认要求。

### Z2：UBB 完整迁入 `modules/ubb`

将以下能力作为一个受控业务批迁入 `src/modules/ubb`：

```text
Ubb/**
Components/UbbContainer.tsx
Components/UbbEditor/**
States/UbbEditorState.tsx
C1 已归位的 UBB 样式入口
```

Module 根入口只导出业务需要的 `UbbContainer`、`UbbEditor`、解析/渲染公共合同和必要扩展点；Application、其他 Module 不得深层导入 handler 或实现文件。原 `@legacy/Ubb/*`、`@legacy/Components/Ubb*` 消费者一次性切换为 `@modules/ubb`。

本批采用完整文件迁址加必要路径修正，保留：

- Handler 名称、注册顺序、动态构造和扩展能力；
- UBB/Markdown 解析结果、嵌套/空标签、quote 和 URL 文本处理；
- 权限、仅楼主、回复可见、指定用户可见等访问控制；
- 图片、上传、音频、视频、Bilibili、数学公式和 sandbox 行为；
- 编辑器按钮 JSON、emoji 资源、光标/选区、预览、上传压缩和草稿交互；
- DOM 结构、className、CSS、错误降级与内容安全边界。

不在本批现代化 Handler class、改写解析算法、修改公开扩展 API 或顺手修复已知 UBB 缺陷。机械检查通过后仍必须单独记录浏览器 UBB/editor/media/permission 验收；未执行不得记为通过。

### Z3：Pages、Components 和根级适配器归真实 owner

按消费者闭包处理剩余根级源码：

- `Pages/` 中非 AnnualReview facade 的调用方改到现有 Application Route 公共入口；旧 `/list` 实现只保留 `src/application/routes/legacy-board-list` 的真实 owner；
- `Components/` 的短 facade 先切换全部调用方再删除；仍有实现的 UI 按复用范围进入业务 Module、Application layout/route 或 Foundation 通用能力，不建立新的泛化 `shared/components` 垃圾桶；
- `Utility.ts` 逐导出迁到 Module/Foundation 公共入口，逐项证明零消费者后删除，不整文件猜测性删除；
- `Utility/`、`IndexedDB/` 按数据和副作用 owner 进入 Foundation storage/lib 或对应 Module cache；Storage 键、TTL 和序列化保持不变；
- 根 `config/` 归 `foundation/config`，根 `SignalR.ts` 归 Notification 的实时通知实现或在兼容消费者归零后删除；
- 根 `Store.tsx` 在零消费者后删除，Store 真实入口继续为 `application/store`；
- `Styles/` 必须已由 C1 完成真实归位，Z 只做零引用和空目录闭包，不重新设计样式。

每个实现文件必须确定唯一 owner；无法确定 owner、必须改变业务逻辑才能编译或可能存在外部 facade 消费者时立即停批审核。

### Z4：AnnualReview 完整移除

用户已决定不保留 AnnualReview。Z4 删除：

```text
Pages/AnnualReview/**
Pages/AnnualReviewV2/**
src/modules/annual-review/**
Utility 中 getAnnualReview / getAnnualReviewV2 兼容导出
仅由 AnnualReview 使用的样式、图表适配和资源
```

不恢复 Route，不迁成新的 Application，不保留空 Module 或兼容 facade。删除前仍核对 Router、动态入口、Vite/HTML/EJS、部署模板、固定 URL 和静态资源；发现仓外独立部署合同或仍被其他业务消费的共享资源时暂停并列出证据，不能连带删除共享能力。

AnnualReview 功能本身不再要求运行验收；需要确认主 Router、首页、登录、构建入口、图表适配的剩余消费者和公开静态资源未受影响。

### Z5：alias、双编译和根目录闭包

最后一批只做全仓闭包：

- 确认 `@legacy`、旧相对 Store/Utility/Components/Pages/Props/States/Ubb import、动态 require 和根级源码引用全部为 0；
- 删除 `@legacy/*` alias、`tsconfig.legacy.json`、Vite legacy compiler options 分支和已失效 architecture allowlist；
- 清理现代 `tsconfig.json` 对 `@types/@cc98` 的 include，确认业务合同全部从真实 Module 根入口解析；
- 删除空的根级源码目录和兼容文件，更新 Application/Modules/Foundation/根 README、架构目录清单和本计划状态；
- 核对 Z1 类型债务清单与实际临时 `any` 一致，未查明项明确移交后续独立类型收窄阶段，不伪记为已解决；
- 不回写历史 phase 记录，不把旧阶段未执行的人工验收改记为通过。

Z5 终验执行：

```powershell
npm run check:architecture
npm run typecheck
npm run build
git diff --check
```

并做全仓活动代码搜索和主代理逐文件审核，确认公开 URL、API wire shape、Storage/IndexedDB、DOM/CSS、Session、Notification、SignalR、主题、缓存和 UBB 合同未漂移。完整浏览器、登录、真实 API、权限、SignalR、跨标签、通知、缓存、编辑器、媒体和 UBB 验收仍分别记录为“未执行”或实际结果。

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
- UBB/AnnualReview 在未到对应 Z 子批或未获实施授权时被意外纳入；
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

骨架和本计划确认后，F1-A、F1-B、F1-C、F1-D、A1、M1、M2、A2.1–A2.11、M3.1–M3.6、S1.1–S1.3、S1.4 六组、S1.5、S1.6、S1.7 与 C1.1–C1.5 均已完成代码实施、机械检查和主代理人工代码审核，A、M、S1 与 C1 代码实施完成。C1.5 已收口为 42 个真实 CSS Module、0 个过渡 partial、29 个主题；兼容选择器、后续语义改名与浏览器验收项已登记。完整的浏览器、登录、真实 API、权限、SignalR、跨标签、转账、缓存、草稿、UBB 与 C1 样式运行验收未全部执行，旧 `/list` 仍仅适用既有免检结论。当前停在 C1.5 收口后，不自动启动 Z。

## 22. 已确认决策与后续边界

已经确认：

1. 采用 `2a69a0f0` 作为重新迁移基点；
2. 在当前目录直接回退，不创建 worktree；
3. 丢弃 D1/D2 迁移结果，不保留只读对照；
4. 第一轮只建骨架、alias 和检查脚本，不迁业务文件；
5. M1 使用五个 Module 根入口，并接受已记录的共享 chunk 重组；
6. S1 Redux 终态只保留 Session 与 Notification unread 两个业务 slice，Application Error 退出 Redux；
7. S1 采用严格保真迁移，已知缺陷只登记，不顺手修复；
8. 未经用户要求，不 commit、不 push；
9. C1 后新增 Z0–Z5 根目录源码收口阶段，浏览器业务源码终态只位于 `src/application`、`src/modules` 和 `src/foundation`；
10. AnnualReview 完整移除，不恢复 Route、不建立新 Application 或空兼容 Module；
11. UBB 功能保留并完整迁入 `src/modules/ubb`，迁址阶段不改写解析器、Handler 体系或扩展合同；
12. `@types/@cc98` 业务声明按真实业务 owner 迁入各 Module，不把 ambient `@cc98/api` 聚合搬入 Foundation；
13. 纯数据 class 优先改为 `interface`，联合/组合类型使用 `type`，只有存在真实运行时身份、继承、方法或生命周期的对象保留 `class`；
14. 类型搬移必须保留全部原始注释；没有明确类型且缺少唯一证据的字段先显式写成 `any`、登记类型债务，后续通过独立类型查明批次收窄。

后续仍需单独授权或审核：

1. S1.1–S1.3、S1.4 六组、S1.5、S1.6 与 S1.7 尚未执行的完整浏览器、登录、真实 API、SignalR、跨标签、缓存与草稿运行验收，C1.1–C1.5 的浏览器样式验收，以及后续每个 Z 子批的代码实施授权；
2. 当前 `useUserProfileContext` 接口及 UserProfileLayout 集中取数边界是否随资料缓存归位或 Redux 闭包再次调整；
3. A2.3–A2.11 与 M3.1–M3.6 尚未执行的浏览器、登录、真实 API、权限、分页、SignalR、通知权限、上传、编辑器、缓存与 UBB 运行验收；
4. 旧 `/list` 免检边界是否继续保留；在另行确认前，Z 只删除根 facade，不删除该公开 Route；
5. UBB 迁入 `modules/ubb` 后的浏览器、权限标签、编辑器、媒体、数学公式和扩展 API 人工验收。
