# UserCenterFavoriteTopicItem

- 旧位置：`Components/UserCenter/ExactFavTopic.tsx` / default 匿名 class。
- 新位置：`src/pages/user-center/favorites/ui/UserCenterFavoriteTopicItem.tsx` / `UserCenterFavoriteTopicItem`。
- 之前：class 渲染收藏主题并通过 Modal 取消收藏或移动分组。
- 现在：具名函数使用相同 props、链接、Dropdown、Modal 和 favorites service。
- 保持不变：版面/主题 URL、时间格式、操作文案、默认分组 0、操作后刷新回调和注释 JSX。
- 延期：收藏 PUT/DELETE 不检查 HTTP 状态，mutation 无请求竞争保护。
- 兼容：旧文件保留 default/named re-export。
- 人工检查：链接、时间、取消、移动分组、成功/失败和列表刷新。
