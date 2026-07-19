# P12 已知问题与保留项

## `P12-NPM-001`：npm 对 Sass 可选 watcher 的顶层显示

严格 `npm ci --legacy-peer-deps=false` 成功，`npm ls --depth=0` 也以 0 退出；npm 仍将由可选 Sass 平台包带入的 `@parcel/watcher`、`@parcel/watcher-win32-x64` 和 `node-addon-api` 标为 `extraneous`。`npm prune` 后显示不变，lockfile 可定位到 Sass 可选依赖；P12 不手工篡改 `node_modules` 或 lockfile 隐藏该 npm 展示问题。

## `P12-BUILD-001`：既有构建警告保留

- Sass `@import` 弃用警告属于 P20；
- Spectrum 的 IE 星号 hack 触发 Lightning CSS warning，源码未在 P12 修改；
- vendors/main chunk 超过 500 kB，路由拆包不属于 P12。

这些警告没有使正式构建失败。

## `P12-ERROR-001`：error 模板不是独立 dist 文件

既有 Vite 合同把根目录 `error.html` 压缩后嵌入 `dist/static/index.html`，不像 `reset.html` 那样复制为独立文件。P12 核对了源模板未变、固定 Bootstrap URL 未变且内容已进入 index，不改变该部署合同。

## `P12-CSS-001`：既有样式覆盖破坏 AntD 组件几何合同

`Styles/Site.scss` 在导入 AntD 样式后，又用全局 `*`、伪元素规则把 `box-sizing` 改回 `content-box`，并保留了全局标签 reset 和若干直接覆盖 AntD 内部类名的规则。AntD 3 与 AntD 4 都以全局 `border-box` 为基础，但 AntD 4 的内部 DOM、图标根节点和部分尺寸参数发生变化，因此升级后已观察到以下视觉偏差：

- 普通 AntD 按钮及图标尺寸、垂直对齐发生变化，Board 的“发主题/发投票”按钮外框尺寸不符合升级前表现；
- AntD 4 Select 新增的 `.ant-select-selector` 受 `content-box` 影响，版面跳转 Select 的可见边框与下拉箭头位置不正确；
- Topic 最新主题卡片仍以 `i` 标签选择器约束隐私图标，但 `@ant-design/icons` 的根节点是 `span`，原有 80×80 遮罩样式不再命中；
- 同一盒模型覆盖还会使 Transfer、Pagination、Radio 和 Checkbox 的固定尺寸被边框或 padding 撑大；
- `Styles/MainPage.scss` 中 `.UBBTableTag th, td` 将 `td` 意外变成全局选择器，可能给 AntD Table 单元格残留额外边框；
- `.user-center button` 会以更高选择器优先级清除用户中心内 AntD Button 的 border、margin 和 padding；分页 quick-jumper、Collapse content box 等还存在直接 `.ant-*` 覆盖。

本轮曾分别尝试为 Button/Board/隐私图标和 Select 增加局部兼容规则，但局部例外无法覆盖同一根因下的全部组件，现已按用户要求撤回。P12 保留升级实现和该缺陷记录，不继续叠加零散 `.ant-*` 补丁，也不得把相关浏览器视觉验收标记为通过。

后续统一调整应先建立站点旧样式与 AntD 组件的明确盒模型边界，再收窄全局标签 reset、修正误写的全局 `td`、逐项审计业务作用域内的 `button/input/i` 规则和直接 `.ant-*` 覆盖，并在默认主题及至少一个非默认主题下统一回归。该工作随计划中的 Sass/主题整理阶段处理，不在本次 P12 临时扩展。

## `P12-MANUAL-001`：UI runtime 尚未人工验收

typecheck、正式 build 和静态产物检查不能证明 AntD 表单布局、Editor Lite 交互、BizCharts canvas、主题视觉或 UBB LazyLoad 在浏览器中正确。所有代表路径仍列在 `manual-checklist.md`，当前不得标记通过。

## `P12-MARKDOWN-001`：当前 Markdown 编辑器仅为临时占位

P12 使用 `react-markdown-editor-lite` 1.4.2 解除旧编辑器的 React peer 阻塞，当前 adapter 只负责保留受控文本、既有工具栏能力、图片上传格式和 330–500px 高度合同，不代表 Markdown 编辑器的最终交互或视觉方案。

后续必须继续统一编辑器样式和交互；如果第三方编辑器无法满足站点需求，可以改为仓库自有实现。届时编辑态预览必须与后续统一的 Markdown 正文渲染器使用同一套渲染规则和安全处理，不能长期保留一套只在编辑器内生效的独立预览结果。

## `P12-JUDGE-STYLE-001`：评分表单样式仍需调整

`Topic-Judge-v3` 的禁用提示为了满足 AntD 4 具名 `Form.Item` 只能绑定一个受控子元素的结构要求，已从字段内部移到紧邻字段的下方。当前只确认评分分支、校验、重置和请求语义保持不变，不把该处视觉效果视为最终结果。

后续样式阶段必须继续校准评分表单的提示间距、字段对齐、弹窗尺寸以及默认主题和至少一个非默认主题下的表现；完成浏览器检查前不得将该处样式验收标记为通过。

## 延期范围

- React runtime 升级属于 P13；
- Router/壳层、复杂 lifecycle 与其余函数化属于 P14/P15；
- server state 与写操作边界属于 P16–P19；
- Sass/主题属于 P20；
- Font Awesome、facade 与无引用依赖的最终清理属于 P21。
