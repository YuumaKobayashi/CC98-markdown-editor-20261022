# TopicReplyComposer

- 旧位置：`Components/Topic/Topic-SendTopic.tsx` / `SendTopic`。
- 新位置：`src/pages/topic/ui/TopicReplyComposer.tsx`。
- 现在：`forwardRef(function ...)` 使用 state/ref/effect，并仅通过 `TopicReplyComposerHandle` 暴露 `isContentEmpty()`。
- 保持：UBB/Markdown、Quote、匿名、通知全部回复、Local Storage 键、草稿落盘、表单/Modal 文案和提交顺序。
- 清理：键盘监听、节流 timer、`onbeforeunload` 与卸载草稿逻辑配对收口。
- 延期：草稿赋值分支、Markdown 临时键、提交异常和旧响应语义保持。
- 兼容：旧文件保留 default、`SendTopic` 与 handle 类型导出。
- 人工检查：两种编辑模式、引用、缓存恢复、匿名、通知、成功/失败和翻页确认。
