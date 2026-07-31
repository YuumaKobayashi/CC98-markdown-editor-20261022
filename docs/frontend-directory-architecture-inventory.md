# CC98 前端目标目录架构清单

> 文档性质：本地仓库目录调研与目标目录候选清单。
>
> 本文不是重构执行计划，不包含迁移阶段、执行顺序、工期、提交批次或完成声明。唯一有效的执行计划是 `docs/frontend-refactoring-plan.md`。

## 1. 本地运行形态结论

当前 CC98 前端是单入口 SPA，不是 MPA，也不是多个独立站点：

- Vite 的应用入口只有 `src/application/bootstrap/index.tsx`；
- 主题文件虽然也在构建 `input` 中，但它们是样式入口，不是独立 HTML 应用；
- 页面只创建一个 React Root；
- 全站只有一个 `createBrowserRouter` 和一棵路由树；
- 构建只生成一个 `static/index.html` 应用壳；
- 开发服务器把无扩展名的页面请求交给同一个 HTML 应用壳。

因此，当前 Application 目录应采用“单应用壳 + 单 Router + routes”的结构，不需要预设 `app-a`、`app-b`。

## 2. 顶层目录

目标代码主体使用三个具有语义的并列目录，不再使用 L1、L2、L3：

```text
src/
├─ foundation/
├─ modules/
└─ application/
```

含义如下：

```text
foundation  通用技术基础，不包含 CC98 业务语义
modules     可被多个页面消费的 CC98 业务能力
application 应用启动、路由入口和页面编排
```

依赖方向：

```text
application ───────────────→ foundation
application → modules ─────→ foundation
```

禁止：

```text
foundation → modules
foundation → application
modules → application
```

`modules` 内部可以存在显式、无环的业务依赖，但不能任意互相穿透内部文件。

## 3. 仓库根目录

并非所有目录都应强行放入 `src/foundation`。构建和部署工具运行在 Node.js、IIS 或 CI 环境中，应继续留在仓库根目录。

```text
/
├─ build/                 # 构建清单、模板合同、主题构建信息
├─ deploy/                # IIS 等部署配置
├─ docs/                  # 方案、调研和迁移记录
├─ public/                # 原样复制的静态资源
├─ scripts/               # 构建、检查和维护脚本
├─ src/                   # 浏览器应用源代码
├─ Template.ejs           # 单 SPA HTML 模板
├─ error.html             # 错误模板片段
├─ unsupported.html       # 不支持浏览器模板片段
├─ vite.config.mjs
├─ tsconfig.json
├─ tsconfig.legacy.json
└─ package.json
```

根目录的 `build/` 与 `src/foundation/constants/build/` 不是一回事：

- 根目录 `build/`：真正参与 Node.js 构建过程的脚本和清单；
- `foundation/constants/build/`：浏览器代码需要读取的构建期常量；
- `foundation/constants/compile/`：通过编译替换或静态注入进入浏览器代码的常量。

## 4. Foundation 完整目录

```text
src/foundation/
├─ api/
│  ├─ client/
│  │  ├─ fetch-client.ts
│  │  ├─ headers.ts
│  │  └─ response.ts
│  ├─ errors/
│  │  ├─ http-error.ts
│  │  └─ network-error.ts
│  └─ index.ts
│
├─ assets/
│  ├─ fonts/
│  ├─ icons/
│  └─ images/
│
├─ config/
│  ├─ platform.ts
│  ├─ runtime-config.ts
│  └─ index.ts
│
├─ constants/
│  ├─ build/
│  ├─ compile/
│  ├─ browser/
│  └─ index.ts
│
├─ integrations/
│  ├─ charts/
│  ├─ markdown-editor/
│  ├─ media-player/
│  ├─ math-renderer/
│  └─ watermark/
│
├─ lib/
│  ├─ async/
│  ├─ dom/
│  ├─ pagination/
│  ├─ text/
│  ├─ time/
│  └─ url/
│
├─ storage/
│  ├─ indexed-db/
│  ├─ local-storage/
│  ├─ session-storage/
│  ├─ storage-codec/
│  └─ index.ts
│
├─ styles/
│  ├─ reset/
│  ├─ base/
│  ├─ vendors/
│  ├─ mixins/
│  └─ variables/
│
├─ theme/
│  ├─ registry/
│  ├─ runtime/
│  ├─ tokens/
│  └─ index.ts
│
├─ types/
│  ├─ browser/
│  ├─ environment/
│  ├─ third-party/
│  └─ global.d.ts
│
├─ ui/
│  ├─ document-title/
│  ├─ feedback/
│  ├─ pagination/
│  ├─ loading/
│  ├─ empty-state/
│  └─ error-state/
│
└─ index.ts
```

