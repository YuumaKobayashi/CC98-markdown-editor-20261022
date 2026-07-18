# P09 人工确认

> 当前状态：实现、运行时兼容修复、有界机械门禁与人工提交授权完成；不 push、不开始 P10

## 待确认内容

- 接受 RTK 1.9.7、React Redux 8.1.3、Redux 4.2.1、redux-thunk 2.4.2 兼容簇；
- 接受根 Store 仍且仅有 `error`、`router`、`userInfo`、`message`，`Post` 不注册；
- 接受 typed hooks、空 listener middleware 和空 CrossTabSync 壳作为后续基础；
- 接受为保持旧行为暂时关闭 immutable/serializable checks；
- 接受 Header storage listener、reducer 副作用、直接 Store 访问和 dormant SignalR 保留；
- 接受构建转换模块从 2,344 增至 2,371，但 9,449 个产物文件和 29 个主题保持；
- 接受真实页面、Redux DevTools、登录/消息/双标签页行为仍需人工环境复核。

## 提交门禁

已获人工授权创建以下两个提交；仍不 push、不开始 P10：

1. `refactor(p09): establish Redux Toolkit store foundation`
2. `docs(p09): record Redux store migration evidence`

## 确认记录

- [x] 人工已审阅当前改动；
- [x] 人工已接受仍需后续复核的登录、消息和双标签页运行路径；
- [x] 人工已授权创建上述 P09 提交。
