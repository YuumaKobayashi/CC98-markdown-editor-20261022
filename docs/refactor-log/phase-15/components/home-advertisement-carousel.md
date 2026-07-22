# HomeAdvertisementCarousel

- 旧位置：`Components/MainPage.tsx` 的 `AdsComponent` class。
- 新 owner：`src/pages/home/advertisement` 具名函数。
- 生命周期：加载与 20 秒轮播分别使用 `useEffect`，interval 在 cleanup 中清理。
- 修复：初始化和请求统一使用既有 `mainAds-v2` 缓存键；卸载后的旧结果不再更新组件。
- 调用方：Home、Board 与 Topic 改用窄入口；旧 `AdsComponent` 继续 re-export。

人工重点：缓存命中/未命中、hover、20 秒轮播、快速离页和登录后缓存清理。