### 4.1 Foundation 各目录边界

#### `api`

只拥有与业务无关的 HTTP 传输能力：

- 发起请求；
- 解析响应；
- 网络错误和 HTTP 错误；
- Header、Body、序列化等通用处理。

不拥有：

- `/topic`、`/board`、`/me` 等业务端点；
- token 生命周期；
- 登录跳转；
- Topic、User、Board 类型。

#### `assets`

只放会被源代码 import 的通用静态资源。部署时原样复制、具有固定 URL 合同的资源继续位于根目录 `public/`。

#### `config`

存放运行时配置和平台能力判断，例如：

- API Origin；
- CDN 地址；
- 是否启用 IndexedDB；
- 浏览器能力开关。

#### `constants`

存放没有运行时状态的稳定常量：

- `build/`：浏览器可见的构建版本、资源版本；
- `compile/`：编译时替换的环境标记；
- `browser/`：浏览器限制、固定平台值。

业务枚举不能因为“是常量”就放入 Foundation。例如 Topic 类型、管理操作类型仍属于对应业务模块。

#### `integrations`

封装第三方库，不直接表达 CC98 业务：

- 图表；
- Markdown 编辑器；
- DPlayer/APlayer/HLS；
- MathJax/KaTeX；
- 水印。

#### `lib`

存放没有业务语义的纯函数和浏览器工具。命名必须能脱离“论坛”独立解释。

#### `storage`

只提供存储引擎和序列化机制：

- IndexedDB；
- localStorage；
- sessionStorage；
- 过期时间编码；
- JSON 编解码。

它不决定缓存什么业务数据，也不拥有业务缓存键。

#### `styles`

只放应用级基础样式、第三方修正、通用变量和 mixin。页面样式与业务组件样式跟随其 owner。

#### `theme`

提供主题注册、加载、切换和 token 解析机制。用户选择了哪个主题属于用户偏好；主题系统怎样加载属于 Foundation。

#### `types`

只放环境、浏览器和第三方声明。Topic、Post、User 等业务类型必须放在 Modules。

#### `ui`

只放不表达论坛业务语义的基础 UI。`TopicCard`、`UserProfile`、`FavoriteTopicGroupSelect` 都不能进入这里。

## 5. Modules 通用内部结构

业务模块使用统一的可选子目录：

```text
src/modules/<module>/
├─ api/                   # 模块拥有的后端端点
├─ model/                 # 类型、状态、selector、业务规则
├─ cache/                 # 模块拥有的数据缓存策略
├─ ui/                    # 可跨页面复用的业务组件
├─ hooks/                 # 可跨页面复用的业务 Hook
├─ lib/                   # 只服务本模块的纯业务函数
├─ testing/               # 模块测试夹具和辅助函数
└─ index.ts               # 唯一公共入口
```

这些子目录按需创建，不要求每个模块都有空目录。

模块外部只能通过 `index.ts` 使用公开能力。模块内部使用相对路径，不从自己的 barrel 反向导入。

## 6. Modules 完整业务目录

根据当前本地代码、API、路由消费关系和缓存用途，可识别出以下业务模块：

