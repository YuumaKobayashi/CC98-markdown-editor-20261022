# P12 前后行为对照

## 应用级 AntD

- 之前：AntD 3 `LocaleProvider`、字符串 `Icon type`、Modal `visible`、`MonthPicker` 与深路径组件导入；
- 之后：AntD 4 `ConfigProvider`、`@ant-design/icons` 官方组件、Modal `open`、`DatePicker picker="month"` 与公开组件入口；
- 中文 locale 仍由 AntD 官方 locale 模块提供，Moment 值、消息调用、Popover/Tooltip 和外层业务 prop 名称不变。

## 六个 class 表单

- 之前：`Form.create` 注入 `form`，`getFieldDecorator` 注册字段，callback 式 `validateFields`；
- 之后：class 自持 `FormInstance` ref，`Form.Item name/rules` 注册相同字段，Promise 式 `validateFields`；
- class 形态、条件表单分支、默认显示、reset、校验消息、解析值、await 请求和成功后 update/close 顺序保持不变；
- Modal 仍从调用方接收原 `visible` 业务 prop，只在 AntD Modal 边界翻译成 `open`。
- `Topic-Judge-v3` 的禁用提示移到具名字段下方；收藏新增表单的分组上限提示从具名字段子元素移到 AntD `Form.Item extra`。文字、计数和显示条件不变，间距与主题表现留待人工样式验收。

## Markdown editor

- 之前：React-16-only fork、Draft.js、两份共享可变 `editor` command；
- 之后：仓库 adapter 持有 Editor Lite 插件，调用方只提供受控文本、Showdown 预览和上传函数；
- 工具栏顺序为标题/粗体/斜体/删除线，链接/引用/代码块，无序/有序/任务列表，最后图片上传和编辑/预览切换；
- 上传成功仍插入 `\n\n![](url)\n\n` 并清空 input；8000 字限制、UBB/Markdown 切换、payload、跳转和草稿逻辑没有改动。

## Chart 与 Lazyload

- 之前：两个年度报告直接使用 BizCharts 3 `Chart/Geom/Axis/Tooltip`；
- 之后：调用方使用通用 `IntervalChart`，adapter 映射到 BizCharts 4 `Interval`，保留字段、alias、auto-fit、y crosshair 和尺寸输入；
- 冻结 UBB 仍写 `import LazyLoad from "react-lazyload"`，只把同名依赖直接升级到 3.2.1。

## 重叠静态 UI

- React Bootstrap 包已移除，唯一 label 仍使用既有 `control-label` class；
- reset/error 继续使用固定 `/static/scripts/lib/bootstrap/` 与 `/static/scripts/lib/bootstrap-icons/`；
- Font Awesome 4 固定 `/static/content/font-awesome/` 继续保留，未批量换图标；
- React/ReactDOM 仍解析为 16.14.0，spatial-watermark 仍固定 commit `b268ef6d5868689e25f0b8f0d58d203bf1f032d5`。
