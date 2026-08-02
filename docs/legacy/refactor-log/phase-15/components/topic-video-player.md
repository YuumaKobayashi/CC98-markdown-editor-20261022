# TopicVideoPlayer

- 旧位置：`Components/Focus/CardTopicSingle.tsx` / `VideoPlayer`。
- 新位置：`src/entities/topic/ui/TopicCard.tsx` / `TopicVideoPlayer`。
- 之前：class 在 mount 创建 DPlayer、注册全屏事件并修改生成 DOM，卸载时销毁。
- 现在：具名函数在 `useLayoutEffect` 中执行同样的显示前初始化、菜单/按钮修正和 cleanup。
- 保持不变：视频 URL、封面、预加载、横竖屏宽度、菜单、全屏事件与播放器销毁。
- 延期：构造失败后继续访问空实例的既有缺陷按用户要求保留。
- 兼容：旧符号 `VideoPlayer` 继续作为别名导出。
- 人工检查：正常/异常媒体、横竖屏、菜单、全屏、切页与卸载。
