# MessagePerson class → function 对照

- 原文件/符号：`Components/Message/MessagePerson.tsx` / `MessagePerson`
- 新文件/符号：`src/entities/message/ui/MessagePerson.tsx` / `MessagePerson`
- 原 props/state：`data: MessagePersonInfo`；无 state
- 原 lifecycle/依赖：无 lifecycle；冻结 `UbbContainer`
- 新 hooks：无 hooks
- cleanup：原/新均无
- 保持不变：头像、用户名、UBB 最近内容、未读点 CSS
- 行为修复：不再把空 `lastContent` 写回 props，只局部回退为空字符串
- 人工路径：`/message/message` 联系人列表；待验收

## 原写法 / 新写法

旧 `render` 会执行 `data.lastContent = ''`；新函数使用 `const lastContent = data.lastContent || ''`。

## 审核结论

待人工填写。
