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
- `FocusBoardArea`/`FocusTopicArea` 当时保留的请求、缓存、滚动监听和 jQuery 事件绑定已在后续 Focus 页面剩余壳层组处理，见 `P15-FOCUS-*`。

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

## 版面列表与展示叶子迁移组

- `P15-BOARD-LIST-001`（已修复）：版面导航目标不存在时旧代码直接调用 `scrollIntoView` 并崩溃；现在使用空值保护。
- `P15-BOARD-TAG-001`（已修复）：一级、二级标签列表的映射元素缺少 React key；现在使用稳定 tag id。
- `P15-BOARD-RECORD-001`（已修复）：操作记录 IP hover 依赖全局 jQuery 查询并保留调试日志；现在由组件本地状态控制 class。
- `P15-BOARD-ACTION-001`（已清理）：`ListButtonAndAds.clickListener` 从未绑定到任何 DOM 或调用方；迁移后删除，不影响现有登录/认证/锁定提示。
- `P15-BOARD-LIST-002`（已保留）：`/Board/all` 失败时仍不提供 loading、错误或重试 UI；本批只迁移组件形态。
- `P15-BOARD-RECORD-002`（已保留）：操作记录继续使用普通 `<a target="_blank">` 且不新增 `rel`；链接安全策略不在本批扩展。

## 公共用户管理子页迁移组

- `P15-USER-MANAGE-001`（已修复）：直达管理 URL 时旧组件可能继续使用 Redux 中前一个访问用户 id；现在以当前路由为唯一查询目标。
- `P15-USER-MANAGE-002`（已修复）：旧管理页将 name 路由参数按整数解析，无法正确加载用户名路由；现在支持 name 查询并规范化到 id URL。
- `P15-USER-MANAGE-003`（已修复）：快速切换用户时旧请求可晚到并覆盖当前页面；现在使用请求序号忽略旧结果。
- `P15-USER-MANAGE-004`（已修复）：同主题多条近期发言复用 `topicId` React key；现在组合主题、楼层和时间形成稳定 key。
- `P15-USER-MANAGE-005`（已保留）：解除处罚仍要求填写理由；TP 天数继续接受 `-1` 或 7 至 1000，未填写天数时也沿用旧比较行为；本批不改变后台操作合同。
- `P15-USER-MANAGE-006`（已保留）：近期发言总页数仍按 `Math.floor(count / 10) + 1` 展示，整十条时会多显示一页；迁移保持现有展示语义。
- `P15-USER-MANAGE-007`（已保留）：页面不新增前端管理员权限判断，真实授权仍由既有侧栏入口与后端 API 共同控制。

## Focus 页面剩余壳层迁移组

- `P15-FOCUS-001`（已修复）：旧 `getData` 在每次版面 props 变化后重复注册 wheel、touchmove 和 scroll listener，只在最终卸载各移除一次；现在 effect 每次先清理旧 handler。
- `P15-FOCUS-002`（已修复）：快速切换版面时旧首批请求可晚到并覆盖当前主题流；现在使用请求序号忽略非当前结果。
- `P15-FOCUS-003`（已修复）：旧版面标签的 jQuery click/dblclick handler 从不解绑；现在改为 React 事件与派生选中 class。
- `P15-FOCUS-004`（已保留）：主题流仍依赖滚动、wheel、touchmove 触发和 300px 底部阈值，没有新增 IntersectionObserver、取消请求或错误/重试 UI。
- `P15-FOCUS-005`（已保留）：回到顶部仍保留 jQuery 500ms 动画；本批只移除展示与事件绑定所需的 jQuery DOM 修改。
- `P15-FOCUS-006`（后续清理）：`FocusBoardAreaState`、`FocusTopicAreaState` 迁移后零引用，留作 P21 删除候选；`CardTopicSingle` 与音视频/侧栏卡片另批迁移。

## 主题发现页与卡片视图迁移组

