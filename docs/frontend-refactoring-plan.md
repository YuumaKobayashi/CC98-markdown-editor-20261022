# CC98 前端目录重构执行计划

> 状态：R0、R1、F1-A、F1-B、F1-C、F1-D、A1、M1、M2、A2.1、A2.2 均已完成；A2.3–A2.11 的代码实施、机械检查和主代理人工代码审核均已完成，A 阶段完成。浏览器、登录、真实 API、权限与 UBB 运行验收未执行；当前停在 M3 前，M3 未获授权。
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
```

### 当前停点：A 阶段已完成，停在 M3 前；M3 未获授权

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

这一步在目录迁址和 API owner 稳定后执行。

### S1.1 Store 结构

```text
application/store
```

只拥有：

- `configureStore`；
- reducer 注册；
- middleware 组合；
- typed hooks；
- AppDispatch/RootState。

业务 slice、action、selector 归对应 Module。

### S1.2 Session

```text
modules/session/model
modules/session/persistence
modules/session/sync
```

统一：

- token；
- 当前用户；
- refresh；
- 登录状态；
- 跨标签页事件。

Header 与 User Center 只消费 Session，不自行读取多套当前用户真相源。

### S1.3 用户资料缓存

```text
modules/user/cache
```

明确：

```text
对象        公共 UserInfo
键          ID/用户名
TTL         当前 3600 秒
介质        Foundation Storage
失效条件    用户资料修改、头像修改等
```

### S1.4 其他领域缓存

```text
modules/board/cache          boardsInfo
modules/topic/cache          tagInfo
modules/daily-signin/cache   当日签到
```

### S1.5 用户偏好

```text
modules/user-preference/persistence
```

包括：

- 主题；
- Topic 浏览模式；
- 通知设置；
- Emoji 分类；
- TopicCard 用户信息显隐。

### S1.6 草稿

```text
modules/posting/drafts
```

接管：

- 回复草稿；
- 发帖失败缓存；
- Editor 内容恢复。

不在本批擅自改键或失效时机。

### S1.7 页面状态

继续位于 Application：

- 路由参数；
- 筛选；
- 当前页；
- tab；
- 页面滚动；
- 页面聚合 loading/error；
- Home/New Topics/Focus 页面私有缓存。

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

骨架和本计划确认后，F1-A、F1-B、F1-C、F1-D、A1、M1、M2、A2.1、A2.2 均已完成；A2.3–A2.11 已完成代码实施、机械检查和主代理人工代码审核，A 阶段完成。浏览器、登录、真实 API、权限与 UBB 运行验收未执行，旧 `/list` 仍仅适用既有免检结论。当前停在 M3 前，M3 未获授权。

## 22. 已确认决策与后续边界

已经确认：

1. 采用 `2a69a0f0` 作为重新迁移基点；
2. 在当前目录直接回退，不创建 worktree；
3. 丢弃 D1/D2 迁移结果，不保留只读对照；
4. 第一轮只建骨架、alias 和检查脚本，不迁业务文件；
5. M1 使用五个 Module 根入口，并接受已记录的共享 chunk 重组；
6. 未经用户要求，不 commit、不 push。

后续仍需单独授权或审核：

1. M3 混合 Service 合同拆分的实施授权与逐批边界；
2. A2.3–A2.11 尚未执行的浏览器、登录、真实 API、权限、分页、编辑器与 UBB 运行验收；
3. 旧 `/list` 免检边界是否继续保留；
4. AnnualReview 与 UBB 是否继续冻结。