```text
src/modules/
├─ board/
│  ├─ api/
│  ├─ model/
│  ├─ cache/
│  ├─ ui/
│  └─ index.ts
│
├─ topic/
│  ├─ api/
│  ├─ model/
│  ├─ cache/
│  ├─ ui/
│  └─ index.ts
│
├─ post/
│  ├─ api/
│  ├─ model/
│  ├─ ui/
│  └─ index.ts
│
├─ user/
│  ├─ api/
│  ├─ model/
│  ├─ cache/
│  ├─ ui/
│  └─ index.ts
│
├─ session/
│  ├─ api/
│  ├─ model/
│  ├─ persistence/
│  ├─ sync/
│  └─ index.ts
│
├─ favorite-topic/
│  ├─ api/
│  ├─ model/
│  ├─ ui/
│  └─ index.ts
│
├─ follow/
│  ├─ api/
│  ├─ model/
│  ├─ ui/
│  └─ index.ts
│
├─ reaction/
│  ├─ api/
│  ├─ model/
│  ├─ ui/
│  └─ index.ts
│
├─ post-rating/
│  ├─ api/
│  ├─ model/
│  ├─ ui/
│  └─ index.ts
│
├─ moderation/
│  ├─ api/
│  ├─ model/
│  ├─ ui/
│  └─ index.ts
│
├─ message/
│  ├─ api/
│  ├─ model/
│  ├─ ui/
│  └─ index.ts
│
├─ notification/
│  ├─ api/
│  ├─ model/
│  ├─ realtime/
│  ├─ ui/
│  └─ index.ts
│
├─ posting/
│  ├─ api/
│  ├─ model/
│  ├─ drafts/
│  ├─ ui/
│  └─ index.ts
│
├─ upload/
│  ├─ api/
│  ├─ model/
│  └─ index.ts
│
├─ ubb/
│  ├─ parser/
│  ├─ renderers/
│  ├─ editor/
│  ├─ model/
│  ├─ ui/
│  └─ index.ts
│
├─ daily-signin/
│  ├─ api/
│  ├─ model/
│  ├─ cache/
│  ├─ ui/
│  └─ index.ts
│
├─ wealth/
│  ├─ api/
│  ├─ model/
│  ├─ ui/
│  └─ index.ts
│
├─ user-activity/
│  ├─ api/
│  ├─ model/
│  ├─ ui/
│  └─ index.ts
│
├─ user-preference/
│  ├─ api/
│  ├─ model/
│  ├─ persistence/
│  └─ index.ts
│
├─ site-content/
│  ├─ announcement/
│  ├─ advertisement/
│  ├─ recommendation/
│  ├─ api/
│  ├─ model/
│  └─ index.ts
│
└─ annual-review/
   ├─ api/
   ├─ model/
   └─ index.ts
```

### 6.1 `board`

拥有：

- Board 基础类型和信息查询；
- Board 名称、标签、管理记录；
- Board 列表和子版面结构；
- `boardsInfo` 的业务缓存策略；
- 可跨页面使用的 Board 展示组件。

不拥有：

- `/board/:id` 页面参数；
- `/boardlist` 页面布局；
- `/list/:boardId` 兼容路由。

### 6.2 `topic`

拥有：

- Topic 类型和基础查询；
- Topic 列表查询；
- 热门、新主题、推荐主题所需的领域查询；
- Topic 标签；
- `tagInfo` 等 Topic 数据缓存策略；
- TopicCard、TopicBreadcrumb 等可复用业务 UI。

不拥有：

- `/topic/:topicid/:page?` 路由参数；
- Topic Detail 整页布局；
- New Topics、Recommended Topics 的整页状态。

### 6.3 `post`

拥有：

- Post/楼层类型；
- 单个或批量楼层基础查询；
- 楼层内容、楼层号和奖励展示数据；
- 可跨页面使用的楼层展示组件。

不拥有：

- Topic Detail 的分页和整页回复列表；
- Message 页的数据生命周期；
- 点赞、评分和管理操作。

### 6.4 `user`

拥有：

- 公共 UserInfo 类型；
- 按用户 ID、用户名查询用户资料；
- 公共头像和用户资料展示；
- 用户资料更新端点；
- 公共用户资料查询缓存。

当前“用户缓存”的准确含义是：

```text
缓存对象    公共 UserInfo 查询结果
缓存键      userId_<id>、userName_<name>
命中方式    按 ID 或用户名
当前介质    IndexedDB 或 localStorage
当前有效期  3600 秒
```

缓存策略属于 `modules/user/cache`，IndexedDB/localStorage 驱动属于 `foundation/storage`。

不拥有：

- access token、refresh token；
- 当前登录会话；
- User Center 和 User Profile 页面。

### 6.5 `session`

拥有：

- access token、refresh token；
- 当前登录用户；
- 登录、退出、刷新 token；
- 刷新当前用户；
- 登录状态 selector；
- 跨标签页 session 同步协议；
- session 持久化策略。

`userInfo` 在这里表示“当前会话用户”，与 `modules/user/cache` 中的“公共用户资料查询缓存”不同。

### 6.6 `favorite-topic`

拥有：

- 收藏、取消收藏；
- 查询收藏状态；
- 收藏分组的增删改查；
- 收藏 Topic 的业务类型和可复用操作 UI。

