# P10 人工确认

> 当前状态：实现与有界机械门禁完成；等待人工页面验收，不提交、不 push、不开始 P11

## 待确认内容

- 接受严格 13 个组件边界及其 pages/entities owner；
- 接受具名函数、无 hooks/`React.FC`/memo 的兼容写法；
- 接受旧路径 facade 与 UBB `@legacy` 桥保留到 P21；
- 接受 Router/shared UI/stateful/dead candidate 均不进入 P10；
- 接受转换模块从 2,371 增至 2,384，产物数和主题数不变；
- 完成首页、Topic 和登录消息路径人工检查。

## 提交门禁

未经人工确认不创建提交、不 push、不开始 P11。建议确认后拆为：

1. `refactor(p10): migrate home presentation leaves`
2. `refactor(p10): migrate message and post presentation leaves`
3. `docs(p10): record function component migration evidence`

## 确认记录

- [ ] 人工已审阅代码和 13 份组件对照；
- [ ] 人工已完成首页、Topic 和登录消息路径验收；
- [ ] 人工已授权创建上述 P10 提交。
