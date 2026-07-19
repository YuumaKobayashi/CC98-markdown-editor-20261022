# CC98 Forum 渐进式前端重构调研与执行计划（V2）

> 调研日期：2026-07-16  
> 调研基线：`main`，工作区在调研开始时干净  
> 迁移分支：`dev20260716`（当前尚不存在；P00 获确认后从当前 `main` 创建）  
> 当前状态：P00 调研完成，等待人工确认；未修改业务代码、未启动 Node server、未提交

## 1. 结论先行

本仓库应采用“原地渐进迁移 + 兼容门面 + 人工逐阶段验收”，不应另起炉灶重写。

建议的主线顺序是：

1. 先确定执行工作区和人工验收协议；
2. 把手工维护的静态资源与 `dist` 生成物分开；
3. 固化依赖安装和构建环境，再以影子构建方式迁移构建工具；
4. 建立领域目录和单向依赖规则；
5. 拆解 `Utility.tsx` 并解除明确循环依赖；
6. 建立状态归属规则和 Redux Toolkit 兼容 Store；
7. 分开升级 TypeScript、React、Router 和 UI 依赖；
8. 按风险从低到高改写 class 组件，每个组件保留人工可审核的前后对照文档；
9. 按领域迁移服务端状态，最后处理 SCSS；
10. 主体迁移完成后，再按缺陷台账逐项修复旧逻辑。

这条路线允许旧代码和新代码长期共存，但每个临时兼容层都必须写明移除阶段，避免形成第二套永久架构。

## 2. 本轮硬性边界

以下规则高于后续阶段中的一般技术建议：

- 每个阶段只处理一个主要问题；阶段完成后立即停止，等待人工确认。
- 人工确认前不提交；提交后也不自动开始下一阶段。
- 默认不引入或运行自动 lint、自动测试、循环依赖扫描、自动视觉截图、自动渲染、bundle analyzer、artifact comparator 或类似门禁。
- 不计算或维护产物 SHA256。编译/打包若成为某阶段的必要动作，需在阶段开始前单独说明；其成功也不能替代人工功能确认。
- 所有 Node dev server、preview server 或其他持续运行的 Node 服务，只能由 subagent 启动和完整回收；若当前协作接口无法锁定具体模型版本，必须在阶段记录中明确说明，但不得改由主线程代跑。
- 发现旧逻辑缺陷时只进入台账；主体迁移完成前不得顺手修复。
- 所有 class → function 改写都必须有人工作成的前后对照文档，不能依赖自动生成报告。
- `spatial-watermark` 是私有依赖：不 vendor、不 pack、不复制其源码或二进制到仓库，不提交 `node_modules` 或由该库产生的独立二进制。若必须改依赖引用、版本、接口或构建方式，先停下征求人工意见。
- `Ubb/**`、`Components/UbbContainer.tsx`、`Components/UbbEditor/**` 及其直接样式/注册顺序按“冻结遗留岛”处理，本轮不改源码、不移动、不格式化。外层只允许增加 adapter。
- LaTeX/MathJax/KaTeX 暂不作为阶段退出条件；升级中短期不可用可以记录，但不在主体迁移中修复。
- 不访问真实 CC98/OpenID 环境，不使用真实账号、token 或用户数据。

## 3. 当前仓库事实

### 3.1 技术基线

当前 lockfile 实际安装基线包括：

- React / ReactDOM `16.14.0`
- React Redux `5.0.7`
- React Router DOM `4.3.1`
- Redux `4.x`、`react-router-redux 5 alpha`
- Ant Design `3.26.20`
- Webpack `4.47.0`、Webpack Dev Server `3.x`
- TypeScript `4.9.5`
- Sass `1.43.3`

`tsconfig.json` 仍使用 `target: es5`、`moduleResolution: node`、`jsx: react`、`noImplicitAny: false`。这些设置已明显落后于现代 bundler/TypeScript 模型；TypeScript 6.0 官方已将 ES5 target 和旧 `moduleResolution: node` 标记为弃用。

依赖清单共有 45 个运行依赖和 40 个开发依赖。React 不能单独大版本升级，因为旧版 `react-redux`、`bizcharts`、`draft-js`、`react-lazyload`、`@cc98/hell-react-mde` 等存在旧 React peer 约束。

当前还存在安装基线不一致：`package.json` 声明 Moment `2.30.1`，lockfile 根记录和锁定包为 `2.22.2`，本机 `node_modules` 又是 `2.30.1`。这必须先作为“依赖可复现性”问题处理，不能在大版本升级时顺便重写 lockfile。

### 3.2 代码规模与组件形态

- TypeScript/TSX/SCSS 共约 5.1 万行。
- `Utility.tsx`：3,996 行、149 个顶层 export/re-export、约 119 个直接 barrel 使用文件。
- `Components/Board/Board.tsx`：2,243 行。
- `Components/Edit.tsx`：1,989 行。
- `Styles/Site.scss`：5,163 行。
- 非 UBB 范围内至少有 203 处 `extends React...` class 声明，分布于 146 个文件；另有 16 处 `RouteComponent` 派生 class。
- React Hooks 只在 2 个文件中出现；`connect(...)` 使用文件有 26 个。
- 83 个文件直接使用 `this.state`，79 个文件调用 `setState`。

因此 class 组件改写不能按目录一次性完成，必须按副作用复杂度和业务风险分批。

### 3.3 已确认的循环依赖和耦合

至少存在以下明确运行时环：

1. `Store.tsx → Reducers/UserInfo.tsx → Utility.tsx → Store.tsx`
2. `Components/Board/Board.tsx → Utility.tsx → Components/Board/Board.tsx`
3. `Components/UserCenter/Theme.tsx → Utility.tsx → Components/UserCenter/Theme.tsx`