User Center Favorites 页面只消费这些能力，不拥有收藏业务合同。

### 6.7 `follow`

拥有：

- 关注、取消关注用户；
- 收藏、取消收藏 Board；
- 查询关注状态；
- UserFollowCard 等可复用 UI。

Focus 页面是这些能力的页面入口，不等于 Follow 模块本身。

### 6.8 `reaction`

拥有：

- 点赞、点踩；
- 查询点赞状态和计数；
- Reaction 类型和交互组件。

### 6.9 `post-rating`

拥有：

- 给 Post 加减财富；
- 奖励信息；
- Post 评价、威望相关操作；
- PostRatingDialog。

它与普通 Like/Dislike 不属于同一合同，因此不与 `reaction` 混为一个模块。

### 6.10 `moderation`

拥有：

- Topic/Post 删除、锁定、置顶、精华、高亮、移动；
- 封禁和解除封禁；
- IP 查询；
- 批量管理；
- 管理记录；
- 管理对话框。

### 6.11 `message`

拥有：

- 私信联系人；
- 私信会话和发送消息；
- Message 类型；
- 可复用的发送者、接收者和会话展示组件。

不拥有回复通知、@ 通知、系统通知。

### 6.12 `notification`

拥有：

- 回复、@、系统通知；
- 未读计数；
- 一键已读；
- SignalR 实时通知；
- 标题闪烁；
- 通知设置。

SignalR 库的通用连接适配可以进入 Foundation，但 CC98 通知频道、事件和重连规则属于本模块。

### 6.13 `posting`

拥有：

- 创建 Topic；
- 回复 Topic；
- 编辑 Post；
- 发帖内容类型；
- 草稿和失败内容恢复策略；
- 发帖/回帖可复用表单能力。

`post-cache-<topicId>`、`temporaryContent-*`、编辑器草稿不是含糊的“页面缓存”，而是 Posting 草稿。

### 6.14 `upload`

拥有：

- 文件上传端点；
- 上传进度、结果和错误类型；
- 对编辑器暴露的上传能力。

Markdown 编辑器适配器属于 Foundation，上传业务合同属于本模块。

### 6.15 `ubb`

拥有：

- CC98 UBB 语法；
- Tag Handler；
- UBB 渲染；
- UBB 编辑器业务配置；
- UBB 内容安全和权限语义。

UBB 是论坛业务能力，不属于通用 Foundation。

### 6.16 `daily-signin`

拥有：

- 签到；
- 签到状态；
- 签到日历数据；
- 当日签到结果的缓存策略；
- 可复用签到展示。

`/signin` 页面只是它的路由入口。

### 6.17 `wealth`

拥有：

- 当前财富；
- 转账；
- 每日奖励记录；
- 财富变动类型和可复用表单。

对具体 Post 的奖励/扣除由 `post-rating` 使用 Wealth 合同。

### 6.18 `user-activity`

拥有：

- 用户最近 Topic；
- 用户最近 Post；
- 用户历史记录；
- 可在 User Center 与 User Profile 复用的活动列表能力。

路由分页和页面布局仍留在 Application。

### 6.19 `user-preference`

拥有：

- Topic 浏览模式；
- 主题选择；
- 通知偏好；
- Emoji 默认分类；
- 卡片用户信息显隐等稳定用户偏好；
- 用户偏好的持久化键和同步规则。

主题加载机制属于 Foundation；用户选择哪个主题属于本模块。

### 6.20 `site-content`

拥有：

- 全局公告；
- 首页广告；
- 首页推荐内容；
- 后台更新这些内容的 API 和业务类型。

Home 页面和 Site Management 页面分别是读取与编辑入口。

### 6.21 `annual-review`

本地存在 AnnualReview 与 AnnualReviewV2 代码和 API，但当前不在主 Router 的可达路由中。

目录清单只记录它是独立业务能力；是否继续接入、冻结或删除需要单独确认，不能因为本次列目录而视为已进入重构范围。

## 7. Modules 初始依赖关系

允许的业务依赖需要明确登记，初始候选如下：

```text
session          → user
favorite-topic   → topic
follow           → user
follow           → board
post-rating      → post
post-rating      → wealth
moderation       → topic
moderation       → post
moderation       → board
message          → user
notification     → user
notification     → topic
notification     → post
posting          → topic
posting          → post
posting          → upload
posting          → ubb
user-activity    → user
user-activity    → topic
user-activity    → post
daily-signin     → session
user-preference  → user
```

