# Phase 3：User/Session/Notification/Site Content DTO 契约对齐

审计日期：2026-08-02

本报告只覆盖 Phase 3。契约源固定为主后端 `master` 的 `c46f2fa4d340c606b42764a05d106f178d91bc3c`；未修改或启动后端，未读取同级废弃项目。

## 1. 结论

- `UserInfo` 已按后端 46 个公开属性补齐 camelCase wire 字段，nullable、数组、嵌套 DTO、numeric enum 与时间字符串均已对齐。
- Session `/me` 直接复用 User owner 的 `UserInfo`；`CurrentUser`、`CurrentUserThemeSetting`、`CurrentUserBoardMasterTitle` 和 `IUser` 只保留兼容出口，不再维护重复 wire 字段。
- 后端不存在的 `displayTitle/photourl/customTitle` 仅保留在可选 `UserViewModel`；没有用 `groupName` 替换它们，也没有新增运行时映射。
- `UserSignInStateInfo.lastSignInTime` 已从页面数字类型改为 wire 字符串。原审计的 nullable 判断有误：固定后端在无签到记录时返回 `1970-01-01` 哨兵时间。
- 两类通知已分离 raw DTO 与追加 `topicTitle/boardName/floor/userId/userName` 的 ViewModel；原请求、原地加工顺序、默认值、异常吞噬和返回协议保持不变。
- Site Content 已区分管理端 `ForumIndexColumn`、广告 `ForumIndexColumnInfo`、提交 `PostForumIndexColumnInfo` 与编辑器本地状态；提交时仍序列化原对象，不改变既有 wire body。

## 2. 契约和投影

| owner | raw wire DTO / 请求 | 兼容或加工结果 |
| --- | --- | --- |
| user | `UserInfo`、`UserBoardMasterInfo`、`UserActivityPointInfo`、`UserPrivacySetting` | `UserViewModel`；`IUser` 兼容别名 |
| session | `/me` 复用 `UserInfo` | `CurrentUser` 等旧 Session 名称兼容别名；`SessionState` 保持 Session 所有权 |
| daily-signin | `UserSignInStateInfo` | `ISignIn` 兼容别名 |
| notification | `ReplyAtNotificationInfo`、`SystemNotificationInfo` | `ReplyAtNotificationViewModel`、`SystemNotificationViewModel`；组件 props 为实际渲染字段投影 |
| site-content | `ForumIndexColumn`、`ForumIndexColumnInfo`、`PostForumIndexColumnInfo` | `SiteIndexColumnEditorItem` 保存 `isNew/days` 本地状态 |

User 的 `UserAllowWechatNotifyState` 与 `UserBirthdayPrivacyMode` 是原只读审计遗漏的正式后端 enum，本批已补入 owner 和审计表。Site Content 原有 `IConfig.recommendationFunction: any[]` 不属于本批核心 DTO，继续登记给 Phase 4；本批未顺手清理剩余 service `any`。

## 3. 行为与边界审核

- 未修改任何 endpoint、HTTP method、Headers、body 生成方式、status 分支、异常吞噬、缓存、IndexedDB、localStorage、Redux 或跨标签同步流程。
- 通知仍对原 JSON 对象按既有顺序补充主题、版面、楼层和用户字段；`postId` 缺失时仍使用原 `floor=1/userId=-1/userName="有人"`，系统通知仍使用 `floor=0`。
- 站点栏目提交虽然以 `PostForumIndexColumnInfo` 约束静态合同，运行时仍对原编辑器 item 执行 `JSON.stringify`，没有删减既有额外字段。
- `displayTitle` 继续保持既有可选读取，不以语义不同的 `groupName` 改变用户资料展示。
- dormant service 未删除、未改变可达性；Phase 4 的 service 签名和剩余 `any` 未提前实施。

## 4. 修改面

| 类别 | 文件 |
| --- | --- |
| User/Session owner 与出口 | `src/modules/{user,session}/model` 及模块 `index.ts` |
| 签到合同 | `src/modules/daily-signin` 与 `DailySigninPage` |
| 通知合同和消费者 | `src/modules/notification` 与三个消息页面 |
| Site Content 合同和消费者 | `src/modules/site-content` 与 `SiteAdvertisementEditor` |
| 审计记录 | `read-only-audit.md` 与本报告 |

## 5. 机械检查与未执行验收

- `npm run typecheck`：通过。
- `npm run build`：通过，共转换 4129 个模块；沙箱内首次因 Vite 子进程 `spawn EPERM` 失败，获准后在沙箱外原样复跑成功。构建仍输出既有 legacy CSS hack、plugin timing 与 chunk size warning，exit code 为 0。
- `git diff --check`：通过；只有 Git 的 LF→CRLF working-copy 提示，无 whitespace error。
- `UserInfo`、`UserSignInStateInfo`、`ReplyAtNotificationInfo`、`SystemNotificationInfo`、`ForumIndexColumnInfo`、`ForumIndexColumn` 字段名闭包逐项与后端比较：`missing=[]`、`extra=[]`。
- 重复 User wire interface 已归零；目标 model owner 中除既有 `IConfig.recommendationFunction: any[]` 外无 `any`。同级废弃后端项目名在前端 `src/docs/scripts/package.json` 引用为 0。
- `git status --short` 仅包含 Phase 3 源码、审计与本报告，无意外生成物；受影响文件保持无 BOM、原换行风格与 EOF 换行。

未启动主后端，也未执行真实 API、登录态、权限、通知、签到、站点管理、主题或浏览器交互验收；机械检查通过时也不声明这些项目已验收。
