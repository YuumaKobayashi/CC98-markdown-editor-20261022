# C1.7.3 Route 样式仓库与组件 owner 共置审计

## 基线与边界

- 实施基线为干净的 `fe0e02fa`；C1.7.2 代码与记录已经分别提交为 `52b4bc77`、`fe0e02fa`。本批不改请求、Redux/Storage、Router、URL、权限、ID/ref、jQuery、计时器、文案、DOM、公开 props/export 或原业务注释。
- 基线精确扫描到 122 条 TS/TSX→CSS Module 边、15 份多 importer Module 和 36 条跨至少两级目录的导入。处理对象只限活动样式 owner；孤儿/休眠源码的删除证明仍属于 C1.7.4。
- 样式按组件实际消费的映射键及 DOM producer 拆分；独立 owner 视觉相同时保留等价声明，不建立万能 React 组件、class-map prop 或新的横向业务样式库。

## 样式 owner 收口

| 原样式仓库 | 归位结果 |
| --- | --- |
| `CollectionLayout` | Focus Board/Topic、New Topics、Recommended、Board/Topic Search 与 Hot Topic 分别直接消费同目录同名 Module；共同页面壳仍由既有 `CollectionPageShell` 持有 |
| `UserActivityLayout` | User Center/Profile 的 overview、history、favorites、posts/topics、fans/followings 与最近主题列表各自持有页面规则；既有 `UserActivityList/Section` 继续只持有其真实共同 DOM |
| Board、Board List、New Topics | 页面、Header、列表、条目、工具栏、预览、分页、侧栏和推荐区按 producer 拆分；Ant Pagination 与 Collapse 的两处 global 随真实根节点移动 |
| Editor、Login、Daily Signin | Editor 页面和三个独立子组件、Login 页面、Daily Signin 页面及两个活动 Calendar legacy 组件分别拥有同名 Module；逻辑与兼容入口不迁址 |
| Topic、Search、Home | Topic Header/Award/Reply Content、两类 Search 页面、Home 热门与主列表各自持有规则；同一 TSX 原先导入的多份 Module 合并为其同名 owner |
| User Profile/Settings | Profile 管理子组件、Overview/Details/Recent Topics、Settings、Theme 与 Favorite Board 规则按实际 JSX owner 拆分；Profile 两套不同语义实现继续独立 |

- 结束扫描共有 114 条样式导入边，其中 105 条为活动边：活动远距离导入 0、非同目录同名 owner 0、活动多 importer Module 0。
- `CC98Calendar` 与 `ReSignCalendar` 暂留根 `Components/`，但已分别直接消费相邻同名 Module；组件与样式在 Z 阶段再整体迁址。
- 六个无活动调用点的旧组件保留 9 条冻结导入边，登记于 `scripts/style-owner-freeze.json`：旧 Edit、FindIP、三份旧 Topic 管理实现及 ExactActivitiesPosts。对应五类旧样式依赖不在本批删除；其中 ExactActivitiesPosts 原本即引用不存在路径，继续冻结到 C1.7.4，不伪造空 Module。

## 声明、global 与守卫

- 删除失去活动消费者的 Route 样式仓库后共有 109 份真实 CSS Module（含两个根 legacy 组件 Module）。仓库级声明集合迁移前后均为 1383 项，没有新增或遗漏属性/值；已删除文件中的 98 条注释逐条仍可在新 owner 中找到。
- Board quick-jumper 的 `:global(.ant-pagination-options-quick-jumper)` 移至 `BoardContent.module.scss`，New Topics Collapse 的 `:global(.ant-collapse-content-box)` 移至 `NewTopicsBoardSidebar.module.scss`；两处 selector 内容与 SHA-256 指纹不变，继续交给 C1.7.6。
- 跨组件祖先 selector 不保留对另一 Module 哈希的依赖：New Topics Sidebar 和 Profile 管理子组件以重复本地根 class 保持原 specificity；没有新增公开样式 prop 或全局 class。
- `check-style-migration.mjs` 现自动扫描 `src` 与 `Components`，验证导入目标、默认绑定消费、同目录同名 owner、单一直接 owner、无 Sass 聚合和无孤儿 Module；固定 CSS Module 总数已移除。只有冻结清单中的精确 source→Module 边可以暂时绕过共置/存在性检查，失效登记会使守卫失败。

