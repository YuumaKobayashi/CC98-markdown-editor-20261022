# Phase 5：API 边界与类型分层计划

计划日期：2026-08-03

本计划承接 Phase 4，只定义后续实施顺序和验收门禁，不代表任何子批已经开始。基线为前端提交 `b33f9dd6`；主后端契约基线仍为 `c46f2fa4d340c606b42764a05d106f178d91bc3c`。

## 1. 目标

1. 分开 wire DTO、ViewModel、表单状态和组件 Props。
2. enum 与所属 DTO/模型放在一起，不再按语法类别统一放入 `enums.ts`。
3. 所有后端网络请求集中到对应 module 的 `api/`；UI、model 和 Redux thunk 不直接拼 URL、Header、method 或 body。
4. 松开“跨 module 所有内容必须从根 `index.ts` 导出”的约束，允许稳定的 `api/model/ui` 子路径。
5. 使用真实浏览器响应核验不确定的 wire 字段，不用后端声明或单次样本盲目收窄类型。
6. （已放弃）原计划移除前端 API 函数中的裸字符串错误哨兵并建立统一错误合同；放弃记录见 P5.5。

## 2. 当前基线

- 当前工作树在制定计划时为 clean。
- 现有 42 个 DTO-like 类型、5 个 `ViewModel`；其中 `UserViewModel` 没有真实转换过程，需要优先重新分类。
- 2026-08-03 静态复扫确认 9 个活动 DTO -> ViewModel/展示模型族、19 个 module service 活动加工现场，集中在 Topic、Post、Message、Notification 4 个 module；无消费者的 `getCurUserTopic`、`getAnonymousTraceTopics` 等 dormant 路径不计入。Route/UI 另有至少 4 个 Form/展示混层现场。
- 当前 18 个业务 module 拥有 `api/`：其中 16 个本来就是单个 `service.ts`，只有 User（3 个 API 文件）和 Session（4 个 API 文件）按查询缓存、认证、刷新、历史等职责自然拆分。Topic `service.ts` 为 1394 行、27 个导出函数，是明确需要按业务子能力拆分的特例；该证据不支持全仓按 `get/update` 或一 endpoint 一文件拆分。
- 当前有 5 个组件 Props 声明误放在 4 个 `model/types.ts`：Message 的 `MessageSendReceiveProps`，Notification 的 `MessageResponseProps` / `MessageSystemProps`，Editor 的 `EditorVoteSettingsProps`，Home 的 `MainPageTopicMoreProps`。迁移时回到对应 `ui` owner；其中名字实际描述数据项而非组件输入的类型先重命名，再决定是否属于页面局部模型。
- 有 16 个文件在 `api/` 之外直接调用 `cc98Fetch/fetch`。
- `application/routes` 下仍有 3 个 Route 私有 API：Board、Editor、Topic Detail。
- 19 个 module 根 `index.ts` 承担 306 处根 barrel import；当前跨 module 深层 import 为 0。
- API 目录约有 120 个裸字符串返回分支，主要集中在 Moderation、Post Rating、Board、Favorite Topic、Topic 和 Posting。
- 制定计划时内建浏览器曾返回 `Browser is not available: iab`；P5.0 已恢复并完成获准登录后的只读基线，后续仍遵守第 7.1 节安全边界。

## 3. 类型与目录规则

### 3.1 类型分层

| 类型 | 含义 | 放置位置 |
| --- | --- | --- |
| DTO | API 实际发送或接收的 wire 数据 | `module/model/dto.ts` |
| ViewModel | DTO 经前端查询、补充或格式化后的结果 | `module/model/view-model.ts` |
| Form/Draft | 页面编辑中的本地状态 | `application/routes/<route>/model` |
| Props | 单个组件需要的参数 | 默认与 owner 组件共置于 `.tsx` |
| State | Redux、Session、页面状态 | 对应 `model` owner |

约束：

- `api/` 只放请求、响应处理和紧邻函数的 operation result 合同，不声明 DTO、ViewModel、Props 或页面状态。
- DTO 必须忠实描述 wire 字段，不混入 UI 字段。
- 没有真实转换过程时不创建 ViewModel。
- DTO 与 ViewModel 同时存在时必须分别放在 `model/dto.ts` 与 `model/view-model.ts`，禁止继续共置于同一个 `types.ts`；只有 DTO 的 module 只保留 `dto.ts`，不创建同形 ViewModel 文件。
- response DTO 与 request DTO 都属于 wire DTO，统一放在该 module 的 `model/dto.ts`，用清晰的类型名区分，不再为 request DTO 单独建立文件；Form/Draft 仍留在 Route。
- enum 与拥有它的 DTO 或 ViewModel 共置于 `dto.ts` / `view-model.ts`，不再建立统一 `enums.ts`。
- DTO 是 API 边界取得的原始数据，不得为了展示、补充查询或错误兜底而原地改写；禁止通过 `as MutableXxx`、交叉类型或扩大同名字段类型，把 DTO 伪装成 ViewModel。
- ViewModel 只表达真实存在的前端转换。展示值使用独立字段，例如保留 `hitCount: number`，另建 `hitCountText: string`；不得把 wire 数字、展示字符串和 `false/null` 错误哨兵合并到同一字段。
- ViewModel 不机械复制整份 DTO：页面需要大部分原始字段时采用组合，需要少数字段时采用 `Pick`/明确投影；不得用继承覆盖 DTO 同名字段的类型。
- Form/Draft 可以保留空字符串、未选择、临时字符串和组件值；提交前必须经显式转换生成 Request DTO。Request DTO 不得接受后端不支持的 `false`、非法字符串或 UI sentinel。
- Props 默认在 owner 组件 `.tsx` 内声明；需要被父子或兄弟组件复用时从最接近的 owner 组件导出类型。只有没有单一 owner 或会形成循环依赖时，才在对应 `ui/` 内建立局部类型文件；禁止放入 module/Route 的 `model/dto.ts`、`view-model.ts` 或公共根类型出口。
- Props 只描述组件输入，可以引用 DTO/ViewModel 或用 `Pick`/明确字段投影；不得反向被 DTO、ViewModel、mapper 或 API service 依赖，也不得把 Props 当作请求体传给 API。
- `null`、字段缺失、空数组和 action 返回空对象的语义逐 endpoint 判定：必须检查 Controller/action 分支、实际投影、C# nullable、JSON 属性/序列化配置及可获得的真实响应，不设置前端统一返回约定。只有这些证据支持时才允许收窄或建立 endpoint 专属 DTO；不得以“消除联合类型”为由错误改写后端真实行为。

