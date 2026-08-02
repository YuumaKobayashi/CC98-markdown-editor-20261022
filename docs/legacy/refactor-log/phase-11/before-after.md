# P11 前后对照

## 组件形态

- 之前：4 个组件继承 `React.Component`；两个维护简单 local state，两个仅在 `componentDidMount` 执行 DOM/storage 操作。
- 之后：4 个组件均为具名 `function`；组件内部 7 个 helper/handler/async action 使用 `const + 箭头函数`；局部状态使用 `useState`，mount-only DOM 操作使用空依赖 `useLayoutEffect`。
- 没有引入 `React.FC`、memo、Context、Redux hooks、Router hooks 或新的数据缓存。
- 原实现注释随对应组件或 `NoticeSetting` 符号原文迁移，没有留在 facade，也没有压缩或改写。

## 状态与事件顺序

- 大字报的关注状态和编辑内容仍只在首次挂载时从当前用户/props 初始化；React 16 下请求完成后的关联 setter 使用 `unstable_batchedUpdates`，对应原单次 `setState`。
- 查看 IP 的 `visible` 仍固定从 `true` 初始化，确认/取消仍只调用父组件回调，由父组件卸载弹窗。
- Focus 页签与消息 radio 仍在 DOM commit 后同步修改；原 class 没有 cleanup，新函数也没有虚构 cleanup。
- `noticeSetting` 编码、默认值、读取/保存顺序和提示调用保持不变。

## 所有权与兼容

- Board/Focus 页面 UI 归入 `pages`；查看 IP 与消息设置动作归入对应 `features`。
- 新实现直接使用已归位的 owner service；尚未迁移的 UI/action/UBB 通过显式 `@legacy` 桥连接。
- 已知调用方走窄入口，旧文件仅作为 P21 前的兼容 facade。

## 未改变范围

没有改变 API、Router、Store、storage key、样式、主题、依赖版本、AntD 属性或 UBB 源码/选项。

## 构建结果

- 两套 TypeScript 与聚合 typecheck 通过；
- 正式构建由 P10 的 2,384 个转换模块变为 2,389 个，产物仍为 9,449 个文件和 29 个主题 CSS；
- index/reset/IIS 合同保留，既有 Sass、Spectrum 和 chunk 警告未变化。
