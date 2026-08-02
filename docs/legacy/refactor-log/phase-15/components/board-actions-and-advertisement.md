# BoardActionsAndAdvertisement

- 旧位置：`Components/Board/Board.tsx` 的 `ListButtonAndAds` class。
- 新 owner：`src/pages/board` 的具名函数。
- 展示：发主题、发投票、未登录、未认证、锁定提示和首页广告保持不变。
- 清理：删除从未绑定或调用的 `clickListener`。
- 兼容：保留 `adsUrl` props 形状；legacy 文件继续 named export `ListButtonAndAds`。

人工重点：五类登录/权限组合、编辑器 URL 与广告加载。
