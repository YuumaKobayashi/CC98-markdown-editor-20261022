# C1.7.5 动态内容全局边界盘点与冻结审计

日期：2026-08-02

实施基线：干净的 `dev20260716@4f5f28ba`

范围：只盘点并冻结 UBB、Markdown、emoji、媒体与数学公式边界；不修改运行时代码、DOM、CSS、公开接口或内容协议

## 1. UBB renderer 与直接消费边界

`Components/UbbContainer.tsx` 仍是唯一 renderer 组件入口；默认使用 `createEngine()`，签名模式使用 `createSignatureEngine()`。C1.7.5 没有迁移 `Ubb/`、`Components/UbbContainer.tsx` 或建立过渡 facade，这些工作仍统一属于 Z2。

机器扫描得到 13 条活动 TypeScript import 边，另有一条整文件注释中的冻结文本边界：

| 消费类别 | 当前文件与合同 |
| --- | --- |
| UBB Editor 预览 | `Components/UbbEditor/components/index.tsx` 使用默认 options；预览与编辑值共用原 `state.value` |
| Board 公告与主题预览 | `BoardAnnouncement` 两处、`BoardTopicPreviewCard` 一处均以完整默认 options 展开后固定 `allowToolbox: false` |
| Topic 正文 | `TopicReplyContent` 固定 `allowToolbox: true`；`TopicReplySignature` 固定外链图片关闭、Markdown 关闭、图片上限为 1 |
| User 资料与签名 | `UserProfile`、`UserProfileDetails` 均在完整默认 options 上关闭外链图片 |
| Message 与站点内容 | `MessageConversationItem`、`MessagePerson`、`SiteAnnouncementPreview` 使用默认 options |
| Notification | `MessageSystembox` 禁用外链图片、媒体、表情、toolbox 和自动播放；Response/Mention 通过 `MessageResponseItem` 传入各自既有 options，均禁用图片、媒体、表情与 toolbox |
| 冻结边 | `TopicReplyComposer` 保留一个未消费的活动 import；`Components/Topic/Post.tsx` 整文件位于块注释内，其 `UbbContainer` 相对 import 只作为休眠文本存在，不能据此恢复或删除逻辑 |

`createSignatureEngine()` 当前按顺序注册 18 个 tag handler 与 2 个 text handler；`createEngine()` 注册 41 个 tag handler 与 2 个 text handler，总活动注册序列为 63 条。完整引擎包含 `MdTagHandler` 与 `BiliTagHandler`；`BiliTextHandler`、`MathTagHandler` 和 `MathTextHandler` 仍为注释注册。注册顺序属于解析 ABI，守卫按顺序冻结，不在本批重排或去重。

## 2. UBB Editor、emoji 与全局样式

`UbbEditor` 的三个活动消费者保持为 Daily Signin、Editor Route 与 Topic Reply Composer。编辑器继续负责 textarea、预览、上传、撤销/重做、扩展面板、emoji 面板和 `Ctrl+Enter` 提交；C1.7.5 不拆组件、不修改 props，也不改变 window click listener 的挂载/清理。

| emoji 组 | 插入格式与资源边界 |
| --- | --- |
| CC98 | `[cc98NN]`，资源位于 `/static/images/CC98/`，现有 GIF/PNG 分段规则保持 |
| 经典 | `[emNN]`，资源位于 `/static/images/em/` |
| AC 娘 | `[acNN]`，资源位于 `/static/images/ac/` |
| 麻将脸 | `[a:NNN]`、`[c:NNN]`、`[f:NNN]`，资源位于 `/static/images/mahjong/` |
| 贴吧 | `[tbNN]`，资源位于 `/static/images/tb/` |
| 雀魂 | `[msNN]`，资源位于 `/static/images/ms/` |

emoji 默认组继续使用 `defaultEmojiType`，通过 legacy Storage wrapper 保存 2592000 秒。`emoji.json` 当前为空；实际清单仍由组件内数组生成，不制造新的配置来源。

活动样式加载链保持为：

```text
29 个主题入口
  -> src/foundation/styles/Site.scss
     -> Styles/MainPage.scss
     -> Components/UbbEditor/stylesheet.scss
```

- `Styles/MainPage.scss` 保留 renderer 动态 producer 使用的 `.hiddenImage`、`.visibleImage`、`.download-file`、`.ubb-image-toolbox`、`.UBBTableTag`、`.UBBTabletTag` 与 `.photoFrame`；原 selector、嵌套、注释和值均未修改。
- `Components/UbbEditor/stylesheet.scss` 保留 `.ubb-editor`、工具栏、扩展面板、emoji、预览、消息和 `#color` 全局合同；它仍由 `Site.scss` 单次加载。
- `Styles/UbbEditor.scss` 当前 importer 为 0，是旧编辑器 compatibility 样式；C1.7.5 只登记，留给 C1.7.7 删除，不把它重新接入入口。
- `react-markdown-editor-lite/lib/index.css` 继续由 Foundation Markdown adapter 直接加载；第三方 selector 限界属于 C1.7.6，不在本批处理。

## 3. Markdown 内容、草稿、上传与安全边界

Editor Route 与 Topic Reply Composer 是 `MarkdownEditor` 的两个业务消费者，均保持 UBB/Markdown 两套独立 state，提交协议仍以 `contentType: 0` 表示 UBB、`contentType: 1` 表示 Markdown。切换编辑器时原“会丢失之前编辑内容”的确认、8000 字限制、匿名/通知参数、URL 与请求体不变。

