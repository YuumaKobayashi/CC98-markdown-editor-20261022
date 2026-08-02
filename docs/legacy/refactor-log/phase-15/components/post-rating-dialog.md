# PostRatingDialog

- 旧位置：`Components/Topic/Topic-Judge-v3.tsx` / `TopicJudgeV3`。
- 新位置：`src/features/moderation/ui/PostRatingDialog.tsx`。
- 之前：class 在点击正负评分页签后加载理由，并以 Form ref、loading 与错误码 alert 完成提交。
- 现在：具名函数保留相同 current/option/loading/tag state、按点击加载时序和 `useRef<FormInstance>`；`Reply` 直接从 moderation barrel 组合。
- 保持不变：`+1/-1` 图标、资格文案、理由过滤、评分参数、所有错误码提示、成功刷新/关闭与调试日志。
- 延期：理由请求无去重/取消/旧响应保护，API 抛错可能保持 loading，未选择类型的既有提示路径不调整。
- 兼容：旧文件保留 default re-export。
- 人工检查：正负评分、理由加载、未选择、资格/重复/过期/不存在错误、异常 API 与快速操作。