- `P15-TOPIC-DISCOVERY-001`（待后续修复）：`NewTopicsBoardSidebar` 沿用旧 `CardBoard` 行为，window scroll listener 不 cleanup；重复挂载可能积累 sticky handler。
- `P15-TOPIC-DISCOVERY-002`（待后续修复）：DPlayer 构造异常被吞掉后仍会调用空播放器实例的 `on`；本批按用户要求保留失败路径，后续需补实例保护并做异常媒体验收。
- `P15-TOPIC-DISCOVERY-003`（待后续复核）：版面和随机近期主题保留旧 OR 空值判断；后续应结合 service 的真实 null/undefined/字符串返回合同统一判断，避免在迁移批次内猜测错误语义。
- `P15-TOPIC-DISCOVERY-004`（待后续修复）：版面项继续使用数组索引 key，随机近期主题外层继续缺少 key；本批不改变 React 身份策略。
- `P15-TOPIC-DISCOVERY-005`（待后续清理）：新帖隐私按钮的 `debugger` 与随机近期主题的 console 调试日志按严格保真要求保留。
- `P15-TOPIC-DISCOVERY-006`（已保留）：新帖首次/刷新请求失败时加载锁可能保持 false，页面没有独立错误或重试 UI；增量请求失败仍恢复加载锁。
- `P15-TOPIC-DISCOVERY-007`（后续清理）：`NewTopicAreaState`、`RecommendedTopicAreaState`、`RandomTopicAreaState` 已无 live owner，留作 P21 引用证明与删除候选。

## 用户中心资料、主题与转账设置迁移组

- `P15-USER-SETTINGS-001`（待后续修复）：生日校验只拒绝未来日期，不拒绝被 `Date` 自动进位的非法月日；年份 `9999` 继续跳过该检查。本批保留既有提交合同。
- `P15-USER-SETTINGS-002`（待后续修复）：资料成功提示的一秒 timer、头像 FileReader 与 canvas `toBlob` 异步回调不取消；组件卸载或快速重复选择时仍可能晚到。本批不增加 mounted 标记或改变反馈时序。
- `P15-USER-SETTINGS-003`（已保留）：头像裁剪只支持鼠标事件，不支持 touch/pointer；本地文件、canvas/context、图片和 Blob 失败路径仍缺少完整空值保护。
- `P15-USER-THEME-001`（已保留）：固定主题 PUT 失败继续静默；主题设置失败只显示 API `statusText/message`，不进入全局错误 UI。
- `P15-USER-THEME-002`（待后续修复）：主题设置表单只在首次挂载读取传入 setting，三秒结果 timer 卸载时不清理；本批保持原局部状态和提示时序。
- `P15-TRANSFER-WEALTH-001`（待后续重构）：转账继续复用用户中心全局 `isLoading/isError/errorMessage`，并由旧 thunk 原地修改 `currentUserInfo.wealth`；并发的其他用户中心请求仍可能干扰按钮或结果判定。
- `P15-TRANSFER-WEALTH-002`（待后续修复）：金额正则允许多个小数点等异常格式，收款人前导空白可能产生空用户名；UI 声称最多 10 人但前端不校验，金额 `10` 可提交而输入提示写“请输入大于10的金额”。本批按用户要求保留。

## 用户中心近期动态、收藏与浏览历史迁移组

- `P15-USER-ACTIVITY-001`（待后续修复）：近期主题 thunk 读取 `hasTotal.profile`，overview UI 与我的主题页读取 `hasTotal.mytopics`；scroll 事件还可能在 Redux loading props 更新前连续触发。本批保留键错位和并发语义。
- `P15-USER-FAVORITES-001`（待后续修复）：收藏页仅 query 变化不会更新 keyword；分组刷新会导航到不含 `?keyword` 的路径；筛选/搜索事件先请求再导航，路由 effect 会再次请求。本批保持 URL、请求顺序和重复请求行为。
- `P15-USER-FAVORITES-002`（待后续修复）：收藏 PUT/DELETE service 不检查 HTTP 状态；收藏列表、分组加载及 mutation 均无旧响应保护；分组管理异步异常可能使 confirm loading 保持。本批不扩展响应合同或增加竞态保护。
- `P15-USER-HISTORY-001`（待后续修复）：历史 thunk 继续原地修改 Redux 数组、总页数和开关；开关提交没有 pending 锁、局部错误提示或快速重复操作保护。
- `P15-USER-CENTER-ROUTE-001`（已保留）：收藏与历史的 page/order/group 继续使用宽松 `parseInt`/`Number` 解析；非法、部分数字和特殊数值 URL 的规范化留待独立路由修复。
- AST 历史口径只统计 class declaration，遗漏了 `Topic-ReplierSignature.tsx` 的 React class expression；本组开始补充双口径，避免在该 class expression 仍存在时误报 P15 完成。

