# C1.7.1 单文件多组件拆分、Legacy Board 删除与 Status 归位审计

## 基线与边界

- 实施基线：`cfbfd83c` 干净工作树；首轮处理计划登记的八个候选。后续引用复核证明旧 `/list` 只有外层 lazy Route，内部 `/board/...` 分支在 `/list/...` owner 下不可达，且仓内没有 `/list` 导航；用户据此明确授权直接删除整条 Legacy Board 链。
- 保真边界：除明确删除 Legacy Board 及重定向旧 `list.asp` 外，其余请求、Redux/Storage、Router、URL、权限、ID/ref、jQuery、计时器、播放器、DOM、文案、props、default/named export、lazy Route 与全部原注释保持。
- 其余候选的公开导出和调用点先逐项冻结；拆分后 public barrel 指向真实 owner，旧路径仅保留无重复实现的 re-export/facade。

## 拆分结果

| 原 owner | 拆分结果 | 调用与兼容闭包 |
| --- | --- | --- |
| `Components/Status.tsx` | 15 个公开状态先拆分，随后按用户确认以薄适配归入 `application/routes/status` 的共同 `StatusPage`；原文件为 facade | `Status[error]` namespace、Router、Shell、Topic、User Center/Profile 的 15 个名称不变 |
| `HomePage.tsx` | 保留 HomePage；推荐阅读、热门话题、广告轮播、论坛统计分别独立 | Home lazy Route 仍导出 `HomePage`；MainPage legacy facade 与 Board/Topic 的广告入口不变 |
| `EditorPage.tsx` | 不改文件 | `EditorContentHeader`、`EditorTypeRadio` 均为父组件私有短组件，无独立状态、副作用或调用点，登记为共置例外 |
| `Header.tsx` | 保留 Header；UserMenu 与 Search 独立 | `SearchBeforeConnent` 错拼名称和 `Search = SearchBeforeConnent` alias 保持；Shell 与 legacy Header facade 不变 |
| `BoardFooterActions.tsx` | 保留主组件；批量管理与版面事件列表独立 | Board barrel 与 legacy Footer default facade 的名称、props 和 Modal 组合不变 |
| `BoardTopicListItem.tsx` | 保留列表项；公开预览卡独立 | `BoardTopicPreviewPost` 无状态且只服务预览卡，继续共置；`generateListPager` 是父组件私有 JSX helper |
| `TopicCard.tsx` | 保留主题卡；音频、视频播放器独立 | Topic barrel 与 legacy CardTopicSingle facade 不变；APlayer/DPlayer 的计数、初始化、事件、异常和 cleanup 原样随 owner 移动 |

## Legacy Board 删除闭包

- 删除 `list/:boardId/:type?/:page?/*` lazy Route、`src/application/routes/legacy-board-list` 全部实现和六份 CSS Module，以及零消费者的 `Components/Board/Board.tsx` facade。
- 删除 Legacy Board 专属 `LegacyBoardRecordCompatibility.scss`、`LegacyBoardTagColumnCompatibility.scss` 及 `Site.scss` import；Current Board、`Components/Board/BoardList.tsx` 和共享 Board Module 保留。
- 删除共享 Module 中经仓库级复核确认只由 Legacy Board 消费的 10 个零调用 API：Topic 的旧普通/置顶/精华/收藏/单双标签查询、Board 的旧标签与事件查询，以及带旧 jQuery DOM 回写的批量锁定/删除；Current Board 的同类 Route API、`getTpUsers`、`getBoardTagV2` 和现行 moderation API 保留。
- IIS 的 `list.asp?boardid=...&page=...` 与 `list.asp?boardid=...` 入口改为重定向当前 `/board/:id/:page` 与 `/board/:id`；不再保留 SPA `/list` Route。

## 样式 owner 与临时边界

- 除删除 Legacy Board 专属样式外，没有改写保留样式的 class 映射、selector、声明值或主题入口；29 个主题和两处第三方 `:global(...)` 基线不变。
- Status 的五条规则已从 Topic Management Module 原样归入 `application/routes/status/ui/StatusPage.module.scss`；Home 标题 Module 改由推荐阅读、热门话题和统计 owner 直接消费，Board Module 新增预览卡直接消费边。后两类是 C1.7.1 拆文件产生的已知临时多 importer，必须在 C1.7.3 按真实 producer 收口，不能作为终态例外。
- 独立的广告、推荐阅读和统计 Module 随对应 TSX owner 加载。构建中旧 Home CSS chunk 被拆为 Home 主页面与广告两个 chunk；拆分前后规则集合均为 47 条，逐条排序比较无差异。删除后构建不再生成 Legacy Board JS/CSS chunk。

## 审核与验证

- AST 复扫确认：Status compatibility facade 不生产 JSX；15 个旧命名只组合共同 `StatusPage` 的窄配置与 children。保留的其他多 JSX 文件只包含已登记的 Editor 私有例外、Board 预览私有子组件及非组件 helper。
- public barrel、原文件 re-export、Home/Editor lazy Route 和 `Status[error]` 动态索引逐项闭包；Legacy Board lazy Route、facade、owner、样式与残余 import 已删除。
- `npm run check:architecture` 通过：316 个现代源码文件、1325 条 import、29 条登记 allowlist；样式守卫通过：66 个真实 CSS Module、0 个过渡 partial、29 个主题、2 个文件中的 2 处 global。
- modern/legacy typecheck 与正式 build 通过；Status 归位后的构建转换 4058 个模块，没有 Legacy Board chunk 或引用，只有既有 Sass、Spectrum/Lightning CSS 和大 chunk 警告。
- 新增和修改文件保持无 BOM、统一 CRLF、单一 EOF newline；`git diff --check`、未跟踪文件、生成产物和原注释覆盖在整批结束时单独复核。

## 运行验收边界与停点

- 浏览器、真实登录/API/权限、默认/暗色主题、Header 搜索/用户菜单、Home 与跨 Route 广告、Current Board 列表/管理/预览、Status、Editor 与 Topic 音视频挂载/清理尚未执行。
- 机械检查和主代理代码审核不能替代上述运行场景。本批停在未提交工作树，不 commit、不 push，不自动实施 C1.7.2 其余候选或其余 Z 批次。
