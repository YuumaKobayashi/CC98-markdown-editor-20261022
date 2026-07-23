# NotificationController

- 旧位置：`Components/NotificationController.tsx` 的同名 class。
- 新 owner：`src/features/message/realtime-notifications` 的具名函数。
- 状态：登录态和未读数使用 typed selector，未读刷新使用 typed dispatch。
- 副作用：SignalR、storage、focus、通知权限和标题闪烁按职责拆分，事件与连接 handler 具有 cleanup。
- 冻结边界：AppShell 继续不挂载该组件，因此运行时不连接 SignalR，也不请求浏览器通知权限。
- 兼容：旧路径保留 default/named re-export。

人工重点：应用启动、登录与导航过程中没有 WebSocket、权限提示或实时通知副作用。
