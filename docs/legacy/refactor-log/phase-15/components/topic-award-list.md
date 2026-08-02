# TopicAwardList

- 旧位置：`Components/Topic/Topic-Award.tsx` / `Award`。
- 新位置：`src/pages/topic/ui/TopicAwardList.tsx`。
- 现在：具名函数以普通 effect 加载奖励和头像，并保留渲染后的 jQuery 显隐时机。
- 保持：API、财富/威望字段、头像、匿名显示、DOM id/class 与文案。
- 延期：请求无取消/旧响应保护，奖励对象继续附加头像字段。
- 兼容：旧文件保留 default 与 `Award` 导出。
- 人工检查：空奖励、多奖励、头像、匿名、异常 API 与快速翻页。
