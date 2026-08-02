# P13.5 人工确认

> 当前状态：用户已审核并授权两笔 P13.5 本地提交；代码提交为 `a298424f`，人工页面验收仍待完成；不 push、不开始 P14

## 已确认的阶段边界

- [x] 新增 P13.5，定位为 P13 与 P14 之间的 Router 去伪依赖和迁移清单阶段；
- [x] P13.5 不升级 Router、不切根 Router、不移除 Redux Router；
- [x] P14 继续拥有单 Router、持久 AppShell、嵌套路由、route lazy 和 `react-router-redux` 清理；
- [x] P15 负责移除为 class 组件保留的临时 route props 兼容桥。

## 待确认内容

- [x] P13 已完成机械门禁和人工验收，并按用户授权创建本地代码提交 `276d0ec0`；
- [x] 用户已授权开始 P13.5 实现；
- [ ] 用户接受目标 service 的 Router 参数确为无效依赖；
- [ ] 用户接受公开 URL、请求、错误、Store 和 Router 4 运行时保持不变；
- [ ] 用户已完成 `manual-checklist.md` 的代表路径验收；
- [x] 用户已审核并授权 P13.5 两笔本地提交；
- [x] 用户已另行授权进入 P14。

两笔本地提交授权不代表人工页面验收已通过，也不授予 push 或进入 P14 的权限。
