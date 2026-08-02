# C1.7.7 Foundation 全局边界最终收口审计

实施日期：2026-08-02
实施基线：干净的 `dev20260716@1b6a8318`
本地代码/守卫提交：`30b150ce`；本文档随 C1.7.7 记录单独提交；不 push、不进入 Z。

## 1. 范围与不变量

本批只收口活动样式 producer/consumer 和 Foundation 全局入口，不改变公开 React props、TypeScript 类型、API、URL、Router、Redux/Storage、UBB options、固定 ID/ref、文案或请求时序。C1.7.3 登记的 New Topics 查询缺陷、Z2 UBB 整体迁移、Markdown 实现替换和 Z4 Annual Review 删除均未进入本批。

`build/theme-manifest.cjs`、29 个主题入口、tokens 与 custom-properties 文件相对基线零差分；主题继续以 token → custom-properties → `Site.scss` 的顺序编译，key/id/顺序及八个 `--cc98-*` 合同不变。活动 UBB 固定 class、`#color`、Topic Header DOM 查询、声明、注释和 renderer/editor 行为保持。

## 2. Foundation 入口与 owner 映射

`src/foundation/styles/Site.scss` 已缩为 10 条有序本地导入，不含 selector，也不反向导入 legacy 目录。其唯一允许内容由 `scripts/foundation-style-boundary.json` 冻结：Spectrum、AntD、Markdown Editor 限界 vendor，document/reset/root，以及 `cc98-row`/`cc98-column`、link/list 等布局和文档原语。固定语义色不经 `Site.scss` 聚合，而由无 CSS 输出的 `styles/tokens/_semantic-colors.scss` 供登记 owner 编译期消费。

| 原全局职责 | 最终 owner | 消费与作用域 |
| --- | --- | --- |
| `.row` / `.column` | `foundation/styles/base/_layout.scss` | 活动 TSX 精确 token 分别改为 71 个 `cc98-row` 与 17 个 `cc98-column`；注释和子串不改 |
| Pager | `foundation/ui/pagination/Pager.module.scss` | `Pager.tsx` 直接映射消费 |
| Notice 与 `fadeOut` | `foundation/ui/feedback/NoticeMessage.module.scss` | `noticeMessageShow(id: string)` 移入 Notice owner，并继续从原 notification barrel/re-export 导出 |
| Markdown 回复正文 | `TopicReplyContent.module.scss` | 由回复内容根限界原 preview 子元素声明 |
| Topic 居中容器 | TopicPage、TopicReplyList、TrackedTopicPage 相邻 Module | 各 owner 独立映射 |
| Editor、Reply、Daily Signin、Board、Topic Vote 按钮 | 各相邻同名 Module | 原 button/blue/grey/post button 声明按真实消费者局部化 |
| `board-head-information` | BoardAnnouncement、UserProfile、UserProfileDetails 各自 Module | 三份业务 owner 独立保留，不建立共享业务样式 |
| `displaynone` | SearchTopicItem、NewTopics、Focus、BoardModeration 各自 Module | 不再保留跨业务全局工具类 |
| `fadeIn` / `fadeOut` | NewTopics、Focus、TopicSearch、UserCenterNavigation 与 Notice Module | 每个消费者拥有本地 keyframe，业务 Module 的值级 `global(...)` 为零 |
| 十个固定语义色 | `foundation/styles/tokens/_semantic-colors.scss` | 13 个 Sass owner 以 `semanticColors.$color-*` 显式消费；不再分散为字面量 |

Markdown 编辑器仍使用当前 `react-markdown-editor-lite`。组件公开 `className` 增加稳定根 `cc98-vendor-markdown-editor`，原 `.button` 级联效果只在该根内保留；import、根和声明由第三方边界清单登记，未替换实现。

修正复核确认，原 `_legacy.scss` 的 14 个实际定义并非全部失效：`color-body`、`color-thinBlack`、`color-border`、`color-focus`、`color-gray`、`color-post`、`color-red`、`color-black`、`color-url`、`color-urlVisited` 共十个仍有活动消费者，现以原变量名集中迁入语义色 token；只有 `bgcolor`、`bgcolor2`、`color-board`、`color-thinBlue` 四个零 consumer 定义删除。原 `// $color-bg: #79b8ca;` 注释保留。`MessageSystembox` 原 import 没有实际变量消费，因此不恢复空依赖。

## 3. UBB 动态内容例外

活动 renderer 样式从 `Styles/MainPage.scss` 与 `Site.scss` 归入 `Components/UbbContainer.scss`，由 `UbbContainer.tsx` 直接加载；活动 editor 样式从 `Components/UbbEditor/stylesheet.scss` 归入 `Components/UbbEditor/components/UbbEditor.scss`，由 editor owner 直接加载。仅把主题 Sass 值改读对应既有 `--cc98-*`，动态生成 class、`#color`、选择器、声明和行为不变。

这两份 global stylesheet 与冻结的 `Pages/AnnualReview/AnnualReview.scss` 是最终守卫允许的三项 legacy global 边界。前两项随 Z2 整体迁移删除，Annual Review 随 Z4 删除；本批没有迁移 UBB 逻辑或删除 Annual Review。