## 当前公开 Board 页面迁移组

- `P15-BOARD-PAGE-001`（待后续修复）：Board route 和列表只在首次挂载取数；浏览器 back/forward、同组件快速切换版面或仅路由 page 变化不会统一重取，事件触发的分页则继续先请求再拼接 pathname 导航。
- `P15-BOARD-PAGE-002`（待后续修复）：Board、置顶、列表、标签和速览请求没有旧响应保护、取消或局部错误 UI；空版面与部分异常响应会继续显示永久 Spin 或在后续字段访问时异常。
- `P15-BOARD-TAG-002`（待后续修复）：主题项继续直接执行 `localStorage.getItem("tagInfo").slice(4)` 和 `JSON.parse`；缓存缺失、格式变化或损坏时没有空值/解析保护。
- `P15-BOARD-ROUTE-001`（已保留）：页码继续使用宽松 `parseInt`，分页目标继续通过 `window.location.pathname` 字符串截取拼接；非法页码、尾斜杠和特殊路径的规范化留待独立路由修复。
- `P15-BOARD-MODERATION-001`（待后续修复）：小黑屋每次请求 6 条却以 21 条判断 `hasMore`，分页继续原地 `pop` 当前数组；小黑屋确定按钮仍只关闭批量管理状态，不能关闭小黑屋 Modal。
- `P15-BOARD-MODERATION-002`（待后续修复）：批量锁沉/删除不检查 HTTP 状态，没有 pending 锁、成功/失败反馈或列表刷新；理由 Select 的调试日志和 Modal footer 缺 key 警告继续保留。
- `P15-BOARD-RECORD-003`（待后续修复）：事件记录组件随 Footer 挂载，即使事件 Modal 尚未打开也会请求第一页；分页请求无异常、取消和旧响应保护。
- `P15-CLASS-INVENTORY-001`（已修正口径）：历史 P15 AST 清单只扫描 `Components/** + src/**`，遗漏计划范围内 `Pages/**` 的 25 个 declaration 与 1 个 expression；自本组起同时维护历史窄口径和完整非冻结口径。

## Topic 评分与管理弹窗迁移组

- `P15-TOPIC-POST-MANAGEMENT-001`（待后续修复）：发言管理没有局部 pending 锁，数值继续使用宽松 `parseInt`；表单和异步异常被统一吞掉，非 `ok` 结果直接 `alert` 原始字符串。`privilege` 与本地 option 状态继续不参与权限过滤或提交。
- `P15-TOPIC-RATING-001`（待后续修复）：正负评分理由在切换页签时请求，没有 pending 去重、取消或旧响应保护；评分 API 抛错后可能保持 loading；未选择评分类型时的既有提示/未知错误路径不调整。
- `P15-TOPIC-MANAGEMENT-001`（待后续修复）：主题管理继续不使用 `isManager/permissions` 过滤菜单；移动版面 Select 的默认显示混用版面名称和提交 ID，切换父版面后默认 child 仍写名称，并继续排除 id 182。
- `P15-TOPIC-MANAGEMENT-002`（待后续修复）：高亮请求返回值不写入 `status`，因此请求正常返回时仍按 `ok` 刷新并关闭；所有主题管理 mutation 均无 pending 锁、取消和旧响应保护，版面缓存前缀兼容清理与调试日志保持。
- `P15-TOPIC-HISTORY-001`（待后续修复）：管理记录忽略传入的 `visible` 值并在挂载时直接请求第一页；分页每次 7 条，没有异常 UI、取消或旧响应保护，快速切页可能被晚到响应覆盖。
- `P15-TOPIC-LEGACY-001`（P21 候选）：Topic `Judge`、`TopicJudgeV2`、`PostManagement` v1、`TopicManagement` v1 未发现 JSX 调用，本批不为降低 class 数量而迁移；P21 仍需重新完成引用和构建证明后再删除。
