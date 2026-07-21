# UserFollowCard

- 旧位置：`Components/UserCenter/MyFollowingsUser.tsx` 的 `Fan` class + `connect`。
- 新 owner：`src/features/follow/ui/UserFollowCard.tsx` 具名函数。
- Redux：使用 `useAppDispatch`，成功后继续 dispatch 既有 follow/unfollow action。
- state：由 keyed 用户卡片实例从 `user.isFollowing` 初始化，不使用 previous-props 模拟器。
- 行为：头像、用户链接、统计、hover 文案、私信 URL、关注上限与失败文案保持不变。
- 修复：取关现在等待真实异步结果；旧实现把 Promise 直接视为成功。
- 兼容：旧路径 default re-export 新 owner。

人工重点：关注/粉丝两页的成功、上限、失败、hover、分页换项及私信跳转。