### 3.2 Mapper 规则

不为没有 ViewModel 的 module 创建空 `mappers.ts`；只要 module 存在真实 DTO -> ViewModel/展示模型转换，就统一建立一个 `model/mappers.ts`，该 module 的转换不得散落在 endpoint 或组件文件中。

当前 9 个活动转换族及 mapper 归并如下；“现场数”表示现有重复加工入口，不表示要建立同等数量的 mapper 文件：

| owner | DTO -> ViewModel / 展示模型 | 当前活动现场 | mapper 决策 |
| --- | --- | ---: | --- |
| Post | `PostInfo` -> `PostViewModel` | 5 | 共享 mapper；统一匿名、删除、用户信息和兼容 `postId` 组装 |
| Post | recent-post response -> `UserRecentPost` 页面项 | 1 | 收入 Post `mappers.ts`，不因单入口散落到 endpoint |
| Topic | `TopicInfo` / `SearchedTopicInfo` -> `FocusTopic` 展示模型 | 5 | 共享 mapper；时间、计数、标签、版面、头像和匿名展示分开处理 |
| Topic | `RecommendedTopicInfo` -> `RecommendedTopic` 展示模型 | 1 | 在 Topic `mappers.ts` 中组合 Topic 展示 mapper |
| Topic | recent-topic / browsing-record DTO -> `UserRecentTopic` 页面项 | 2 | 两个入口共享 mapper；DTO 不再预先声称含补查得到的 `boardName` |
| Message | `MessageInfo` -> `MessageViewModel` | 1 | 共享纯 mapper；计算 `showTime`，不修改消息 DTO |
| Message | `RecentContactUserInfo` + `UserBasicInfo` -> `MessagePersonInfo` | 1 | 共享组合 mapper；用户查询在 mapper 外完成 |
| Notification | `SystemNotificationInfo` -> `SystemNotificationViewModel` | 1 | Notification mapper；补楼层展示值 |
| Notification | `ReplyAtNotificationInfo` + Topic/Board 信息 -> `ReplyAtNotificationViewModel` | 2 | reply/@ 两入口共享 mapper |

因此当前固定建立 **4 个 `mappers.ts` 文件**，承载 **9 个逻辑 mapper 入口**：Topic 文件 3 个、Post 2 个、Message 2 个、Notification 2 个。所有入口无论长短、是否只有一个消费者，都进入 owner module 的 `model/mappers.ts`；文件内部可以保留不导出的组合 helper，只导出 API producer 实际需要的转换函数。现有 `UserViewModel` 没有真实 DTO 转换，不计入这 9 组，也不为 User 创建 `mappers.ts`；应在消费者闭包确认后改为 DTO、Props/投影或删除兼容字段。

- DTO 与 ViewModel 类型分别放入 `model/dto.ts` 和 `model/view-model.ts`；全部 DTO -> ViewModel 转换统一放入同 module 的 `model/mappers.ts`。
- `mappers.ts` 可以同时包含多个同 owner 的短转换，不因单一调用者拆回 endpoint；不同业务 owner 的 mapper 不合并成全局转换层。
- mapper 必须是纯函数，不自行发请求、不修改输入 DTO，返回新对象；同一输入与依赖必须得到同一输出。迁移后的 mapper 参数使用 `Readonly<TDto>` / `readonly TDto[]` 表达只读边界，嵌套对象按真实修改面逐步收紧，不一次性伪造全仓 deep readonly。
- API service 负责取得 DTO 和依赖数据，再调用 mapper 组装 ViewModel。
- 补充查询由 API service 在 mapper 之前完成，并作为显式依赖传入；查询失败进入错误合同或明确的 ViewModel fallback，不写回 DTO 字段。
- DTO 到 ViewModel、Form 到 Request DTO 的转换必须从函数签名可识别；禁止在组件内依靠断言把一种模型冒充为另一种模型。

### 3.3 类型收窄、泛型与函数拆分

