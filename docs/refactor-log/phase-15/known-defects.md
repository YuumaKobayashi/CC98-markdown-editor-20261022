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

## 无 Redux 轻状态与导航组件组

- `P15-PAGER-001`（已修复）：用户中心 Pager 在总页数不超过 7 时为所有页码元素使用相同空 key；现改为稳定的 `href + page` key，并移除 render 调试日志。
- `P15-TOPIC-001`（已修复）：匿名用户链接和无标签搜索项在旧实现首次绘制后才由 jQuery 修正，可能短暂显示错误的可点击/标签状态；现由 props 在首次 render 声明式决定。仍保留“主题作者匿名时同时禁用最后回复用户链接”的既有合同。
- `P15-TOPIC-002`（已修复）：Topic breadcrumb 把 props 复制到 state，首次 commit 为空且更新需额外 render；现直接读取当前 props。
- `P15-FOCUS-001`（已修复）：Focus 页签选中状态由三个子页挂载副作用竞争维护，收藏页还使用 `useLayoutEffect`；现由布局按 pathname 唯一派生，支持 deep link 与 back/forward。
- 通用 Pager 的 Go 输入仍是非受控输入，`nextPage` 仍按旧合同只在组件实例创建时取当前页；本组不主动改变该交互语义。
- `FocusBoardArea`/`FocusTopicArea` 仍包含旧请求、缓存、滚动监听和 jQuery 事件绑定，留待后续高风险小批迁移。

## 用户中心 Redux 页面与壳层组

- `P15-USERCENTER-004`（已修复）：关注/粉丝页过去接受负数页码并在首次进入不滚动；现复用既有正整数页码合同，首次进入和分页变化均滚动到顶部。
- `P15-USERCENTER-005`（已保留）：用户中心多个页面继续共享 `userInfo.isLoading`，并且 thunk 不提供取消/请求序号；本组不改变跨页面加载态竞争与陈旧响应风险。
- `P15-USERCENTER-006`（已保留）：关注/粉丝 Pager 过去忽略已从 Redux 读取的 `hasTotal`，始终传入 `true`；本组保持该公开展示合同，不在迁移中推断分页语义。
- 在该组检查点，关注版面仍由 legacy `MyFavoritesBoard` 处理关注/取关 mutation，关注/粉丝用户项仍由 legacy `MyFollowingsUser` 处理 follow mutation；随后已由下述交互叶子组迁移。

## 用户中心交互叶子组

- `P15-USERCENTER-007`（已修复）：`MyFollowingsUser.unfollow` 未等待异步请求，Promise 被直接视为成功，失败响应仍会切换按钮并更新 Redux；现仅在 `await unfollowUser(id)` 返回成功后更新状态和 dispatch，失败显示“取关失败”。
- `P15-USERCENTER-008`（已保留）：用户/版面关注操作没有请求取消或卸载保护；快速离开页面时请求仍会结束，本组不扩展全局 mutation 基础设施。
- `P15-USERCENTER-009`（已保留）：侧栏回顶继续依赖 jQuery `animate` 以保持现有 500ms 行为；完整移除 jQuery 留给专门批次。
- `P15-USERCENTER-010`（待后续修复）：`UserCenterNavigation` 当前直接把 `btn-show`/`btn-disappare` 动画类名保存为 React state，并在 document scroll 事件中切换；这是为保持旧行为而保留的表现层状态，不作为最终设计。后续与回顶 jQuery 清理一并改为语义化可见状态、由 render 派生 class、CSS transition 和原生滚动 API，同时补齐挂载时初始同步、234px 临界值、首次隐藏无闪烁及淡入/淡出/回顶手感的浏览器验收。

## 热门主题同构页面组

- `P15-HOTTOPIC-001`（已修复）：三个热门列表过去为 `FocusTopicItem` 缺少 React key；现使用稳定的 topic id。
- `P15-HOTTOPIC-002`（已修复）：旧异步 `componentDidMount` 在页面卸载后仍可能 `setState`；现由 effect cleanup 忽略旧结果，不改变 API 请求本身。
- `P15-HOTTOPIC-003`（已保留）：首次加载和请求失败仍只显示空白列表，没有 spinner、空态或重试入口；本组不扩展页面交互合同。
- `ExactActivitiesPosts` 未发现运行时引用，登记为 P21 引用证明与删除候选，不为 class 计数而迁移。
