# P09 前后对照

## Store 创建

- 之前：根 `Store.tsx` 使用 `createStore`、手写 DevTools compose、显式 thunk 和 router middleware；
- 之后：`src/app/store` 使用 RTK `configureStore`，自动接入 Redux DevTools 与默认 thunk，追加原 router middleware；
- 之后：listener middleware 位于 middleware 链首，但没有注册任何 listener。

## State shape

迁移前后都只有以下四个 key，reducer 实现和初始化顺序未改变：

```text
error
router
userInfo
message
```

`Post` 未注册；没有 slice、RTK Query reducer、第二个 Store 或远端数据副本。

## 兼容接口

- 根 `Store.tsx` 继续提供默认 Store、`Actions`、`history`、`RootState`、`RootAction` 和 `RootThunkAction`；
- 新入口增加 `store`、`AppStore`、`AppDispatch`、`useAppDispatch`、`useAppSelector` 和 typed `startAppListening`；
- provider 与 utility effect adapter 已改用 `@app/store`，legacy 消费者保持原 import。
- React Redux 8 不再向旧 context 暴露 Store；legacy `ConnectedRouter` 改为通过 `store` prop 显式复用同一个根 Store。

## 兼容开关

- `immutableCheck` 暂时关闭，因为既有 thunk 会修改 `getState()` 返回对象；
- `serializableCheck` 暂时关闭，因为 legacy state 含 class 实例且尚未建立领域序列化合同；
- reducer 内 localStorage/IndexedDB 副作用保持原状；P09 只建立 listener 基础设施，不迁移副作用。

## 跨标签页壳

- 之前：应用壳没有统一 storage bridge，Header 自行注册匿名 listener；
- 之后：Provider 内只挂载一个可 cleanup 的 `CrossTabSync` 壳，但 handler map 和 key 白名单为空；
- 当前可观察的 `userInfo`/`showCardUser` 行为仍由 Header 旧代码负责，P17 再迁移。

## 构建结果

- 现代、legacy 和聚合 typecheck 全部通过；
- 正式构建成功，转换模块由 P08 的 2,344 增至 2,371，来源是 RTK/React Redux 8 兼容依赖；
- 产物仍为 9,449 个文件、29 个主题 CSS，并保留 index/reset/IIS 部署文件；
- Sass `@import`、Spectrum 旧 CSS hack 和大 chunk 警告保持既有状态。
