# P10 文件与接口映射

| P10 前 | P10 后 | 兼容方式 |
|---|---|---|
| `Components/MainPage.tsx` 内 6 个展示 class | `src/pages/home/ui` | `MainPage.tsx` 导入并继续 re-export 原符号 |
| `Pages/Index/Announcement.tsx` | `src/pages/home/ui/Announcement.tsx` | 旧文件改为 re-export；`Index.tsx` 使用 `@pages/home` |
| 首页 `MainPageTopicState`、`MainPageTopicMoreProps`、`MainPageColumn` | `src/pages/home/model/types.ts` | `MainPage.tsx` 继续 re-export 原符号 |
| 5 个 `Components/Message/*box/Sender/Receiver` 实现 | `src/entities/message/ui` | 旧文件改为 re-export；已知父组件使用 `@entities/message` |
| 3 个消息 Props class | `src/entities/message/model/types.ts` | 根 `Props` 文件改为 re-export |
| `Topic-Reply.tsx` 内 `FloorSize` | `src/entities/post/ui/FloorSize.tsx` | 原文件导入并继续 re-export `FloorSize` |

窄入口为 `@pages/home`、`@entities/message`、`@entities/post`。新实现不会从旧 `Utility`、Store、Router 或旧 Props barrel 取能力。
