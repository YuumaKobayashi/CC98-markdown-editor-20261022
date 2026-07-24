# FocusTopicArea

- 旧位置：`Components/Focus/FocusTopicArea.tsx` / `FocusTopicArea`。
- 新位置：`src/pages/focus/ui/FocusTopicArea.tsx` / `FocusTopicArea`。
- props：继续接受 `{ id: number; name: string }`；`-1` 为关注用户、`-2` 为收藏主题、`0` 为全部关注版面、正数为指定版面。
- 之前：class 字段控制加载锁，`componentWillReceiveProps` 取数；每次取数后重复注册 document listener，DOM class 由 jQuery 修改。
- 现在：普通 effect 随 `id/name` 请求首批数据，请求序号忽略旧响应；ref 保存加载锁、offset 和停止标记；listener effect 统一注册并 cleanup。
- 保持不变：`focusBoard_:id` 缓存键、每批 20 条、最多 200 条、300px 底部阈值、重复主题截断、字段映射、loading/done 文案和 500ms 回顶动画。
- 修复：切换版面不再积累 wheel/touchmove/scroll handler；旧请求不能覆盖当前选择；失败或过期结果不会锁死后续加载。
- 兼容：旧文件保留组件和 props 类型 named re-export；Focus user/favorite 子页直接组合同 owner 实现。
- 人工检查：四条 Focus 路径、三类数据流、触底/连续滚动/末页、快速切换、失败恢复、回顶与 back/forward。

## 审核结论

2026-07-24 人工验收通过。
