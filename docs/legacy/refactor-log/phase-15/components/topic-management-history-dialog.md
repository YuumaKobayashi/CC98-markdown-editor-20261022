# TopicManagementHistoryDialog

- 旧位置：`Components/Topic/Topic-ManageHistory.tsx` / 匿名 class。
- 新位置：`src/features/moderation/ui/TopicManagementHistoryDialog.tsx`。
- 之前：class 自有 `visible=true`，挂载即请求第一页，分页每次请求 7 条。
- 现在：具名函数保留自有 visible/data/loading state，以普通首次 `useEffect` 请求第一页，分页回调继续按 `(page - 1) * 7` 取数。
- 保持不变：忽略传入 visible、Modal DOM/宽高、匿名对象、时间、操作人、IP、Spin 位置、确认/取消回调和 API 参数。
- 延期：无错误 UI、取消、请求竞态和旧响应保护，快速切页可能被晚到响应覆盖。
- 兼容：旧文件保留 default re-export；`SendTopic` 改用 moderation barrel。
- 人工检查：首次加载、分页、匿名对象、时间/IP、确认/取消、异常 API 和快速切页。