另外，`Store.tsx` 为推导 action 类型导入整个 `AsyncActions` barrel，而多个 thunk 又反向导入 `Store` 和 `Utility`。`Utility.tsx` 中存在大量直接 `store.dispatch`，并同时承担 HTTP、storage、时间格式化、DOM/jQuery、主题、权限、消息、上传和业务 API 等职责。

解除这些环的关键不是机械移动文件，而是把数据、渲染、状态副作用和基础设施分开：

- 基础工具不得 import React 组件或 Store；
- API/service 返回结构化结果，不直接 dispatch 全局错误；迁移期可通过显式 adapter 保持旧错误行为；
- 主题清单从组件文件移到独立 registry；
- JSX 转换函数回到组件/feature 层；
- action/store 类型放到无运行时副作用的类型模块。

### 3.4 状态管理现状

全局 Store 实际只注册：

- `error`
- `userInfo`
- `message`
- `router`

但大量远端响应、分页、loading、表单、弹窗和路由派生值保存在 class local state；消息等组件还直接调用 `Store.getState()`。`States/` 有 13 个文件，`AppState.tsx` 单文件 651 行，混合了 API DTO、领域实体和 UI state。

问题不在于“有的地方用 reducer、有的地方不用”。合理系统本来就应有多种状态容器；当前真正缺少的是明确的所有权规则和唯一事实源。

#### 3.4.1 当前 reducer 与业务内容审计

| reducer | 是否注册 | 当前实际内容与消费者 | 目标判断 |
|---|---|---|---|
| `userInfo` | 是 | 被 32 个组件/thunk 文件直接读取；同时容纳登录态、完整当前用户、跨端用户设置、用户中心列表、分页、loading/error、访问他人页面的路由派生状态和转账结果 | `CurrentUser` 必须保持一个完整业务聚合；列表/请求生命周期、URL 状态和表单结果按所有权移出 |
| `message` | 是 | Header 订阅未读汇总；多个消息页面直接 `Store.getState()`；数据来自 `/me/unread-count` | 属于全局可见的服务端数据，迁入 RTK Query cache，而不是再维护一份普通 slice 副本 |
| `error` | 是 | `Utility.tsx` 的大量请求直接 dispatch；`App.tsx` 用一个全局 flag 替换整套路由；导航后由 `ErrorControl` 清除 | P09 先兼容；以后只保留真正需要接管全应用的 fatal/navigation fault，普通请求错误归对应 query/mutation |
| `router` | 是 | 注册了 `react-router-redux` reducer/middleware，但源码没有读取 `state.router` 的业务消费者 | P14 由 Router URL 自己拥有，不继续保留 Redux 路由副本 |
| `Post` | 否 | 文件存在、只处理 `ADD_AWARD`，且 reducer 声明为 `async` | 作为未生效遗留代码登记；不得在迁移中顺便注册 |

`userInfo` 的核心问题不是字段应该按“资料/偏好”拆开。当前 `UserInfo` 本身已经包含 `theme`、`themeSetting`、`topicViewMode`、`browsingHistoryEnabled`、`customBoards` 等跨设备字段，并分别通过 `/me/theme`、`me/theme-setting`、`/me/topic-view-mode`、`/me/browsing-history`、`/me/custom-board/*` 写回服务器。这些字段与 id、用户名、头像、等级、权限共同属于完整的 `CurrentUser` 聚合，迁移后仍保存在一起。

目前真正重复的是同一聚合的存放位置：

- `state.userInfo.currentUserInfo`；
- localStorage 的 `userInfo`，并有至少 56 处非注释调用直接通过 `getMyInfo()` 读取；
- `Reducers/UserInfo.tsx` 在 reducer 内把同一对象写入 localStorage 和 IndexedDB 用户缓存。

目标是保留完整 `CurrentUser`，但只设一个规范的内存事实源；localStorage/IndexedDB 只能通过 adapter 作为兼容镜像或缓存，不能形成另一个可独立修改的用户对象。用户已明确 `showCardUser` 也属于需要跨设备同步的用户设置；当前前端却只在 localStorage/普通 reducer 中维护，且现有 `UserInfo` DTO 与请求路径中未找到对应服务端字段。这一差异先登记，待 P17 人工确认服务端合同，不在主体迁移前修复。

#### 3.4.2 实际需要 reducer 语义的业务

这里的“需要 reducer”不等于都要手写一个普通 slice；RTK Query 的 query cache 本身也由 reducer 管理。

| 业务 | 目标状态机制 | 原因 |
|---|---|---|
| 认证会话生命周期 | 小型 Redux Toolkit `session` slice | `unknown/authenticated/anonymous`、刷新中、跨标签页登录/退出属于全应用客户端状态；token 不进入 Store |
| 完整 `CurrentUser` | 一个 RTK Query `getCurrentUser` cache entry；迁移兼容期可由旧 reducer 原样承载 | 来自 `/me`，被 Header、权限判断、用户中心、主题和多个页面共同消费；所有跨端用户设置必须保留在同一聚合中 |
| 用户资料/主题/浏览模式/足迹开关/关注版面 mutation | RTK Query mutation 更新或失效同一个 `CurrentUser` cache entry | 服务器写回成功后要让所有消费者同时看到一致对象，不能分别维护偏好 slice |
| 首页、Board、Topic、Search、用户中心列表、收藏/关注/足迹 | 各领域 RTK Query reducer/cache | 都是带参数、分页、loading/error/失效规则的服务端数据 |
| 未读消息汇总与消息列表 | Message RTK Query reducer/cache | Header 与消息页共享，服务器为事实源 |
| 真正接管整个应用的 fatal/navigation fault | 暂时保留兼容 reducer，Router 阶段再决定最小 `appFault` slice | 当前确有全壳层消费，但不能继续吞并所有 HTTP 错误 |
| URL 可表达的页面、页码、筛选和访问用户 id | Router URL，不建 reducer | 刷新、分享、前进后退必须保持一致 |
| 编辑器、管理表单、批量选择等单页面状态 | 组件局部 `useReducer` | 状态转换复杂但没有跨路由共享需求；UBB 仍冻结 |
| 弹窗、hover、输入值、单按钮 loading | `useState` | 生命周期局部，不需要全局 reducer |

