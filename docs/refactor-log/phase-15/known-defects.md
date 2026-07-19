# P15 首批已知缺陷与行为变化

## 未修复的既有问题

- `STATE-USER-001` 至 `STATE-USER-004`：用户数据的 Redux/storage 重复事实源、直接 state 修改和缺失 reducer case 均留待既定阶段；本批只消费现有 reducer。
- 两个页面共享 `userInfo.isLoading`，可能被用户中心其他请求相互影响；P17 前不调整状态所有权。
- 现有 thunk 不提供请求取消或请求序号。本批没有跨越 action/service 边界增加竞态控制；真实快速翻页需人工确认没有陈旧响应覆盖。

## 已授权的首批行为变化

- `P15-USERCENTER-001`：旧页码解析接受负数；新解析只接受正整数，其余回退到第 1 页。
- `P15-USERCENTER-002`：旧 `ishot` 直接执行 `Number(...)`；新实现固定为 `0 | 1`，只有路由值 `"1"` 表示热门。
- `P15-USERCENTER-003`：旧实现首次进入不滚动，只有 props 参数变化时滚动；新实现进入页面和分页/热门条件变化时均滚动到顶部。

上述变化只影响无效 URL 或视口位置，不修改合法 URL 下的请求合同和列表内容。

## 无 Redux 简单组件组

- `P15-SIMPLE-001`（已修复）：`MessagePerson` 过去在 render 中把空 `lastContent` 写回 `props.data`；现改为局部派生值，避免修改父级/缓存对象。
- `P15-SIMPLE-002`（已修复）：用户生日字段非空但不符合日期格式时，旧资料组件会访问空正则匹配；现只在匹配成功时判断生日。
- Notice 仍依赖固定 DOM id、CSS class 与外部 jQuery show/hide 合同；本轮只迁 owner，不重构该 ABI。
- `ExactActivitiesTopics`、SiteManage 的 Announcement/Advertisement 以及冻结 UBB 仍是 legacy 子树；本轮 wrapper 迁移不代表这些子组件完成 P15。
- 已登记的零调用 class 只进入 P21 候选，不在迁移中顺便删除。
