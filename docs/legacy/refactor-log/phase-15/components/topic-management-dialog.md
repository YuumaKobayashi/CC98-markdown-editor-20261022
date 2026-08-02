# TopicManagementDialog

- 旧位置：`Components/Topic/Topic-TopicManagement-v2.tsx` / `TopicTopicManagementV2`。
- 新位置：`src/features/moderation/ui/TopicManagementDialog.tsx`。
- 之前：class 在 mount 时加载版面列表，以九个菜单、Form ref、天数/版面/颜色 state 执行主题管理。
- 现在：具名函数用普通首次 `useEffect` 加载版面，以相同 state 与 `useRef<FormInstance>` 承接锁定、热门、删除、移动、提升、两级固顶、精华和高亮。
- 保持不变：props/API 参数、菜单/表单 DOM、天数、版面 id 182 排除、缓存前缀处理、颜色选择、刷新/关闭与调试日志。
- 延期：`isManager/permissions` 不过滤菜单；默认版面名称/ID 混用；高亮返回值不进入 status；mutation 无 pending/取消/旧响应保护。
- 兼容：旧文件保留 default re-export；`SendTopic` 改用 moderation barrel。
- 人工检查：九类操作、天数、父子版面、高亮样式、作者/版主/管理员权限、取消、异常 API 和重复提交。
