# HeaderUserMenu

- 旧位置：`Components/Header.tsx` 的 `DropDownConnect` class。
- 新 owner：`src/app/layouts/header` 的内部具名函数。
- 状态：使用 typed selector/dispatch、局部 hover state 和声明式未读/隐私展示。
- 副作用：首次隐私水合、未读刷新、每日用户刷新及跨标签页同步按职责进入普通 effect；storage handler 会 cleanup。
- 行为：登录/退出、主题、签到、管理入口、消息入口、storage key 和 DOM/CSS 合同保持不变。

人工重点：跨标签页登录/退出与隐私同步、未读计数、hover、完整退出和主题恢复。