需要避免：

```text
topic ↔ post
user ↔ session
message ↔ notification
posting ↔ topic
```

如果双方都需要同一类型，应重新确定 owner 或通过窄接口解耦，不能建立循环依赖。

## 8. Application 完整目录

当前项目是纯 SPA，因此 Application 不再套一层虚构的 `app-a`：

```text
src/application/
├─ bootstrap/
│  └─ index.tsx
│
├─ providers/
│  ├─ create-application-root.tsx
│  ├─ error-boundary.tsx
│  ├─ store-provider.tsx
│  ├─ theme-provider.tsx
│  └─ cross-tab-sync.tsx
│
├─ router/
│  ├─ create-router.tsx
│  ├─ navigation.ts
│  ├─ navigation-prompt.tsx
│  ├─ route-error.tsx
│  └─ route-types.ts
│
├─ store/
│  ├─ store.ts
│  ├─ hooks.ts
│  ├─ listener-middleware.ts
│  └─ reducer-registry.ts
│
├─ layouts/
│  ├─ application-shell/
│  ├─ header/
│  └─ footer/
│
├─ routes/
│  ├─ home/
│  ├─ topic/
│  ├─ board/
│  ├─ board-list/
│  ├─ legacy-board-list/
│  ├─ user-center/
│  ├─ message-center/
│  ├─ focus/
│  ├─ new-topics/
│  ├─ recommended-topics/
│  ├─ user-profile/
│  ├─ login/
│  ├─ search/
│  ├─ daily-signin/
│  ├─ site-management/
│  ├─ editor/
│  ├─ legacy-index/
│  ├─ unauthorized/
│  └─ not-found/
│
├─ compatibility/
│  ├─ legacy-route-props/
│  ├─ legacy-navigation/
│  └─ legacy-store/
│
└─ index.ts
```

`compatibility/` 是兼容边界，不是长期业务 owner。它存在时也不能被 Foundation 或 Modules 依赖。

## 9. Route 内部结构

单个 Route 目录按需要使用以下结构：

```text
routes/<route>/
├─ route.tsx              # 路由声明和 lazy 入口
├─ page.tsx               # 页面根组件
├─ layout.tsx             # 仅该路由树使用的布局
├─ model/
│  ├─ route-params.ts
│  ├─ page-state.ts
│  └─ query-state.ts
├─ ui/                    # 只在该页面使用的组件
├─ hooks/                 # 只在该页面使用的 Hook
├─ lib/                   # 页面编排辅助函数
└─ index.ts
```

Route 目录可以有页面查询编排，但不重新定义业务 API。例如 Topic Detail 可以组合 Topic、Post、Reaction、Moderation 和 Posting，不应再复制一套 Topic API。

## 10. 当前真实路由对应目录

```text
src/application/routes/
├─ home/                              # /
│  ├─ page.tsx
│  ├─ ui/
│  ├─ model/
│  └─ cache/                          # 首页聚合数据的页面级缓存策略
│
├─ topic/
│  ├─ layout/
│  ├─ detail/                         # /topic/:topicid/:page?
│  ├─ tracked/                        # /topic/:topicId/postid/:postId/:page?
│  └─ hot/
│     ├─ monthly/                     # /topic/hot-monthly
│     ├─ weekly/                      # /topic/hot-weekly
│     └─ history/                     # /topic/hot-history
│
├─ board/                             # /board/:id/:page?/*
│  ├─ page.tsx
│  ├─ model/
│  └─ ui/
│
├─ board-list/                        # /boardlist
│
├─ legacy-board-list/                 # /list/:boardId/:type?/:page?/*
│
├─ user-center/                       # /usercenter
│  ├─ layout/
│  ├─ overview/                       # index
│  ├─ followings/                     # myfollowings/:page?/*
│  ├─ fans/                           # myfans/:page?/*
│  ├─ topics/                         # mytopics/:page?/*
│  ├─ history/                        # myhistory/:page?/*
│  ├─ posts/                          # myposts/*
│  ├─ favorites/                      # myfavorites/*
│  ├─ settings/                       # config/*
│  ├─ custom-boards/                  # mycustomboards/*
│  ├─ wealth-transfer/                # transferwealth/*
│  └─ theme/                          # theme/*
│
├─ message-center/                    # /message
│  ├─ layout/
│  ├─ responses/                      # response/:page?
│  ├─ mentions/                       # attme/:page?/*
│  ├─ system/                         # system/:page?/*
│  ├─ private-messages/               # message/:page?/*
│  └─ settings/                       # setting/*
│
├─ focus/                             # /focus
│  ├─ layout/
│  ├─ boards/                         # board/*
│  ├─ users/                          # user/*
│  └─ favorites/                      # favorite/*
│
├─ new-topics/                        # /newtopics/*
│
├─ recommended-topics/                # /recommendedtopics/*
│
├─ user-profile/                      # /user/:method/:id
│  ├─ layout/
│  ├─ overview/                       # index
│  └─ manage/                         # manage/*
│
├─ login/                             # /logon
│
├─ search/
│  ├─ topic/                          # /search/*
│  └─ board/                          # /searchBoard/*
│
├─ daily-signin/                      # /signin/*
│
├─ site-management/                   # /sitemanage/*
│
├─ editor/                            # /editor/:mode/:id?/*
│
├─ legacy-index/                      # /index/*
│
├─ unauthorized/                      # /error/401/*
│
└─ not-found/                         # *
```

