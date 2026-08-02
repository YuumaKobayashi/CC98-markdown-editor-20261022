# Phase 5：API 边界、类型分层与错误合同收口计划

计划日期：2026-08-03

本计划承接 Phase 4，只定义后续实施顺序和验收门禁，不代表任何子批已经开始。基线为前端提交 `b33f9dd6`；主后端契约基线仍为 `c46f2fa4d340c606b42764a05d106f178d91bc3c`。

## 1. 目标

1. 分开 wire DTO、ViewModel、表单状态和组件 Props。
2. enum 与所属 DTO/模型放在一起，不再按语法类别统一放入 `enums.ts`。
3. 所有后端网络请求集中到对应 module 的 `api/`；UI、model 和 Redux thunk 不直接拼 URL、Header、method 或 body。
4. 松开“跨 module 所有内容必须从根 `index.ts` 导出”的约束，允许稳定的 `api/model/ui` 子路径。
5. 使用真实浏览器响应核验不确定的 wire 字段，不用后端声明或单次样本盲目收窄类型。
6. 移除前端 API 函数中的裸字符串错误哨兵，建立简单、统一的错误合同。

## 2. 当前基线

- 当前工作树在制定计划时为 clean。
- 现有 42 个 DTO-like 类型、5 个 `ViewModel`；其中 `UserViewModel` 没有真实转换过程，需要优先重新分类。
- 有 16 个文件在 `api/` 之外直接调用 `cc98Fetch/fetch`。
- `application/routes` 下仍有 3 个 Route 私有 API：Board、Editor、Topic Detail。
- 19 个 module 根 `index.ts` 承担 306 处根 barrel import；当前跨 module 深层 import 为 0。
- API 目录约有 120 个裸字符串返回分支，主要集中在 Moderation、Post Rating、Board、Favorite Topic、Topic 和 Posting。
- 内建浏览器当前返回 `Browser is not available: iab`；测试账号尚未登录，也没有发送外部请求。

## 3. 类型与目录规则

### 3.1 类型分层

| 类型 | 含义 | 放置位置 |
| --- | --- | --- |
| DTO | API 实际发送或接收的 wire 数据 | `module/model/*-dto.ts` |
| ViewModel | DTO 经前端查询、补充或格式化后的结果 | `module/model/*-view-model.ts` |
| Form/Draft | 页面编辑中的本地状态 | Route 或 module 的 `model/*-form.ts` |
| Props | 单个组件需要的参数 | 组件文件附近 |
| State | Redux、Session、页面状态 | 对应 `model` owner |

约束：

- `api/` 只放请求和响应处理代码，不声明领域类型。
- DTO 必须忠实描述 wire 字段，不混入 UI 字段。
- 没有真实转换过程时不创建 ViewModel。
- Request DTO 也属于 DTO，放在 `model`，不放入 `api`。
- enum 与使用它的 DTO/模型共置；大 module 按 Topic、Vote、User Setting 等业务能力拆文件，不恢复统一 `enums.ts`。

### 3.2 Mapper 规则

不为每个 module 强制创建 `mappers.ts`。

- 单一调用者、转换很短：作为调用文件中的私有函数。
- 被多个入口复用、转换复杂或需要独立测试：放入 `model/*-view-model.ts`，必要时再建立 `model/mappers.ts`。
- mapper 必须是纯函数，不自行发请求。
- API service 负责取得 DTO 和依赖数据，再调用 mapper 组装 ViewModel。

### 3.3 目标目录示例

```text
src/modules/user/
├─ api/
│  ├─ get-user-info.ts
│  └─ update-user.ts
├─ model/
│  ├─ user-dto.ts
│  ├─ user-view-model.ts
│  └─ user-form.ts
└─ ui/
```

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
- `foundation/config/runtime-config.ts` 的启动配置加载属于 Foundation 特例，不强行迁入业务 module。
- `/static/portrait.json` 是共享用户展示资源，由 User API 提供统一读取入口。

## 5. 公共入口规则

根 `index.ts` 从“所有内容总出口”改为可选的稳定 facade。

允许：

```ts
import { getUserInfo } from "@modules/user/api/get-user-info";
import type { UserInfo } from "@modules/user/model/user-dto";
import { UserProfileAvatar } from "@modules/user/ui/UserProfileAvatar";
```

小型 module 可以按需提供 `api/index.ts`、`model/index.ts` 或 `ui/index.ts`，但不强制。

迁移规则：

