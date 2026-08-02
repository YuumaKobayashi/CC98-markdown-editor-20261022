# C1.7.2 真实组件复用审计

## 基线与边界

- 实施基线为干净的 `99a8679e`；C1.7.1、Legacy Board 删除与 Status 共同骨架已经提交，本批只处理其余 C1.7.2 候选。
- 只在至少两个活动消费者拥有相同 DOM 骨架、交互语义和变化方向时建立共享组件；请求、Redux/Storage、Router、URL、计时器、UBB、权限、业务状态机、文案、样式声明和原注释不改。
- 本批不修改既有 SCSS/CSS 的属性、值和注释；用户复核后补充组件样式所有权收口：每个本批新提取且使用局部样式的组件改为直接导入同目录同名 Module，不再借用另一组件或 Route 的 Module。仍存在于旧页面之间的多 importer 和远距离 Module 由 C1.7.3 按真实 producer 收口。

## 接受的复用边界

| 共同 owner | 活动消费者与保真合同 |
| --- | --- |
| `CollectionPageShell` | Focus、New Topics、Recommended Topics、Topic/Board Search、Hot Topic 共用原 `focus-root`、`DocumentTitle` 与 `focus` DOM；Board Search 仅通过 `afterContent` 保留无结果节点的原 sibling 位置 |
| `UserAreaShell` | User Center 与 User Profile 只共用页面根、标题和 body 外壳；navigation/router 仍由各 Route 放在原位置，Profile loading 与 loaded provider 的分支、上下文范围和 DOM 顺序不变 |
| `UserAreaLoading`、`UserActivitySection`、`UserActivityList` | 只替换完全一致的 spinner、活动标题和默认列表 wrapper；带特殊 inline style、操作区、空态和分页状态机的差异继续留在调用方 |
| `MessageConversationItem` | `MessageSender`/`MessageReceiver` 保留旧导出和 props，只用 `sender`/`receiver` 语义方向选择原 class；头像、动态 ID、时间、UBB 与链接不变 |
| `MessageResponseItem` | `MessageResponsebox`/`MessageAttmebox` 继续独立计算楼层、URL、已读文案和既有差异，只复用版面、日期和正文 DOM；各自 UBB options 的属性和值保持 |
| `TopicCollectionItem` | Focus/Search/Recommended 保留各自 topic URL、tag DOM、最后回复与摘要差异，共用作者、标题、版面和中栏骨架；旧三个公开导出与 legacy facade 不变 |
| `HomeSectionHeader` | 七类 Home 栏目继续按 `main`/`sub` 使用原主题 class，标题、喇叭图标、附加链接顺序、URL 与 `target` 不变 |

## 明确拒绝的伪复用

- `UserProfile` 与 `UserProfileDetails` 不合并：私信 URL、关注/取关状态机、锁定提示、字段集合、注册时间格式和 DOM 结构均不同，统一会引入大量 boolean 或行为插槽。
- User Center/Profile 两套 Navigation 不合并：路由集合、权限、滚动按钮和 active 计算不同；只复用外层页面骨架。
- Collection 内部的刷新、加载、回顶、搜索无结果逻辑和 User Activity 各请求/分页状态机不进入共享组件；仅 CSS 相似不构成 React 复用理由。
- `RecommendedTopicItem` 的摘要 class 已归入其同名 Module；User Activity 特殊空态及现有旧页面之间的 Collection/User Activity 多 importer 暂时保留，交给 C1.7.3 的样式 producer 拆分，不为本批制造 class-map prop 或万能 variant。

## 依赖、样式与兼容闭包

- Message/Notification 的四条旧 UBB renderer allowlist 随真实 DOM owner 合并为 `MessageConversationItem` 与 `MessageResponseItem` 两条；两条 wrapper 自有 compatibility-mode 依赖保持，allowlist 总数由 29 降为 27，没有新增 legacy 能力。
- `TopicCollectionItem` 使用最小结构类型，不为 `@legacy/Props/FocusTopic` 新增架构例外；模块公开 barrel 仍只导出原 Focus/Search/Recommended 名称。
- 新组件与 Message Center 子页面的独立样式 owner 补充完成后共有 78 个 CSS Module；29 个主题、两处已登记 `:global(...)` 及其指纹不变。冻结基线只更新阶段名称与经授权新增的 Module 数量。
- Route 私有布局统一保留 `layout/` 目录，但移除重复的 `layout/ui/` 层：Focus、Message Center、User Center 与 User Profile 的 Layout、Navigation、既有 Layout Module 和 barrel 直接在 `layout/` 下并列。Focus 专属导航 Module 随 `FocusLayout` 移入同目录；Message Layout Module 与组件同步上移，随后将并非 Layout producer 的 Responses、Mentions、System 页面规则归还各页面同名 Module。User Center/Profile 的 Layout 与 Navigation 各自拥有同目录同名 Module，不再跨 Route 借用 `application/layouts/user-area` 的 Module。
- `CollectionPageShell`、`UserAreaShell`、`UserAreaLoading`、`UserActivitySection`、`UserActivityList`、`HomeSectionHeader`、`TopicCollectionItem`、`RecommendedTopicItem` 以及四个 User Route Layout/Navigation 均已建立独立样式 owner；`MessageConversationItem`、`MessageResponseItem` 原本已经符合该约束。为解除父 Module 的局部 class 哈希依赖，Collection 的回顶/加载规则保持原 specificity 后改为独立 selector；User Area 的 shell、navigation、router、loading 声明按真实 DOM owner 拆分，属性、值及注释保持。
- `MessageResponsesPage`、`MessageMentionsPage`、`MessageSystemPage` 各自拥有同目录同名 Module；三页自己渲染的右栏、内容区和分页 wrapper 不再向上导入 `MessageLayout.module.scss`。相同声明按独立页面 owner 保留，不仅凭 CSS 雷同制造无 DOM owner 的共享 Module。

## 审核与验证

- `npm run check:architecture` 通过：327 个现代源码文件、1351 条 import、27 条登记 allowlist；样式守卫通过：78 个真实 CSS Module、0 个过渡 partial、29 个主题、2 个文件中的 2 处 global。
- modern 与 legacy typecheck 通过；正式 build 在样式 owner 收口后重跑成功，转换 4081 个模块，只有既有 Sass、Spectrum/Lightning CSS 与大 chunk 警告。
- 本地 Vite 根入口返回 200；当前会话没有可连接的浏览器实例，Collection、User Center/Profile、Message、Topic item、Home 及默认/暗色主题的浏览器运行验收均未执行，不能以机械检查替代。
- 本批完成后停在未提交工作树，不 commit、不 push，不自动进入 C1.7.3 或 Z。
