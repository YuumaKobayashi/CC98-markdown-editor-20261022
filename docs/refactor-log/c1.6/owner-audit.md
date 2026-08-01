# C1.6.5 全仓样式所有权收口审计

## 基线与范围

- 实施基线：`c1a31770` 干净工作树；本批只整改样式所有权、休眠规则和公告展示复用，不修改 Route、业务 props、Redux、Storage、API、权限、URL、固定行为 ID、jQuery 查询、UBB/Markdown 输出、DOM 文案或主题合同。
- 审计范围：`src`、legacy `Components`、`public`、构建入口和当前生产产物。逐项核对 CSS Module importer、局部映射 consumer、DOM producer、固定/动态 class 与 ID、Route 可达性及第三方生成 DOM。
- 文件大小和重复声明只作为审计信号：超过 300 行或覆盖三个以上 producer 的文件必须有唯一语义 owner，否则拆分；视觉相同但生命周期和 producer 不同的独立组件不为合并 CSS 扩大 props、slot 或职责。

## 实施结果

- `TopicDetail.module.scss` 删除 27 处无活动 producer 的休眠业务 `:global(...)` 及未消费局部规则，只保留 `TopicReplyContent` 实际消费的正文和 Markdown 表格样式。
- 全仓删除 16 个 Module 中 37 个无映射 consumer 的局部 class；没有为休眠样式制造 DOM、空属性或保活 import。最终静态映射扫描未发现活动无 consumer 的局部规则。
- Home 按页面框架、推荐阅读、主题条目、常用功能、特殊入口、广告轮播和统计区拆为相邻 owner Module；原 `Home.module.scss` 只保留仍由多个 Home producer 共用的标题视觉约定。
- Focus 专属导航保留在 Route Module；Focus、New Topics、Search、Recommended/Hot Topic 的真实跨 Route 页面框架、滚动状态和内容列表编排归入 `application/layouts/collection/CollectionLayout.module.scss`。
- User Center/Profile 的共同壳层、导航、加载与内容区归入 `application/layouts/user-area/UserArea.module.scss`；活动列表归入 `UserActivityLayout.module.scss`；设置、转账、自定义版面和主题页规则归相邻 Route Module。原 527 行混合 owner 与导航标签附属文件删除。
- 新增 `@modules/site-content` 公共接口 `SiteAnnouncementPreview({ content: string })`，Home 的 `Announcement`、`AnnouncementComponent` 与站点管理公告编辑器复用同一展示 owner；两个 Home 导出的空值返回行为和原 JSX 注释保持。
- 样式守卫冻结 71 个真实 CSS Module 和两处 selector 级 global，并新增“Application Route 不得导入另一 Route 的 CSS Module”检查；Application layout owner 仍可被多个 Route 显式消费。

## 最终 owner 与边界

- 大文件审计：最终没有超过 300 行的 `*.module.scss`；没有覆盖三个以上不相关 producer 且未解释的混合 owner。
- 跨 Route 样式依赖：0。共享布局只能从命名明确的 `application/layouts` 进入，Route 不再反向导入另一 Route 的样式。
- `rg ':global\(' src` 只剩两处，均保持原局部根限界、specificity 和声明值：
  - `Board.module.scss`：Ant Design Pagination quick-jumper 的 `.ant-pagination-options-quick-jumper`；
  - `NewTopics.module.scss`：Ant Design Collapse 的 `.ant-collapse-content-box`。
- 两处均为第三方动态 DOM 边界，本仓没有按该 class 执行行为查询；C1.6.5 只登记并冻结，最终零 `:global(...)` 迁移属于 C1.7。

## 同名与同声明规则审核

- 删除没有 producer/consumer 的偶然重复和休眠声明；没有发现需要继续由多个 Route 大 owner 共同持有的相同规则。
- User Recent Post/Topic/Favorite 条目、Message sender/receiver、签名、标签/时间元数据等独立组件保留少量相同视觉声明。它们的 DOM producer、加载生命周期和语义 owner 不同；逐组件直接消费自己的 Module，不合并为扩大职责的公共组件或样式 slot。
- User Activity 中为保持旧选择器权重而保留的重复局部根仅用于 specificity 等价，不是跨 owner 重复，也不改变声明值或后代关系。

## 验证证据

- `npm run check:architecture` 通过：309 个源码文件、1331 个 import、29 条登记 allowlist；样式守卫通过：71 个真实 CSS Module、0 个过渡 partial、29 个主题、2 个文件中的 2 处 global。
- modern 与 legacy typecheck 均通过；`npm run build` 首次在受限环境因 Vite 子进程 `spawn EPERM` 失败，同一命令在允许子进程的环境重跑通过，转换 4058 个模块，只有既有 Sass `@import`、Spectrum/Lightning CSS 和大 chunk 警告。
- 构建前后 29 个主题 CSS、APlayer 及 vendor CSS 的文件名、长度和 SHA-256 全部逐字节不变；`dist` 没有工作树污染。业务 CSS 差异限定在休眠规则删除和 Home、Collection、User、Site Content owner/chunk 重组。
- `git diff --check`、未跟踪文件、生成物、BOM、行尾和 EOF 在最终工作树复核；新增文件遵循相邻 owner 约定。

## 运行验收边界与停点

- 浏览器连接器在本批没有可用运行实例，因此 Home/公告预览、Focus、New Topics、Search、Recommended/Hot Topic、User Center/Profile、Topic 正文和 Board quick-jumper 的默认/暗色主题、直接进入、前进后退、加载/空/错、hover/focus/disabled、响应式及 Collapse/分页交互均明确为未运行验收。
- 登录、真实 API、权限和第三方运行时状态同样未运行；机械检查与代码审核不替代这些场景。
- 本批停在未提交工作树，不 commit、不 push，不自动进入 C1.7 或 Z，等待单独运行验收与提交授权。