- 禁止使用 `as unknown as T`、先断言为 `unknown` 再转成目标类型，或其他双重断言跨越不兼容模型；这类写法不是类型转换，也不能作为 DTO -> ViewModel 的实现。
- P5 暂不引入通用 runtime schema/parser。真正动态或尚未验证的 JSON 保持 `unknown` 并登记来源、消费者和移除条件，不通过断言转成领域 DTO/ViewModel；待独立运行时校验批次再决定具体技术方案。
- 一个 API 函数应对应明确的 endpoint 能力和稳定返回模型。若不同调用模式会改变 URL、补充查询、投影字段、匿名 fallback 或错误语义，优先拆成语义明确的函数，不用宽联合返回值维持一个大函数。
- 多个函数只有在请求协议、控制流和容器结构真实同构时才使用受约束泛型，例如 `ResultWithCount<T>`；泛型参数必须能从参数或 endpoint 映射推导，禁止由调用者任意指定 `T` 后在函数内部强制断言。
- 对少量字段差异且类型关系可静态表达的能力，可以使用泛型、overload 或 discriminated 参数；若需要在实现中大量分支、双重断言或原地补字段，则直接拆函数。
- Topic 当前 `getTopic`、特定用户首帖、匿名追踪等函数在 P5.3 按 endpoint、raw DTO 和 ViewModel producer 重新划分；允许直接拆成独立函数，不要求为复用而强行保留统一 `getTopic` 抽象。

### 3.4 最终业务代码目录架构

目标依赖方向：

```text
application  ───────>  modules  ───────>  foundation
     │                   │                   │
页面编排、路由、状态      业务能力与领域类型      无业务语义的基础能力
```

最终目录蓝图：

```text
src/
├─ application/                         # 应用装配与页面编排
│  ├─ bootstrap/                        # 应用启动、根挂载
│  ├─ providers/                        # React 全局 Provider
│  ├─ router/                           # 路由表、导航和兼容桥
│  ├─ layouts/                          # 跨 Route 页面骨架
│  ├─ store/                            # 全局 Redux 装配；只保留真正全局状态
│  ├─ compatibility/                    # 有明确删除条件的旧入口/桥接层
│  └─ routes/
│     └─ <route>/
│        ├─ index.ts                    # Route 稳定入口
│        ├─ ui/                         # 页面、局部组件及其 producer-owned CSS Module
│        │  ├─ <Route>Page.tsx
│        │  └─ <Route>Page.module.scss
│        ├─ model/                      # 页面 state、Form/Draft、Route 参数
│        │  ├─ <route>-form.ts
│        │  ├─ <route>-state.ts
│        │  └─ <route>-params.ts
│
├─ modules/                             # 按业务能力划分
│  └─ <capability>/                     # 如 topic、post、user、notification
│     ├─ api/                           # 该能力拥有的 endpoint 与响应处理
│     │  ├─ service.ts                  # 默认：该 module 内聚的 API 集合
│     │  └─ <sub-capability>.ts         # 仅过大时按业务子能力拆，不按 get/update 拆
│     ├─ model/                         # 领域类型和纯转换
│     │  ├─ dto.ts                      # response/request DTO 及其所属 enum
│     │  ├─ view-model.ts               # 可选；仅真实补充/格式化/聚合结果
│     │  └─ mappers.ts                  # 可选；存在 ViewModel 时与其配套
│     ├─ cache/                         # 可选；该业务能力拥有的缓存/持久化适配
│     ├─ ui/                            # 可跨 Route 复用的业务组件；Props 默认写在组件 .tsx
│     ├─ internal/                      # 可选；不允许跨 module 使用的实现细节
│     └─ index.ts                       # 可选兼容 facade；不是唯一公共入口
│
└─ foundation/                          # 不含 CC98 业务语义
   ├─ api/
   │  ├─ http.ts                        # cc98Fetch 等通用 HTTP 基础设施
   │  ├─ contracts.ts                   # 通用 wire wrapper
   │  └─ errors.ts                      # P5.5 原提案，已放弃，不创建
   ├─ config/                           # 启动配置
   ├─ integrations/                     # 第三方库适配器
   ├─ lib/                              # 通用纯函数
   ├─ storage/                          # 通用存储基础设施
   ├─ styles/                           # Foundation 样式入口/令牌
   ├─ theme/                            # 主题运行时与 manifest 合同
   ├─ types/                            # 第三方/资源声明，不放业务 DTO
   └─ ui/                               # 无业务语义的基础 UI
```

目录约束：