## 11. Topic 功能如何同时出现在 Modules 与 Application

Topic 相关代码会同时出现在两个目录，但它们不是重复 owner：

```text
src/modules/topic/
├─ api/                 # Topic 能力
├─ model/
├─ cache/
└─ ui/

src/application/routes/topic/
├─ detail/              # Topic 详情页面如何组合
├─ tracked/
└─ hot/
```

判断标准：

```text
问题                                      归属
Topic 是什么、如何查询、有哪些业务规则      modules/topic
TopicCard 如何跨页面复用                    modules/topic/ui
topicId/page 路由参数如何读取               application/routes/topic
详情页如何组合 Post、回复框和管理按钮        application/routes/topic/detail
热门月榜页面怎样布局                        application/routes/topic/hot/monthly
```

因此，Topic 能力可以被 Home、Search、User Center、Favorites 等多个 Route 使用，但实现仍只有一个业务 owner。

## 12. 缓存目录清单

“缓存”不是一个统一层级，也不应建立一个包揽全部业务的 `foundation/cache`。

### 12.1 存储机制

```text
src/foundation/storage/
├─ indexed-db/
├─ local-storage/
├─ session-storage/
└─ storage-codec/
```

这里只负责怎么存，不负责存什么。

### 12.2 领域数据缓存

```text
src/modules/user/cache/                # UserInfo，按 ID/用户名，当前 1 小时
src/modules/board/cache/               # boardsInfo，当前 1 小时
src/modules/topic/cache/               # tagInfo，当前 10 分钟
src/modules/daily-signin/cache/        # 当日签到状态
```

缓存键、TTL、失效和刷新策略属于对应业务模块。

### 12.3 Session 持久化

```text
src/modules/session/persistence/
```

包括：

- access token；
- refresh token；
- 当前用户；
- token 过期时间；
- 跨标签页会话同步。

它是会话持久化，不称为普通数据缓存。

### 12.4 用户偏好持久化

```text
src/modules/user-preference/persistence/
```

包括：

- 主题选择；
- Topic 浏览模式；
- 通知设置；
- Emoji 分类；
- TopicCard 用户信息显隐。

### 12.5 草稿

```text
src/modules/posting/drafts/
```

包括：

- Topic 回复草稿；
- 发帖失败恢复内容；
- Editor 内容草稿。

草稿有用户可恢复的业务含义，不能笼统称为缓存。

### 12.6 页面级缓存

```text
src/application/routes/home/cache/
src/application/routes/new-topics/cache/
src/application/routes/focus/cache/
```

只有与单个页面聚合结果、滚动恢复或页面切换直接绑定的数据才放在 Route 下。若后来被多个页面消费，应提升到对应 Module。

### 12.7 实时通知状态

```text
src/modules/notification/realtime/
```

SignalR 心跳、重连时间和未读计数属于实时通知协议，不归入通用缓存目录。

## 13. 本地现有目录到目标目录的对应关系

### 13.1 Foundation 输入

