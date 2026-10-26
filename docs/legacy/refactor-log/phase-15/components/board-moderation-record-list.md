# BoardModerationRecordList

- 旧位置：`Pages/Board/Footer.tsx` / `Record`。
- 新位置：`src/pages/board/ui/BoardFooterActions.tsx` / `BoardModerationRecordList`。
- 之前：class mount 即取第一页事件，AntD List 分页继续请求并替换 `boardEvents`。
- 现在：具名函数用普通首次 effect 和页码 handler 保持相同请求和数据替换。
- 保持不变：每页 7 条、总数、主题链接、匿名对象、时间、操作人与 Spin DOM。
- 延期：Modal 未打开也会预取；无异常、取消、旧响应保护或局部错误 UI。
- 兼容：由 Board Footer 内部组合，不扩大旧文件公开合同。
- 人工检查：首次请求、打开、分页、匿名对象、链接、时间、异常 API 和快速切页。
