# PrivateConversationWindow

- 后续修改：输入框已有内容时切换联系人，应按联系人保留草稿缓存，并在切回时恢复；本批仍保持切换联系人清空草稿的现状。

- 旧位置：`Components/Message/MessageWindow.tsx` 的 `MessageWindow` class。
- 新 owner：`src/pages/message/private-messages` 的具名函数。
- 状态：消息、分页、受控草稿、焦点和发送错误均由 hooks 管理；paste/drop/dragover 使用 React 事件。
- 滚动：首次加载/发送后用普通 effect 滚到底部；仅 prepend 后用 `useLayoutEffect` 在绘制前恢复原锚点。
- 修复：数组不再原地 reverse；联系人切换忽略旧结果并清理 200ms timer；无联系人发送安全返回；消息使用稳定 id key。
- 兼容：发送、403 文案、上传/粘贴/拖放、缓存、未读刷新、DOM id/CSS 和旧 `MessageWindow` 导出保持不变。

人工重点：切换会话、加载更早消息的锚点、发送成功/403、所有图片入口和快速离页。
