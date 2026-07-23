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

## 首页、搜索与站务组件组

- `P15-HOME-001`（已修复）：广告组件初始化读取 `mainAds`，后续请求和登录清理使用 `mainAds-v2`；现统一为 `mainAds-v2`。
- `P15-HOME-002`（已修复）：首页与广告异步结果可能在卸载后更新，广告 interval 依赖 class 实例清理；现分别由 effect cleanup 保护。
- `P15-SEARCH-001`（已修复）：旧代码注释要求最多五个关键词，却用 `splice(5)` 取第五项之后的内容；现使用前五个关键词。
- `P15-SEARCH-002`（已修复）：路由变化会重复注册 scroll listener，旧请求可能覆盖新搜索，展示依赖 jQuery 修正；现使用 cleanup、请求序号和声明式状态。
- `P15-SEARCH-003`（已修复）：搜索结果缺少稳定 key，版面空数组不会显示无结果；现以实体 id 为 key，并统一空态。
- `P15-SITEMANAGE-001`（已修复）：公告成功提示 timer 未清理；现卸载时清理且忽略旧响应。
- `P15-SITEMANAGE-002`（已修复）：栏目编辑直接修改 state 数组，且空列表新增访问 `data[0].id`；现不可变更新并用最大 id 加一。
- 搜索 API 仍不支持 AbortSignal；本组通过请求序号忽略旧结果，但不会取消已发出的网络请求。
- `RecommendedBoardComponent` 与 `SearchState` 继续留作 P21 引用证明/删除候选。

## 消息与私信组件组

- `P15-MESSAGE-001`（已修复）：通知子页用 jQuery 修改父 layout 页签，setting 没有对应逻辑；现由 pathname 唯一派生。
- `P15-MESSAGE-002`（已修复）：通知页首次挂载不区分页码就读取第一页缓存；现仅第 1 页且对应未读数为零时复用。
- `P15-MESSAGE-003`（已修复）：联系人缓存失效依赖未读计数 DOM class，联系人选中和更多状态依赖 jQuery；现已移除联系人 Web Storage，相关状态由 React 管理。
- `P15-MESSAGE-004`（已修复）：会话消息数组原地 reverse，textarea 事件在每次 update 重绑且没有卸载清理，发送 timer 也未清理；现使用不可变数组、React 事件和 cleanup。
- `P15-MESSAGE-005`（已修复）：`sortContactList` 为 deep link 新联系人把整条消息对象写入 `lastContent`；现写入消息 `content` 字符串并处理空消息。
- `P15-MESSAGE-006`（已保留）：`readAll` 在私信/设置页无操作，成功读取单类通知后仍清零全部本地未读计数；本组不扩大 API/Redux 协议。
- `P15-MESSAGE-007`（待后续修改）：聊天窗口在输入框已有内容时切换联系人，当前会清空旧草稿；后续应按联系人保留草稿缓存，切回联系人时恢复尚未发送的内容。
- 消息 API 不接受 AbortSignal；通知翻页和联系人切换通过请求序号忽略旧结果，但不会取消网络请求。
- 五个旧 state/props class 已无 live owner 消费，留待 P21 引用证明后删除。

## Header、登录、通知与错误控制组

- `P15-HEADER-001`（已修复）：Header 的两个匿名 storage listener 和搜索 document click/DOM listener 从不 cleanup；现改为具名 effect handler，并在卸载时移除。
- `P15-HEADER-002`（已修复）：顶部搜索依赖 jQuery 持有搜索类型、输入和下拉显示；现由 React state 派生，路由上下文变化时同步回对应默认类型。
- `P15-LOGIN-001`（已修复）：登录成功但 `logOnRedirectUrl` 缺失、损坏或跨域时，旧代码可能导航到无效地址；现统一回退 `/`。
- `P15-ERROR-001`（有意变化）：全局错误重置现在首次挂载也执行，不再只模拟 class 的 update 分支；后续仍由 pathname 变化触发。
- `P15-NOTIFY-001`（已保留）：`NotificationController` 仍未挂载，SignalR、跨标签页未读同步、标题闪烁和浏览器通知均不运行；本组不恢复实时通知。
- `P15-NOTIFY-002`（待后续处理）：SignalR 仍是全局可变 singleton，标题闪烁器可能重复启动 interval；由于控制器保持停用，本组只补监听和连接 cleanup，不重构消息基础设施。
- `P15-NOTIFY-003`（已修复但当前不可达）：旧浏览器通知把点击回调放进非标准 Notification options；新实现改为设置 `notification.onclick`。控制器保持未挂载，因此本批不会产生新的运行时行为。
- `P15-HEADER-003`（后续需大规模重构）：本批只完成 class 到函数组件迁移、owner 归位和已授权的窄修复；`Header.tsx` 仍集中承担用户菜单、搜索、导航及多类持久化/浏览器事件职责。后续应单独立项拆分职责并治理状态与缓存，不在本批继续扩展。
- `P15-NOTIFY-004`（后续需大规模重构）：实时通知仍依赖全局 SignalR singleton、storage 事件、标题闪烁和浏览器通知等耦合基础设施；恢复挂载前应单独重构连接生命周期、跨标签页协调与通知权限管理。
- 登录源码仍包含既有 OIDC 客户端配置，认证协议与安全治理不属于函数组件迁移范围，文档不复制其具体值。
- `ErrorBoundary` 按 P15 例外继续保留 class；零调用测试桩 `ErrorEmitter` 登记为 P21 删除候选。

## 公共用户详情页迁移组

- `P15-USER-PROFILE-001`（已修复）：访问不存在用户后 `currentVisitingUserIsExisted=false` 会使父壳永久阻止新的详情请求；现在每次 `method/id` 变化先恢复查询状态。
- `P15-USER-PROFILE-002`（已修复）：旧页码解析会把非数字或部分数字 id 交给请求；现在仅接受 `name` 或安全正整数 `id`，非法参数直接显示用户不存在。
- `P15-USER-PROFILE-003`（已修复）：生日字符串非空但不符合日期格式时，旧实现解引用空匹配并崩溃；现在先检查匹配结果。
- `P15-USER-PROFILE-004`（已修复）：头像徽章和近期主题列表缺少稳定 key；现分别使用 title id 与 topic id。
- `P15-USER-PROFILE-005`（已修复）：近期主题最终批次不足 11 条时旧 scroll listener 不解除，可持续请求相同末页；现由 `hasMore=false` 停止监听。
- `P15-USER-PROFILE-006`（已保留）：关注 API 仍使用既有返回字符串区分上限与其他失败；本批不扩展 follow 协议、取消请求或全局错误 UI。
- `P15-USER-PROFILE-007`（已保留）：近期主题首次请求期间仍显示既有“没有主题”，请求失败仍只记录日志；本批不新增 spinner、错误态或重试按钮。
