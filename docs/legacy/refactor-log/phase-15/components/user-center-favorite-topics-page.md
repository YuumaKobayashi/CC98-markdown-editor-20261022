# UserCenterFavoriteTopicsPage

- 旧位置：`Components/UserCenter/MyFavoritesPosts.tsx` / `Posts`。
- 新位置：`src/pages/user-center/favorites/ui/UserCenterFavoriteTopicsPage.tsx` / `UserCenterFavoriteTopicsPage`。
- 之前：connected/withRouter class 用实例 keyword、props lifecycle 和本地分组 state 协调筛选、搜索、分页与刷新。
- 现在：具名函数使用 typed hooks、Router hooks、keyword ref、路由 effect 和相同分组 state。
- 保持不变：收藏/搜索 API、order/group/page URL、默认重定向、11 条探测、分页、文案、DOM/CSS 和请求后导航。
- 延期：query-only 导航不同步 keyword、分组刷新移除 query、筛选/导航重复请求及旧响应竞争。
- 兼容：旧文件保留 default/named re-export；Router 使用 favorites 窄入口。
- 人工检查：deep link、排序、分组、搜索、分页、刷新、back/forward、空列表和异常 API。
