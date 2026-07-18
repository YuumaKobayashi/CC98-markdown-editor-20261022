# P07 `Utility.tsx` 拆分与解环范围

> 状态：实现与全部有界机械验证完成；等待人工验收；不提交、不 push、不开始 P08

## 唯一大事

将根目录 `Utility.tsx` 按基础设施和业务 owner 拆入 P06 建立的 `src` 边界，同时解除 Utility 对 Store 和业务组件的反向依赖。

## 允许范围

- 迁移 runtime config、HTTP、storage、IndexedDB、主题 registry/runtime 和纯函数；
- 将 Board、Topic、User、Message read service 放入对应 entity；
- 将登录、关注、收藏、发帖、消息操作、管理和账户操作放入对应 feature；
- 建立由 `src/app` 注册的 legacy Utility effect 端口；
- 保留根 `Utility.ts` 和旧子路径 re-export shim；
- 为解环修改 Theme registry 所在位置及 UserInfo reducer 的直接依赖。

## 禁止范围

- 不迁移 Store、Router、页面或组件所有权，不做 class → function；
- 不修改 Redux state shape、API 请求合同、storage key/编码、主题编号或错误码；
- 不升级 TypeScript、React、依赖或 lockfile；
- 不修改 `Ubb/**`、`Components/UbbEditor/**`、样式或主题 SCSS；
- 不修复拆分过程中发现的旧业务缺陷；
- 人工确认前不提交，完成后不进入 P08。

## 完成条件

1. 三个已确认环均从运行时 import 关系上断开；
2. Utility facade、shims 和新 service 不 import Store、actions、Board、Theme 或 Constant 组件；
3. `src/shared` 不反向依赖 app、feature、entity 或 legacy；
4. 旧 159 个 facade 导出除零调用的 `convertHotTopic` 外全部保留；
5. 类型、构建、diff 和受限运行检查完成，真实 API 行为留给人工验收。
