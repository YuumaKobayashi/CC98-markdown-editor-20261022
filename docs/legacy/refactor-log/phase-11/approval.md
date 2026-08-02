# P11 人工确认

> 当前状态：实现与有界机械门禁完成；用户已授权代码/文档分开提交，人工页面验收仍未由本轮自动验证；不 push、不开始 P12

## 待确认内容

- 接受 4 个组件和 page/feature owner 边界；
- 接受组件使用具名 `function`、组件内具名函数使用 `const + 箭头函数`的统一语法；
- 接受原始注释随实现/符号原文迁移、facade 不重复注释的规则；
- 接受独立 `useState`、空依赖 `useLayoutEffect` 和 React 16 显式批处理映射；
- 接受旧路径 facade 与必要 `@legacy` 桥保留到后续所属阶段/P21；
- 接受 4 项已登记旧缺陷均未在 P11 修复；
- 完成 Board、Topic 管理、Focus 和消息设置人工页面检查。

## 提交门禁

用户确认后按以下边界创建本地提交，不 push、不开始 P12：

1. `refactor(p11): migrate local state and mount effects`
2. `docs(p11): record function component migration evidence`

## 确认记录

- [x] 人工已审阅本阶段交付并授权创建 P11 本地提交；
- [ ] 人工已完成列出的页面与交互验收；
- [x] 人工已授权代码与文档分开提交。

确认记录：2026-07-19，用户回复“写个提交吧 文档跟代码分开”。未勾选的浏览器、真实登录态和真实 API 路径仍保持未验证，不因提交授权自动视为通过。
