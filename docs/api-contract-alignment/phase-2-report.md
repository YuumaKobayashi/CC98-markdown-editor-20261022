# Phase 2：Topic/Post/Board DTO 契约对齐

审计日期：2026-08-02

本报告只覆盖 Phase 2。契约源固定为主后端 `master` 的 `c46f2fa4d340c606b42764a05d106f178d91bc3c`；未修改或启动后端，未读取同级废弃项目。

## 1. 结论

- `TopicInfo`、`PostInfo`、`BoardInfo` 已按后端公开属性补齐 camelCase wire 字段，`DateTime` / `DateTimeOffset` 字段均按 JSON 字符串建模。
- `isVote/isPosterOnly` 已从字面量 `false` 收窄错误修正为 `boolean`；Topic 匿名用户、最后回复与 highlight 字段已对齐 nullable。
- Post 的 `allowedViewers/lastUpdateAuthor/lastUpdateTime` 已移除 `any`，raw DTO 已移除后端不存在的 `awardInfo/isBest/length`，并补齐 `count/isMe/awards`。
- Board 已使用真实 wire 字段 `isLocked`；原 `isLock` 没有可达消费者，不需要 service 别名或 DOM 兼容层。
- raw DTO 与现有 topic service 追加的 `userInfo/postId/boardName/floorCount/portraitUrl` 及格式化计数已分别命名；旧 `ITopic/IPost/IBoard` 仅保留为同一 wire DTO 的兼容别名。

## 2. 契约和投影

| owner | raw wire DTO / 投影 | 加工结果 |
| --- | --- | --- |
| topic | `TopicInfo`、`TopicBasicInfo`、`SearchedTopicInfo`、`RecommendedTopicInfo`、`BoardBestSaveTopicsInfo`、`TagTopicsInfo` | `FocusTopic`、`RecommendedTopic` |
| post | `PostInfo`、`PostBasicInfo`、`SpecificUserPostInfo`、`PostAward` | `PostViewModel` |
| board | `BoardInfo`、`BoardSimpleInfo`、`BoardCategoryInfo`、`BoardTagInfo(V2)`、`BoardStopPostUserInfo`、`BoardEventInfo` | 本批无额外 Board ViewModel |

Topic 的 `mediaContent` 在后端公开类型仍为 `object`，raw DTO 保留为 `unknown`；现有卡片 service 的媒体摘要继续使用独立 `MediaTopicContent` ViewModel。`TopicInfo.userInfo` 暂引用现有 `IUser | null`，User wire 唯一基础留待 Phase 3。

`PostController.GetSpecificUserPosts` 在当前后端源码中声明返回 `SpecificUserPostInfo`，并使用 `PostInfo` 同系字段及 `count`；审计树内未找到该类的独立声明文件，因此前端以 `PostInfo` 同形别名记录，不虚构额外字段。

## 3. 审计补记与行为边界

- 原只读审计的 enum 表漏列 `BoardPrivacyState`、`ViewerFilterState`、`BoardProtectionLevel`、`TopicSpecialStyle`、`PostAwardType`；它们均由本批补齐并反写原审计。
- 保留现有 endpoint、HTTP status 分支、缓存、匿名显示、时间/计数/标签格式化与数组合并顺序。数字格式化处的 `Number(...)` 仅用于在联合 ViewModel 上保持原数值运算，wire 输入为数字时运行结果不变。
- 不删除 dormant service，不扩张到 User/Session/Notification/Site Content，不执行 Phase 3/4 的全局 service 签名清理。

## 4. 修改面

| 类别 | 文件 |
| --- | --- |
| owner 与出口 | `src/modules/{topic,post,board}/model/{types,enums}.ts` 及三个模块 `index.ts` |
| service 边界 | topic/board module service，board route service，editor 的 Response JSON 消费点 |
| 可达消费者 | topic reply list 的 `PostViewModel`，以及标签名返回值的原行为兼容类型断言 |
| 审计记录 | `read-only-audit.md` 与本报告 |

## 5. 机械检查与未执行验收

- `npm run typecheck`：通过。
- `npm run build`：通过；沙箱内首次因 Vite 子进程 `spawn EPERM` 失败，获准后在沙箱外原样复跑成功。构建仍输出既有 legacy CSS hack 与 chunk size warning，exit code 为 0。
- `git diff --check`：通过；只有 Git 的 LF→CRLF working-copy 提示，无 whitespace error。
- 三个核心 DTO 的属性名闭包逐项与后端比较：`missing=[]`、`extra=[]`；目标漂移字段与三个 owner 中的 `any` 命中均为 0。
- 同级废弃后端项目名在前端 `src/docs/scripts/package.json` 引用为 0；User/Session/Notification/Site Content 的 Phase 3 owner diff 为空。
- `git status --short`：仅 19 个 Phase 2 源码/审计路径，新文件只有本报告，无意外生成物。受影响文件均保持无 BOM、EOF 换行；原 CRLF 文件已恢复为纯 CRLF。

未启动主后端，也未执行真实 API、登录态、权限、主题、帖子、编辑器或浏览器交互验收；机械检查通过时也不声明这些项目已验收。
