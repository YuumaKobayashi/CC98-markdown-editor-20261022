# app

应用级启动、Provider、Router、Store 和持久布局的 owner。P06 迁入 `bootstrap` 与最小 Provider 树；P09 已将唯一根 Store 和空的跨标签页同步壳迁入 `app`。Router、Header 和 Footer 仍按后续阶段处理。

`app` 可以组合其他源码层，其他层不得 import `app`。

## P09 Store 边界

- `store` 只原样承载 `error`、`userInfo`、`message`、`router` 四个 legacy reducer；
- 新代码使用 `@app/store` 与 typed hooks，旧代码暂由根 `Store.tsx` facade 兼容；
- listener middleware 与 `CrossTabSync` 当前没有业务 listener 或同步 key；
- RTK Query、领域 slice、持久化迁移和旧 reducer 清理分别归后续领域阶段。
