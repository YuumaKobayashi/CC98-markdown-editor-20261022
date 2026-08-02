# PostManagementDialog

- 旧位置：`Components/Topic/Topic-PostManagement-v2.tsx` / `TopicPostManagementV2`。
- 新位置：`src/features/moderation/ui/PostManagementDialog.tsx`。
- 之前：class 以 state 菜单和 Form ref 执行财富/威望奖惩、删除、TP 与解除 TP。
- 现在：具名函数以相同菜单 state、option state 和 `useRef<FormInstance>` 承接七类操作；`Reply` 直接从 moderation barrel 组合。
- 保持不变：props 名称、财富限制提示、理由选项、宽松 `parseInt`、API 参数顺序、`ok` 刷新/关闭和原始 alert。
- 延期：无 pending 锁，异常统一吞掉，`privilege` 与 option 不参与权限/提交，零值与服务返回语义不调整。
- 兼容：旧文件保留 default re-export。
- 人工检查：七类操作、必填/零值、每日上限文案、成功刷新、取消、异常 API 与快速重复提交。