根 `Styles/`、三个 route compatibility partial、旧 `_legacy.scss` 路径和 Foundation `_animations.scss` 已无文件。仍在使用的十个定义已归明确 token owner，只有四个零 consumer 定义删除。`Styles/UbbEditor.scss` 本来零 importer，现与其余休眠规则一起删除。

## 4. 零 producer 删除证明

删除前后均以源码、TSX class/id producer、style importer 和构建输入联合搜索，结论如下：

| 删除集合 | 零 producer 证据 |
| --- | --- |
| 旧 React MDE/DraftJS：`.react-mde`、`.mde-*`、`.DraftEditor-*`、`.cc98reactmde` | 活动实现是 `react-markdown-editor-lite`；源码无对应 DOM class。仅保留的 `react-mde-*` 是已冻结 Storage key，不是 selector producer |
| React Bootstrap：`.react-bootstrap-*` | 活动 TSX 无对应 class，源码无 importer/组件 producer |
| `.popup` / `.popup_title` | 活动 TSX 无对应 class；其 `/images/headerBackground.jpg` 只属于该零 producer 规则 |
| `#tagButton`、`.follow`、`.followuser`、旧 orange/green 按钮颜色 | 活动 TSX 无精确 id/class producer；当前同名单词只存在于局部 Module 哈希或普通变量/子串中 |
| `.signature iframe` 的旧全局副本 | 活动签名样式已有 TopicReplySignature/ConfigSignature 本地 owner，无该全局 producer 合同 |
| route compatibility、四个零 consumer Sass 定义、休眠 `Styles/UbbEditor.scss` | importer/变量 consumer 为零；最终 guard 禁止旧路径或未登记定义重新出现 |

## 5. 自动守卫

新增 `scripts/foundation-style-boundary.json` 与 `scripts/check-foundation-style-boundary.mjs` 并接入 `npm run check:architecture`。检查会阻止：

- `Site.scss` 出现非登记、乱序或非本地导入，以及反向 legacy import；
- 根 `Styles/`、route compatibility、旧 variables/animations 路径和旧 UBB stylesheet 重新出现；
- 活动 JSX 精确 `row`/`column` 回流或 `cc98-*` 数量漂移；
- 普通业务 global stylesheet、业务 Module 的 `:global(`/`global(`，以及未登记 Foundation selector/keyframe；
- 三项 legacy global 的 owner/importer、12 份 Foundation 文件、语义色变量/13 个 Sass importer、第三方根和删除条件漂移。

同步后的清单结果为：327 个现代源码文件、1356 条 import、27 条既有 allowlist；116 个真实 CSS Module、29 个主题、0 处业务 Module global；18 条动态内容 import、63 条 UBB 注册、2 份 UBB 样式边界；115 条第三方 import、35 条 AntD consumer、3 份 vendor owner；12 份 Foundation 文件、10 个固定语义色、13 个 Sass importer、88 个布局 token 和 3 项冻结 legacy global。

## 6. 验证与产物

- `npm run check:architecture`：通过。
- `npm run typecheck`：modern/legacy 均通过。
- `npm run build`：通过，4124 modules transformed；仅保留既有 Sass `@import`、Spectrum/Lightning CSS hack 与大 chunk 警告。
- 正式产物：9563 个文件、97 个 CSS。相对 C1.7.6 的 9561/95，新增的两个 CSS chunk 来自 UBB renderer/editor owner 直载；其余 hash 差分来自清单登记的 owner 迁移、Module 哈希、局部 keyframe 与零 producer 删除。
- 以“排序后的相对路径 + 单文件 SHA-256”再次 SHA-256 聚合：全产物 `56d7b1db62edb8de7e50a14bcbd868e4f6f51c8fff9bdecd82c9347d7f49fb7c`，CSS `63709ae810bcadda7e8d7e0ec111611e5c58acf14658d267672d9607cabc2fc0`。
- `dist` 没有 tracked 污染，`git diff --check` 通过。103 份修改/新增文本均为 UTF-8/CRLF、无混合行尾和替换字符；只保留基线已有的 `Components/Category.tsx`、`Components/UbbContainer.tsx` BOM，UBB Editor stylesheet 搬移后继续保留原无 EOF 换行合同，其余文件均有 EOF 换行。未跟踪项只有本批登记的新 owner、守卫与审计文件。

## 7. 浏览器运行验收

已按运行验收要求尝试连接应用内浏览器，运行时列表为空。默认/暗色主题下 Header/Footer、Board/Board List、Topic、Editor、Signin、Search、User Center/Profile，以及 Pager、通知淡出、按钮、Markdown、UBB URL/code/table/image/download/emoji、Spectrum、hover/focus/disabled、前进后退、登录与真实 API 场景均未执行。该结论不由 build 或 HTTP 200 替代。

## 8. 人工代码审核结论

逐 owner 核对 class 映射、声明、注释、导入闭包、公开导出和动态内容清单后，未发现公开接口、业务逻辑、请求时序或内容协议变化。允许的 CSS 差分仅是登记的 owner 直载/哈希化/作用域缩小、局部 keyframe 和经零 producer 证明的删除。C1.7.7 代码实施与静态人工审核完成，代码与守卫已本地提交为 `30b150ce`，本文档随记录提交；浏览器运行验收仍未执行，不 push，不自动进入 Z。
