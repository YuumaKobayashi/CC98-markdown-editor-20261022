# BoardHeader

- 旧位置：`Pages/Board/Head.tsx` / default 匿名 class。
- 新位置：`src/pages/board/ui/BoardHeader.tsx` / `BoardHeader`。
- 之前：class 每次 render 从本地用户缓存派生登录、认证、禁言与发帖入口。
- 现在：具名函数读取同一 current-user storage 并组合既有 breadcrumb、公告和广告。
- 保持不变：发主题/投票 URL、提示文案、按钮 class、大字报 key、广告和 `board-head-*` DOM。
- 延期：用户缓存读取和大字报既有失败反馈不在本批调整。
- 兼容：旧 Head 文件保留 default re-export。
- 人工检查：游客、未认证、禁言、正常用户、投票权限、大字报和广告。