```text
src/shared/api             → src/foundation/api
src/shared/config          → src/foundation/config
src/shared/integrations    → src/foundation/integrations
src/shared/lib             → src/foundation/lib
src/shared/storage         → src/foundation/storage
src/shared/theme           → src/foundation/theme
src/shared/ui              → src/foundation/ui
@types                     → src/foundation/types
Styles 中的全局基础样式     → src/foundation/styles
Themes                     → src/foundation/theme
```

### 13.2 Modules 输入

```text
src/entities/user          → src/modules/user
src/entities/message       → src/modules/message
src/features/auth          → src/modules/session
src/features/favorites     → src/modules/favorite-topic
src/features/follow        → src/modules/follow
src/features/reactions     → src/modules/reaction + post-rating
src/features/moderation    → src/modules/moderation + post-rating
src/features/posting       → src/modules/posting + upload
src/features/message       → src/modules/message + notification
src/features/account       → session + daily-signin + wealth
src/modules/board          → board 能力与 Board Route 分开
src/modules/topic          → topic 能力与 Topic Route 分开
src/modules/post           → src/modules/post
Ubb                        → src/modules/ubb
Components/UbbEditor       → src/modules/ubb/editor
```

### 13.3 Application 输入

```text
src/app/bootstrap          → src/application/bootstrap
src/app/providers          → src/application/providers
src/app/router             → src/application/router
src/app/store              → src/application/store
src/app/layouts            → src/application/layouts
src/app/legacy             → src/application/compatibility
src/pages/*                → src/application/routes/*
src/modules/*/pages        → src/application/routes/*
```

### 13.4 旧根目录

当前根目录仍有：

```text
Components/
IndexedDB/
Match/
Pages/
Props/
States/
Styles/
Themes/
Ubb/
Utility/
Utility.ts
```

这些目录是本地兼容、旧 owner 或未迁移代码来源，不是目标架构中的第四个长期层级。具体文件最终归属要按调用链和行为合同判断，不能只按旧目录名机械搬运。

## 14. Application 的其他形态

本节只列结构变体，不表示 CC98 当前需要采用。

### 14.1 当前：纯 SPA

```text
src/application/
├─ bootstrap/
├─ providers/
├─ router/
├─ layouts/
└─ routes/
```

适用条件：

- 一个 HTML 应用壳；
- 一个前端启动入口；
- 一个 Router 管理全部页面。

CC98 当前属于这一形态。

### 14.2 MPA：每个页面独立入口

```text
src/applications/
├─ home/
│  ├─ bootstrap/
│  └─ page/
├─ topic/
│  ├─ bootstrap/
│  └─ page/
└─ user-center/
   ├─ bootstrap/
   └─ page/
```

适用条件：

- 多个 HTML；
- 页面间发生完整文档导航；
- 每个入口独立打包和启动。

### 14.3 MPA + SPA：多个应用入口，每个入口内部有 Router

```text
src/applications/
├─ forum/
│  ├─ bootstrap/
│  ├─ router/
│  └─ routes/
├─ admin/
│  ├─ bootstrap/
│  ├─ router/
│  └─ routes/
└─ annual-review/
   ├─ bootstrap/
   ├─ router/
   └─ routes/
```

适用条件：

- Forum、Admin、活动站等分别拥有 HTML 和启动入口；
- 每个子应用内部仍是 SPA；
- 子应用可以共享 Foundation 和部分 Modules。

### 14.4 独立站点或 Monorepo

```text
apps/
├─ forum/
├─ admin/
└─ annual-review/

packages/
├─ foundation/
├─ forum-modules/
└─ design-system/
```

适用条件：

- 独立部署；
- 独立发布周期；
- 独立依赖或技术栈；
- 需要跨站共享 package。

仅仅存在 `/sitemanage` 路由或 AnnualReview 源文件，不足以证明应改造成这种形态。

## 15. 当前目录结论

当前 CC98 目录候选为：

```text
src/
├─ foundation/            # 通用技术基础
├─ modules/               # 可复用业务能力
└─ application/           # 单 SPA 应用壳和全部 Routes
```

Application 当前采用：

```text
application/
├─ bootstrap/
├─ providers/
├─ router/
├─ store/
├─ layouts/
├─ routes/
└─ compatibility/
```

不采用：

```text
applications/app-a
applications/app-b
apps/forum
apps/admin
```

除非以后出现真实的第二个 HTML、第二个 React Root、第二个独立 Router 或独立部署站点，再重新评估 Application 的拓扑。
