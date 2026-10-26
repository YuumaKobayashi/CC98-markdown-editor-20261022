# FocusBoardArea

- 旧位置：`Components/Focus/FocusBoardArea.tsx` / `FocusBoardArea`。
- 新位置：`src/pages/focus/ui/FocusBoardArea.tsx` / `FocusBoardArea`。
- 之前：class 从 sessionStorage 初始化版面与选择，在 mount 后逐项加载版面名，再用全局 jQuery 绑定 click/dblclick 和修改选中 class。
- 现在：具名函数以 lazy state initializer 读取相同缓存，普通 effect 按原顺序加载版面名，React handler 和当前选择直接派生相同 DOM/class。
- hooks/cleanup：`useState` 保存版面与选择；普通 mount effect 顺序加载版面名，不使用 mounted 标记模拟生命周期。
- 保持不变：`focusBoardList`、`currentFocusBoard` 键，关注版面顺序，默认“全部帖子”，提示文案、DOM id/class、单击切换和双击 `/board/:id` 整页跳转。
- 修复：旧 jQuery handler 不解绑；缓存中的数字字符串版面 id 会在读取时规范化为 number。
- 兼容：旧文件保留 named re-export；Router index 与 `board/*` 改用 `pages/focus` 入口。
- 人工检查：缓存初始化与刷新恢复、单击/双击、快速切换、版面名加载失败和全部帖子。

## 审核结论

2026-07-24 人工验收通过。
