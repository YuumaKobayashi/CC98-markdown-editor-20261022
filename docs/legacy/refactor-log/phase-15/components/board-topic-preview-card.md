# BoardTopicPreviewCard

- 旧位置：`Pages/Board/PostItem.tsx` / `Card`。
- 新位置：`src/pages/board/ui/BoardTopicListItem.tsx` / `BoardTopicPreviewCard`。
- 之前：Popover 内容中的 class 在 mount 请求主题前十楼，空数组显示 Spin，再通过冻结 UBB 展示楼层。
- 现在：具名函数使用普通首次 effect，主题项与预览楼层也改为具名函数并共同归位。
- 保持不变：1.5 秒 hover、`/topic/:id/post?from=0&size=10`、用户链接、楼层、UBB options、图标/标签/高亮/分页 DOM。
- 延期：速览异常响应无错误 UI；tagInfo 直接 slice/JSON.parse、列表索引 key、缺少 pager key 和调试日志均保留。
- 兼容：旧 PostItem/PostList/ListHead 分别保留 default re-export；冻结 UBB 源码未改。
- 人工检查：延迟 hover、loading、楼层 UBB、匿名/空标题、图标、高亮、标签、页码和异常缓存/API。
