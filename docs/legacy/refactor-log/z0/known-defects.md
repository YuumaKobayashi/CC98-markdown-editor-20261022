# Z0 已知问题与保留边界

## 1. 可达性与休眠源码

- 运行图是静态可解析图，不能证明仓外固定 URL、后端注入、浏览器扩展或运行时字符串构造不存在；因此 Z1–Z4 删除前仍要按当批目标重做搜索。
- 273 个根级文件中大量 facade 只被其他不可达 facade import；“存在 inbound edge”不等于从 bootstrap 可达。
- `ErrorEmitter` 与活动 `ErrorBoundary` 共文件；按文件级零调用会误删 error boundary。
- UBB Math/Sandbox 文件当前未加载，但禁用代码和注释是功能边界，Z2 不得当作普通 P21 孤儿删除。
- AnnualReview 无 Router，但仍有内部 API、chart、样式和公开图片依赖；Z4 必须区分专属资源与共享 chart adapter。

## 2. 类型与兼容入口

- `@types/@cc98` 是 ambient 编译输入，JavaScript 可达图天然显示为 0；Z1 必须按 symbol consumer 而非运行 import 迁移。
- `States/AppState` 聚合了多个业务 DTO，当前有 32 条现代直接 import；禁止整文件搬到单一 Foundation owner。
- Props/States/Match 中的纯数据 class 尚未逐个完成 class/interface/type 判定；Z0 不提前改写构造调用或默认值。
- 根 `Utility.ts` 同时承接活动 Board/Favorites 和休眠 AnnualReview；必须逐导出拆分，不能因其中一类不可达整文件删除。

## 3. 既有行为缺陷

- Storage 中保留 raw `JSON.parse`、`slice(4)`、无空值保护、全量 clear 后选择性恢复等既有宽松/脆弱语义；本批不修复。
- Board/Topic/Discovery/Message 等既有请求竞态、错误吞噬、分页探测和缓存同步问题不因 Z0 记录而视为已修复。
- `CountDown` 的两处 JSX 只在注释中，`RouteComponent` 只被不可达旧 Topic 文件 import；这些事实是当前证据，不是永久安全删除授权。
- C1.7 记录的浏览器/API/主题/动态内容人工验收缺口继续存在，Z0 不回写历史结果。

## 4. 验证边界

- architecture/typecheck/build 只能证明当前源码图、类型和产物可生成。
- 本批未访问真实 CC98/OpenID/API，未验证登录、权限、分页、SignalR、通知权限、跨标签、IndexedDB、UBB/media/editor、主题或视觉。
- Z0 不启动下一阶段，也不提交；人工验收和提交授权是独立门禁。
