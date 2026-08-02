# UserCenterHistoryPage

- 旧位置：`Components/UserCenter/MyHistory.tsx` / `Posts`。
- 新位置：`src/pages/user-center/history/ui/UserCenterHistoryPage.tsx` / `UserCenterHistoryPage`。
- 之前：connected/withRouter class 在 mount 刷新 `/me`、读取历史并标记页签，在 page props 变化时重新取数和滚顶。
- 现在：具名函数使用 typed hooks 与 params；mount effect 负责用户刷新/页签，page effect 负责取数和滚顶。
- 保持不变：浏览记录/开关 API、Redux 字段、确认框、跨端文案、十条展示、Pager、loading 与空列表。
- 有意时序差异：首次挂载也会在普通 effect 后执行 `window.scroll(0, 0)`。
- 延期：Redux 原地修改、开关无 pending/局部错误、宽松页码解析和请求竞争。
- 兼容：旧文件保留 default/named re-export；Router 使用 history 窄入口。
- 人工检查：开关、分页、deep link、空列表、403、异常 API、快速切页与 back/forward。
