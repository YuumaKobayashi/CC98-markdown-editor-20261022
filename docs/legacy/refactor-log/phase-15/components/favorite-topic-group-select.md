# FavoriteTopicGroupSelect

- 旧位置：`Components/UserCenter/MyFavoritesAdd.tsx` / `MyFavoritesAddModalcontent`。
- 新位置：`src/features/favorites/ui/FavoriteTopicGroupSelect.tsx` / `FavoriteTopicGroupSelect`。
- 之前：class 在 mount 读取分组，以默认分组占位并通过 `option` callback 返回选择。
- 现在：具名函数使用 mount effect 和 local state，继续复用既有 favorites service。
- 保持不变：默认分组数据、errorCode 判断、异常回退、Select 尺寸、默认值和 callback 合同。
- 延期：分组请求没有取消或旧响应保护。
- 兼容：旧文件保留 default/named re-export；Topic 详情旧 class 继续通过 facade 消费。
- 人工检查：Topic/收藏页 Modal、分组数量、默认值、选择、失败回退和快速关闭。
