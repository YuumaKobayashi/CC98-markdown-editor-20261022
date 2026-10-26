# DocumentTitle class → function 对照

- 原文件/符号：`Components/DocumentTitle.tsx` / anonymous default class
- 新文件/符号：`src/shared/ui/document-title/DocumentTitle.tsx` / `DocumentTitle`
- 原 props/state：title、可选 children；无 state
- 原 lifecycle：mount 设置标题，receive-props 时仅在 title 变化后设置
- 新 hooks：`useEffect(..., [title])`
- cleanup：原实现不恢复标题，新实现也不恢复
- 保持不变：空标题回退、`Children.only`、无 children 返回 null
- 人工路径：首页、Board、Topic、Message、Focus、UserCenter 等；待验收

## 原写法 / 新写法

两个 title lifecycle 合并为一个真实依赖的 effect，不使用 mount/update 模拟器。

## 审核结论

待人工填写。
