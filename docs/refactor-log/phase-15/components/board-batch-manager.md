# BoardBatchManager

- 旧位置：`Pages/Board/Footer.tsx` / `Manage`。
- 新位置：`src/pages/board/ui/BoardFooterActions.tsx` / `BoardBatchManager`。
- 之前：class 用 Transfer、两个子 Modal 和局部选择/reason/value state 执行批量锁沉与删除。
- 现在：具名函数维持相同 state 边界、重开 key、零选择 notification 和 mutation 参数。
- 保持不变：Source/Target 文案、理由、7/30/98/1000 天、按钮、宽高与 API wire shape。
- 延期：mutation 不检查状态、无 pending/成功失败反馈、不刷新列表；调试日志和 footer key 警告保留。
- 兼容：由 `BoardFooterActions` 组合，旧 Footer facade 不新增历史上不存在的导出。
- 人工检查：选择/反选、零选择、理由、锁沉、删除、取消、异常 API 和重复提交。
