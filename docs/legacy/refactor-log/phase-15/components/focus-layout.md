# FocusLayout class → function 对照

- 原文件/符号：`Components/Focus/Focus.tsx` / `Focus`
- 新文件/符号：`src/pages/focus/layout/ui/FocusLayout.tsx` / `FocusLayout`
- 原 props/state/lifecycle：均无
- 依赖：DocumentTitle、三个 Router Link、Outlet
- 新 hooks/cleanup：均无
- 保持不变：URL、id、文案、DOM 层级与 Outlet
- 人工路径：`/focus/board`、`/focus/user`、`/focus/favorite`；待验收

## 原写法 / 新写法

route layout class 改为具名函数，Router lazy 直接加载 page owner。

## 审核结论

待人工填写。
