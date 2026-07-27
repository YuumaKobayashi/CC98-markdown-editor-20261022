# FavoriteTopicGroupManager

- 旧位置：`Components/UserCenter/MyFavortitesManage.tsx` / `MyFavoritesPostsManager`。
- 新位置：`src/pages/user-center/favorites/ui/FavoriteTopicGroupManager.tsx` / `FavoriteTopicGroupManager`。
- 之前：class 用 form ref 和 visible/option/confirmLoading state 管理新增、重命名与删除。
- 现在：具名函数使用相同 ref/state、表单校验、API 顺序和 Notice DOM id。
- 保持不变：十组上限、默认组保护、名称长度、删除说明、Modal/Menu DOM、成功与失败文案。
- 延期：异步异常可能保持 confirm loading，最大值判断只处理恰好十组。
- 兼容：旧文件保留 default/named re-export。
- 人工检查：三种操作、空分组、十组上限、校验、成功/失败、取消与刷新。