- 先允许稳定子路径，旧根入口继续兼容。
- 不一次性改写全部 306 处 import。
- 每完成一个 module，再删除该 module 已无消费者的根出口。
- module 内部使用相对路径，禁止 self-barrel import。
- cache 和 internal helper 不因存在就自动成为公共 API。
- 每批检查循环依赖、初始 JS 和 lazy chunk；历史 root barrel 曾造成 57,891 字节初始 JS 增长，不能只依赖 tree-shaking 假设。

## 6. 错误合同

### 6.1 普通 API 失败

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

验收：清单闭合；浏览器未执行项和原因明确；停在人审点。

### P5.1：公共入口松绑

- 允许稳定的 `api/model/ui` 子路径。
- 选择一个小 module 验证导入规则，不批量迁移全部 import。
- 根 `index.ts` 保持兼容，不删除现有出口。

验收：typecheck、build、diff check、循环依赖和 chunk 对比；基础页面浏览器烟雾测试；停在人审点。

### P5.2：低耦合只读 API 迁移

按小组迁移 BoardList、用户头衔、Recent Topic/Post、unread count、portrait 配置和 Daily Signin GET。

每组顺序：改前浏览器取证 -> 等价搬迁 -> DTO/ViewModel 分层 -> 改后浏览器对照。不得在同一子批改变错误返回协议。

验收：请求 URL/method/query、返回形状和页面行为一致；停在人审点。

### P5.3：核心 module 类型与 API 收口

顺序：User/Session -> Notification/Message -> Board -> Topic/Post -> Site Content。

- 按 module 纵向拆 DTO/ViewModel，不做一次性全仓文件搬迁。
- `UserViewModel` 优先查清真实 producer；无转换则改为兼容类型或删除。
- mapper 按复用和复杂度决定是否单列。

验收：每个 module 独立 typecheck/build/browser 对照；停在人审点。

### P5.4：Route API 拆回 module

- 拆分 Board、Editor、Topic Detail 的 Route 私有 API。
- 按 endpoint 的资源 owner 迁移，不按原目录整体搬运。
- 先处理 GET；写函数只做静态迁移，不发送请求。

验收：Route 不再拥有可下沉的后端请求；GET 浏览器验收完成；停在人审点。

### P5.5：错误合同迁移

顺序：

1. 建立 `ApiFailure` 和 Response 转换 helper。
2. Board 查询移除 `BoardInfo | string`。
3. Favorite Topic、Follow、Posting 等简单命令移除 `"ok"/"error"`。
4. Moderation、Post Rating 改为业务 result。
5. 删除消费者中的字符串比较和 `alert(response)`。
6. 增加静态门禁，禁止 API 导出裸错误字符串。

只读 Board 分支可直接浏览器验收；写接口遵守版面 `245` 和逐次审批规则。账号级写接口只做静态验证。

验收：可达 API 不再使用裸错误字符串；正常、业务拒绝和技术失败三个通道明确；停在人审点。

### P5.6：兼容出口和根 barrel 清理

- 删除无消费者的根出口。
- 在引用闭包归零后删除 `IUser/ITopic/IPost/IBoard/ISignIn`。
- 删除不再需要的兼容 ViewModel 和 facade。
- 完成全量浏览器回归、chunk 对比和文档收口。

验收：无 self-barrel、无意外循环依赖、无初始 chunk 回退；停在人审点。

## 9. 每批统一门禁

- 开始前检查分支、worktree diff、owner、调用点和授权边界。
- `npm run typecheck`。
- `npm run build`。
- `git diff --check`，并单独检查 untracked 文件。
- BOM、换行和 EOF 检查。
- endpoint、method、Header、query、body、status 和异常行为对照。
- 浏览器项目必须区分：已执行、未执行、因环境不可用而阻塞。
- 机械检查不能替代真实 API、权限和交互验收。
- 每个 P5.x 独立等待人工审核；未经明确授权不 commit、不 push、不进入下一批。
- 获准提交后仅暂存批准路径，源码和文档分别提交，排除 `.vscode/`。

## 10. 完成条件

- wire DTO、ViewModel、Form 和 Props 边界可从文件和函数签名直接识别。
- enum 不再作为全局语法类别单列。
- 可达后端请求均位于 Foundation 或对应 module API owner。
- Route/UI/model 不再直接拼后端请求。
- 根 `index.ts` 不再是唯一跨 module 入口，且没有因此引入循环依赖或 chunk 回退。
- 不确定 wire 字段均有后端源码与真实浏览器响应证据，或明确保留宽类型及原因。
- 可达 API 不再返回裸错误字符串；普通失败使用 `ApiFailure`，预期业务拒绝使用 discriminated result。
- 所有写请求均有逐次批准记录，且实际目标严格限制在版面 `245`。
