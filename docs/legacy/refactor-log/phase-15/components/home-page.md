# HomePage

- 旧位置：`Components/MainPage.tsx` 的 `MainPage` class。
- 新 owner：`src/pages/home/main` 的 `HomePage` 具名函数。
- 数据：首页缓存与 `/config/index` 请求合同不变；非空十大仍决定是否写入 60 秒缓存。
- 生命周期：mount `useEffect` 负责加载，cleanup 忽略卸载后的旧结果。
- 兼容：旧路径保留 `MainPage` named re-export，Router 改用 page 窄入口。

人工重点：首页缓存命中/未命中、空十大回退、登录态福利及完整左右栏展示。
