# BoardFooterActions

- 旧位置：`Pages/Board/Footer.tsx` / default 匿名 class。
- 新位置：`src/pages/board/ui/BoardFooterActions.tsx` / `BoardFooterActions`。
- 之前：class 同时保存小黑屋、批量管理和事件 Modal 状态，并按版主权限显示管理入口。
- 现在：具名函数保留相同局部 state、handler、Modal 组合和 service 调用。
- 保持不变：小黑屋 API、5/6 条分页参数、解除 TP、版主宽度/按钮、事件和批量管理入口。
- 延期：21 条 hasMore 判断、数组原地 pop、小黑屋 OK 关闭错误状态和请求竞态。
- 兼容：旧 Footer 文件保留 default re-export。
- 人工检查：普通用户/版主、小黑屋打开/分页/解除、OK/取消、事件和管理入口。