主题的“服务端设置”和“当前实际套用哪张样式表”要区分：前者始终是完整 `CurrentUser` 的字段，后者是由这些字段和昼夜条件推导出的运行时结果，通过 effect/adapter 应用到 DOM；不得因此把服务器主题设置从 `CurrentUser` 拆出去。

### 3.5 静态资源与构建

P02 前，`dist` 同时承担三种互相冲突的职责：

1. 手工维护的源资源库；
2. 构建输出目录；
3. IIS 部署配置目录。

P02 前已跟踪的 `dist` 内容约 54 MB、2,514 个文件，其中 2,509 个位于 `dist/static/images`。源码和 SCSS 中有大量 `/static/images/...` 固定 URL，UBB 还会动态拼接表情路径，因此第一阶段不能把这些资源逐个改成 module import。

目标边界应为：

- `public/static/**`：必须保留固定 URL/文件名的图片、表情、JSON 和图标；
- `src/assets/**`：后续新组件中可以安全 import 并由 bundler 管理的资源；
- `deploy/iis/web.config`：手工维护的 IIS 源配置；
- `dist/**`：完全可删除、可重建的产物，不作为源文件位置。

现有 29 个主题 SCSS entry 都会 import 完整的 `Styles/Site.scss`。`Template.ejs` 又依赖 CSS 产物顺序生成隐式 `themeNames` 全局变量，`Utility.tsx` 直接读取它。这是构建迁移前必须显式化的主题 ABI，不能把换 Vite 当成单纯改配置文件。

### 3.6 私有水印现状

仓库只跟踪 `package.json`/lockfile 中的私有 Git 引用，没有跟踪 watermark 命名文件或 `.node/.dll/.wasm/.exe` 等二进制；`node_modules` 已忽略。release 构建会将依赖代码并入普通 bundle，debug 配置则对其使用 `null-loader`。

本轮保持这个状态：不把私有库内容搬入 `public`、`src/vendor`、`dist` 提交或任何新包中。

## 4. 同类项目调研后的取舍

本方案只借鉴成熟论坛的边界，不照抄其框架：

