# FocusUserArea

- 原位置：`Components/Focus/FocusUserArea.tsx` / `FocusUserArea`。
- 新位置：`src/pages/focus/ui/FocusUserArea.tsx` / `FocusUserArea`。
- 之前：class 在 mount 后用 jQuery 修改布局中的三个页签 class。
- 现在：具名函数只组合 `FocusTopicArea`；页签状态由 `FocusLayout` 根据 pathname 声明式派生。
- 行为：仍以 `id=-1`、`name=关注用户` 调用原数据区；DOM wrapper 与公开 URL 不变。
- 兼容：旧路径保留具名 re-export；Router lazy import 使用 page 入口。
- 人工检查：`/focus` 四条路径、deep link、back/forward 和唯一页签高亮。
