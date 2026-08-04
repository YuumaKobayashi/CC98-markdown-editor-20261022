# Phase 5：总收口补充验收

执行日期：2026-08-04

本批从 `dev20260716@40ae5438` 的 clean worktree 开始，补齐 Phase 5 首次总验收发现的请求所有权、DTO/enum 分层和文档状态缺口。P5.5 的统一错误合同仍保持放弃状态；本批没有重新引入 `ApiFailure`，没有改变现有 `Response`、status、JSON/text 读取或裸字符串错误协议。

## 1. 请求所有权

- 9 个 `api/` 外文件中的 11 个活动 `cc98Fetch` 调用已下沉到 Daily Signin、Follow、User、User Preference、Upload、Moderation 和 Post API owner。
- Notification unread-count thunk 不再构造授权 Header，Header 与请求均由 Notification API owner 负责。
- Route/UI、module model 和 UBB Editor utility 中活动 `cc98Fetch/fetch`、`formAuthorizeHeader` 请求构造扫描为 0；`foundation/config/runtime-config.ts` 仍是计划明确保留的 Foundation 启动配置特例。
- 页面继续拥有表单校验、交互顺序、状态更新和原有 response 分支。下沉函数逐项保留原 URL、method、Header、query、body、FormData 字段顺序和返回 `Response`：补签、关注版面、资料/头像/主题设置、头像/UBB 上传、用户内容删除、用户处罚和管理页发言查询均未改协议。

## 2. DTO 与 enum 分层

- Board、Post、Topic、User、Notification、Site Content 的 6 个独立 `model/enums.ts` 已删除；enum 连同原注释移入所属 `model/dto.ts`，消费者改用稳定 DTO owner 路径。
- Wealth 的 transfer/reward、User Preference 的 theme setting、Moderation 的用户操作/IP/管理记录、Post Rating 的 rating reason 均从 `model/types.ts` 移入各自 `model/dto.ts`。
- `ModerationResult` 与 `PostOperationResult` 是紧邻 operation 的现有业务结果合同，分别留在对应 `api/service.ts`；没有把它们伪装成 wire DTO，也没有改变字符串值。
- 剩余 `model/types.ts` 只承载兼容 re-export、本地 fallback、Redux/Storage/展示模型，不再保存已知 wire request/response DTO；全仓独立 `model/enums.ts` 数量为 0。

## 3. 机械门禁与产物

- `npm run typecheck`：通过。
- `npm run build`：通过，转换 4087 modules；仍只有既有 Sass `@import`、Spectrum legacy CSS、plugin timing 和大 chunk warning。
- 首屏静态 JS 闭包保持 14 个文件，由 1,849,079 B 变为 1,849,189 B（+110 B）；vendor 保持 1,778,287 B，没有初始 chunk 回退。
- `git diff --check`：通过；根 module import、旧 enum 路径、`api/` 外活动请求、self-barrel、双重断言和 model Props 扫描均无新增问题。
- 当前 TypeScript import/export 图只保留既有 Application Store 三文件循环 SCC；本批没有新增 module 循环。
- 改动文件保持 UTF-8 无 BOM、原有 CRLF/EOF 约定；`ubb-editor/utility.ts` 保持原有无 EOF 换行格式。

## 4. 浏览器回归与未执行项

复用 `http://127.0.0.1:25174` 的既有登录会话，只进行直接导航和读取：

- 首页、版面列表、新帖、版面 245、主题详情；
- 个人资料设置、主题皮肤、关注版面；
- 用户管理页（仅确认处罚、删除和发言查询界面挂载）。

页面均正常渲染，控制台未发现 `ChunkLoadError`、动态 import 失败、module 404、`ReferenceError` 或 `SyntaxError`。既有 UBB、React key、hydration 与 legacy CSS warning 不属于本批回归。

没有点击保存、上传、补签、关注/取关、用户处罚、内容删除、发言查询、发帖或其他写操作。因此静态门禁和只读页面回归不能替代这些写 API、权限、失败分支与真实交互验收。

Phase 5 当前已满足计划中的静态目录、请求所有权和只读回归完成条件，停在人审点：未 stage、未 commit、未 push，也没有进入后续阶段。