## CSS chunk 重组登记

- 使用同一依赖树分别构建 `fe0e02fa` 与本批工作树：基线转换 4081 个模块、生成 68 份 CSS chunk；当前转换 4111 个模块、生成 74 份 CSS chunk。52 份同名产物 SHA-256 完全一致，其中包含全部 29 个主题；不存在“同名但内容哈希变化”的产物。
- 基线退出的 16 份 chunk 为：`board-B6l0tfiU.css`、`board-list-DrN-Cl-D.css`、`CollectionLayout-CUjk8PCV.css`、`daily-signin-xbPLRO4I.css`、`detail-wnSADKTY.css`、`editor-BC4bt91A.css`、`favorites-BdwFlCof.css`、`login-BA5EpstW.css`、`main-CJl_p-qy.css`、`manage-CJnvbgZS.css`、`new-topics-Cy02eFWx.css`、`Search-Dd7F22zo.css`、`settings-ChMMSwCU.css`、`theme-JvI1TzEk.css`、`topic-ic-LKhJz.css`、`UserActivityLayout-B-aUd9Sf.css`。
- 当前新增的 22 份 chunk 为：`board-BTYAnBpT.css`、`board-Iwkk8B-N.css`、`board-list-C0mjP5wh.css`、`daily-signin-BnDef_HM.css`、`detail-BBmm2Z3l.css`、`editor-C-8SN-KM.css`、`favorites-nk31szAB.css`、`focus-BE7vnpf5.css`、`history-ChxqqNC-.css`、`HotTopicPage-DhTYdCo0.css`、`login-BRegIiV4.css`、`main-D47yrFZz.css`、`manage-Na_z_fCc.css`、`my-fans-B-QQqCUa.css`、`new-topics-rht4B-2F.css`、`overview-B7pILrTz.css`、`overview-Dw6Wl2iW.css`、`recommended-topics-ANds2cKf.css`、`settings-pDAkP-xS.css`、`theme-BLrtg6iN.css`、`topic-CpqLAgsx.css`、`topic-mNHEeNwr.css`。
- CSS 总字节数由 18,212,833 增至 18,221,165（+8,332）；这是独立 owner 等价声明副本及 Route 拆 chunk 的预期结果。仓库级声明集合、两处 global 指纹和 29 个主题 SHA-256 均未漂移。

## 验证与停点

- `npm run check:architecture` 通过：327 个现代源码文件、1343 条 import、27 条既有 allowlist；样式守卫通过：109 个真实 CSS Module、0 个过渡 partial、29 个主题、2 个文件中的 2 处 global、9 条冻结休眠边。
- modern/legacy typecheck 均通过。正式 build 首次在受限环境因 Vite 子进程 `spawn EPERM` 失败；放行后发现并修正两份 Search Module 的 Sass `@use` 顺序与相对路径，重跑通过，转换 4111 个模块，仅保留既有 Sass、Spectrum/Lightning CSS 与大 chunk 警告。
- `git diff --check` 通过；55 个修改 TSX 在归一化 CSS Module import 与 binding 后逐文件一致，没有非样式逻辑差异。全部新增/修改文本文件统一为无 BOM 的 CRLF、恰好一个 EOF newline；未跟踪文件另行纳入检查，新增尾随空白与替换字符均为 0，`CC98Calendar.tsx` 的两处既有尾随空白原样保留；`dist` 仍为忽略产物，未进入工作树清单。
- 本地 Vite 根入口 `http://127.0.0.1:5173/` 返回 HTTP 200，但当前浏览器运行时没有可连接实例；Board/Board List、Collection 六类页面、User Center/Profile、New Topics、Search、Editor、Login、Daily Signin、Home、Topic、默认/暗色主题、分页/空态/加载/回顶/hover/focus、Ant Design 控件及真实登录/API/权限均未执行浏览器验收，不记为通过，也不以 build 代替。
- 本批停止在未提交工作树，不 commit、不 push，不自动进入 C1.7.4、其余 C1.7 或 Z。
