# P07 人工确认

> 当前状态：实现与全部有界机械门禁完成；等待人工验收，不提交、不 push、不开始 P08

## 待确认内容

- 接受 Utility 按 shared/entity/feature owner 拆分；
- 接受 Store 副作用改为 app 注册的显式端口；
- 接受 `entities ↔ features/auth` 及 feature 间依赖作为阶段性例外，后续在用户与认证能力迁移或单独获批阶段处理；
- 接受三个已确认环的解除方式；
- 接受旧 facade/shim 保留至 P21；
- 接受真实 API、登录态和交互行为需要人工环境复核。

## 提交门禁

未经人工确认不创建提交、不 push、不开始 P08。建议确认后拆为：

1. `refactor(p07): split utility ownership and remove reverse dependencies`
2. `docs(p07): record utility decomposition evidence`

## 确认记录

- [ ] 人工已审阅代码和 P07 文档；
- [ ] 人工已完成或接受未完成的运行路径检查；
- [ ] 人工授权创建上述 P07 提交。
