# Z3 源文件、消费者与真实 owner 映射

日期：2026-08-02

| 原 owner/path | 活动消费者 | Z3 处理 | 终点 owner/边界 |
| --- | --- | --- | --- |
| `Components/ErrorBoundary.tsx` | `create-app-root.tsx` | 迁址；去掉零消费 `ErrorEmitter` | `application/providers/error-boundary.tsx` |
| `Components/ReSignCalendar.tsx` | `DailySigninPage.tsx` | 迁址；仅切换 Session/HTTP import | `application/routes/daily-signin/ui` |
| `Components/CC98Calendar.tsx` 及 2 份 Module | `ReSignCalendar.tsx` | blob 原样迁址 | `application/routes/daily-signin/ui` |
| `Components/NoticeMessage.tsx` | Topic Detail 4 处、Favorite manager 1 处 | consumer 切换后删 facade | `foundation/ui/feedback` |
| `Components/DocumentTitle.tsx` | Topic Page | consumer 切换后删 facade | `foundation/ui/document-title` |
| `Components/Constant.tsx` | Topic Reply Composer | consumer 切换后删 facade | `foundation/config/runtime-config` |
| `Utility/fetchUtility.ts` | Board Route API | HTTP/Session 分别直连后删 facade | `foundation/api/http` + `modules/session` |
| `Utility/timeZoneUtility.ts` | User Profile Details | consumer 切换后删 facade | `foundation/lib/time-zone` |
| 根 `Utility.ts` 活动导出 | Board Page、Favorite manager | 切到 Topic/Feedback owner | `modules/topic` + `foundation/ui/feedback` |
| 根 `Utility.ts` AnnualReview 导出 | 两棵休眠 AnnualReview 页面 | 收缩为 4 个精确导出，不删 | Z4 删除边界 |
| `Store.tsx`、`SignalR.ts`、`config/index.ts`、`IndexedDB/**`、其余 `Utility/**` | 0 | 删除兼容转导 | 既有 Application/Module/Foundation owner |
| `Pages/Board/**`、`Pages/Index/**` | 0 | 删除 11 个 Route facade | 既有 Application Route |
| 其余 `Components/**` | 0 | 删除短 facade 与休眠实现 | 既有 owner，或无运行入口 |

## 休眠实现复核

`Breadcrumb`、`Category`、`CountDown`、`Topic-ReplyUserBar`、`Topic-Judge-v2`、`Topic/Post`、`RouteComponent` 均无 inbound import/export/require、Router lazy、bootstrap、Vite/HTML/EJS/IIS 或公开资源入口。`MainPage.tsx` 仅对既有 Home Route owner 转导并带无消费兼容类，同样在零 inbound 后删除。

`ErrorEmitter` 是活动 `ErrorBoundary` 文件内的零消费 symbol；Z3 只删该 symbol，保留并迁址真实错误边界。