| 边界 | 当前合同 |
| --- | --- |
| Editor Markdown 预览 | Showdown 启用 `tables`、`simplifiedAutoLink`，没有加载 `showdown-xss-filter`；C1.7.5 只如实冻结，不把未经过滤误写为安全验收通过 |
| Topic Reply Markdown 预览 | Showdown 另启用 `strikethrough` 与 `showdown-xss-filter`；原 `extensions: [xssFilter]` 保持 |
| UBB `[md]` | `MdTagHandler` 受 `allowMarkDown` 控制，通过 `remark` + `remark-react` 输出 React 内容，并保留旧引用换行兼容处理 |
| Markdown adapter | 保留任务列表、图片上传、AutoResize、中文 locale、工具栏顺序、只显示单模式以及调用方提供的 `renderPreview` |
| Editor 草稿 | `contentCache` 保存完整 editor state；成功发帖/编辑后的清理时机不变 |
| Reply 草稿与失败缓存 | `temporaryContent-${topicId}`、`post-cache-${topicId}` 及旧 `temporaryContent` 清理合同保持；卸载、失败和成功分支的时序不改 |
| Markdown 图片上传 | `uploadEvent` 继续调用 Upload Module，并维护 `react-mde-imageurl-status` 的 pending/success/fail 与 `react-mde-imageurl` |

当前三条 Markdown 渲染路径的库、过滤策略和 DOM 不一致；C1.7.5 不统一它们。整体替换仍须在 Z 后单独授权，并重新验证内容往返、草稿、上传、快捷键、主题及内容安全。

## 4. 动态 HTML、播放器与数学公式

- UBB Image/Upload 保留图片延迟加载、外链和数量限制、默认显示值、toolbox、旋转、隐藏以及下载按钮；`.hiddenImage`/`.visibleImage` 仍被 Topic Header 的批量显示/隐藏逻辑查询。
- legacy Audio/Video handler 与现代 `TopicAudioPlayer`/`TopicVideoPlayer` 都保留 APlayer/DPlayer 初始化和 destroy 清理。现有 `aplayer-author`、`dplayer-menu`、`dplayer-full-in-icon`、`dplayer-setting`、`dplayer-full` DOM 查询及播放器菜单 `innerHTML` 写入全部冻结。
- Video handler 的 HLS script 注入、Bili iframe URL/参数和媒体权限判断保持；未启用的 `BiliTextHandler` 不恢复注册。
- Math handler 继续不注册并保留 `@ts-nocheck`。其 MathJax 转换和 `dangerouslySetInnerHTML` 只是休眠代码边界，不记为活动安全能力，也不在本批删除。

## 5. 守卫与停点

新增 `scripts/dynamic-content-boundary.json` 与 `check-dynamic-content-boundary.mjs`，并接入 `npm run check:architecture`。守卫执行以下失效检测：

- UBB Container、UBB Editor 与 Markdown Editor 的精确 import 集合及休眠边界；
- 63 条活动 UBB handler 注册的精确顺序和 Math/Bili 注释状态；
- 两条活动全局样式加载边及一份零 importer compatibility 样式；
- `defaultEmojiType`、草稿/失败缓存与 Markdown 上传 Storage key；
- Editor/Reply 的 `contentType` 0/1，以及预览过滤、动态 selector、媒体 DOM 查询和清理标记。

守卫只冻结边界合同，没有对整个 UBB/Markdown 文件做内容哈希，不阻止后续独立维护。C1.7.5 不修改 `src/`、`Components/`、`Ubb/`、`Styles/` 或 `Pages/` 中的任何运行时文件；完成后保持未提交，不进入 C1.7.6、C1.7.7、Z2 或 Markdown 替换批。

机械检查与运行边界：

- `npm run check:architecture` 通过：327 个现代源码文件、1348 条 import、27 条既有 allowlist；样式守卫保持 110 个真实 CSS Module、29 个主题、2 处既有第三方 global、0 条休眠 owner 边和 2 条 Annual Review 冻结样式边；动态边界守卫通过 18 条直接 import 边、63 条活动 UBB 注册、3 份样式边界、3 组 Storage 合同与 2 组内容类型合同。
- modern/legacy typecheck 均通过；正式 build 修改前后均转换 4116 个模块，只保留既有 Sass、Spectrum/Lightning CSS 与大 chunk 警告。沙箱内首次 build 仍因已知 `spawn EPERM` 失败，原命令在允许子进程的环境重跑成功。
- 修改前后 `dist` 均为 9561 个文件、95 个 CSS 文件；全产物聚合 SHA-256 均为 `ad00794f52f5482f4390c459d9db1e269e3d86a0a2b3bd3d73332f0a89b100c5`，CSS 聚合 SHA-256 均为 `296f2c3c35ec94c04847422bf83eee6cab589cb382b5d42bba5595c1d3998465`。因此主题、静态 URL、CSS chunk、vendor 与脚本产物差异为 0。
- 本地 Vite 根入口 `http://127.0.0.1:5173/` 返回 HTTP 200，但浏览器连接器没有可用实例。UBB/Markdown 切换与预览、emoji 默认组、上传、草稿恢复、动态图片、播放器、登录与真实 API 均未执行浏览器验收，不以 HTTP 200、build 或静态审核代替。
- `git diff --check`、未跟踪文件、UTF-8 无 BOM、CRLF、单一 EOF newline、运行时目录零差异与生成产物检查在整批结束时复核。本批不 commit、不 push，不自动进入 C1.7.6、C1.7.7 或 Z。
