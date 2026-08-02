# P11 简单局部状态与 mount-only effect 组件函数化范围

> 状态：4 个组件实现与有界机械验证完成；用户已授权代码/文档分开提交，人工页面验收仍待记录；不 push、不开始 P12

## 唯一大事

在 React 16.14 上将 4 个在用 class 组件改为具名函数，并在不改变 state、effect、请求、storage、DOM 或事件顺序的前提下归入 page/feature owner。

## 允许范围

- 迁移版面大字报与查看 IP 弹窗两个简单局部状态组件；
- 迁移收藏更新页签与消息设置两个 mount-only DOM/storage effect 组件；
- 使用 P07 已归位的 owner service，并通过 `@legacy` 连接未迁移的父组件、页面 action、DocumentTitle、NoticeMessage 和冻结 UBB；
- 将已知调用方切换到窄入口，旧路径保留 re-export；
- 组件使用具名 `function`，组件内部具名函数使用 `const + 箭头函数`；
- 将原实现注释随所属实现或符号原文迁入新 owner；
- 记录逐组件 state/effect/cleanup、事件顺序、保留缺陷和人工验收路径。

## 禁止范围

- 不迁移 Redux、Router、复杂 lifecycle、订阅/timer cleanup 或 app shell 组件；
- 不创建 `shared/ui`，不升级 React、AntD 或其他依赖；
- 不改变请求合同、storage key、路由、CSS、主题或 UBB 选项；
- 不修改 `Ubb/**`、`Components/UbbEditor/**` 或未选中的 class 组件；
- 不修复迁移中发现的旧缺陷；
- 不提交、不 push、不进入 P12。

## 完成条件

1. 4 个目标符号均由具名函数实现，旧文件只保留兼容导出；
2. 组件内部 7 个具名函数均为 `const + 箭头函数`，不存在普通 `function` 声明；
3. 原始注释逐项保留，未删除、压缩或改写；
4. state 初始化、mount effect、无 cleanup 事实和事件顺序有逐项对照；
5. 两套 TypeScript、正式构建、diff 和窄入口检查通过；
6. 有界开发服务验证四个入口可转换且测试进程完整回收；
7. Board、Topic 管理、Focus 和消息设置由人工审核后才允许提交。
