# PrivateMessagesPage

- 旧位置：`Components/Message/MessageMessage.tsx` 的 `MessageMessage` class。
- 新 owner：`src/pages/message/private-messages` 的具名函数。
- 状态：联系人列表、当前联系人和更多加载状态由 hooks 管理；联系人更新在父组件内单向流转，不再使用 `recentContact` Web Storage，继续使用既有排序 API。
- 修复：选中 class/已读状态声明式派生；`?id=`/`?name=`变化会重新请求并排序；联系人使用稳定 id key。
- 兼容：联系人卡片、更多联系人 DOM/CSS、窗口回调和旧 `MessageMessage` 导出保持不变。

人工重点：deep link、联系人切换/置顶/已读、更多联系人、重新进入页面和空列表。