- 目录按真实职责按需创建，不为套模板生成空 `api/model/ui/cache/internal` 或空 `index.ts`。
- Route 最终不保留可下沉的后端 `api/`；它只组合 module API、维护交互顺序、Route 参数、页面 state 和仅页面使用的 Form/Draft。
- module `api/` 默认使用一个内聚的 `service.ts`，不按 GET/POST/PUT 或一 endpoint 一文件机械拆分。只有 Topic 这类明显过大的 API 才按 detail、list/search、history 等业务子能力拆文件；同一业务能力的读写可以共置。
- response/request DTO 统一进入 `model/dto.ts`；ViewModel 单独进入 `model/view-model.ts`，两者不得共置。Form/Draft 留在 Route，不在 module 中再建立一套 form 文件。
- 同一 module 只建立一个 `model/mappers.ts`；有真实 DTO -> ViewModel 转换时必建，没有 ViewModel 时不创建空 mapper 文件。endpoint 和组件不得各自保留另一份同类转换。
- mapper 只依赖 DTO、显式补充数据和 Foundation 纯函数；不得依赖 React、Route、Redux store 或自行请求。
- module `ui/` 只放多个 Route 可复用的业务 UI；单页面组件留在 `application/routes/<route>/ui`，不为形式复用上提。
- Props 跟随组件留在对应 `ui/*.tsx`；除确有多个 UI owner 且无法由其中一个导出外，不新增独立 `props.ts`。现有放在 `model/types.ts` 或根 `index.ts` 的 Props 在迁移对应组件闭包时移回 UI。
- module 间只能使用对方稳定的 `api/model/ui` 子路径或保留期内 facade；禁止访问 `internal`，module 内禁止 self-barrel。
- `foundation` 不导入 `modules` 或 `application`；module 不导入 `application`。跨 module 依赖逐项检查循环依赖和业务 owner，不用公共目录掩盖归属。
- compatibility、旧根 facade 和 dormant 出口必须附消费者、保留原因和删除条件；只在对应闭包归零并通过人审后删除。

## 4. 网络请求所有权

目标规则：`cc98Fetch` 只能出现在 `foundation/api` 或各 module 的 `api/` 中。

| 当前请求 | 目标 owner |
| --- | --- |
| BoardList、Board Route 请求 | Board；跨资源部分拆给 Topic/Moderation |
| Recent Topic/Post | Topic/Moderation |
| 用户资料、头衔、头像 URL | User |
| 文件上传 | Upload |
| 主题设置 | User Preference |
| 补签日历 | Daily Signin |
| unread count | 请求放 Notification API；Redux thunk 留在 Notification model |
| Topic Detail Route API | Topic/Post/Follow 等 endpoint owner |
| Editor Route API | Board/Post/Posting |

边界：

- API 函数接收 primitive、DTO、`File/Blob` 等数据，不接收 React state setter、DOM event 或 AntD FormInstance。
- 页面继续拥有交互顺序和 UI state；不能因为集中请求就把整个组件工作流搬进 API。
- module API 是否向 Route/UI 返回原始 `Response` 暂时保持 P5.4 结束时的现状。原计划在 P5.5 统一闭合 status、JSON 读取和错误转换，现已放弃；后续只有具体 endpoint 确有需求并单独评审时，才做局部调整。
- `foundation/config/runtime-config.ts` 的启动配置加载属于 Foundation 特例，不强行迁入业务 module。
- `/static/portrait.json` 是共享用户展示资源，由 User API 提供统一读取入口。

## 5. 公共入口规则

根 `index.ts` 从“所有内容总出口”改为可选的稳定 facade。

允许：

```ts
import { getBoardInfo } from "@modules/board/api/service";
import type { BoardInfo } from "@modules/board/model/dto";
import { UserProfileAvatar } from "@modules/user/ui/UserProfileAvatar";
```

不新增 `api/index.ts`、`model/index.ts` 或 `ui/index.ts` 这类子 barrel；直接从 `service.ts`、`dto.ts`、`view-model.ts` 或具体 UI 文件导入。旧根 `index.ts` 只作为迁移期兼容 facade。

迁移规则：

- 先允许稳定子路径，旧根入口继续兼容。
- 不一次性改写全部 306 处 import。
- 每完成一个 module，再删除该 module 已无消费者的根出口。
- module 内部使用相对路径，禁止 self-barrel import。
- cache 和 internal helper 不因存在就自动成为公共 API。
- 每批检查循环依赖、初始 JS 和 lazy chunk；历史 root barrel 曾造成 57,891 字节初始 JS 增长，不能只依赖 tree-shaking 假设。

## 6. 错误合同

状态：已放弃（2026-08-04）。本节以下内容仅保留为 P5.5 的历史设计提案，不再作为当前实现规则、迁移要求或 Phase 5 完成条件。放弃原因是主后端没有统一、稳定的错误响应范式，前端实际需要区分错误的场景较少；全局 `ApiFailure`、通用转换 helper 和 discriminated result 会引入与收益不匹配的复杂度，并可能把不稳定的后端行为误建模为稳定合同。后续错误处理按具体 endpoint 和真实 UI 需求局部处理，不预设全仓统一抽象。

### 6.1 普通 API 失败

位置与职责：

- `foundation/api/errors.ts` 只定义共享 `ApiFailure` 及 HTTP status、网络失败、响应解析失败到 `kind` 的通用转换，不包含 Topic/User 等业务判断。
- module `api/service.ts` 负责检查 status、读取/解析 JSON，并调用共享转换；不得把技术失败吞成 `undefined/null/false`、空数组或裸字符串，也不得把原始 `Response` 交给 Route/UI。
- endpoint 合法返回 `null`、空数组、字段缺失或空对象时，按后端 action 合同保留为成功 DTO，不得被通用错误 helper 误判为失败。
- Route/UI 只按 `ApiFailure.kind` 决定跳转、提示或重试，不比较 `message`、裸字符串或 HTTP status；业务组件不导入底层 `Response` 转换 helper。

