# P10 前后对照

## 组件形态

- 之前：13 个展示组件继承 `React.Component`，业务 JSX 位于旧页面/组件目录；
- 之后：13 个组件使用具名函数和显式 props 类型，不使用 hooks、`React.FC` 或 `React.memo`；
- JSX、className、固定 URL、日期格式、UBB 字符串与 options 保持原样；普通 `Component` 没有被额外 memo 化。

## 所有权与兼容

- 首页私有 UI/模型进入 `pages/home`；消息与帖子领域展示进入对应 entity；
- 已知消费者直接使用窄入口，旧文件只作为 P21 前的兼容 facade；
- `UbbContainer` 和 `UbbCompatiblityMode` 仍通过显式 `@legacy` 桥使用冻结实现；
- 没有新增请求、Redux state、Router 行为、storage key、CSS 或依赖。

## 构建结果

- `typecheck:modern`、`typecheck:legacy` 和聚合 `typecheck` 通过；
- 正式构建通过，转换模块由 P09 的 2,371 增至 2,384，等于新增的 13 个组件模块；
- 产物仍为 9,449 个文件、29 个主题 CSS，index/reset/IIS 文件存在；
- Sass `@import`、Spectrum 恢复性警告和大 chunk 警告保持既有状态。
