# TopicAudioPlayer

- 旧位置：`Components/Focus/CardTopicSingle.tsx` / `AudioPlayer`。
- 新位置：`src/entities/topic/ui/TopicCard.tsx` / `TopicAudioPlayer`。
- 之前：class 在 mount 创建 APlayer，忽略 IE11 InvalidStateError，卸载时销毁。
- 现在：具名函数在 `useLayoutEffect` 中保留相同初始化、异常忽略和 cleanup。
- 保持不变：编码后的音频 URL、标题、作者、封面、预加载、循环和 DOM/CSS。
- 兼容：旧符号 `AudioPlayer` 继续作为别名导出。
- 人工检查：播放、标题/作者、异常音频、切页及卸载。