统一使用最小错误结构：

```ts
export interface ApiFailure {
  kind:
    | "unauthorized"
    | "forbidden"
    | "not-found"
    | "validation"
    | "server"
    | "network"
    | "invalid-response";
  message?: string;
  status?: number;
}
```

- `kind` 是程序分支依据。
- `message` 是页面提示或兜底说明，不参与逻辑判断。
- `status` 保存可用的 HTTP 状态码；断网时可以不存在。
- 第一版不增加 `code/cause/details/retryable/url/method`。

普通查询成功返回 DTO，普通命令成功返回 `void`；失败抛出结构化错误，不再返回裸字符串。

### 6.2 预期的业务规则拒绝

评分等具有多种正常拒绝分支的操作使用 discriminated result：

这类 result 是单个 module API 函数的调用合同，类型紧邻对应 `service.ts` 导出；不放入 `dto.ts`、`view-model.ts`，也不建立全局 business-error 模型。

```ts
export type RatePostResult =
  | { ok: true }
  | {
      ok: false;
      error: {
        kind:
          | "cannot-rate-self"
          | "already-rated"
          | "post-too-old"
          | "not-qualified";
        message?: string;
      };
    };
```

规则：

- 正常业务拒绝返回 `{ ok: false, error }`。
- 网络、500 和无法解析等技术错误仍走 `ApiFailure`。
- 成功且没有数据时返回 `void` 或 `{ ok: true }`。
- 禁止新增 `"ok"/"error"/"unauthorized"` 等裸字符串结果。

### 6.3 迁移边界

- 请求搬迁和错误合同改变不得混在同一个子批：先等价迁移，再单独修改返回协议和消费者。
- 先处理可用只读场景验证的 Board 查询，再处理 Favorite Topic 等简单命令，最后处理 Moderation/Post Rating 的业务拒绝。
- dormant service 继续登记；重新启用或删除前另行证明可达性。

## 7. 浏览器契约核验

浏览器同时用于改前取证和改后验收：

```text
修改前记录 raw response
    -> 实施 API/类型改动
    -> 修改后重复同一请求和页面路径
    -> 比较 URL、method、query、status、字段形状和 UI
```

每个不确定 wire 字段记录：

- 字段是否存在；
- `null` 与缺失的区别；
- number/string 的实际类型；
- 时间格式；
- 正常、空数据、匿名和无权限分支。

单个样本不能证明完整合同。只有后端源码、真实响应和所有 producer 一致时才能收窄；前端自行格式化产生的宽类型应改 ViewModel，不靠浏览器证明。

### 7.1 授权和安全边界

- 已获准在内建浏览器中提交一次测试账号登录；登录可能更新最后登录时间。
- 账号和密码不得写入源码、文档、日志或测试 fixture。
- 登录后默认只执行 GET/read-only 请求，不读取 cookie、localStorage 或浏览器密码存储。
- 避免进入会自动签到、标记通知已读或修改偏好的页面。
- 所有写操作仅允许作用于版面 `245`，并且每次执行前必须列出 endpoint、method、payload、预期数据和清理方案，等待用户明确批准。
- 用户资料、头像、主题、签到、关注、通知已读、私信和收藏版面等账号级写操作不属于版面 `245`，当前不授权实测。
- 内建浏览器不可用时停止浏览器工作，不擅自改用 Chrome、Playwright 或脚本直连。

## 8. 实施顺序

### P5.0：基线与规则冻结

- 固化本计划中的类型、API owner、公共入口和错误合同规则。
- 输出 endpoint -> owner、宽类型分类、字符串错误消费者清单。
- 内建浏览器恢复后，先采集公开 GET 和已授权登录后的只读基线。
- 不改业务代码。

执行结果见 [`p5.0-baseline.md`](./p5.0-baseline.md)：规则与三份清单已冻结；内建浏览器已从 `http://127.0.0.1:25174/` 完成公开、登录后只读基线，并扩展核验 6 个版面的标签响应。除获准登录外未执行业务写请求；主题详情失败黑框作为既有 CSS 缺陷留待其他批次。当前停在人审点，不自动提交、推送或开始 P5.1。

当前宽类型、真实 nullable、ViewModel/Form 混层、service 错误哨兵与 `api/` 外 JSON 边界的核验入口见 [`p5.0-wide-api-types.md`](./p5.0-wide-api-types.md)。该清单原定作为 P5.2-P5.5 的实施输入；P5.5 已放弃，其中错误合同相关条目不再进入本阶段实施，不代表其他宽类型已经清理或所有 endpoint 已完成运行时 schema 验证。

验收：清单闭合；浏览器未执行项和原因明确；停在人审点。

### P5.1：公共入口松绑

- 允许稳定的 `api/model/ui` 子路径。
- 选择一个小 module 验证导入规则，不批量迁移全部 import。
- 根 `index.ts` 保持兼容，不删除现有出口。

执行结果见 [`p5.1-public-entry.md`](./p5.1-public-entry.md)：以 `favorite-topic` 为试点，将 6 个外部根入口消费者按职责切换到 `api/model/ui` 稳定子路径；根 facade 保持兼容，循环 SCC 未新增，正式 chunk 只有可归因的 owner 命名与引用长度变化。typecheck、build、diff check 和本地只读浏览器烟雾测试通过；当前停在人审点，不自动提交、推送或开始 P5.2。

