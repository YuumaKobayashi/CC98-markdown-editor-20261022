# CC98 前端目录重构执行计划

> 状态：R0、R1、F1-A、F1-B、F1-C、F1-D、A1、M1、M2、A2.1–A2.11、M3.1–M3.6、S1.1–S1.3、S1.4 六组、S1.5、S1.6、S1.7 与 C1.1–C1.5 的代码实施、机械检查和主代理人工代码审核均已完成；C1.5 已本地提交为 `733eb045`。C1.6.0 已提交为 `bee0dd05`，C1.6.1 代码与记录已提交为 `61b4d5db`/`ff9702be`，C1.6.2 代码已提交为 `ad1db0e7`，C1.6.3 代码已提交为 `788da9e7`，C1.6.4 已提交为 `fdbe3762`，C1.6.5 代码与记录已提交为 `0c6efc6e`/`b232c6ca`。C1.7.1、Legacy Board 删除和 C1.7.2 Status 子批已随代码/记录提交 `f11fe1e7`/`99a8679e`，C1.7.2 其余真实复用候选已提交为 `52b4bc77`/`fe0e02fa`，C1.7.3 已提交为 `b361a4c1`/`489dff9d`，C1.7.4 已提交为 `4f5f28ba`，C1.7.5 代码与记录已提交为 `0cc9d51f`/`3db6030e`，C1.7.6 已提交为 `3e3a65e1`/`1b6a8318`。C1.7.7 代码与守卫已本地提交为 `30b150ce`，记录随本批单独提交；浏览器运行验收结论见本批审计，不 push，不自动进入 Z。
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
C1.6.0 业务 global 基线与行为查询清单           已完成（主代理逐项审计；已有本地提交）
C1.6.1 Message/Notification 样式所有权收口       已完成（主代理整批审核；浏览器运行验收未执行；已有本地提交）
C1.6.2 Topic/Post 样式所有权收口                  已完成（主代理整批审核；浏览器运行验收未执行；已有本地代码提交）
C1.6.3 User 与共享卡片样式所有权收口              已完成（主代理整批审核；浏览器运行验收未执行；已有本地代码提交）
C1.6.4 Editor/Login/Search/Legacy Board 收口         已完成（主代理整批审核；浏览器运行验收未执行；已有本地代码提交）
C1.6.5 全仓样式与剩余业务 global 审计               已完成（主代理整批审核；浏览器运行验收未执行；已有本地代码/文档提交）
C1.7.1 单文件多组件拆分                              已完成（主代理整批审核；浏览器运行验收未执行；已有本地提交）
Legacy Board 不可达兼容链删除                        已完成（用户明确授权；机械检查通过；已有本地提交）
C1.7.2 真实共同语义组件复用                          已完成（主代理整批审核；浏览器运行验收未执行；已有本地提交）
C1.7.3 Route 样式仓库与组件 Module 共置              已完成（主代理整批审核；浏览器运行验收未执行；已有本地提交）
C1.7.4 孤儿源码与样式 owner 收口                     已完成（主代理整批审核；浏览器运行验收未执行；已有本地提交）
C1.7.5 动态内容全局边界盘点与冻结                    已完成（主代理整批审核；浏览器运行验收未执行；已有本地代码/文档提交）
C1.7.6 Ant Design、Spectrum、Router/Portal 第三方边界  已完成（主代理整批审核；浏览器运行验收未执行；已有本地提交）
C1.7.7 Foundation 全局边界最终收口                    已完成（主代理整批审核；浏览器运行验收结论见审计；已有本地代码/文档提交）
```

### 当前停点：C1.7.7 Foundation 全局边界最终收口已完成并本地提交；不 push、不自动进入 Z

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

- 本轮按用户授权完成全部 15 批后统一报告；随后经用户批准已本地提交为 `733eb045 refactor(styles): complete C1.5 CSS Modules migration`，未 push、未创建 PR；
- C1.5 代码实施已收口，仍需按最终报告列出的浏览器/真实后端场景执行人工运行验收。

### C1.6 组件样式所有权与业务 global 收口

C1.5 解决了“业务样式由主题入口重复编译”和“伪 CSS Modules”问题，但还没有完成组件级所有权。C1.6.0 基线有 42 个真实 CSS Module，其中 16 个文件包含合计 120 处 `:global(...)`；主要集中在 `TopicDetail.module.scss`（40 处）、`MessageCenter.module.scss`（31 处）、`UserCenter.module.scss`（18 处）和 `EditorTopic.module.scss`（10 处）。C1.6.1 完成后为 48 个真实 CSS Module、14 个文件中的 85 处 `:global(...)`；C1.6.2 完成后为 53 个真实 CSS Module、13 个文件中的 70 处 `:global(...)`；C1.6.3 完成后为 59 个真实 CSS Module、10 个文件中的 47 处 `:global(...)`；C1.6.4 完成后为 58 个真实 CSS Module、3 个文件中的 29 处 `:global(...)`；C1.6.5 最终为 71 个真实 CSS Module、2 个文件中的 2 处第三方 `:global(...)`。Message/Notification、Topic/Post、User、Editor、Login、Search、Legacy Board 及全仓无 producer/consumer 业务规则已经收口，剩余两处已登记到 C1.7 第三方边界。

C1.6 的目标不是机械减少文件行数，而是让每条业务规则跟随真实 DOM producer：组件生产 DOM，也直接导入并消费自己的 CSS Module；Route 样式只保留 Route 根布局、Route 间编排和确实由该 Route 自身生产的状态。父 Route 不再依靠固定字符串 class、固定 ID 或 `:global` 反向命中 `modules`、`foundation/ui` 或子 Route 组件。

#### C1.6 目标与完成定义

- `src/application` 与 `src/modules` 中，父 owner 命中子组件业务 class/ID 的 `:global` 数量为 0；跨层样式依赖必须通过子组件自有 Module、已有可控 `className`/slot 接口或组件内部状态映射解决；
- 每个活动业务 selector 都有唯一 owner、明确 producer 和至少一个可追踪 consumer；无 consumer 规则不得为了维持 CSS Module 输出而制造空锚点、无意义 DOM、未读取自定义属性或 React `key`；
- 固定 ID 仅保留给脚本、可访问性、锚点或外部合同，视觉规则改由本地 Module class 承担；必须保留的 jQuery/DOM 查询同步使用既有 ID、`ref`、稳定 `data-*` 或同批迁移后的 Module 映射，不以视觉选择器兼任行为协议；
- React Router `active`、加载/隐藏、选中、错误、楼层类型等本仓状态由 Module class 映射、条件渲染、`hidden`、ARIA 或局部 `data-state` 表达，不继续依赖全局 `active`、`displaynone` 等工具 class；
- Route 级大文件按真实子组件边界拆分。文件大小只作为审计信号而非硬指标：超过 300 行、覆盖三个以上独立组件或含多个无关 BEM 根时，必须解释为何仍由同一 owner 持有；
- C1.6 结束时，剩余 `:global` 只能属于 C1.7 已登记的第三方生成 DOM、Portal、动态 HTML 或 Foundation 全局入口边界；守卫禁止新增未登记项。

#### C1.6 selector 分类与处理规则

1. **本仓子组件固定 class**：例如 Message/Notification 的 `message-*`、Post/Topic 的 `user-post-*` 与 `reply-floor*`。将规则移入生产这些节点的组件 Module，由组件直接消费 `styles.*`；父 Route 删除对应 `:global` 后代规则。
2. **本仓固定 ID**：例如 Topic Header、Login、User Profile、Legacy Board 的视觉 ID。保留确有行为合同的 `id`，同时增加或复用局部 Module class；SCSS 只选择局部 class，不使用 `:global(#...)`。无行为/可访问性/外部合同的纯视觉 ID 另批删除。
3. **跨 Route 共享业务组件**：样式归入 `src/modules/<owner>/ui/<component>/`，不得复制到多个 Route，也不得让 Module 反向导入 Application 样式。确有 Route 差异时由组件提供语义化 variant，而不是暴露内部 DOM class。
4. **Route 自身状态**：`NavLink`、空结果、加载、错误和选中态由 Route Module 映射直接消费；不得以全局工具 class 拼接保持旧 specificity。
5. **休眠或无 producer 规则**：先查 TS/TSX、模板、动态 HTML、脚本、public 静态入口和仓外合同；确认无 consumer 后在独立小批删除，不继续用精确 global“保存历史”。无法确认的项目进入有 owner、原因、证据和删除条件的冻结清单，不算作 C1.6 完成。
6. **第三方、Portal、UBB/Markdown 动态 DOM**：不在 C1.6 猜测性改写，完整移交 C1.7；但必须先由本地根节点或稳定 `data-cc98-owner` 限定影响范围，禁止裸全站命中。

#### C1.6 建议实施批次

```text
C1.6.0  重新生成 selector/producer/consumer/行为查询清单；冻结 120 处基线
C1.6.1  Message 与 Notification 子组件样式下沉；拆分 MessageCenter/Settings
C1.6.2  Post、Topic、FloorSize、Topic Header/Reply 子组件样式下沉
C1.6.3  User、Post、Topic 共享卡片及 User Center/Profile 样式下沉
C1.6.4  Editor、Login、Search、Legacy Board 的固定 ID、状态和休眠规则收口
C1.6.5  全仓反向依赖、重复规则、大文件 owner 与剩余 global 人工审计
```

#### C1.6.0 selector/producer/consumer/行为查询基线记录（2026-08-01）

- 重新扫描全部 42 个真实 CSS Module，确认 16 个文件包含合计 120 处 `:global(...)`：`TopicDetail.module.scss` 40 处、`MessageCenter.module.scss` 31 处、`UserCenter.module.scss` 18 处、`EditorTopic.module.scss` 10 处，其余 12 个文件合计 21 处；该数字与 C1.6 计划基线一致；
- 新增 `docs/refactor-log/c1.6/global-selector-baseline.md`，逐 owner 登记全部 selector、重复次数、DOM producer、CSS Module importer、jQuery/DOM/ref/Router/通知状态行为查询及后续 C1.6/C1.7 归属；明确 importer 只能证明 chunk 加载，不能代替活动 selector consumer 证明；
- 新增 `scripts/style-global-baseline.json`，并扩展既有 `check-style-migration.mjs`：校验含 global 的文件集合、逐文件出现次数和按源码顺序计算的 selector SHA-256 指纹，禁止新增未登记业务 global 或在未同步审计的情况下静默改写基线；`global(fadeIn)`/`global(fadeOut)` 为动画值转义，不计入 selector 基线；
- 本批未修改任何 SCSS、TS/TSX、DOM、组件 props、行为查询、主题、构建入口或运行代码，因此没有预期 CSS chunk、29 主题、vendor 或静态内容产物差分；没有删除休眠规则，也没有为无 producer 规则制造空 DOM；
- `npm run check:architecture` 通过：308 个源码文件、1307 个 import、28 条既有 allowlist；样式守卫通过：42 个真实 CSS Module、0 个过渡 partial、29 个主题、16 个文件中的 120 处 C1.6 global；modern/legacy typecheck 与 `git diff --check` 通过；
- `npm run build` 在受限环境首次因 Vite 子进程 `spawn EPERM` 失败，未改源码；在允许子进程的环境用同一命令重跑通过，转换 4028 个模块并生成既有 29 个主题 CSS、业务 chunks 与 vendor 产物；既有 Spectrum legacy hack minify 与大 chunk 警告保持；
- 主代理已复核 16 个样式文件的 120 处 selector、69 次显式默认导入、活动/休眠/第三方 producer、固定 ID、条件 class、头像 ref 原生事件、通知 class 切换、Router 状态与 jQuery 查询边界，未发现未登记的 global 或 C1.6.0 范围外运行代码变化；
- 浏览器视觉、默认/暗色主题切换、真实 API/权限、Portal、UBB/editor、跨 Route 和响应式运行验收均未在本批执行；C1.6.0 后已按单独授权提交为 `bee0dd05 chore(c1.6.0): freeze global selector baseline`，未 push。

#### C1.6.1 Message/Notification 样式所有权收口记录（2026-08-01）

- 以 `bee0dd05` 为唯一基线，将原 `MessageCenter.module.scss` 与 `MessageSettings.module.scss` 拆为 8 个真实 owner Module：Message Layout、私信列表、私信窗口、联系人、收发气泡、系统通知卡片、回复/@通知卡片和消息设置；Sender/Receiver 与 Response/Attme 分别共享同一语义 Module，没有复制规则或扩展公开 props；
- Message/Notification producer 全部直接导入并消费局部映射；Route 只保留外壳、导航、共享右栏/分页和通知列表根编排。Settings Route 删除 React `key` 与空自定义属性锚点，仍只渲染原 `MessageSetting`，其 jQuery radio ID/name/checked、Storage key、提示 ID/class 切换与 3 秒时序未改；
- NavLink 当前态、未读计数及私信加载/隐藏状态改由局部 Module 或原生 `hidden` 表达；Foundation 中仅供消息导航使用的 `.message-counterNav` 原声明与注释下沉到 `MessageLayout`。全部固定/动态 ID、API、Redux、Router、权限、请求、URL、UBB options、DOM 层级和业务注释保持；`TopicNotices.module.scss`、`NoticeMessage` 及通知服务的 `displaynone`/`noticeDisplaynone` 合同未改；
- `scripts/style-global-baseline.json` 更新为 C1.6.1 精确基线，样式守卫通过：48 个真实 CSS Module、0 个过渡 partial、29 个主题、14 个文件中的 85 处 C1.6 global；Message/Notification 两份旧 owner 的 35 处 global 已清零，没有新增 `:global(...)`；
- `npm run check:architecture` 通过：308 个源码文件、1312 个 import、28 条既有 allowlist；modern/legacy typecheck、生产 build 与 `git diff --check` 通过。生产 build 转换 4034 个模块，仍只有既有 Sass `@import`、Spectrum/Lightning CSS 与大 chunk 警告；
- 29 个主题入口、顺序和八个自定义属性保持；每份主题 CSS 只因移出 `.message-counterNav` 同步减少 238 bytes。22 个非主题顶层产物的文件名、长度与 SHA-256 完全不变；原 MessageCenter/Settings CSS 拆为 MessageLayout、private-messages、notification 与 bundler 归属的 upload owner chunks，均已抽查包含对应局部 selector；
- 主代理逐组件复核样式声明、后代关系、specificity、hover/focus/active、气泡伪元素、UBB 链接四态、条件状态、固定/动态 ID、jQuery 查询、lazy Route 和注释闭包，未发现范围外逻辑或未登记全局依赖。浏览器、真实登录/API/权限、默认/暗色主题、响应式及五个 `/message/*` 场景未执行，不以机械检查代替；本批停止等待用户验收和单独提交授权，不自动进入 C1.6.2、C1.7 或 Z。

#### C1.6.2 Topic/Post 样式所有权收口记录（2026-08-01）

- 以 `ff9702be` 干净工作树为唯一基线；Topic Header 的标题、标签、时间、浏览与收藏规则并入既有 Header Info Module，Replier、Reply Signature、Reply List、Vote 和 `modules/post/ui/FloorSize` 分别直接导入并消费自有 Module。Header、`commentlike` 与动态楼层 ID 均保留，`FloorSizeProps`、公开导出和三个调用点未改；
- `TopicDetail.module.scss` 删除 13 处已有活动 producer 的 global：Header 8 处、Reply Signature 1 处、FloorSize 4 处；仍由 Reply Content 消费正文布局并冻结 27 处无活动 producer、legacy Post 或仓外合同未排除的固定 selector，不删除休眠规则、不制造 DOM、空属性或样式锚点；
- 回帖失败提示样式由 Foundation `NoticeMessage` 自有 Module 直接消费，Route 的 `TopicNotices.module.scss` 删除。提示根局部化后以 `[class~="noticeDisplaynone"]` 响应原 Notification service；固定/动态错误 ID、`displaynone`、`noticeDisplaynone`、1ms class 切换和 3 秒全局 `fadeOut` 时序均未改，伪造 CSS 消费的 React key 改为现有错误身份；
- `scripts/style-global-baseline.json` 更新为 C1.6.2 精确基线；`npm run check:architecture` 通过：308 个源码文件、1312 个 import、28 条既有 allowlist。样式守卫通过：53 个真实 CSS Module、0 个过渡 partial、29 个主题、13 个文件中的 70 处 C1.6 global；modern/legacy typecheck 与 `git diff --check` 通过；
- 基线与最终生产 build 分别转换 4034/4039 个模块并通过，仍只有既有 Sass `@import`、Spectrum/Lightning CSS 与大 chunk 警告。29 个主题及另外 25 个无关顶层产物同名、等长且 SHA-256 完全一致；旧 `detail` CSS 仅按 owner 重组为新的 `detail`、`post` 和共享反馈样式 chunk；
- 主代理逐组件复核声明、后代关系、specificity、`@extend`、主题变量、UBB/Markdown 后代、固定/动态 ID、hash 楼层、jQuery 通知状态、组件接口、注释和生成 CSS，未发现范围外业务或未登记 global。Vite 根入口返回 200，但当前浏览器运行时没有可用实例；默认/暗色主题、普通/追踪 Topic、FloorSize 四种状态、投票、赞踩、签名、Markdown、通知、真实 API/权限、响应式和前进后退仍明确为未验收。用户人工审核通过后，代码已本地提交为 `ad1db0e7 refactor(c1.6.2): localize topic and post styles`；本记录随单独文档 checkpoint 提交，未 push，不自动进入 C1.6.3、C1.7 或 Z。

#### C1.6.3 User/Post/Topic 共享卡片与 User Center/Profile 收口记录（2026-08-01）

- 以 `81ad463d` 干净工作树为唯一基线；三个 recent-item producer、`UserFollowCard`、`UserCenterAvatarSettings` 与 `UserCenterPager` 分别直接消费自有 Module，Route 只保留列表、分隔线、设置页外壳和页面状态。`ConfigSignature` 及两套 User Profile producer 继续共享既有 owner Module，没有修改公开 props、模块导出或 DOM 层级；
- User Center 的 18 处 global 与 User Module 的 5 处固定 ID global 全部删除。头像 `cover`/`selector`/`resize` ID、refs、原生事件及拖拽身份判断保持，只将视觉映射局部化；其余无行为消费者的纯视觉 ID 删除，`userIntroducion` 拼写和三个 recent-item JSX 的 Font Awesome 注释保持，两条无活动 producer 的休眠 Font Awesome 样式删除；
- `scripts/style-global-baseline.json` 更新为 C1.6.3 精确基线；`npm run check:architecture` 通过：308 个源码文件、1317 个 import、28 条既有 allowlist。样式守卫通过：59 个真实 CSS Module、0 个过渡 partial、29 个主题、10 个文件中的 47 处 C1.6 global；modern/legacy typecheck 与 `git diff --check` 通过；
- 修改前快照与最终生产 build 分别转换 4039/4045 个模块；最终构建通过，仍只有既有 Sass `@import`、Spectrum/Lightning CSS 与大 chunk 警告。9546 个基线产物中 9495 个同路径、等长且 SHA-256 完全一致，29 个主题与两个 vendor 产物全部逐字节不变；差异限定在 User 相关 CSS owner 拆分、对应 JS/CSS 内容哈希及 `index.html` 引用；
- 主代理逐组件复核声明、后代关系、specificity、条件 class、disabled/hover/active、固定 ID、头像 ref/监听闭包、分页 URL、组件接口、注释和生成 CSS，未发现范围外业务或未登记 global。本地 Vite 根入口返回 200，但浏览器连接器没有可用实例；默认/暗色主题、用户中心各子页、公开用户主页、头像拖动/缩放/上传、分页前进后退、真实 API/权限和响应式明确为未验收。用户人工审核通过后，代码已本地提交为 `788da9e7 refactor(c1.6.3): localize user styles`；本记录随单独文档 checkpoint 提交，未 push，不自动进入 C1.6.4、C1.7 或 Z。

#### C1.6.4 Editor/Login/Search/Legacy Board 固定 ID、状态与休眠样式收口记录（2026-08-01）

- 以 `b5ff1f70` 干净工作树为唯一基线。Editor 删除全仓源码、根 `Components`、public、UBB/Markdown 依赖与生产 bundle 均无 producer 的 `.createTopicBoardName` 及整份 `EditorTopic.module.scss`，同步删除仅用于保留休眠 CSS 的 import 与未读取自定义属性锚点；实际 Editor 表单、UBB/Markdown、投票、权限、请求、缓存、URL 与 DOM 层级未改；
- Login 状态消息由 `LoginPage` 直接组合局部 `loginMessage` 映射，删除无行为查询的纯视觉 `loginMessage` ID；Search 的结果、加载、完成、空态和错误态改用原生 `hidden`，删除对全局 `displaynone` 的依赖及没有 consumer 的 `.rusultErr`，不把错拼休眠规则猜测性接入历史 `resultErr` 节点；
- Legacy Board 浏览/回复计数与普通/置顶主题行由 `LegacyBoardTopicItem` 直接消费局部语义 class，版面事件奇偶行背景归入 `BoardModerationRecordItem` Module；删除 `disliked`、`commentsAmount`、`changeColor`、`changeTopColor` 视觉 ID、无 producer 的 `boardTopics`/`notice`/`essay` 规则及两份失效 compatibility partial。动态 `topic${id}`、`title${id}`、`ip_${id}`、jQuery 标题高亮、分页、事件和内联布局保持；
- `scripts/style-global-baseline.json` 更新为 C1.6.4 精确基线；`npm run check:architecture` 通过：308 个源码文件、1316 个 import、28 条既有 allowlist。样式守卫通过：58 个真实 CSS Module、0 个过渡 partial、29 个主题、3 个文件中的 29 处 C1.6 global；modern/legacy typecheck、正式 build 与 `git diff --check` 通过；
- `b5ff1f70` 临时基线与最终生产 build 分别转换 4045/4044 个模块并各生成 9550 个文件。9498 个同路径文件中 9497 个长度与 SHA-256 完全一致，另一项仅为引用新内容哈希的 `index.html`；两个 vendor 产物逐字节不变。29 个主题 CSS 均只精确删除 91 bytes 的 `#changeColor` 两条规则；其余差异限定在 Board、Editor、Legacy Board、Login、Search 的 CSS owner 及依赖这些内容哈希的 JS chunks；
- 主代理逐项复核 selector 声明和值、specificity、`:nth-child(odd)`、条件 class、原生 `hidden`、固定/动态 ID、jQuery/ref、注释、公开接口和生成 CSS，未发现范围外逻辑或未登记 global。浏览器运行时没有可用实例；Editor UBB/Markdown/投票与编辑模式、Login 校验/反馈、Search 全状态、Legacy Board 普通/置顶主题及版面事件、默认/暗色主题、真实 API/权限和响应式明确为未验收。用户人工审核通过后，代码已本地提交为 `fdbe3762 refactor(c1.6.4): localize remaining route styles`；本记录随单独文档 checkpoint 提交，未 push，不自动进入 C1.6.5、C1.7 或 Z。

#### C1.6.5 全仓样式所有权收口记录（2026-08-01）

- 以 `c1a31770` 干净工作树为唯一基线。删除 `TopicDetail.module.scss` 的 27 处无活动 producer 业务 global，并在全仓 16 个 Module 中删除 37 个无映射 consumer 的局部 class；不修改相关 TSX 注释、业务逻辑、固定行为 ID、jQuery 查询、UBB/Markdown 输出或 DOM 文案；
- Home 规则按实际组件拆到相邻 Module；Focus/Search/推荐/热门/新帖的真实跨 Route 布局归入 `application/layouts/collection`；User Center/Profile 的共享壳层和活动列表归入 `application/layouts/user-area`，设置、转账、自定义版面和主题规则归相邻 Route owner。最终没有超过 300 行或覆盖三个以上无关 producer 的未解释 Module，也没有 Route 直接导入另一 Route 的样式；
- 公告展示抽为 `@modules/site-content` 的 `SiteAnnouncementPreview({ content: string })`，由 Home 两个既有导出和站点管理复用；各自空值返回、JSX 注释、UBB options、DOM 层级和文本保持。样式守卫新增跨 Route CSS Module import 禁令，并把两处 Ant Design 动态 DOM selector 精确冻结到 C1.7；
- `npm run check:architecture` 通过：309 个源码文件、1331 个 import、29 条登记 allowlist。样式守卫通过：71 个真实 CSS Module、0 个过渡 partial、29 个主题、2 个文件中的 2 处 global；modern/legacy typecheck、正式 build 与 `git diff --check` 通过；
- 正式 build 首次在受限环境因 Vite 子进程 `spawn EPERM` 失败，同一命令在允许子进程的环境重跑通过，转换 4058 个模块，仍只有既有 Sass `@import`、Spectrum/Lightning CSS 与大 chunk 警告。29 个主题 CSS、APlayer 与 vendor CSS 的文件名、长度和 SHA-256 全部逐字节不变，`dist` 没有工作树污染；
- 主代理逐项复核 selector、producer、映射 consumer、声明、后代关系、specificity、Route 可达性、固定/动态行为查询、注释、公共接口和生成 CSS。浏览器连接器没有可用运行实例；Home/公告预览、Focus、New Topics、Search、Recommended/Hot Topic、User Center/Profile、Topic 正文、Board quick-jumper、默认/暗色主题、真实 API/权限、响应式及 Collapse/分页交互明确为未运行验收。随后按用户授权将代码与记录分别本地提交为 `0c6efc6e refactor(c1.6.5): close repository-wide style ownership` 与 `b232c6ca docs(c1.6.5): record repository-wide style ownership closure`，未 push，不自动进入 C1.7 或 Z。

每批只处理一个可独立验收的 owner 集合；不得顺手修改 API、权限、Redux、Storage、Router URL、jQuery 行为、UBB 输出、DOM 文案或主题视觉。需要新增组件 variant/slot 时，先证明它是跨 Route 的真实语义差异，不为搬 CSS 扩大公共 API。

#### C1.6 验收与停点

- 每批运行 `npm run check:architecture`、modern/legacy typecheck、正式 build、`git diff --check`，并比较受影响 Route 的 CSS chunk、29 主题、vendor 与静态内容产物；
- 主代理逐组件核对 SCSS 声明、伪类、后代关系、specificity、DOM producer、条件 class、脚本查询、Portal 和懒加载边界，不能以构建通过代替人工审核；
- 浏览器至少覆盖对应 owner 的默认/暗色主题、直接进入、前进后退、hover/focus/disabled、加载/空/错状态、弹层和响应式边界；涉及真实后端或权限的场景继续明确报告未验收项；
- C1.6 完成后停止，等待用户验收与单独提交授权；不自动启动 C1.7 或 Z。

### C1.7 组件边界、样式所有权与 Foundation 全局边界最终收口

C1.6 已完成活动 selector 的 producer/consumer 收口，但“selector 有 owner”不等于“组件边界已经干净”。2026-08-01 的只读拓扑复核确认，当前仍存在单文件承载多个独立组件、多个页面直接导入同一共享样式表、业务 TSX 跨多层目录引用远端 Module，以及相同 DOM/行为只复用样式却没有复用组件等问题。若先处理 `Site.scss`、根 `Styles/` 和第三方 global，再拆组件，样式还会随着 owner 变化重复搬迁；因此 C1.7 改为先完成组件拆分与真实复用，再完成 Foundation 全局边界和最终样式目录收口。

本阶段所称“组件状态清理”是组件文件、公开接口、DOM owner、样式 owner、活动调用点和目录边界的终态收口，不授权顺手改写请求、缓存、Redux/Storage、Router、SignalR、计时器、表单、UBB、权限或其他业务状态机。拆分和复用批必须保持现有逻辑、注释、URL、API、DOM 行为合同和导出兼容；确需改变行为的事项另立阶段，不混入 C1.7。

严格意义上的 Web 应用不可能完全没有全局 CSS：reset、`html`/`body`/`#root`、`:root` 主题变量、字体、第三方生成 DOM 及用户生成 HTML 均需要跨组件合同。因此本计划把“没有 global 样式”定义为：**没有无 owner 的业务全局规则、没有业务 `:global(...)`、没有父组件通过全局选择器侵入子组件；所有不可避免的基础全局规则均集中、限界、登记且可审计。**

#### C1.7.0 只读拓扑基线（2026-08-01）

- `src/` 与根 `Components/` 共扫描到 281 个 TSX；当前共有 145 条 `*.module.scss` 导入边，其中 55 条路径至少包含两个 `../`，33 条至少包含三个 `../`；从现代入口解析的活动依赖图中仍有 48 条远距离 Module 导入。该数字用于定位 owner，不作为鼓励机械移动或复制样式的 KPI；
- 24 个 CSS Module 被多个 TSX 直接导入，合计形成 97 条消费边。`UserArea.module.scss` 有 13 个 importer、`UserActivityLayout.module.scss` 有 11 个、`CollectionLayout.module.scss` 有 8 个；这些 importer 中既有真实共享壳层，也有 loading/list wrapper、导航、按钮和 Route 专属规则，必须逐 class/DOM 判定，不能把“多人导入同一 Module”直接视为组件复用；
- AST 初扫发现 21 个文件包含多个顶层 React 组件。`Components/Status.tsx` 有 15 个、`LegacyBoardTopicLists.tsx` 有 10 个、`HomePage.tsx` 有 5 个；`EditorPage.tsx`、`Header.tsx`、`BoardFooterActions.tsx`、`TopicCard.tsx` 与 `BoardTopicListItem.tsx` 各有 3 个。文件大小和组件数量只作为审计信号，是否拆分由独立调用点、生命周期、公开导出、DOM owner 和验收边界决定；
- `scripts/check-style-migration.mjs` 当前只验证相对导入、跨 Route 禁令、默认绑定消费和 Module 至少有 importer；`../../../../layouts/...` 只要不跨另一个 Route 就会通过，也没有限制一份 Module 的直接 TSX owner 数量。C1.7 必须把守卫从“映射被使用”升级为“组件与样式真实共置”；
- 已发现休眠/孤儿候选，例如无活动调用点但仍引用已不存在样式路径的 `ExactActivitiesPosts.tsx`，以及当前未找到调用点的 `FindIP.tsx`。此类项目必须复核 barrel、动态导入、模板、脚本、public 和仓外合同后单独处理；未完成证明前不得仅凭文本搜索删除。

#### C1.7 最终完成定义

- 默认一个可独立调用、复用或验收的 React 组件一个 TSX；同一文件不得继续承载多个独立导出组件。仅有几行、只服务父组件、没有独立状态/副作用/调用点且生命周期完全一致的私有子组件可以保留在父文件，并由人工审核说明例外理由；
- 组件拆分必须保持既有命名导出、default export、barrel、legacy facade 和 lazy Route 合同。需要兼容旧入口时使用薄 re-export，不复制实现；不得借拆文件改写请求时序、状态结构、错误处理、DOM 层级、固定 ID、jQuery/ref 查询或注释；
- 每份活动业务 `*.module.scss` 原则上只有一个直接 TS/TSX owner；其他消费者必须导入该 owner 组件，而不是越过组件接口直接导入其 Module。若多个 TSX 必须共享同一 Module，必须证明它们是同一不可分割组件族并进入有删除条件的例外清单，不能以“样式相同”作为理由；
- 业务组件与 Module 共目录并原则上同名，活动业务 TS/TSX 中跨两级以上目录的 CSS Module 相对导入为 0；Route 子组件、共享 layout 和根 legacy 组件都不得通过 `../../..` 获取样式。仍等待 Z 迁址的活动 legacy 组件可暂时拥有相邻同名 Module，但组件与样式必须在 Z 中整体移动，禁止继续反向引用 `src/application` 样式；
- 一份共享 React 组件只在 DOM 骨架、交互语义、状态转换和未来变化方向一致时建立，并至少有两个活动消费者。差异通过窄的语义 prop、children 或 slot 表达；若为了统一需要大量布尔开关、暴露内部 class 或复制调用方业务状态，则维持独立组件；
- 只有颜色、间距、边框或排版声明相同但业务语义不同的项目不抽 React 组件：优先使用现有主题 token，确为编译期重复时使用不生成 selector 的 Sass mixin；禁止为了降低重复率制造 `Box`、`Wrapper`、万能 variant 或新的横向业务样式库；
- 无活动调用点的 TSX、barrel、facade 和 Module 必须完成可达性、动态导入、模板/public 及仓外合同审计；确认无 consumer 后在独立小批删除，无法确认的项目登记 owner、冻结原因和删除条件。最终不得保留断裂样式路径、只靠通配声明逃过 typecheck 的孤儿组件或为保活样式制造的空 DOM；
- `rg ':global\(' src` 结果为 0；CSS Module 内不再使用 selector 级或值级 `:global`；
- `src/application`、`src/modules` 中不存在普通全局业务 `.scss`，业务样式全部是由相邻 TSX 显式默认导入并实际消费的 `*.module.scss`；
- 根 `Styles/` 删除，根 `Components/UbbEditor/stylesheet.scss` 不再作为样式 owner，`Site.scss` 不再反向导入根 legacy 目录；删除前完成全仓、模板、构建输入和 public URL 零引用审计；
- `Site.scss` 只作为 29 主题共同依赖的 Foundation 全局入口，内容原则上仅为有序导入；不得直接包含 Home、Topic、Message、User Center、Annual Review、UBB 等业务 selector；
- Foundation 普通全局 SCSS 只允许 reset、document/root、共享字体或 keyframe、主题自定义属性和登记后的第三方兼容。每个非 reset selector 必须记录 owner、consumer、作用域锚点、引入顺序、存在原因和删除条件；
- 所有第三方覆盖必须由组件可控根或稳定 `data-cc98-owner` 限界。优先使用第三方公开 `className`、`rootClassName`、slot、popup container 或 token API；确无接口时才进入 `foundation/styles/vendors`，禁止裸 `.ant-*`、`.spectrum-*` 或标签选择器影响全站；
- UBB、Markdown、emoji、编辑器预览等动态内容样式归对应 integration/业务 owner，并由组件本地根约束。原生元素可在本地 Module 根下选择；需要固定生成 class 时优先让 renderer 消费显式样式映射或稳定 `data-*` 合同，无法做到的项目作为动态内容边界单独登记，不混入通用 `Site.scss`；
- `public/static/images/emoji/emojify.css` 等固定 URL 静态样式先审计模板、服务端、仓外引用和图片相对 URL 合同：仍是公开静态合同的文件可继续作为 `public/` 分发产物，但必须登记生成/维护 owner，不能冒充组件源码；确认零引用后才能随同资源删除，不能为目录统一机械搬动；
- `scripts/check-style-migration.mjs` 从“固定数量与 importer 存在”升级为 AST 所有权守卫：自动发现 Module 和 React owner，验证相邻默认导入、映射真实消费、单一直接 owner、组件/Module 共置、跨层与远距离样式闭包、多组件文件例外、断裂路径和孤儿源码；同时禁止 Sass 聚合业务 Module、根 `Styles/`、`:global`、未登记 Foundation selector 和跨层样式依赖。文件数量可随真实组件拆分增长，不能把任何阶段性数量当成终态常量。

#### C1.7 最终目录示例

```text
src/
├─ foundation/
│  ├─ styles/
│  │  ├─ Site.scss                       # 唯一全局入口；原则上只保留有序 @use/@forward 或兼容导入
│  │  ├─ reset/
│  │  │  ├─ _normalize.scss
│  │  │  └─ _restore.scss
│  │  ├─ base/
│  │  │  ├─ _document.scss               # html/body/#root 等应用根合同
│  │  │  ├─ _fonts.scss
│  │  │  └─ _shared-keyframes.scss       # 仅真正跨组件复用的动画
│  │  ├─ vendors/
│  │  │  ├─ _antd.scss                   # 受 data-cc98-owner 或组件根限定
│  │  │  ├─ _spectrum.scss
│  │  │  └─ contracts.md                 # owner/consumer/范围/删除条件
│  │  └─ mixins/                          # 仅编译期工具，不生成 selector
│  └─ theme/
│     ├─ registry/
│     ├─ runtime/
│     ├─ tokens/
│     └─ themes/                          # 29 个主题入口及顺序合同保持
│
├─ application/
│  ├─ layouts/
│  │  ├─ application-shell/
│  │  │  ├─ ApplicationShell.tsx
│  │  │  └─ ApplicationShell.module.scss
│  │  ├─ collection/ui/CollectionPageShell/
│  │  │  ├─ CollectionPageShell.tsx
│  │  │  └─ CollectionPageShell.module.scss  # 页面直接消费组件，不再导入远端布局 Module
│  │  ├─ user-area/ui/UserAreaShell/
│  │  │  ├─ UserAreaShell.tsx
│  │  │  └─ UserAreaShell.module.scss
│  │  ├─ user-area/ui/UserActivityList/
│  │  │  ├─ UserActivityList.tsx
│  │  │  └─ UserActivityList.module.scss
│  │  ├─ header/ui/Header/
│  │  │  ├─ Header.tsx
│  │  │  └─ Header.module.scss
│  │  └─ footer/ui/Footer/
│  │     ├─ Footer.tsx
│  │     └─ Footer.module.scss
│  └─ routes/
│     ├─ status/
│     │  ├─ index.ts                         # 旧命名状态导出只保留薄配置/适配
│     │  └─ ui/
│     │     ├─ StatusPage.tsx
│     │     └─ StatusPage.module.scss
│     └─ topic/
│        ├─ page/
│        │  ├─ TopicPage.tsx
│        │  └─ TopicPage.module.scss      # 仅 Route 根布局
│        └─ ui/
│           ├─ TopicHeader/
│           │  ├─ TopicHeader.tsx
│           │  └─ TopicHeader.module.scss
│           └─ TopicReplyList/
│              ├─ TopicReplyList.tsx
│              └─ TopicReplyList.module.scss
│
└─ modules/
   ├─ message/ui/MessageConversationItem/
   │  ├─ MessageConversationItem.tsx
   │  └─ MessageConversationItem.module.scss # Sender/Receiver 由语义方向参数适配
   ├─ notification/ui/MessageResponseItem/
   │  ├─ MessageResponseItem.tsx
   │  └─ MessageResponseItem.module.scss     # 回复/@ 通知共享骨架，差异显式传入
   ├─ post/ui/FloorSize/
   │  ├─ FloorSize.tsx
   │  └─ FloorSize.module.scss
   ├─ topic/ui/TopicCollectionItem/
   │  ├─ TopicCollectionItem.tsx
   │  └─ TopicCollectionItem.module.scss     # Focus/Search/Recommended 共享语义壳层
   ├─ user/ui/UserProfileSummary/
   │  ├─ UserProfileSummary.tsx
   │  └─ UserProfileSummary.module.scss
   └─ ubb/
      ├─ editor/ui/UbbEditor/
      │  ├─ UbbEditor.tsx
      │  └─ UbbEditor.module.scss
      └─ renderer/ui/UbbContent/
         ├─ UbbContent.tsx
         └─ UbbContent.module.scss
```

目录示例表达所有权规则而非预先批准这些名称或要求一次性重命名全部 TSX：必须先比较真实 DOM、状态和调用点，再确定组件 API。默认一个可独立复用/验收的组件一个目录、一份同名 Module；仅有几行且生命周期完全一致的私有子组件可以与父组件共用 Module。共享布局也必须通过 React 组件提供 DOM 与样式，页面不得只导入 `CollectionLayout.module.scss`、`UserArea.module.scss` 等远端样式表。禁止建立新的 `styles/` 业务杂物目录、按“颜色/布局/按钮”横向集中业务规则，或让多个无组件关系的 TSX 共同依赖一个巨型 Route Module。`row`、`column` 这类只有稳定 flex 声明、跨业务使用的布局原语不复制进各业务 Module，也不包装为无语义 React 组件；它们归 Foundation 单次全局加载，并在独立机械批统一命名空间化为 `cc98-row`、`cc98-column`，旧宽泛名称在全仓消费者切换后直接删除，不长期保留双别名。

#### C1.7 拆分与复用判定

1. **应优先拆分的多组件文件**：`Status.tsx`、`LegacyBoardTopicLists.tsx`、`HomePage.tsx`、`EditorPage.tsx`、`Header.tsx`、`BoardFooterActions.tsx`、`BoardTopicListItem.tsx` 与 `TopicCard.tsx` 已存在多个独立导出、跨文件调用点、不同 DOM owner 或不同样式 owner，进入 C1.7.1 首轮审计。拆分后保留现有 public barrel/facade；组件名、props、default/named export 和 lazy chunk 合同不变；
2. **大文件不自动等于多组件**：`TopicReplyComposer.tsx`、`UserCenterAvatarSettings.tsx` 等即使行数很高，也必须先证明内部区块拥有独立职责、状态/副作用闭包和可单独验收边界。只把 JSX 搬到另一个文件但继续共享父级状态、远端 Module 和大量内部参数，不算完成拆分；
3. **真实组件复用候选**：Collection 页面共同壳层、User Center/Profile 共同壳层与活动列表、Status 页面骨架、`MessageSender`/`MessageReceiver`、`MessageResponsebox`/`MessageAttmebox`、Focus/Search/Recommended 主题项骨架、UserProfile/UserProfileDetails 的资料展示区和 Home 重复标题行，均须比较 DOM、状态、文案、UBB options、URL 与行为差异后决定最小公共组件；
4. **样式仓库不是复用**：`Board.module.scss`、`EditorLegacyForm.module.scss`、`Home.module.scss`、`MessageLayout.module.scss`、`UserProfileManagement.module.scss`、`TopicManagement.module.scss` 等由多个无父子 owner 的 TSX 直接导入时，应按 producer 拆到相邻组件。若多个调用方使用完全不同 class 根，直接拆 Module；若共同生产相同 DOM 骨架，先抽组件再让该组件独占 Module；
5. **不为了复用而复用**：仅 CSS 声明相似、业务含义不同，或需要把调用方请求/状态塞进通用组件的项目继续独立。禁止通过公开内部 `className`、任意 `render*`、大量 boolean variant 或复制状态机来伪造复用；
6. **休眠与孤儿源码**：零调用候选必须先证明 import/export、动态加载、模板/public、jQuery/DOM 字符串与仓外合同闭包，再在独立批删除；活动 legacy facade 若仍需等待 Z，可保留为薄 re-export，但不得继续拥有重复实现或远距离样式依赖。

#### C1.7 建议实施批次

```text
C1.7.0  冻结组件/导出/调用点/CSS importer/DOM owner、Site/root/vendor/动态内容和产物基线
C1.7.1  拆分单文件多组件；保留 barrel、facade、lazy Route、DOM 与行为合同
C1.7.2  提取有真实共同语义的 Collection、User Area、Status、Profile、Message 与 Topic item 组件
C1.7.3  拆除 Route 样式仓库；组件与同名 Module 共置，活动业务远距离 Module 导入清零
C1.7.4  审计孤儿/休眠源码；Application Shell、Footer、Home/PWA、Vote、Annual Review 规则归 owner
C1.7.5  盘点并冻结 UBB、Markdown/emoji 动态内容全局边界；UBB 样式随 Z2 模块化，Markdown 留待整体替换
C1.7.6  Ant Design、Spectrum、Router/Portal 等第三方边界限界与登记
C1.7.7  Foundation 布局工具命名空间化；删除休眠 compatibility、根 Styles 与反向 import，Site.scss 缩为纯入口并启用最终守卫
```

#### C1.7.1 单文件多组件拆分实施记录（2026-08-01）

- 以 `cfbfd83c` 干净工作树为基线审计首轮八个候选；`Status.tsx` 的 15 个公开状态组件拆为单独 owner，原文件变为兼容 facade；Home、Header、Board Footer、Board Topic Item 与 Topic Card 保留主组件文件并把独立公开组件或有独立状态/副作用的私有组件拆到相邻文件。Legacy Board 首轮拆分随后被用户授权的整链删除取代，不再保留拆分产物或 facade。
- `EditorContentHeader`、`EditorTypeRadio` 与 `BoardTopicPreviewPost` 只服务直接父组件、没有独立状态/副作用且生命周期完全一致，按 C1.7 规则登记为共置例外；`generateListPager` 是父组件私有 JSX helper，不作为 React 组件边界。详细调用点、接口、样式 owner 与例外证据见 `docs/refactor-log/c1.7/component-split-audit.md`。
- public barrel 已指向真实 owner；旧 `Status` 路径及 Home/Header/Board/Topic 原文件继续 re-export。15 个 Status 名称、`SearchBeforeConnent`/`Search` alias、legacy default facade 与 Home/Editor lazy Route 命名导出保持。
- 除明确删除 Legacy Board 专属 Route、facade、SCSS 和 IIS 重定向目标外，其余请求、Redux/Storage、Router、URL、ID/ref、jQuery、播放器初始化/清理、计时器、文案、DOM 与原注释不变；拆分新增的 Module importer 边已登记，留待 C1.7.3 收口。
- 删除后同时移除经仓库级复核确认只由 Legacy Board 消费的 10 个零调用 Board/Topic/Moderation API；Current Board 的同类 Route API 与共享活动能力保留。`npm run check:architecture` 通过：314 个现代源码文件、1320 条 import、29 条登记 allowlist；样式守卫通过：65 个真实 CSS Module、0 个过渡 partial、29 个主题、2 个文件中的 2 处 global。modern/legacy typecheck、正式 build 与 `git diff --check` 通过；构建转换 4072 个模块，只有既有 Sass、Spectrum/Lightning CSS 和大 chunk 警告。
- 浏览器、真实登录/API/权限、默认/暗色主题、Header 搜索/用户菜单、Home/跨 Route 广告、Current Board、Status、Editor 与 Topic 音视频运行验收尚未执行；机械检查和代码审核不替代这些场景。本批不 commit、不 push，不自动进入 C1.7.2。

#### C1.7.2 Status Route 共同骨架实施记录（2026-08-02）

- 用户明确否决在 `application` 顶层新增泛化 `ui/` 层；15 个跨 Router、AppShell、Topic、User Center 与 User Profile 使用的状态展示归入 `src/application/routes/status`，Route 根入口统一公开原 15 个名称，`Components/Status.tsx` 缩为薄兼容转导，现代消费者不再反向依赖旧根目录。
- 重复的图片、标题、正文与返回链接 DOM 收口到 `StatusPage`；15 个旧命名保持原文本、图片 URL、Link URL、DocumentTitle、导出名和 `Status[error]` 映射。`Disconnected` 与 `ContentNeeded` 继续通过 children 保持原无图片/标题结构，不引入领域状态、请求或 Router 行为改写。
- 五条 Status 样式声明和值从 Topic Management Module 原样归入相邻 `StatusPage.module.scss`；Topic Management 不再充当跨 Route 样式仓库，CSS Module 冻结基线由 65 更新为 66，29 个主题与两处既有 `:global(...)` 指纹不变。
- `npm run check:architecture` 通过：316 个现代源码文件、1325 条 import、29 条登记 allowlist；样式守卫通过：66 个真实 CSS Module、0 个过渡 partial、29 个主题、2 个文件中的 2 处 global。modern/legacy typecheck、正式 build（4058 modules transformed）和 `git diff --check` 通过；构建只有既有 Sass、Spectrum/Lightning CSS 与大 chunk 警告。
- 浏览器、真实权限/API、默认/暗色主题及 15 个状态分支运行验收未执行；本子批不 commit、不 push，不自动实施 C1.7.2 其余候选或 C1.7.3。

#### C1.7.2 真实组件复用整批实施记录（2026-08-02）

- Collection 六类页面以 `CollectionPageShell` 复用原根节点、DocumentTitle 与内容骨架；User Center/Profile 以 `UserAreaShell` 复用页面壳层，并只在 DOM 完全一致处使用共同 loading、活动分区和默认列表 wrapper。各 Route 的请求、provider、导航、空态、分页、回顶和搜索状态机保持独立。
- Message Sender/Receiver 由共同会话条目按语义方向适配；Response/Attme wrapper 继续独立计算楼层、URL、已读文案和各自 UBB options，只复用通知 DOM。Focus/Search/Recommended 继续保留各自 URL、tag、最后回复和摘要差异，共用主题条目骨架；Home 七类栏目只复用原 main/sub 标题行。
- `UserProfile` 与 `UserProfileDetails` 因私信 URL、关注状态机、锁定提示、字段和时间格式存在真实差异而明确不合并；两套 Navigation、Collection 控制逻辑和列表请求状态机同样不为降低重复率强行统一。详细接受/否决证据见 `docs/refactor-log/c1.7/component-reuse-audit.md`。
- 首轮实施未修改 SCSS/CSS 声明；用户复核后要求新组件及 Message Center 子页面各自拥有独立 Module，属性、值和注释按真实 DOM owner 归位，CSS Module 冻结数由 66 更新为 78。29 个主题与两处 global 指纹不变。四条旧 UBB renderer allowlist 随真实 owner 合并为两条，架构登记由 29 降为 27；没有新增 legacy 能力或公开模块接口。
- Route 私有布局保留 `layout/` 目录，但不再机械嵌套 `ui/`：Focus、Message Center、User Center 与 User Profile 的 Layout、Navigation、既有 Layout Module 和 barrel 直接并列。Focus 专属导航 Module 与 `FocusLayout` 共置。用户复核后进一步要求组件样式独立：Collection/User Area/Home/Topic/Message/Notification 新组件、User Center/Profile Layout/Navigation，以及 Message Responses/Mentions/System 页面均直接导入同目录同名 Module；Message Layout 只保留自身 producer 规则，不再作为子页面样式仓库。旧页面之间尚存的 Collection/User Activity 多 importer 仍留待 C1.7.3 全量处理。
- `npm run check:architecture` 通过：327 个现代源码文件、1351 条 import、27 条登记 allowlist；style guard、modern/legacy typecheck、正式 build（4081 modules transformed）与 diff 检查通过。build 仍只有既有 Sass、Spectrum/Lightning CSS 与大 chunk 警告。
- 本地 Vite 根入口返回 200，但当前没有可连接的浏览器实例；Collection、User Center/Profile、Message、Topic item、Home 及默认/暗色主题运行验收未执行。本批不 commit、不 push，不自动进入 C1.7.3 或 Z。

#### C1.7.3 Route 样式仓库与组件 owner 共置实施记录（2026-08-02）

- 以干净的 `fe0e02fa` 为基线，将 Collection/User Activity、Board/Board List、New Topics、Editor、Login/Signin、Search、Topic、Home 与 User Profile/Settings 的 Route 样式仓库按实际 JSX producer 拆入同目录同名 Module；独立语义 owner 即使声明相同也保持独立，没有新增万能组件、class-map prop 或业务状态共享。
- 122 条基线样式边收口为 114 条：105 条活动边全部同目录同名，活动远距离导入 0、活动多 importer 0。`CC98Calendar`/`ReSignCalendar` 获得相邻 Module 但留在 legacy 目录；旧 Edit、FindIP、三份旧 Topic 管理和 ExactActivitiesPosts 的 9 条边显式冻结到 C1.7.4，不删除或伪造兼容实现。
- Board Pagination 与 New Topics Collapse 的两处 global 仅随 producer 移动，内容和指纹不变。仓库级 1383 项声明集合前后一致，已删除样式仓库中的 98 条原注释全部保留；29 个主题入口、顺序、自定义属性和静态 URL 未改。
- 样式守卫扩展到 `src`/`Components`，自动校验同目录同名、单一直接 owner、实际默认绑定、目标存在、无 Sass 聚合与无孤儿 Module；取消固定 Module 总数，新增精确冻结边清单及失效检测。守卫通过：109 个真实 Module、0 个过渡 partial、29 个主题、2 个文件中的 2 处 global、9 条冻结边。
- `npm run check:architecture` 通过：327 个现代源码文件、1343 条 import、27 条既有 allowlist；modern/legacy typecheck 通过。正式 build 在受限环境先因 `spawn EPERM` 失败，放行后修正 Search Module 的 `@use` 顺序/相对路径并重跑通过，转换 4111 个模块，仅有既有 Sass、Spectrum/Lightning CSS 与大 chunk 警告。完整证据见 `docs/refactor-log/c1.7/style-owner-audit.md`。
- 本地 Vite 根入口 `http://127.0.0.1:5173/` 返回 HTTP 200，但当前浏览器运行时没有可连接实例；Board/Board List、Collection 六类页面、User Center/Profile、New Topics、Search、Editor、Login、Daily Signin、Home、Topic、默认/暗色主题、分页/空态/加载/回顶/hover/focus、Ant Design 控件及真实登录/API/权限均未执行浏览器验收，不记为通过，也不以 build 代替。`NewTopicsBoardSidebar` 仍以自身 Module 映射查询由父页面 Module 生产的容器 class，两个哈希不会相同；后续行为修复改用父 owner 持有的 `ref` 或稳定 `id`，并同步解除子 Module 对错误祖先哈希的依赖。C1.7.3 代码与记录已提交为 `b361a4c1`、`489dff9d`，不自动进入 C1.7.4 或 Z。

#### C1.7.4 孤儿源码与样式 owner 收口实施记录（2026-08-02）

- 以干净的 `dev20260716@37dffb03` 为基线，在用户确认无仓外源码级消费者后删除旧 `Edit`、`FindIP`、三份旧 Topic 管理、`ExactActivitiesPosts` 六个零调用实现及其四份孤儿 Module；旧 Edit facade 的七组导出和 README 失效入口一并清理，活动 Editor 入口仍为 `@application/routes/editor`。
- Application Shell、Footer、Header、Search、UserMenu、Topic Vote 与赞踩激活规则已归实际 JSX producer 的同名 Module。`MainPage.scss` 只保留原 UBB/editor 规则，删除六组无 producer 的 PWA redirect；`Styles/Vote.scss` 及入口导入删除，不迁移三组休眠 Vote selector。
- Annual Review 仍使用的 8 组、共 9 个 selector 移入 `Pages/AnnualReview/AnnualReview.scss`，只允许 V1/V2 两个冻结入口显式加载并登记随 Z4 整体删除；三组无 producer 的旧 selector 删除，不恢复 Route、不迁移页面/API。`frozenInactiveImports` 清零，失效边会报错；守卫通过：110 个真实 Module、29 个主题、2 处既有第三方 global、0 条休眠 owner 边、2 条冻结 Annual 样式边。
- `npm run check:architecture` 通过：327 个现代源码文件、1348 条 import、27 条既有 allowlist；modern/legacy typecheck、正式 build 和 `git diff --check` 通过。基线/当前均为 29 个主题，自定义属性无漂移；静态 URL 差分精确等于 Annual Review 的两个背景 URL，主题 CSS 每份按预期减少 10131–10151 字节。完整证据见 `docs/refactor-log/c1.7/orphan-and-shell-style-audit.md`。
- 本地 Vite 根入口返回 HTTP 200，但当前浏览器运行时没有可连接实例；首页/非首页 Header、登录/未登录菜单、搜索、未读数、隐私头像、Footer、Shell/Error、默认/暗色主题、Topic 投票和赞踩激活状态均未执行浏览器验收。Annual Review 无 Route 且等待 Z4 删除，只验证冻结入口、legacy typecheck 与主应用产物不携带其样式。本批不修复 C1.7.3 登记的 New Topics 查询缺陷，不 commit、不 push，不自动进入 C1.7.5 或 Z。

#### C1.7.5 动态内容全局边界盘点与冻结实施记录（2026-08-02）

- 以干净的 `dev20260716@4f5f28ba` 为基线，只盘点 UBB renderer/editor、Markdown、emoji、动态 HTML、媒体和数学公式边界；`src/`、`Components/`、`Ubb/`、`Styles/`、`Pages/` 运行时文件差异为 0，没有迁址、模块化样式、兼容双写、接口或内容协议改动。
- 冻结 `UbbContainer` 的 13 条活动 import 和一条整文件注释文本边界、`UbbEditor` 的 3 个活动消费者、`MarkdownEditor` 的 2 个活动消费者，以及 63 条有序 UBB handler 注册。Math tag/text 与 Bili text 自动识别继续不注册；Topic Reply 的未使用 UBB import 和旧 `Components/Topic/Post.tsx` 只登记，不借盘点清理或恢复。
- 登记 `Site.scss` 对 `MainPage.scss`、活动 UBB Editor stylesheet 的两条加载边和零 importer `Styles/UbbEditor.scss`；同时冻结六类 emoji 格式与 `defaultEmojiType`、UBB options、Markdown `contentType` 0/1、三组草稿/上传 Storage key、Showdown/XSS 差异，以及 APlayer/DPlayer DOM 查询与清理。完整矩阵见 `docs/refactor-log/c1.7/dynamic-content-boundary-audit.md`。
- 新增动态内容清单和独立守卫并接入 `npm run check:architecture`。检查通过：327 个现代源码文件、1348 条 import、27 条既有 allowlist；110 个真实 CSS Module、29 个主题、2 处既有第三方 global；18 条直接动态内容 import 边、63 条 UBB 注册、3 份样式边界、3 组 Storage 合同与 2 组内容类型合同。modern/legacy typecheck、正式 build（4116 modules transformed）和 `git diff --check` 通过。
- 修改前后正式产物均为 9561 个文件、95 个 CSS；全产物与 CSS 聚合 SHA-256 分别保持 `ad00794f52f5482f4390c459d9db1e269e3d86a0a2b3bd3d73332f0a89b100c5`、`296f2c3c35ec94c04847422bf83eee6cab589cb382b5d42bba5595c1d3998465`，主题、静态 URL、CSS chunk、vendor 和脚本产物零漂移。
- 本地 Vite 根入口返回 HTTP 200，但浏览器连接器没有可用实例；UBB/Markdown 切换与预览、emoji、上传、草稿、动态图片、播放器、登录和真实 API 均未执行运行验收。本批不修复 New Topics 查询缺陷，不进入 C1.7.6/C1.7.7/Z2/Markdown 替换；用户审核授权后，代码与记录已分别提交为 `0cc9d51f`、`3db6030e`，未 push。

#### C1.7.6 第三方全局边界限界与登记实施记录（2026-08-02）

- 以干净的 `dev20260716@257f1b27` 为基线，将 Board Pagination quick-jumper 与 New Topics Collapse content 的两处 AntD 内部 DOM override 从业务 Module 迁入 `foundation/styles/vendors/_antd.scss`，分别由稳定 `cc98-vendor-*` 根限界；110 个真实 CSS Module 中 selector 级 `:global(...)` 收口为 0。
- New Topics Panel 自有背景/边框两条原声明解除对另一份 Module 父哈希的错误依赖，改由 Panel 直接消费的本地 class 生产；滚动监听仍保留 C1.7.3 登记的哈希查询缺陷，不在本批改逻辑。`Site.scss` 中零 producer 的 AntD Carousel/Slick 与 `antd-table` 两组休眠 override 删除。
- Spectrum 固定脚本 URL、加载顺序、palette、change/reset、replacer class 与隐藏行为不变；使用插件公开 `appendTo: 'parent'` 把动态容器限界到颜色按钮 owner，原 507 行上游样式整体置于该根，不删除或改写声明、注释、data URL 与 IE hack。AntD ConfigProvider 仍只提供 locale，Modal/Select/DatePicker/Dropdown/Popover/Tooltip/message/notification 保持默认 Portal 语义。
- React Router 保持 66 条 core import、1 条 DOM RouterProvider import 和冻结 UBB 的 3 条 DOM import；两个 NavLink consumer 均本地计算 Module class，活动源码没有 `activeClassName`/`activeStyle`，仓库没有自写 `createPortal`。完整矩阵见 `docs/refactor-log/c1.7/third-party-boundary-audit.md`。
- 新增第三方清单和守卫并接入 `npm run check:architecture`。检查通过：327 个现代源码文件、1348 条 import、27 条既有 allowlist；110 个真实 CSS Module、29 个主题、0 处业务 global；动态内容守卫保持通过；第三方守卫冻结 114 条 import 边、35 条 AntD Portal/配置 consumer 边和 2 份 vendor 样式 owner。modern/legacy typecheck 与正式 build 通过，构建仍为 4116 modules transformed，只保留既有 Sass、Spectrum/Lightning CSS 和大 chunk 警告。
- 正式产物仍为 9561 个文件、95 个 CSS；主题 CSS、Board/New Topics lazy CSS 与 UBB Editor JS 的预期 hash 变化均来自限界、休眠规则删除与 Spectrum 挂载参数，主题 key/id/顺序、静态 URL 和部署文件未改。浏览器运行时列表为空，AntD/Spectrum/Portal/默认与暗色主题/键盘/z-index/真实 API 场景均未执行运行验收；本批停在未提交工作树，不 commit、不 push，不自动进入 C1.7.7 或 Z。

#### C1.7.7 Foundation 全局边界最终收口实施记录（2026-08-02）

- 以干净的 `dev20260716@1b6a8318` 为基线，`Site.scss` 收缩为 10 条登记且有序的 Foundation 本地导入；活动 JSX 的 71 个 `row` 与 17 个 `column` 精确 token 分别改为 `cc98-row`/`cc98-column`，由 Foundation 单次加载。根 `Styles/`、三个 route compatibility partial、旧 variables/animations 路径和休眠 UBB stylesheet 已清空或删除。
- 变量复核修正后，原 `_legacy.scss` 的 14 个定义中，十个仍有活动消费者的固定语义色以原变量名集中迁入 `foundation/styles/tokens/_semantic-colors.scss`，由 13 个真实 owner 带命名空间 `@use`；只删除 `bgcolor`、`bgcolor2`、`color-board`、`color-thinBlue` 四个零 consumer 定义，原注释保留。该 token 不输出 CSS，也不改变 29 主题的八个 token/custom-properties 合同。
- Pager、Notice、Markdown 回复正文、Topic 居中容器、Board/Editor/Reply/Daily Signin/Topic Vote 按钮、三份 `board-head-information`、`displaynone` 与 fade keyframe 均归实际相邻 Module；`noticeMessageShow(id: string)` 由 Notice owner 实现并保持原入口 re-export。普通业务 Module 的 `:global(`/`global(` 为零。
- Markdown Editor 仍为当前实现，只通过公开 `className` 增加限界 vendor 根以保持原 `.button` 级联。活动 UBB renderer/editor 样式由相邻 legacy owner 直接加载，固定 class、`#color`、Topic Header 查询、声明、注释、UBB options 与行为不变，主题值改读既有 `--cc98-*`；两者登记为到 Z2 为止的精确动态内容例外，Annual Review 继续冻结到 Z4。
- 新增 Foundation 样式 manifest/checker 并接入架构检查。通过结果：327 个现代源码文件、1356 条 import、27 条 allowlist；116 个真实 CSS Module、29 个主题、0 处业务 global；18 条动态内容 import、63 条 UBB 注册、2 份 UBB 样式边界；115 条第三方 import、35 条 AntD consumer、3 份 vendor owner；12 份 Foundation 文件、10 个固定语义色、13 个 Sass importer、88 个布局 token 与 3 项冻结 legacy global。
- modern/legacy typecheck 与正式 build 均通过，构建为 4124 modules transformed。正式产物为 9563 个文件、97 个 CSS，新增两个 chunk 正是 UBB renderer/editor owner 直载；全产物/CSS 聚合 SHA-256 为 `56d7b1db62edb8de7e50a14bcbd868e4f6f51c8fff9bdecd82c9347d7f49fb7c`、`63709ae810bcadda7e8d7e0ec111611e5c58acf14658d267672d9607cabc2fc0`。29 主题入口、manifest、key/id/顺序、八个自定义属性和活动静态 URL 合同不变。
- 浏览器运行时列表为空，计划中的默认/暗色主题、页面、交互、UBB/Markdown/Spectrum、前进后退、登录与真实 API 场景均未执行；不以 build 或 HTTP 200 替代。完整 owner、删除证明、守卫与验收矩阵见 `docs/refactor-log/c1.7/foundation-style-boundary-audit.md`。本批停在未提交工作树，不 commit、不 push，不进入 Z。

Annual Review 的最终删除仍属于 Z4；C1.7 不得借整理样式提前删除业务。若 Z4 尚未实施，C1.7 只把其样式放入明确的冻结 owner，并登记“随 Z4 整体删除”，不得继续留在 `Site.scss`。UBB 实现和样式的完整迁址统一属于 Z2；C1.7.5 只登记 renderer/editor、动态 HTML、播放器、数学公式和 emoji 的当前 producer/consumer/selector 边界，不提前建立过渡 Module、全局兼容 facade 或旧 class 双写。Markdown 现有编辑/预览组件及其样式不在 C1.7 做兼容性迁移，只冻结调用点、内容格式、Storage/草稿、上传和安全边界，留待 Z 后独立整组件替换。根 `Components/` 等 legacy 源码目录的整体迁址和删除仍属于 Z；C1.7 只允许为组件边界、真实复用和样式共置所需的窄拆分，必要时让活动 legacy 组件暂时拥有相邻 Module，并登记随 Z 整体移动，不得把 C1.7 扩张为完整 legacy 逻辑迁移。

#### C1.7 验收、守卫与停点

- 每个拆分批先记录源文件中的顶层组件、props、公开导出、调用点、状态/副作用、DOM producer、样式映射和注释范围；实施后逐项证明 re-export 与调用闭包。不能用“文件变短”代替边界审核，也不能删除或改写原注释来适配拆分；
- 每个复用批必须提交调用方对照：共同 DOM/行为、保留差异、组件 API、为什么不是 coincidental similarity，以及复用前后 URL、文案、条件渲染、UBB options、事件、ID/ref 和请求状态是否一致。主代理必须逐调用方审核，不能以减少行数或 importer 数量代替；
- 每个样式 owner 批必须生成 TSX→Module→class/DOM 映射，确认活动业务 Module 只有一个直接 owner、组件与 Module 共置、其他调用方只消费组件；最终活动业务 TS/TSX 中跨两级以上目录的 Module 导入为 0，多 importer 例外清单为空或每项都有不可分割证据与删除条件；
- 休眠/孤儿删除批必须给出全仓、barrel、动态 import/require、模板、public、构建入口、行为字符串与仓外合同证据；通配 `*.module.scss` 类型声明、typecheck/build 未报错或当前 Route 未加载均不能单独证明可删除；
- 除 C1.6 的机械检查外，必须比较 `Site.scss` 编译顺序、29 主题 key/id/名称/日夜配对、主题变量、静态 URL、各 CSS chunk 和 vendor 产物；纯归位批要求声明级和级联顺序可证明等价，删除/作用域调整批逐项说明预期差分；
- 每批运行 `npm run check:architecture`、modern/legacy typecheck、正式 build、`git diff --check`，并检查新增/迁移文件的 BOM、CRLF/LF、EOF、注释和生成产物；`git diff --check` 不覆盖未跟踪文件，必须单独审计；
- 浏览器全量覆盖 Shell、Home、Board、Topic、Message、Search、Editor、User Center/Profile、Login、Signin、Ant Design、Spectrum、UBB、Markdown/emoji、默认/暗色主题、Portal、hover/focus/disabled、打印/降级和前进后退；未实际执行的场景明确保留为未验收，不以截图抽查或 build 代替；
- 最终人工审核必须逐项确认：独立导出组件一文件一个或例外已登记；活动业务 Module 单一直接 owner；远距离 Module 导入为 0；无断裂路径和未登记孤儿组件；仅登记的第三方/动态内容边界允许 `:global(...)`；根 `Styles/` 不存在；`Site.scss` 无业务 selector；Foundation manifest 与实际 selector 一致；`row`/`column` 旧名字和活动消费者为 0，布局工具只以 `cc98-row`/`cc98-column` 从 Foundation 单次全局加载；组件和 Module 共置；跨层 import 闭包、BOM/EOL/EOF、29 主题和静态 URL 合同保持；
- C1.7 完成后停止，等待用户验收和单独提交授权；不自动启动 Z。Z2/Z3/Z4 后再次运行同一守卫，确保 legacy 源码删除不会把样式重新拉回全局入口。

## 17. Z：根目录 legacy 浏览器源码收口

Z 是 C1.6、C1.7 之后的最终源码归位阶段。目标不是把根目录旧文件机械搬进 `src`，而是让每个仍保留的运行能力都落到真实 owner，并删除已经失去职责的 facade、ambient 业务声明和双编译配置。

新增本计划不等于授权实施 Z。C1.6、C1.7 仍先单独实施和验收；Z0–Z5 每批完成机械检查和主代理逐文件审核后停止，等待用户人工验收及单独提交授权，不自动进入下一批。

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
- 用户已另行授权删除旧 `/list`；`src/application/routes/legacy-board-list`、lazy Route、根 facade 与专属样式不再进入 Z，旧 `list.asp` 入口由 IIS 重定向当前 `/board`；
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

- 公开 URL、Router 参数、lazy 边界，以及旧 `list.asp` 到当前 `/board` 的 IIS 重定向；
- API URL、method、headers、body、response wire shape 和错误语义；
- Storage/IndexedDB 键、TTL、序列化格式、失效与跨标签行为；
- UBB 解析/输出语义、权限标签、内容安全、播放器、数学公式和编辑器行为；旧 DOM className 与独立全局 CSS 不作为冻结兼容合同，Z2 必须在同一批同步迁移 producer、selector 与样式 owner；
- SignalR、通知、Session、主题和缓存行为。

16 个零调用/P21 候选仍逐项做上述证明；禁止因类名陈旧、文件短或当前无静态调用而批量删除混合文件。

Z0 实施记录（2026-08-02，基线 `dev20260716@de6eca90`）：

- 以 tracked 文件和 bootstrap import 图完成 273 个根级 legacy 文件的 file map、owner map 与 consumer map；现代源码到 `@legacy/*` 共 82 条直接边，其中 27 条 Module 例外继续由 architecture allowlist 精确守卫；
- Router lazy、dynamic import/require、Vite/Template、IIS、独立 HTML、public/resource、UBB 注册与 AnnualReview 独立入口均已纳入审计；历史 16 个 P21 候选中 5 个已在 C1.7.4 删除，剩余 11 个逐项区分加载、可达与直接调用，本批不删除源码；
- URL/API/Storage/IndexedDB/UBB/Session/Notification/SignalR/主题/缓存合同已冻结；机械检查、主代理静态审核和未执行的浏览器/真实 API/权限/媒体/跨标签验收分别记录于 `docs/refactor-log/z0/`；
- Z0 只产生审计记录，不实施 Z1，不 commit、不 push；完成后停在用户人工验收与单独提交授权门禁。

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

Z1 实施记录（2026-08-02，基线 `dev20260716@2fb2a54f`）：

- 19 个 `@types/@cc98` ambient API 声明已按 Board、Topic、Post、User、Message、Daily Signin 和 Site Content owner 迁入 Module 公共入口；活动 Props/States 合同已迁入对应 Module、现有 Session `CurrentUser` 或唯一 Board Route，48 个 Z1 根级文件已删除，`States/UbbEditorState.tsx` 原样留给 Z2；
- `@cc98/api`、`@legacy/Props`、Z1 `@legacy/States`、`@legacy/Match` 活动源码引用归零，architecture allowlist 从 27 条降到 10 条 Z2 UBB 例外；modern/legacy typecheck、architecture/style/dynamic-content/third-party/foundation 守卫和 build 均通过；
- 对 19 个 ambient 文件、6 个活动 Props 文件、BoardEvent 及 AppState 活动声明的 JSDoc/行注释/块注释逐条比对，缺失为 0；六个原有 `any` 已登记，`ISignIn.lastSignInTime` 的旧合同与活动页面冲突仅记录、不猜测修复；
- 生产构建前后均为 9563 个文件，29 个主题 CSS 的内容哈希文件名和长度保持，但完整产物聚合 SHA-256 从 `72EB74312129118A9BB6F3F1A4163D1D091934A59CE4DD5F2369A16A0901C03D` 变为 `E6A2846C509366418A08BF127697FB21C6331C54016E8C37148C064E5D0BED2A`。计划要求的伪 class/构造器消除和 legacy 运行时边删除会改变 JS 模块图，故完整 JS 字节零漂移门禁未通过；未添加死 class 或兼容 import 伪造旧产物；
- 详细 source→destination、类型债务、注释审计、机械证据与未运行验收见 `docs/refactor-log/z1/`；本批未 commit、未 push、未进入 Z2，停在人工验收与产物漂移决策门禁。

### Z2：UBB 完整迁入 `modules/ubb`

将以下能力作为一个受控业务批迁入 `src/modules/ubb`：

```text
Ubb/**
Components/UbbContainer.tsx
Components/UbbEditor/**
States/UbbEditorState.tsx
现有 UBB editor/renderer 全局样式与动态 selector
```

Module 根入口只导出业务需要的 `UbbContainer`、`UbbEditor`、解析/渲染公共合同和必要扩展点；Application、其他 Module 不得深层导入 handler 或实现文件。原 `@legacy/Ubb/*`、`@legacy/Components/Ubb*` 消费者一次性切换为 `@modules/ubb`。

本批采用完整文件迁址加必要路径修正，保留：

- Handler 名称、注册顺序、动态构造和扩展能力；
- UBB 解析结果、嵌套/空标签、quote 和 URL 文本处理；
- 权限、仅楼主、回复可见、指定用户可见等访问控制；
- 图片、上传、音频、视频、Bilibili、数学公式和 sandbox 行为；
- 编辑器按钮 JSON、emoji 资源、光标/选区、预览、上传压缩和草稿交互；
- 用户内容语义、必要 DOM 关系、错误降级与内容安全边界；旧 className 字面量、独立全局 UBB CSS 文件名和 selector 名不要求兼容。

UBB 样式随实现一次性收口：Editor、Container、renderer 及具备独立 DOM 的 Handler 各自直接导入相邻同名 Module；只共享值时使用 CSS 自定义属性，不建立新的独立全局 UBB 业务样式表。动态插入 HTML、DPlayer/APlayer、数学公式等无法由 React producer 映射的 selector 必须由最近的局部根限界并逐项登记。迁移时同步修改 JSX、动态模板、DOM 查询和 `classList`；不保留旧全局 class 双写或兼容 facade。

不在本批现代化 Handler class、改写解析算法、修改公开扩展 API 或顺手修复已知 UBB 缺陷。机械检查通过后仍必须单独记录浏览器 UBB/editor/media/permission 验收；未执行不得记为通过。

### Z3：Pages、Components 和根级适配器归真实 owner

按消费者闭包处理剩余根级源码：

- `Pages/` 中非 AnnualReview facade 的调用方改到现有 Application Route 公共入口；旧 `/list` 实现已按用户授权提前完成整链删除；
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

### Z 后续独立批：Markdown 组件整体替换

现有 Markdown 编辑器、预览 renderer 及其全局 class/CSS 不做逐条 Module 化或旧 selector 兼容迁移；C1 与 Z 只保证它们在整体替换前仍可构建，并冻结真实调用点、输入输出内容格式、草稿/Storage、上传、emoji、数学公式、内容安全和与 UBB 编辑模式切换的边界。

整体替换必须另行选型、设计和授权，可以替换组件库、DOM、className、CSS 和交互实现，不保留旧 Markdown 样式 facade 或双写 class。验收以内容往返不丢失、编辑/预览、粘贴与上传、草稿恢复、模式切换、主题、快捷键、滚动和安全过滤为准；未经该独立批授权，C1.7、Z2 或 Z3 均不得顺手重构现有 Markdown 实现。

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

骨架和本计划确认后，F1-A、F1-B、F1-C、F1-D、A1、M1、M2、A2.1–A2.11、M3.1–M3.6、S1.1–S1.3、S1.4 六组、S1.5、S1.6、S1.7、C1.1–C1.6 与 C1.7.1–C1.7.7 均已完成代码实施、机械检查和主代理人工代码审核；C1.7.1、Legacy Board 删除和 Status 子批已提交为 `f11fe1e7`/`99a8679e`，C1.7.2 其余真实组件复用已提交为 `52b4bc77`/`fe0e02fa`，C1.7.3 样式 owner 共置已提交为 `b361a4c1`/`489dff9d`，C1.7.4 已提交为 `4f5f28ba`，C1.7.5 代码与记录已提交为 `0cc9d51f`/`3db6030e`，C1.7.6 代码与记录已提交为 `3e3a65e1`/`1b6a8318`；C1.7.7 代码与守卫已本地提交为 `30b150ce`，记录随本批单独提交。浏览器运行时无可用实例，C1.7.7 运行验收未执行；New Topics 跨 Module DOM 查询/祖先哈希问题仍登记为后续修复；当前不自动进入 Z。

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
9. C1.5 后先新增 C1.6、C1.7：业务组件样式必须与 producer 共置，`src/application`/`src/modules` 的业务 global 清零；仅第三方和动态内容的精确限界允许登记后的 `:global(...)`。reset、应用根、主题变量及跨业务布局工具等真正全局能力集中到 Foundation；`row`/`column` 不复制进业务 Module，统一命名空间化为 `cc98-row`/`cc98-column` 并单次全局加载。完成后再进入 Z0–Z5，浏览器业务源码终态只位于 `src/application`、`src/modules` 和 `src/foundation`；
10. AnnualReview 完整移除，不恢复 Route、不建立新 Application 或空兼容 Module；
11. UBB 功能保留并完整迁入 `src/modules/ubb`，迁址阶段不改写解析器、Handler 体系或扩展合同；Editor、Container、renderer 与独立 DOM Handler 各自携带相邻 Module，不建立长期全局 UBB 业务样式表，也不兼容旧 className/CSS selector；
12. `@types/@cc98` 业务声明按真实业务 owner 迁入各 Module，不把 ambient `@cc98/api` 聚合搬入 Foundation；
13. 纯数据 class 优先改为 `interface`，联合/组合类型使用 `type`，只有存在真实运行时身份、继承、方法或生命周期的对象保留 `class`；
14. 类型搬移必须保留全部原始注释；没有明确类型且缺少唯一证据的字段先显式写成 `any`、登记类型债务，后续通过独立类型查明批次收窄。
15. 旧 `/list` Legacy Board 不再保留；删除 Route、owner、根 facade 和专属样式，旧 `list.asp` 链接重定向当前 `/board`；
16. 现有 Markdown 编辑/预览组件后续整体替换；当前 C1/Z 不做逐条样式模块化或旧 class 兼容，替换批可改变组件库、DOM 和 CSS，但必须单独验证内容格式、草稿/Storage、上传、emoji/数学公式、模式切换和内容安全。

后续仍需单独授权或审核：

1. S1.1–S1.3、S1.4 六组、S1.5、S1.6 与 S1.7 尚未执行的完整浏览器、登录、真实 API、SignalR、跨标签、缓存与草稿运行验收，C1.1–C1.7.7 的浏览器样式/行为验收，C1.7.7 的提交授权，以及后续每个 Z 子批的代码实施授权；
2. 当前 `useUserProfileContext` 接口及 UserProfileLayout 集中取数边界是否随资料缓存归位或 Redux 闭包再次调整；
3. A2.3–A2.11 与 M3.1–M3.6 尚未执行的浏览器、登录、真实 API、权限、分页、SignalR、通知权限、上传、编辑器、缓存与 UBB 运行验收；
4. UBB 迁入 `modules/ubb` 后的浏览器、权限标签、编辑器、媒体、数学公式和扩展 API 人工验收；
5. Z 后 Markdown 组件整体替换的选型、实施授权及内容往返、草稿、上传、主题、快捷键和安全验收。
