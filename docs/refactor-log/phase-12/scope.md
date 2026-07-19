# P12 UI / React peer 阻塞收口范围

> 状态：实现与机械验证完成，已按用户逐批审批创建本地提交；浏览器、真实登录态和真实 API 人工验收待用户执行；不 push、不开始 P13

## 唯一大事

在 React/ReactDOM 16.14、Router、Store、请求和路由行为不变的前提下，把阻塞后续 React runtime 升级的 UI peer 收口到 AntD 4 与仓库自有适配边界。

## 已实施范围

- AntD 升至 4.24.16，图标包固定为 4.8.3；应用中文 locale 由 `LocaleProvider` 迁到 `ConfigProvider`；
- 6 个 class 表单由 `Form.create/getFieldDecorator` 迁到 `FormInstance` ref、字段化 `Form.Item` 和 Promise `validateFields`，组件仍为 class；
- Modal 内部属性迁到 `open`，组件之间既有 `visible` 业务 prop 不变；
- `MonthPicker` 迁到 `DatePicker picker="month"`，继续传 Moment；
- AntD 3 字符串图标直接迁到 `@ant-design/icons` 对应的官方组件，不增加图标包装层；
- 以 `react-markdown-editor-lite` 1.4.2 和仓库 adapter 替换旧 Markdown editor，保留受控文本、Showdown 预览、上传格式、工具栏顺序和 330–500px 高度合同；
- 以无年度报告业务字段的 chart adapter 隔离 BizCharts 4；
- 将冻结 UBB 已使用的 `react-lazyload` 直接升级到 3.2.1，原导入保持不变；
- 唯一 React Bootstrap `ControlLabel` 改为原生 label；Bootstrap、Bootstrap Icons 与 Font Awesome 固定 URL 保留；
- 删除 `.npmrc` 的长期 peer 忽略，严格重建 lockfile。

## 明确未实施

- 不升级 React/ReactDOM，不进入 P13；
- 不改 Router、Redux state、API payload、storage key、主题 ID、公开 URL 或部署静态路径；
- 不引入 Day.js、CSS-in-JS、AntD 5/6 或主题重构；
- 不修改、移动或格式化 `Ubb/**`、`Components/UbbContainer.tsx`、`Components/UbbEditor/**` 及其直接样式；
- 不访问真实 CC98/OpenID、账号、token 或用户数据；
- 不触碰用户未跟踪的 `.vscode/`；
- 不把 P11 尚未完成的浏览器验收标记为通过；
- 不 push，不开始 P13。

## 完成门禁

机械门禁已经完成，代码已按用户逐批审核结果创建本地提交，P12 仍停在人工验收门口。只有用户完成 `manual-checklist.md` 的代表场景并明确授权后，才可讨论进入 P13；本阶段不会自动 push 或进入 P13。
