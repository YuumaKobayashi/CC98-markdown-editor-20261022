# Z1 验证与人工审核记录

日期：2026-08-02

## 1. 机械检查

| 检查 | 结果 |
| --- | --- |
| `npm run typecheck` | 通过；modern 与 legacy 均通过 |
| `npm run check:architecture` | 通过；335 source files、1351 imports、10 allowed violations |
| `git diff --check` | 通过 |
| `@cc98/api`、`@legacy/Props`、Z1 `@legacy/States`、`@legacy/Match` 活动源码闭包 | 0 条 |
| `States` 剩余文件 | 仅 `UbbEditorState.tsx` |
| architecture allowlist | 27 → 10；剩余均为 Z2 UBB 边 |
| 迁移注释逐块对照 | 0 条缺失 |
| 新 owner 显式 `any` | 6 处；与 `type-debt.md` 逐项一致 |
| BOM/行尾/EOF 形态 | 既有修改文件与各自 HEAD 形态一致；新文件为 LF、无 BOM、单一 EOF；无混合行尾 |
| `npm run build` | 通过；4119 modules transformed；保留既有 Sass、Spectrum/Lightning CSS 和大 chunk 警告 |

## 2. 生产产物比较

- 迁移前：9563 个文件，聚合 SHA-256 `72EB74312129118A9BB6F3F1A4163D1D091934A59CE4DD5F2369A16A0901C03D`。
- 迁移后：9563 个文件，聚合 SHA-256 `E6A2846C509366418A08BF127697FB21C6331C54016E8C37148C064E5D0BED2A`。
- 29 个主题 CSS 的内容哈希文件名和输出长度保持；完整产物聚合不一致，因此不能宣称 JS 字节零漂移。
- 差异原因是计划同时要求移除活动 `MainPageColumn` 构造 class、将 Message/Notification/Home/Board List/Topic Reply 伪 class 改为 interface，并删除 legacy 运行时模块边；这些源码动作必然改变打包模块图或 JS 字节。未为保留旧 hash 添加死 class、兼容 import 或无消费者运行时代码。

## 3. 主代理静态审核

- API URL、method、headers、body 字段、Storage 键、TTL、Router、DOM/CSS、UBB、权限判断和页面时序未改。
- Home 广告构造由 class 改为对象字面量后，字段名、赋值顺序、Storage payload 和调用时机保持 `imageUrl`、`title`、`url`、`content` 原顺序。
- `IIndexHotTopic` 与 Topic `IHotTopic`、`IUser`/`UserInfo`/`CurrentUser`、三类主题设置合同均保持独立，未用结构相似性抹平端点差异。
- 零消费者声明与迁移声明分开记录；未把删除项冒充 owner 迁移。

## 4. 未执行验收

- 未执行浏览器页面、真实 API、权限、匿名内容、主题视觉、IndexedDB/Storage、跨标签、通知或媒体验收。
- 完整 JS 字节零漂移门禁未通过；等待人工决定接受计划要求的伪 class 消除所产生的构建差异，或回退该要求并保留运行时 class。
- 未 commit、未 push、未进入 Z2。
