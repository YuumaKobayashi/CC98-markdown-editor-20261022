# Z0 行为合同冻结基线

本文件记录 Z1–Z5 不得漂移的合同类别与当前 owner。它不是运行验收结果；真实服务响应、浏览器行为和仓外固定 URL 尚未由本批执行。

## 1. URL、Router 与部署

- `src/application/router/app-router.tsx` 中的 path、参数名/大小写、可选参数、wildcard、redirect、lazy export 名称与 error boundary 全部冻结。
- `deploy/iis/web.config` 中 `index.asp`、`list.asp`、`dispbbs.asp`、`dispuser.asp` 的 query 捕获、redirect 目标和 `appendQueryString` 语义冻结。
- `/reset -> /static/reset.html`、非 static 请求回退 `/static/index.html`、`error.html`/`reset.html`/`unsupported.html` 独立入口冻结。
- `Template.ejs` 的主脚本注入、29 主题入口、第三方脚本/样式 URL 与加载顺序冻结。

## 2. API wire 合同

API 合同以 28 个包含 `fetch`/`cc98Fetch` 的 API owner 文件为 source of truth：其中 27 个属于主应用活动图，覆盖 Application 的 Board/Editor/Topic Detail、Foundation HTTP，以及 Board/Daily Signin/Favorite/Follow/Message/Moderation/Notification/Post Rating/Post/Posting/Reaction/Session/Site Content/Topic/Upload/User Preference/User/Wealth Modules；另 1 个是无主应用入口的 AnnualReview API owner。

Z1–Z5 迁址时必须逐调用保留：

- URL 模板、query 参数名与编码；
- HTTP method、headers、body 串行化及空 body；
- response JSON/text/void 的读取方式、字段大小写、可空性和日期表示；
- 非 2xx、网络异常、吞错/继续执行、重试与导航语义；
- 请求顺序、并发、分页探测和 refresh 时机。

`src/modules/annual-review/api/service.ts` 的 `/me/annual-review-2022` 与 `/me/annual-review-${year}` 只属于 Z4 删除边界，不得在 Z1–Z3 顺手调整或恢复调用。

## 3. Storage 与 IndexedDB

`foundation/storage/web-storage.ts` 的 `obj-`/`str-` 编码、`${key}_expirationTime` 秒级过期、clear/version 保留键、原始 `JSON.parse` 路径和跨标签 storage event 语义冻结。

| owner | 键/模板 | TTL/格式合同 |
| --- | --- | --- |
| Session | `userInfo`、`accessToken`、`refresh_token`、`refresh_token_expirationTime`、`logOnRedirectUrl`、`shouldNotRefreshUserInfo` | 当前用户 2592000 秒；access token 使用响应 `expires_in`；refresh 保留既有过期与跳转语义 |
| Notification | `messageCount`、`noticeSetting`、`signalr` | 未读四计数无 TTL；跨标签替换、通知设置和 realtime 唤醒语义冻结 |
| Board/Topic | `boardsInfo`、`boardInfo`、`tagInfo` | boards 3600 秒且保留 raw/`obj-` 检查；boardInfo 为 sessionStorage；tagInfo 600 秒并保留 raw slice/parse |
| User cache | `userId_${id}`、`userName_${name}`；IndexedDB `cc98` / `userInfo` store / `name` index | local fallback 3600 秒；IndexedDB schema、version、事务与 invalidation 冻结 |
| Daily Signin | `signin_${userId}` | TTL 为下一个本地午夜前剩余秒数 |
| Posting | `contentCache`、`temporaryContent`、`temporaryContent-${topicId}`、`post-cache-${topicId}`、`react-mde-imageurl(-status)` | 内容、失败草稿、图片上传状态与清除时机冻结 |
| Home/Discovery | `mainPageData`、`mainPageHotTopic`、`mainAds-v2`、`AllNewTopic`、`AllNewMediaTopic`、`Current/LastRandomTopics`、`Current/LastRecommendedTopics` | 现有 local/session storage 选择、60 秒首页 TTL、回退与合并顺序冻结 |
| Focus/Preference | `focusBoardList`、`currentFocusBoard`、`focusBoard_${id}`、`showCardUser`、`usePWA`、`defaultEmojiType` | 当前 storage 类型、0 TTL/无 TTL、监听和 UI 初始化语义冻结 |

## 4. UBB/Editor/Markdown

- `createSignatureEngine` 与 `createEngine` 的 Handler 类、注册/文字处理顺序和返回类型冻结。
- Math 与 Sandbox 当前被注释禁用；注释、禁用状态和源文件不能在迁址中被“清理”。
- parser Token/Segment/Engine/Handler 的 class 身份、继承、`init`、反射式构造、未知标签回退、嵌套/空标签语义冻结。
- 权限标签、仅楼主/回复可见/指定用户可见，图片/上传/音频/视频/Bilibili/数学公式/sandbox，播放器和内容安全边界冻结。
- Editor 的按钮/config/emoji JSON、选区、预览、上传压缩、草稿与 UBB/Markdown 切换冻结。
- Z2 允许同步迁移 producer、DOM 查询和 selector 到局部 Module；旧 className、独立全局 UBB CSS 文件名与 selector 名本身不是兼容合同，不得为兼容而双写。
- Markdown 整体替换不属于 Z；Z2/Z3 只保持内容往返、草稿、上传、emoji、公式、安全与模式切换。

## 5. Session、Notification、SignalR、主题和缓存

- Store 的 Session 与 Notification unread slice、四计数、标题闪烁、页面清零、跨标签更新和 Utility effect bridge 冻结。
- NotificationController 当前是否挂载、SignalR 连接/重连、浏览器通知权限请求时机和 navigation binding 冻结；不因根 `SignalR.ts` 无 consumer 改写活动 Module 实现。
- 29 个主题的 key/id/顺序、日夜配对、八个 `--cc98-*` 自定义属性、Template 选择与 Foundation manifest/hash guard 冻结。
- Board/Topic/User/Home/Discovery/Posting 缓存的 key、TTL、序列化、请求回退、失效与分页合并语义冻结；已知原始 parse/竞态缺陷只登记。

## 6. 现有守卫复用

- `scripts/dynamic-content-boundary.json`：UBB public consumer、63 条注册、editor/renderer/媒体/动态 HTML 边界。
- `scripts/style-owner-freeze.json`：Z2 UBB 与 Z4 AnnualReview 的冻结样式边。
- `scripts/foundation-style-boundary.json`、`style-global-baseline.json`、`third-party-boundary.json`：主题、global、动态内容和第三方样式合同。
- `scripts/architecture-allowlist.json`：27 条 Module→legacy 临时边及逐条移除条件。

这些 manifest 是可执行机械守卫；Z0 文档补足 Router、API、Storage、部署和零调用候选的人工审计边界。