- [Discourse](https://github.com/discourse/discourse) 将 `frontend`、`plugins`、`themes`、`public` 分开，说明论坛核心、扩展、主题和公开资源应有独立边界。
- [NodeBB 静态目录文档](https://docs.nodebb.org/development/plugins/statics/) 明确区分可被构建清空的 `/build/public` 和手工维护的 `/public`，与本仓库清理 `dist` 的目标直接对应。
- [NodeBB `src`](https://github.com/NodeBB/NodeBB/tree/master/src) 按 categories/posts/topics/user/messaging 等领域组织，适合替代本仓库按 Actions/Reducers/States 横切的结构。
- [Flarum 前端文档](https://docs.flarum.org/extend/frontend/) 区分 forum/admin/common，并要求入口只 export 实际 `src` 能力，适合作为窄公共 API 和管理端边界的参考。
- [Redux Toolkit 迁移指南](https://redux-toolkit.js.org/usage/migrating-to-modern-redux) 明确支持旧 reducer、`connect` 和新 Toolkit/hooks 逐项共存。
- [React class 文档](https://react.dev/reference/react/Component) 表述为“class 仍受支持，但新代码推荐函数组件”；Error Boundary 目前仍没有直接函数组件等价物，因此本轮允许 `ErrorBoundary` 保持 class。
- [Vite 静态资源指南](https://vite.dev/guide/assets.html) 建议默认 import 资源，只有必须保留原名/固定 URL 的资源进入 `public`。本仓库第一步应优先保 URL，而不是强行 import 2,509 个图片。
- [Sass `@import` 说明](https://sass-lang.com/documentation/at-rules/import/) 已将 `@import` 标为弃用并推荐 `@use`，但本轮禁止自动 migrator，必须逐 feature 人工迁移。

## 5. 目标目录和依赖方向

迁移期间采用“新目录承接已迁移代码，旧目录保持可运行”的结构：

```text
src/
  app/                    # bootstrap、providers、router、store、layouts
  pages/                  # 路由级组合，只编排 feature/entity
  features/               # 登录、关注、发帖、收藏、管理等用户动作
  entities/               # board、topic、post、user、message、tag
  shared/
    api/                  # HTTP client、错误模型、请求契约
    config/               # runtime config 和解析
    storage/              # storage/IndexedDB adapter
    ui/                   # 无业务语义的视觉原语和第三方 UI 适配
    theme/                # theme manifest、tokens、CSS variables
    lib/                  # 无 React/Store 副作用的纯函数
  integrations/
    watermark/            # 只包装私有库调用，不包含库内容

public/static/            # 固定 /static URL 的 authored assets
deploy/iis/web.config     # IIS 源配置
dist/                     # 纯构建产物

Ubb/                      # 本轮原地冻结
Components/UbbEditor/     # 本轮原地冻结
docs/refactor-log/        # 阶段范围、人工验收和前后对照
```

依赖方向固定为：

```text
app → pages → features → entities → shared
```

补充规则：

- 下层不得反向 import 上层。
- `shared` 不得 import Store、Router 或业务组件。
- `integrations` 只依赖第三方包和 `shared`，不得反向依赖 app/page/feature/entity；上层通过窄 adapter 使用第三方能力。
- `entities` 不直接操作页面跳转或全局错误 UI。
- 每个 feature/entity 只暴露窄 `index.ts`，禁止重新创建全仓 giant barrel。
- 旧 `Utility.tsx` 在迁移期只做兼容 facade：旧代码可以继续 import facade，新代码不得从 facade 取能力。
- forum/admin 暂不拆成两个独立部署应用；Site Manage 仍是主论坛 SPA 内的路由边界，除非以后出现独立发布或安全要求。
- 主论坛保持持久壳层：Header/Footer/Provider/Store 不随首页、版面、主题帖之间的普通导航重建；特殊 `/reset` 页面继续独立。

P06 同时建立 `@app/*`、`@pages/*`、`@features/*`、`@entities/*`、`@shared/*`、`@integrations/*` 路径别名。`@legacy/*` 临时指向仓库根目录，只用于已迁入模块连接尚未归位的旧实现，不作为新业务代码的默认依赖入口。

### 5.1 目录迁移具体发生在哪些阶段

P06 不是“把整个仓库一次性搬进 `src`”。它只建立目录契约、路径别名和最小 app bootstrap，并用一个真实入口证明新旧目录可以共存。其余文件在所属能力被迁移时进入目标目录：

| 现有目录/文件 | 目标位置 | 实际迁移阶段 | 处理方式 |
|---|---|---|---|
| `dist/static/**`、`dist/web.config` | `public/static/**`、`deploy/iis/web.config` | P02 | 只迁 authored assets/部署源，保持 URL |
| `Main.tsx` 与最小 providers/bootstrap | `src/app/bootstrap`、`src/app/providers` | P06 | 机械搬迁和入口适配，不改业务逻辑 |
| `Components/App.tsx`、Header/Footer、顶层 Router | `src/app/router`、`src/app/layouts` | P14/P15 | Router 壳层和高风险组件迁移时处理 |
| `Store.tsx` | `src/app/store` | P09 | `configureStore` 阶段迁移，旧 reducer 继续挂载 |
| `Utility.tsx`、`Utility/**`、`config/**`、`IndexedDB/**` | `src/shared/{api,config,storage,lib}`、对应 entity/feature service | P07 | 按符号拆分；根 `Utility.tsx` 暂留 facade |
| `Actions/**`、`AsyncActions/**`、`Reducers/**` | `src/app/store` 或对应 `features/entities` | P09、P16–P19 | Store 壳先迁；领域 action/reducer 随所属数据域迁移 |
| `States/**`、`Props/**`、`Match/**` | 各 owner 的 `types.ts`/组件同目录 | P10–P19 | 不保留新的全局类型杂物目录 |
| `Components/**`、`Pages/**` | `src/pages`、`src/features`、`src/entities/*/ui`、`src/app/layouts` | P10、P11、P14、P15、P16–P19 | 随组件风险批次或所属业务域迁移；每个 move 写入 file-map |
| `Styles/**`、`Themes/**` | owner 同目录样式、`src/shared/theme` | P20 | 在样式专属阶段迁移，不与组件函数化混做 |
| `Ubb/**`、`Components/UbbEditor/**` | 本轮仍留原路径 | 不迁移 | 冻结，不移动、不格式化、不改源码 |
| 搬空后的旧顶层目录与兼容 facade | 删除 | P21 | 仅在人工确认无剩余 owner 后删除 |

因此，P06 回答“新代码应该放哪里”，后续各阶段回答“某个现有文件何时真正归位”。不会出现一次性移动两百多个文件、随后再集中修 import 的大爆炸。

一个文件若同时需要函数化和归位，视为同一个“组件所有权迁移”事项，按以下小步骤完成：先记录旧路径和原实现，再做文件移动，最后在新路径改写并提供前后对照；整个批次仍只围绕该组件迁移，不夹带状态缓存或样式重构。

### 5.2 `shared/ui` 放什么

`shared/ui` 不是新版 `Components/Common`，也不是把所有 AntD 组件再包一层。只有同时满足“无 CC98 业务语义”且“至少两个领域复用，或需要隔离第三方 UI 破坏性变化”的组件才进入这里。

初始候选范围：

```text
src/shared/ui/
  button/                 # 统一 loading/disabled/危险操作外观
  dialog/                 # Modal、ConfirmDialog 的项目级稳定接口
  feedback/               # Spinner、EmptyState、ErrorState、Notice
  form/                   # 确有复用的 FormField/Input/Select adapter
  navigation/             # Pagination、Tabs 等无业务路由语义控件
  display/                # Avatar、Badge、Tooltip 等通用展示原语
  icon/                   # 隔离 AntD/Font Awesome/Bootstrap Icons
  layout/                 # PageContainer、Stack、Card 等纯布局原语
  index.ts                # 窄公开入口
```

明确不放入 `shared/ui`：

- `BoardCard`、`TopicListItem`、`UserBadge`：分别属于 `entities/board`、`entities/topic`、`entities/user`。
- Follow、Favorite、SignIn、Moderation 按钮：包含业务动作，属于相应 `features`。
- Header、Footer、主导航、路由壳：属于 `app/layouts`。
- 页面级表格、用户中心导航、消息列表：属于对应 page/feature。
- UBB renderer/editor、Markdown editor：属于冻结遗留岛或 editor feature。
- AntD `ConfigProvider`、全局 locale：属于 `app/providers`。
- 主题 ID、token、theme manifest：属于 `shared/theme`，不放 UI 组件目录。

`shared/ui` 不得 import Store、Router、API、storage、entities 或 features。P06 只创建边界说明；真正的首批 UI adapter 在 P12 根据 AntD 升级影响面建立，不会提前凭空造一套设计系统。若某个 AntD 组件只是单处使用且 API 稳定，调用方可直接使用，不强制包装。

## 6. 状态所有权规则

| 状态类型 | 唯一事实源 | 典型例子 | 不应放置的位置 |
|---|---|---|---|
| 可分享/可前进后退的视图状态 | Router URL | boardId、topicId、page、search、sort、tag | Redux 和长期 local state 的副本 |
| 简单瞬时 UI 状态 | `useState` | modal、hover、输入框、展开状态 | 全局 Store |
| 单页面复杂交互状态 | `useReducer`，必要时局部 Context | 编辑流程、批量选择、多步骤表单 | 全局 Store，除非跨路由共享 |
| 跨页面客户端状态 | Redux Toolkit slice | 认证会话生命周期、真正的 app-shell 协调状态 | 零散 localStorage 和组件字段 |
| 服务端数据与请求生命周期 | RTK Query（按领域逐步引入） | 完整 `CurrentUser`、board/topic/user/message 列表、跨端用户设置、缓存与失效 | 多份普通 slice 副本和多处重复 fetch |
| 跨刷新持久化 | 明确 storage adapter | token、完整 `userInfo` 兼容镜像、启动期主题投影、草稿 | reducer 副作用、随手 `localStorage` |
| React 渲染异常 | Error Boundary | render 错误和 fallback | HTTP error reducer |

`CurrentUser` 不按“资料字段”和“偏好字段”拆成两个事实源。凡是服务端随账号跨设备同步的字段，包括主题、主题切换设置、主题列表浏览模式、足迹开关、关注版面以及用户确认应跨端同步的 `showCardUser`，都属于同一个聚合。可以按子对象组织 DTO，但更新、缓存失效、持久化兼容和人工审核必须以完整聚合为边界。

### 6.1 跨路由、跨标签页与跨窗口同步

这三种场景不应混为一种“全局状态”：

| 场景 | 采用机制 | 说明 |
|---|---|---|
| 同一 SPA 内跨路由 | 同一个 Redux Store，必要状态进入 URL | 路由切换不会重建 Store，无需通过 localStorage 绕一圈 |
| 刷新后恢复 | `shared/storage` 的显式持久化 adapter | 只恢复列入白名单且带版本的数据；远端响应缓存默认不持久化 |
| 同源多标签页/窗口 | 应用级 `storage` event bridge | 当前标签页直接 dispatch；其他标签页收到事件后再 dispatch 对应的 external-change action |
| 跨标签页的远端数据变化 | 按领域合同处理 | 普通列表优先广播失效并 refetch；`userInfo` 迁移期保留当前完整对象的 localStorage 同步合同，未经人工批准不改成仅 revision 信号 |
| 更复杂的标签页协调 | 先保留现有语义；确有需要时单独评估 BroadcastChannel/租约协议 | 不在 Store 基础阶段顺便重写 SignalR 主标签页选举 |

目标依赖方向如下：

```text
当前标签页 UI
  -> dispatch(action)
  -> Redux state
  -> listener middleware
  -> shared/storage adapter

其他标签页 window.storage
  -> app/providers/CrossTabSync
  -> shared/storage adapter 解码、校验版本
  -> dispatch(externalChanged(...)) / RTK Query invalidateTags(...)
```

约束：

1. `shared/storage` 只负责 key、编码、过期、版本和读写，不 import React、Redux 或领域模块。
2. `CrossTabSync` 在应用壳层只注册一次监听并负责 cleanup；业务组件不各自注册匿名 `storage` listener。
3. reducer 保持纯函数；持久化由 listener middleware 或领域 effect 完成，禁止在 reducer 内写 localStorage/IndexedDB。
4. `storage` 事件不会通知执行写入的当前页面，因此当前页面必须先正常 dispatch；也不得依赖“重复写入相同值”触发通知。
5. token 不进入 Redux state、RTK Query cache、跨页消息 payload 或日志。完整 `userInfo` 在迁移期继续兼容现有 localStorage、`str-`/`obj-` 与过期 key 格式；不得借同步重构拆散其中的跨端设置。未来是否改为 revision/refetch 必须单独审批。
6. URL、输入框、弹窗等页面状态默认不跨标签页同步；只有产品行为明确要求的 key 才进入同步白名单。
7. 独立 `reset.html` 的 `localStorage.clear()` 要处理 `StorageEvent.key === null`；只重新水合允许恢复的状态，不把它当作普通单 key 更新。

现状证明这类需求已经存在：`Header.tsx` 监听 `userInfo`、`showCardUser`，`NotificationController.tsx` 监听 `signalr`、`messageCount`。主体迁移先保持可观察行为，再把监听生命周期和解码逻辑搬到上述统一边界；现有 SignalR 子系统仍按冻结规则保持不挂载。

迁移顺序：

1. 先用 `configureStore` 原样承载旧 reducer/middleware；
2. 建 typed hooks，但不要求立即删除 `connect`；
3. 一次迁一个 slice，不创建重复事实源；
4. RTK Query 与 Store 基础迁移分开，并按领域单独验收；
5. 组件函数化与远端状态迁移也分开，避免一个 diff 同时改变生命周期、请求时机和缓存语义。

## 7. 依赖升级与替换策略

依赖不按“全部更新到 latest”处理，而按兼容簇分组：

### 7.1 先修安装基线

- 解决 manifest/lock/node_modules 不一致，但不顺便升级大版本。
- 固定 Node/npm 版本和私有依赖的可访问前提。
- 水印依赖保持现有 Git commit 和外部状态；任何 lockfile 重写都人工检查其条目，禁止把库内容写入仓库。

### 7.2 构建簇

- Webpack 4、WDS 3、ExtractTextPlugin、旧 css/sass loader 作为一组迁往 Vite。
- 先影子构建，保留旧 Webpack；人工确认输出路径、主题映射、IIS rewrite 和 reset 页面后，再单独切换默认构建。
- 不使用自动 artifact comparator；采用人工文件清单和代表性 URL 检查。

### 7.3 React/状态/路由簇

- Redux 先迁 Toolkit Store，并选择仍支持 React 16.14 的 React Redux 兼容档。
- 纯展示和简单 local-state class 可先在 React 16.14 上函数化；Hooks 自 React 16.8 起已可用，不必为了改写组件先冒险升级 runtime。
- 先处理 AntD、BizCharts、React Lazyload、旧 editor 等 React peer 阻塞；冻结的 UBB/editor 接触面只做外层隔离。若只能靠长期 `legacy-peer-deps` 才能继续，则阶段应停下申请人工决策。
- peer 阻塞解除后，React 先到 18.3 兼容档；Router 再单独迁移；connected/Router/壳层 class 随后迁移；最后评估当前受支持的 React 19。
- 移除 `react-router-redux`，Router 自己拥有导航状态。
- 不把 React、Router、Redux、AntD 和 class 改写塞进同一阶段。

### 7.4 UI 与旧浏览器簇

- AntD 3 通过 `shared/ui` 逐步收口，再按官方迁移路径升级；Bootstrap/React Bootstrap/Font Awesome 的重叠能力单独梳理。
- jQuery 先隔离到 legacy adapter；在 spectrum、Template 和旧 DOM 调用清理前不直接删除。
- `core-js 2`、`es6-promise`、`whatwg-fetch`、`formdata-polyfill` 只有在现代浏览器基线和新构建生效后才可移除。
- Moment 替换与 AntD/主题升级分开，避免日期格式和 locale 行为同时漂移。

### 7.5 冻结或延期簇

- UBB/表情/media handler 相关依赖不在主体阶段升级；如旧依赖阻挡 React/构建，只在外层做兼容隔离并请求人工决策。
- LaTeX/MathJax/KaTeX 不作为主体迁移阻塞项。
- Dormant SignalR 保持不挂载；主体迁移末期证明无运行时引用后，才单独决定删除旧 `@aspnet/signalr`，不默认恢复实时功能。

## 8. class → function 人工审核协议

迁移批次按风险排序：

1. 纯展示叶子组件，无 state/lifecycle/connect；
2. 简单 local state 组件；
3. Redux `connect` 组件；
4. lifecycle、订阅、timer、DOM/ref、网络请求组件；
5. Header、Board、Topic、Editor、App shell 等高风险组件。

明确例外：

- `ErrorBoundary` 允许保留 class。
- UBB/UBB Editor 范围不参与本轮函数化。
- 不为了减少 class 数量而合并原本相互独立的副作用。

语法与注释约束：

- 函数组件本身使用具名 `function` 声明，不使用 `React.FC` 或组件级箭头函数。
- 组件内部新增或迁移的具名 helper、事件处理器和异步动作统一使用 `const + 箭头函数`，不保留普通 `function` 声明；内联 callback 继续使用箭头函数。
- 原实现中的注释必须随所属实现或符号原文迁入新 owner，不得删除、压缩或擅自改写；旧路径变为纯 facade 后无需重复这些注释。

每个被改写组件必须新增一份人工文档，至少包含：

```md
# <组件名> class → function 对照

- 原文件/符号：
- 新文件/符号：
- 原 props/state：
- 原 lifecycle 与调用顺序：
- 原 Redux/Router/DOM/fetch/storage 依赖：
- 新 hooks 和依赖数组：
- cleanup 对应关系：
- 保持不变的行为：
- 发现但未修复的缺陷 ID：
- 人工验收路径与结果：

## 原写法
<人工截取的关键代码>

## 新写法
<对应的新代码>

## 审核结论
<待人工填写>
```

一个批次只改同一风险层的少量组件；文档与代码一起保留为未提交 diff，等待人工确认。

## 9. SCSS 收敛原则

样式迁移晚于主要组件迁移，避免 JSX 和样式同时大改。

执行顺序：

1. 固化 29 个主题 ID、默认主题、日夜映射和固定图片 URL；
2. 将颜色、间距、字体、断点等提取为 tokens；
3. 将真正重复的结构提取为 mixin/placeholder，不使用自动 Sass migrator；
4. `@import` 按 feature 人工迁往 `@use/@forward`；
5. `Site.scss` 按 app shell、board、topic、user、message、editor 等领域拆分；
6. 新组件优先 CSS Modules，旧选择器在对应页面迁移完成前保留；
7. 主题构建改为显式 manifest，不再依赖 CSS 产物顺序生成隐式全局变量。

人工检查重点不是像素级自动对照，而是各主题下的 Header、首页、版面、主题帖、用户中心、编辑器和管理弹窗。

## 10. 阶段计划

每一行都是独立审批点。任何阶段失败或范围扩大，都停在该阶段，不把工作带入下一阶段。

| 阶段 | 唯一大事 | 主要小步骤 | 人工退出条件 |
|---|---|---|---|
| P00 | 调研与治理规则 | 当前事实、硬边界、缺陷台账、阶段计划；获确认后从 `main` 创建 `dev20260716` 并只提交 P00 文档 | P00 提交只存在于 `dev20260716`；无业务代码变化；提交后停止 |
| P01 | 工作区隔离 | 主工作区切回 `main`；处理失效 worktree 记录；将 `dev20260716` 挂到新的兄弟 worktree；旧 refactor 分支只作历史参考 | `Forum` 保持 `main` 基线，迁移 worktree 独占 `dev20260716`；未带入旧自动检查脚本或无关主题二进制 |
| P02 | 静态资源/产物分离 | `dist/static` authored assets → `public/static`；`web.config` → `deploy/iis`；旧 Webpack 只做必要 copy 调整；保持 `/static/*` | 人工抽查固定 URL、JSON、reset、IIS 规则；`dist` 可被视为纯产物 |
| P03 | 可复现依赖环境 | 统一 manifest/lock；固定 Node/npm；检查水印条目未漂移 | 人工审查 lock diff；无大版本业务依赖升级；无私有库内容入库 |
| P04 | Vite 影子构建 | 新增 Vite 配置但不切默认；显式主题 manifest；保留 Webpack | 人工比较文件清单、入口、主题编号、reset/IIS 约定；旧构建可回退 |
| P05 | Vite 唯一构建切换 | 默认开发/发布命令转 Vite；正式产物写入 `dist`；删除仓库自有 Webpack 配置、脚本和直接依赖，第三方传递依赖除外；回滚通过 Git 恢复 P04 | 人工确认开发/发布流程、固定 URL 和部署产物；Node server 若需运行，使用可用 subagent 并记录无法锁定具体模型 |
| P06 | 目标源码边界 | 建 `src/app/pages/features/entities/shared/integrations`；写明 owner/依赖规则；只把 `Main.tsx` 和最小 bootstrap/providers 机械迁入新目录 | 新旧代码可共存；入口行为不变；其余文件按 5.1 的归属阶段迁移 |
| P07 | `Utility.tsx` 拆分与解环 | 先纯函数/平台，再领域 service；保留 facade；去掉 Utility→Component/Store 反向依赖 | 三个已确认环均从源码关系上解除；旧调用行为未主动改变 |
| P08 | TypeScript 过渡基线 | 先升 TS 5.9 兼容档；现代 target/moduleResolution/JSX；新旧 tsconfig 分区 | 新 `src` 使用现代语法；冻结 UBB 走兼容配置；不在此阶段开全仓 strict |
| P09 | Redux Store 基础 | `configureStore` 原样承载旧 reducer；typed hooks；listener middleware 与应用级 `CrossTabSync` 空壳；写明状态所有权 | 旧 reducer/`connect` 仍可用；同步 key 白名单为空或仅作兼容转发；没有同一远端数据的第二份 Store |
| P10 | 函数组件 A | 在 React 16.14 上迁纯展示叶子组件，同时归位到对应 entity/feature/page | 每个组件有路径映射、前后对照文档和人工页面审核 |
| P11 | 函数组件 B | 在旧 runtime 上迁简单 local state 与可清晰映射 lifecycle 的组件，同时归位 | state、effect、cleanup、事件顺序和新 owner 逐项审核 |
| P12 | UI/React peer 阻塞收口 | 建 `shared/ui`；分步升级 AntD；隔离 BizCharts/Lazyload/editor 等旧 peer；梳理 Bootstrap/Icon 重叠 | 代表页面/弹窗人工核对；不改冻结 UBB 源码，不靠长期 peer 忽略参数掩盖冲突 |
| P13 | React 18.3 runtime | 只处理 React/ReactDOM runtime、root/provider 和已知兼容警告 | 人工核对启动、导航、表单和 timer 行为；不改 Router 或继续函数化 |
| P13.5 | Router 去伪依赖与迁移清单 | 删除已证明未被读取的 service `router` 参数和 `this.context.router` 类型假声明；固化公开 URL、嵌套 Router、class route props 与 P14 兼容桥退出清单 | 请求参数、返回值、错误副作用和现有 Router 4 运行时不变；Message/Focus/Search/Topic 代表路径人工核对；不升级 Router、不改 Store |
| P14 | Router 与持久壳层 | 在 P13.5 清单上迁现代单一 Router；移除 `react-router-redux`；route lazy；Header/Footer/Store 持久；临时 class route props 桥明确由 P15 删除 | 旧 URL/IIS deep link/前进后退/页内导航经人工核对；嵌套 BrowserRouter 与 Redux 路由副本均已移除 |
| P15 | 函数组件 C | Redux/Router/复杂 lifecycle/壳层组件；高风险文件小批次并归位到 app/page/feature | `ErrorBoundary` 与 UBB 例外保留；每批独立确认 |
| P16 | 公共读路径服务端状态 | 首页、Board、Topic read、Feed、Search 逐领域迁 RTK Query | 请求参数、分页、缓存/刷新时机和错误呈现人工核对 |
| P17 | 用户与收藏服务端状态 | 建立完整 `CurrentUser` 聚合；迁 User、User Center、profile/theme/topicView/history/customBoards/follow/favorite；收口现有完整 `userInfo` 跨标签页兼容桥 | 跨端设置未被拆成独立本地偏好；逐字段/API 映射人工确认；`showCardUser` 服务端合同缺口先确认再处理；其他认证改动另行授权 |
| P18 | 消息服务端状态 | message list/unread/read/send；保留 `messageCount` storage 合同但不挂载当前未启用的控制器；继续不启用 SignalR | HTTP 消息路径人工核对；无实时连接，也不新增原运行时不存在的跨标签页行为 |
| P19 | 写操作与管理状态 | 发帖、回复、编辑、上传、签到、moderation 的 mutation 边界 | 不修改 UBB 引擎；请求/跳转/草稿/错误行为逐项审核 |
| P20 | SCSS 与主题体系 | tokens、显式 theme manifest、`@use`、按 feature 拆分、去重 | 29 个主题映射保留；人工视觉路径审核；无自动渲染 |
| P21 | 遗留代码与依赖清理 | 移除 facade、旧目录，确认无用的 SignalR/polyfill/dependency | 每项有无引用证据和人工批准；水印、UBB 冻结边界不动 |
| P22 | React 最终受支持版本 | 在组件/UI 迁移完成后评估并进入当前受支持 React 19 | 只处理 runtime 差异；人工路径确认 |
| P23 | TypeScript 最终严格化 | 评估 TS 6；strict 按目录收口；冻结岛保留显式兼容项目 | 新主体 strict；所有例外有路径、原因和后续计划 |
| P24+ | 旧缺陷逐项修复 | 每个缺陷单独一个微阶段，不批量修 | 每项都有旧行为、新行为、影响面和独立人工批准 |
| P-FINAL | 最终人工验收 | 路由、登录、主题、读写、消息、管理、部署文档 | 人工签字后才允许最终清理/提交 |

## 11. 已知缺陷/风险台账（只记录，不在主体阶段修）

当前至少应登记：

- Board 新旧路由遮蔽、同组件参数变化时不重新取数、浏览器 back/forward 与列表状态可能不同步。
- `/error/404`、`/error/500` 与现有 route 声明不一致。
- Message/Focus 存在嵌套 BrowserRouter 风险。
- `Reducers/Post.tsx` 存在但未注册，且 reducer 声明为 async；不得在迁移中“顺便启用”。
- 部分 thunk 直接修改 `getState()` 返回数组/对象，绕过 reducer。
- 消息组件直接 `Store.getState()`，可能不随更新重新渲染。
- `Reducers/UserInfo.tsx` 含 storage/IndexedDB 副作用，且登录状态对象合并顺序存在风险。
- `STATE-USER-001`：完整当前用户同时存在于 Redux、localStorage 和 IndexedDB，且大量调用直接 `getMyInfo()` 绕过响应式 Store；迁移只收敛事实源，不改变字段语义。
- `STATE-USER-002`：业务要求 `showCardUser` 随账号跨设备同步并属于完整 `CurrentUser`，但当前前端只发现 localStorage/reducer 路径，`UserInfo` DTO 与服务端写回路径中未发现对应字段；P17 前只记录，不推测或补造 API。
- `STATE-USER-003`：`browsingHistoryEnabled` 在完整 `currentUserInfo` 外又维护一份 reducer 字段，相关 thunk 直接修改 `getState()`；属于重复事实源。
- `STATE-USER-004`：`CHANGE_USER_HISTORY_POSTS` 有 action 无 reducer case，`hotPosts` 写入后无已确认消费者，`USER_LOG_ON` 的对象展开顺序可能覆盖目标状态；主体迁移保持现状，P24+ 分项处理。
- `Header.tsx` 和 `NotificationController.tsx` 使用匿名跨标签页监听、直接解析 `str-`/`obj-` 前缀且未统一 cleanup；`reset.html` 清空 storage 时的 `key === null` 语义也未集中处理。主体迁移只收口边界，不顺便改变业务行为。
- 认证实现中存在前端硬编码的 OIDC client secret；只登记字段和路径，不在文档复制 secret 值。
- `config.Production.json` 是未跟踪的部署时可选覆盖配置；大小写敏感环境必须保持运行时代码使用的精确文件名。
- `Utility/boardInfoJson.ts` 与 `public/static/boardinfo.json` 数量不一致，TS 数据独有 board id 788。
- UBB 自定义 engine/options/handler 注册存在已知语义风险；因 UBB 冻结，本轮只登记。
- `SignalR.ts` 存在但 `NotificationController` 未挂载，当前应保持“不连接”。

缺陷台账必须给每项稳定 ID。迁移阶段若触及相关代码，只能保持旧可观察行为或停下申请独立修复批准。

## 12. 每阶段人工交付物

每个 `docs/refactor-log/phase-XX/` 至少包含：

- `scope.md`：本阶段唯一大事、允许/禁止触及范围；
- `file-map.md`：旧文件、当前文件、移动/适配关系；
- `manual-checklist.md`：人工查看的页面、路由、主题和操作；
- `known-defects.md`：本阶段发现但未修的旧问题；
- `before-after.md`：关键调用、状态和行为对照；
- `components/`：该阶段所有 class → function 的逐组件文档；
- `server-run.md`：若运行 Node server，记录 subagent、模型确认、PID/端口、启动/停止和端口释放；
- `approval.md`：人工确认内容和提交授权。

阶段结束顺序固定为：

1. 停止改动；
2. 停止本阶段启动的所有服务；
3. 整理未提交 diff 和人工文档；
4. 报告未验证项、已知缺陷和回滚方式；
5. 等待人工确认；
6. 获确认后才提交；
7. 再次等待下一阶段授权。

## 13. 现有 refactor 分支处理建议

仓库当前记录了 `Forum-frontend-refactor` worktree，但其 gitdir 指向不存在的位置；`refactor/frontend-modernization` 分支仍存在，并比 `main` 多 5 个提交。

该旧分支包含有价值的架构/路由/状态/缺陷调研，但也包含：

- 自动 artifact/reproducibility 脚本；
- 与本轮“不使用自动化检查”冲突的阶段门禁；
- 计划修改 UBB renderer 的阶段；
- 与本轮主体无关的主题文件和二进制图片变化。

推荐的 P00 落盘顺序：

1. 用户确认 P00；
2. 从当前 `main` 创建本地 `dev20260716`；
3. 只提交本 V2 计划文档，不提交其他文件；
4. 停止并报告 P00 提交结果；不自动执行 P01，也不自动 push。

推荐在 P01：

1. 保留旧分支不动，作为只读历史资料；
2. 主工作区切回 `main`，将 `dev20260716` 挂到新的兄弟 worktree；
3. 人工选择性迁移旧分支的文档事实，不 cherry-pick 旧自动化脚本和无关二进制；
4. 以本 V2 规则重写阶段日志；
5. P01 完成后保持未提交状态，等待人工确认。

在用户确认 P00 前，不执行 worktree 修复、分支创建、cherry-pick、提交或业务代码迁移。
