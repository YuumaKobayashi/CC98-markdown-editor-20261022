# P11 文件与接口映射

| P11 前 | P11 后 | 兼容方式 |
|---|---|---|
| `Pages/Board/Announcement.tsx` | `src/pages/board/ui/BoardAnnouncement.tsx` | 旧文件 re-export 默认与具名符号；`Head.tsx` 使用 `@pages/board` |
| `Components/Topic/Topic-IPData.tsx` | `src/features/moderation/ui/TopicIPData.tsx` | 旧文件 re-export 默认与具名符号；`Topic-SendTopic.tsx` 使用 `@features/moderation` |
| `Components/Focus/FocusFavoriteArea.tsx` | `src/pages/focus/ui/FocusFavoriteArea.tsx` | 旧文件 re-export；`Focus.tsx` 使用 `@pages/focus` |
| `Components/Message/MessageSetting.tsx` | `src/features/message/ui/MessageSetting.tsx` | 旧文件 re-export；消息与 Topic 调用方使用 `@features/message` |
| 消息设置 `NoticeSetting` class | `src/features/message/model/types.ts` | 继续通过旧文件和 feature 窄入口导出运行时 class |

新公开入口为 `@pages/board`、`@pages/focus`、`@features/moderation` 和 `@features/message`。旧路径 facade 计划在 P21 按引用证据删除。