验收：typecheck、build、diff check、循环依赖和 chunk 对比；基础页面浏览器烟雾测试；停在人审点。

### P5.2：低耦合只读 API 迁移

按小组迁移 BoardList、用户头衔、Recent Topic/Post、unread count、portrait 配置和 Daily Signin GET。

每组顺序：后端 Controller/action/投影/序列化取证 -> 可安全执行时的改前浏览器 GET 取证 -> 等价搬迁 -> response/request 类型归入 owner `model/dto.ts` -> 有真实转换时建立 `view-model.ts` / `mappers.ts` -> Form/Draft 保持在 Route 并显式生成 Request DTO -> 改后浏览器对照。不得在同一子批改变错误返回协议。

每组分层时必须先列出 raw DTO producer、原地修改点、补充查询、格式化字段、Form sentinel 和全部消费者；mapper 改为返回新对象后，再逐一迁移消费者。没有真实转换的类型保持 DTO 或组件 Props，不为满足目录形式创建空 ViewModel。

Recent Topic/Post 子组在本批先建立 Topic/Post 的 `dto.ts`、`view-model.ts` 和唯一 `mappers.ts`，只迁移 recent-topic、browsing-record、recent/hot-post 三条已纳入本批的转换；Topic/Post 其余 mapper 入口留到 P5.3，不建立第二个 mapper 文件。

执行结果见 [`p5.2-low-coupling-read-api.md`](./p5.2-low-coupling-read-api.md)：六个子组的只读请求已迁入对应 API owner，Topic/Post 建立唯一 DTO、ViewModel 与 mapper 分层；改前/改后 11 个只读 GET、页面烟雾、typecheck、build、diff check、循环 SCC、chunk 和字节格式检查均已完成。Daily Signin POST、通知已读、偏好/历史切换和资料提交等未获授权操作均未执行。当前停在人审点，不自动提交、推送或开始 P5.3。

验收：请求 URL/method/query、返回形状和页面行为一致；目标 wire/request DTO 不存在无依据的 `number | string`、`false`、`any`，无 DTO 原地展示性改写；停在人审点。

### P5.3：核心 module 类型与 API 收口

顺序：User/Session -> Notification/Message -> Board -> Topic/Post -> Site Content。

- 按 module 纵向将 wire 类型收口到唯一 `model/dto.ts`，有真实展示转换时建立唯一 `model/view-model.ts` 与 `model/mappers.ts`；不做一次性全仓文件搬迁。
- `UserViewModel` 优先查清真实 producer；无转换则改为兼容类型或删除。
- 接续 P5.2 已建立的 Topic/Post `mappers.ts` 完成剩余转换入口；Notification、Message 各建立一个 `mappers.ts`。最终仍只有 Topic、Post、Message、Notification 4 个 mapper 文件，其他 module 不创建空文件。
- Message/Notification 子组把 `MessageSendReceiveProps`、`MessageResponseProps`、`MessageSystemProps` 移回对应 UI owner；Site Content/Home 子组处理 `MainPageTopicMoreProps`，若它实际是链接数据项则重命名为页面局部模型，不继续伪装成 Props，也不进入业务 DTO。
- 每个 DTO 先核对对应 endpoint 的 Controller/action 返回分支、LINQ/手工投影、C# nullable、JSON 属性和 serializer 行为；公开或已授权的只读接口在内建浏览器可用时补正常、空数据、匿名和无权限样本。无法安全实测的字段保留宽类型并记录原因。
- Topic/Post 优先拆除 `FocusTopic` 一类在 raw DTO 上原地改写计数、标签、用户和媒体字段的流程：保留数值/id wire 字段，以独立展示字段承接格式化结果和补充查询结果。
- Topic/Post 清除现有 `as unknown as PostViewModel` 一类双重断言；`getTopic` 及相关首帖、特定用户、追踪函数按真实同构程度选择受约束泛型或直接拆分，不能再依靠宽联合、原地补字段或双重断言共享实现。
- API 文件默认保持一个内聚 `service.ts`；User/Session 保留按查询缓存、认证、刷新等自然职责形成的文件。Topic 在 owner 与调用闭包稳定后按 detail、list/search、history 等业务子能力拆分 1394 行 service，不按 GET/POST/PUT 或单 endpoint 拆文件。
- 每个 module 输出 DTO -> mapper -> ViewModel -> Props 的 producer/consumer 闭包；ViewModel 采用组合或投影，不复制同形 DTO，也不覆盖同名 DTO 字段类型。

验收：每个 module 独立完成字段 `missing/extra/incompatible` 对照、DTO 原地修改扫描、宽类型归因、typecheck/build/browser 对照；停在人审点。

执行结果见 [`p5.3-core-module-contracts.md`](./p5.3-core-module-contracts.md)：User/Session、Notification/Message、Board、Topic/Post、Site Content/Home 已按纵向 owner 收口；Topic API 拆为 detail、list/search、metadata、history 四个业务闭包，最终仅保留 Topic/Post/Message/Notification 四个 mapper。只读浏览器烟雾、typecheck、production build、DTO mutation/宽类型/双重断言/Props/mapper 数量与产物检查已完成；私信和通知页因挂载会触发已读写入而未打开。当前停在人审点，不 commit、不 push、不进入 P5.4。

