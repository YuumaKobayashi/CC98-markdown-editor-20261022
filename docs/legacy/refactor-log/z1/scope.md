# Z1 业务类型和数据模型 owner 收口范围

日期：2026-08-02

实施基线：干净的 `dev20260716@2fb2a54f`

范围：只实施 Z1；不进入 Z2，不迁移 UBB，不改变 API、Storage、Router、DOM/CSS、权限或用户可见时序，不 commit、不 push

## 1. 本批完成项

- 将 19 个 `@types/@cc98` ambient API 声明拆入 Board、Topic、Post、User、Message、Daily Signin 和 Site Content 的真实 Module owner，并由 Module 根入口公开类型合同。
- 将活动 `Props/States` 合同迁入 Board、Topic、Post、User、Session、User Preference、Wealth 或唯一消费它的 Board Route；所有消费者改用类型入口。
- 将无运行时身份的 Message、Notification、Home、Board List 和 Topic Reply 数据 class 改为 interface；Home 广告的唯一构造调用改为字段顺序一致的对象字面量。
- 删除 48 个 Z1 根级文件：`@types/@cc98` 19、`Props` 16、`Match` 1、`States` 12；`States/UbbEditorState.tsx` 原样保留给 Z2。
- 移除 `@cc98/api`、`@legacy/Props`、Z1 `@legacy/States`、`@legacy/Match` 消费和 17 条对应 architecture allowlist，保留 10 条 Z2 UBB 例外。
- 从现代及 legacy TypeScript include 中移除已删除的 `@types/@cc98`、`Props` 和 `Match`，但保留 `States` 和 legacy 双编译至 Z2/Z5。

## 2. 明确不做

- 不猜测收窄旧合同中的 `any`，不把互相冲突的端点 shape 强行合并。
- 不修改 `CurrentUser`、`IUser`、`UserInfo` 各自的字段集合、可空性或大小写。
- 不把 User Preference 主题设置、Session 当前用户主题设置与 Foundation 运行时主题配置合并为一个 owner。
- 不删除或修改 `States/UbbEditorState.tsx`、`Ubb/**`、UBB 组件、注册顺序、样式或输出合同。
- 不修复审计中发现的 `ISignIn.lastSignInTime` 旧声明与活动页面类型冲突。

## 3. 当前停点

代码、类型闭包、注释保真和文档已完成；生产构建成功，但迁移前后完整 JS 产物聚合 SHA-256 不一致。该差异来自本计划明确要求的伪 class/构造器移除和 legacy 运行时模块边删除，因此“class 转 interface”与“全部 JS 字节零漂移”不能同时成立。本批不制造兼容死代码来伪造旧产物，结果记录在 `manual-checklist.md`，等待人工验收。
