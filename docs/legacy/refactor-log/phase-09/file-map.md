# P09 文件与接口映射

| P09 前 | P09 后 | 说明 |
|---|---|---|
| 根 `Store.tsx` 内直接 `createStore` | `src/app/store/store.ts` 使用 `configureStore` | 根文件变为兼容 facade，旧相对 import 不需要批量修改 |
| 手写 `RootState`、action union 与 Store 实现在同一副作用模块 | `src/app/store/legacy-types.ts` + 推导的 `AppStore/AppDispatch` | legacy state/action 类型模块不产生运行时 import |
| 无 typed hooks | `src/app/store/hooks.ts` | 新代码使用 `useAppDispatch`、`useAppSelector`；旧 `connect` 保留 |
| 无 listener middleware | `src/app/store/listener-middleware.ts` | middleware 已安装并导出 typed `startAppListening`，注册表为空 |
| Provider 直接挂载 LocaleProvider | Provider 内增加 `CrossTabSync` | 无 DOM 包装；handler 与 key 白名单为空；现有 Header listener 不迁移 |
| `src/app` 仍通过 `@legacy/Store` | provider/utility effect adapter 直接使用 `@app/store` | legacy 组件继续通过根 facade 访问同一 Store |
| `ConnectedRouter` 从 React Redux 5 legacy context 隐式读取 Store | 显式传入根 `store` prop | 兼容 React Redux 8；不创建第二个 Store，不提前迁移 Router |
| React Redux 5.0.7 + 外置 `@types/react-redux` | React Redux 8.1.3 自带类型 | React 16.14/Redux 4 兼容档 |
| 无 Redux Toolkit | Redux Toolkit 1.9.7 | 不引入 RTK Query，不升级 Redux/thunk 主版本 |

## 保持原位

- `Reducers/Error.tsx`、`Reducers/UserInfo.tsx`、`Reducers/Message.ts` 内容不变；
- `Reducers/Post.tsx` 继续不注册；
- `Actions/**`、`AsyncActions/**` 与所有 legacy `connect` 消费者不迁移；
- Header 的 `userInfo`/`showCardUser` storage 合同留给 P17；
- Router reducer/middleware 留给 P14。