### P5.4：Route API 拆回 module

- 拆分 Board、Editor、Topic Detail 的 Route 私有 API。
- 按 endpoint 的资源 owner 迁移，不按原目录整体搬运。
- 先处理 GET；写函数只做静态迁移，不发送请求。
- 等价迁移阶段允许 Route 私有 API 的 `Promise<Response>` 随函数进入 module，页面现有 status/JSON 行为保持不变；不得在 P5.4 借机同时改错误协议。原计划由 P5.5 统一闭合 typed return，现因 P5.5 放弃而保留 P5.4 现状。
- Editor 同步分开编辑 Form/Draft 与 Request DTO：标签查询失败、空输入和组件临时值留在 Form 或显式失败分支，只有后端接受的字段和值可以进入 `JSON.stringify`。
- 将 `EditorVoteSettingsProps` 移回 `EditorVoteSettings.tsx`；Editor Route model 只保留页面 Form/Draft、Route 参数和页面状态，不继续导出组件 Props。

验收：Route 不再拥有可下沉的后端请求；GET 浏览器验收完成；所有写 request body 完成静态字段和值域对照，且不存在把 Form sentinel 声明为 wire 值的情况；停在人审点。

执行结果见 [`p5.4-route-api-migration.md`](./p5.4-route-api-migration.md)：Board、Editor、Topic Detail 的 23 个 Route API 导出已按资源 owner 闭合为 21 个 module 入口；无约束泛型已拆分，重复 @ 通知入口已合并，Editor Form/Draft 与 Posting request DTO 已分开。只读浏览器烟雾、typecheck、production build、Route 请求边界、request sentinel、循环 SCC、chunk 和字节格式检查已完成；所有写接口均未执行。当前停在人审点，不 commit、不 push、不进入 P5.5。

### P5.5：错误合同迁移（已放弃）

放弃记录（2026-08-04）：本批曾从干净的 `dev20260716@837740ba` 开始实施，但人工审核认为全仓统一错误合同过重、调用链过绕，且主后端不存在可供前端稳定映射的统一错误范式，实际需要精细错误分支的页面也很少，因此决定放弃。全部未提交实现已撤回到 `837740ba`；新增的 `foundation/api/errors.ts` 和 P5.5 验收报告已删除，`npm run typecheck` 通过，撤回后工作树为 clean。以下步骤与验收文字仅作为历史提案保留，不再执行。

P5.6 未开始；放弃 P5.5 不自动授权进入 P5.6，后续阶段是否继续或重新规划须另行人工评审。

顺序：

1. 建立 `foundation/api/errors.ts`，定义最小 `ApiFailure` 和 HTTP status、网络失败、响应解析失败的通用转换 helper；不加入业务错误枚举。
2. 将可达 module API 的 `Promise<Response>` 改为 DTO、`void` 或明确业务 result；status 和 JSON 读取收回 API owner，页面不再断言 `response.json()`。
3. Board 查询移除 `BoardInfo | string`。
4. Favorite Topic、Follow、Posting 等简单命令移除 `"ok"/"error"`。
5. Moderation、Post Rating 改为业务 result。
6. 删除消费者中的字符串比较和 `alert(response)`；Route/UI 只按 `ApiFailure.kind` 或 operation result 的 discriminant 分支。
7. 逐 endpoint 区分后端合法 `null`、空数组、字段缺失、空对象与技术失败，禁止通用 helper 改写真实成功合同。
8. 增加静态门禁，禁止 API 导出裸错误字符串和面向 Route/UI 的原始 `Response`，并检查技术失败没有再被吞成 `undefined/null/false` 或空数组。

只读 Board 分支可直接浏览器验收；写接口遵守版面 `245` 和逐次审批规则。账号级写接口只做静态验证。

验收：可达 API 不再使用裸错误字符串；正常、业务拒绝和技术失败三个通道明确；停在人审点。

### P5.6：兼容出口和根 barrel 清理

- 删除无消费者的根出口。
- 在引用闭包归零后删除 `IUser/ITopic/IPost/IBoard/ISignIn`。
- 删除不再需要的兼容 ViewModel 和 facade。
- 删除迁移完成后根 `index.ts` 中的 Props 出口，并确认组件 Props 不再位于任何 module/Route `model` 文件。
- 完成全量浏览器回归、chunk 对比和文档收口。

验收：无 self-barrel、无意外循环依赖、无初始 chunk 回退；停在人审点。

## 9. 每批统一门禁

- 开始前检查分支、worktree diff、owner、调用点和授权边界。
- `npm run typecheck`。
- `npm run build`。
- `git diff --check`，并单独检查 untracked 文件。
- BOM、换行和 EOF 检查。
- endpoint、method、Header、query、body、status 和异常行为对照。
- 对目标 module 检查 DTO 字段写入、`as MutableXxx`/交叉类型伪装、`as unknown as`/双重断言、同名字段宽化、Form sentinel 进入 request body，以及未归因的 `any/unknown/number | string/null/undefined/false`。
- 对泛型 API 检查类型参数能否由输入推导、所有分支是否保持同一协议和错误语义；需要调用者任意指定返回类型或内部强制断言的泛型必须改为明确函数或 overload。
- 对每个本批 DTO 记录 Controller/action 分支、投影、C# 类型、JSON 属性/序列化配置、可获得的实际响应与前端字段的 `missing/extra/incompatible`；真实 nullable、字段缺失、空数组、空对象与保留宽类型必须分别写明来源和原因。
- mapper 审核必须证明不修改输入 DTO，参数以 `Readonly<TDto>` / `readonly TDto[]` 表达只读边界，补充查询已在 mapper 外完成，并覆盖正常、空数据、匿名和失败 fallback。
- 对本批 owner 扫描 DTO/ViewModel 转换是否全部进入唯一 `model/mappers.ts`，并扫描 `model` 与根出口中残留的 `*Props`；例外必须说明它实际不是组件 Props 并完成重命名。
- 检查 API 文件按业务职责组织：普通 module 不因 HTTP method 或 endpoint 数量机械拆文件，超大 module 的子文件具有明确业务闭包，迁移后不存在同一能力分散在 `get-*` / `update-*` 文件的形式拆分。
- P5.5 已放弃；原定对 `foundation/api/errors.ts`、可达 `Promise<Response>`、裸错误字符串及 Route/UI 错误分支的额外检查不再执行，也不作为其他 P5.x 子批的隐含门禁。
- 浏览器类型取证默认只执行 GET/read-only；只有页面不会自动触发签到、已读或偏好写入且符合第 7.1 节授权边界时才执行。无法安全实测不是收窄依据，必须保留类型并记录未执行原因。
- 浏览器项目必须区分：已执行、未执行、因环境不可用而阻塞。
- 机械检查不能替代真实 API、权限和交互验收。
- 每个 P5.x 独立等待人工审核；未经明确授权不 commit、不 push、不进入下一批。
- 获准提交后仅暂存批准路径，源码和文档分别提交，排除 `.vscode/`。

## 10. 完成条件

- 每个业务 module 的 wire response/request 类型统一位于 `model/dto.ts`；只有真实展示转换时才存在 `model/view-model.ts` 和唯一 `model/mappers.ts`。转换方向为 `JSON -> DTO -> ViewModel -> Props` 和 `Form/Draft -> Request DTO -> JSON`。
- Props 默认与 owner 组件共置于 `.tsx`，不位于 module/Route `model` 或根类型出口；现有 5 个误放声明均已迁移或按真实语义重命名。
- DTO 在读取后不因展示、补充查询或错误兜底被原地修改；ViewModel mapper 以 `Readonly<TDto>` / `readonly TDto[]` 接收输入并返回新对象，不用断言或交叉类型把 DTO 伪装成可变 ViewModel。
- 生产代码不存在 `as unknown as T` 或等价双重断言；P5 不新增通用 runtime schema/parser，真实动态或未验证的 `unknown` 保持边界隔离并附来源、消费者和后续移除条件。
- ViewModel 只在存在真实转换时建立，采用组合或投影复用 DTO；格式化值、名称和 fallback 使用独立字段，不覆盖同名 wire 字段并扩大其类型。
- API 函数按 endpoint 能力和返回模型划分；泛型只表达真实同构合同，业务语义、补充查询或错误分支不同的函数已经拆开。
- API 文件默认按 module 聚合在内聚 `service.ts`，只有明确超大模块按业务子能力拆分；不存在按 GET/POST/PUT 或一 endpoint 一文件的机械目录。
- Request DTO 只允许后端实际接受的字段和值域；空输入、未选择、`false` 和其他 UI sentinel 留在 Form/Draft 或转换失败分支。
- enum 不再作为全局语法类别单列。
- 可达后端请求均位于 Foundation 或对应 module API owner。
- Route/UI/model 不再直接拼后端请求。
- P5.5 已放弃；“可达 module API 不再向 Route/UI 导出原始 `Response`”不再作为 Phase 5 完成条件，保留 P5.4 已确认的现有响应处理行为。
- 根 `index.ts` 不再是唯一跨 module 入口，且没有因此引入循环依赖或 chunk 回退。
- 每个可达 wire/request DTO 均完成 `missing=[]`、`extra=[]`、`incompatible=[]` 字段闭包；未达到空集合的项目必须列出 endpoint、消费者、风险和后续批次，不得笼统宣布类型对齐完成。
- 不确定 wire 字段均已检查 Controller/action 返回逻辑、投影、C# nullable 和 JSON 序列化行为；可安全访问的只读 endpoint 具有真实浏览器响应证据，无法安全实测的字段明确保留宽类型及原因。后端真实 nullable、字段缺失、空数组或空对象不作为类型债务擅自改写。
- wire/request DTO 中不存在无后端依据的 `number | string`、`false` 或 `any`；`unknown` 只允许保留在真实动态/未验证 JSON 边界，并附来源、消费者和移除条件，不在 P5 内通过断言强转。
- P5.5 已放弃；不创建 `foundation/api/errors.ts`，不要求全仓采用 `ApiFailure`、统一技术错误转换或 discriminated result。后续仅按具体 endpoint 的真实响应和 UI 需求局部处理错误。
- 所有写请求均有逐次批准记录，且实际目标严格限制在版面 `245`。
