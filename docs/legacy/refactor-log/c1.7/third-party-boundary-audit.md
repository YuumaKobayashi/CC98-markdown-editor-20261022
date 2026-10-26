# C1.7.6 第三方全局边界限界与登记审计

日期：2026-08-02

实施基线：干净的 `dev20260716@257f1b27`

范围：Ant Design 4.24.16、Spectrum Colorpicker 1.8.0、React Router 7.18.0 及其 Portal/生成 DOM 边界；不升级第三方包，不改变公开 URL、Router 树、业务状态、请求、Redux/Storage、UBB 内容协议或 AntD Portal 默认挂载语义

## 1. Ant Design 样式源与内部 DOM 覆盖

`src/foundation/styles/vendors/_antd.scss` 继续是 `antd/dist/antd.css` 的唯一源码加载入口。AntD 上游基础 CSS 必须覆盖默认挂到 `document.body` 的 Modal、Select、DatePicker、Dropdown、Popover、Tooltip、message 与 notification，因此它是登记后的第三方基础样式源，不被误写为 CC98 自有 override，也不在本阶段整体嵌套到 `#root`。

C1.7.6 前，业务 CSS Module 只剩两处第三方内部 DOM selector。两处现已迁入唯一 vendor owner，并由本仓可控根精确限界：

| 场景 | 可控根 | 第三方内部 selector | 保留声明 | consumer |
| --- | --- | --- | --- | --- |
| Board 顶部/底部分页 | `.cc98-vendor-antd-board-pagination`，与原 `BoardContent.module.scss` 映射共同传给 `Pagination.className` | `.ant-pagination-options-quick-jumper input` | `padding: 0 0 0 5px` | `BoardContent` 两个 `showQuickJumper` 分页 |
| New Topics 版面折叠区 | `.cc98-vendor-antd-new-topics-collapse`，由 `NewTopicsBoardSidebar` 自有 wrapper 固定生产 | `.ant-collapse-content-box` | `padding: 4px; padding-left: 15px` | Sidebar 内唯一 `Collapse` |

- 两份业务 Module 不再包含 `:global(...)` 或 `.ant-*`；当前 110 个真实 CSS Module 中 selector 级 `:global(...)` 为 0。
- New Topics 的 Panel 背景和边框仍由 Panel 直接消费的本地 `card-topic-area-left-content-collapse` 映射拥有；本批把这两条原声明移出无法匹配的跨 Module 父哈希，值不变。C1.7.3 登记的滚动监听仍按自身 Module 哈希查询父页面节点，本批没有顺手改写监听、清理或 transform 状态机。
- `Site.scss` 中零 producer 的 `.ant-carousel .slick-slide` 和 `.antd-table table tr td` 已删除。当前广告轮播是仓库自有 `HomeAdvertisementCarousel`，没有 AntD `Carousel` import；`antd-table` 在 TS/TSX、模板、样式和 public 中均无 producer。

## 2. AntD Portal 与 ConfigProvider 边界

AST 清单冻结 44 条 `antd` import 边、40 个直接 consumer。下表的数字是导入该 Portal/配置能力的源码文件数，不冒充运行时实例数：

| 能力 | 文件数 | 当前挂载与样式合同 |
| --- | ---: | --- |
| `ConfigProvider` | 1 | 仅在 `create-app-root.tsx` 提供 `zhCN`；没有新增 `getPopupContainer`/`getTargetContainer` |
| `Modal` | 16 | 保持 AntD 默认 Portal；业务内容使用自身 Module，不依赖调用方 DOM 祖先 |
| `Select` | 10 | 下拉层保持默认容器；当前没有 CC98 `.ant-select-*` override |
| `DatePicker` | 2 | 日历 Portal 保持默认容器；日期状态、禁用条件与 locale 不变 |
| `Dropdown` | 1 | 收藏主题菜单保持默认容器；菜单行为与 URL 不变 |
| `Popover` | 2 | 补签规则与 Board 预览内容直接携带各自样式，不依赖 Portal 祖先 |
| `Tooltip` | 1 | Board 工具提示保持默认容器，无内部 selector override |
| `message` / `notification` | 1 / 1 | 保持 AntD 静态 API 的 body 容器、时序和文案 |

本仓没有自写 `createPortal`。把全局 `getPopupContainer` 指向 `#root` 会改变 fixed 定位、z-index、overflow 和事件边界，且 Modal 不统一受该配置控制；C1.7.6 因此只对确有内部 DOM override 的两个组件增加稳定根，不进行高风险的全站 Portal 重挂载。

## 3. Spectrum Colorpicker 边界

Spectrum 仍由 `Template.ejs` 在 jQuery 后通过固定 URL `/static/scripts/lib/spectrum/spectrum.js` 加载，Vite 仍从 `node_modules/spectrum-colorpicker/` 原样复制。颜色表、默认值、`change` 回调、重置为 `#000000`、`replacerClassName: 'ubb-color-picker'` 与 `hideAfterPaletteSelect` 均保持。

本批只收窄挂载和样式作用域：

- 颜色按钮增加稳定根 `.cc98-vendor-spectrum-color-picker`；
- 使用 Spectrum 1.8.0 公开的 `appendTo: 'parent'`，让动态 `.sp-container` 与 replacer 一同留在颜色按钮 owner 内，并登记生成容器类 `cc98-vendor-spectrum-container`；
- 原 `_spectrum.scss` 的 507 行上游声明、注释、data URL 与 IE hack 不删除、不改值，整体嵌入该 owner 根；生成 CSS 中每条 `.sp-*` 规则均带 owner 前缀；
- `#color`、`ubb-color-picker`、工具栏 click 传播、palette 选择和 UBB 插入格式不变。旧组件仍没有显式调用 Spectrum `destroy`，C1.7.6 不借限界改写其生命周期。

Spectrum Portal 从 `body` 移到相邻 owner 会影响定位上下文与 UBB Editor 后代级联，必须在浏览器中验证面板位置、颜色选择、页面外点击、多个 Editor 和卸载后的残留；构建成功不等于这些场景通过。

## 4. React Router 生成 DOM 与活动状态

机器清单冻结 66 条 `react-router` import、1 条 `react-router/dom` import 和冻结 UBB 中 3 条 `react-router-dom` import。Application 仍只有一个 `createBrowserRouter`/`RouterProvider`；本批没有改 RouteObject、lazy、URL、参数、navigation port 或 legacy route props。

Router 只通过 `Link`/`NavLink` 生成普通锚点，没有需要 Foundation 全局覆盖的第三方内部 class：

- `NavLink` 仅由 Message Center 与 User Center Navigation 两处使用，均通过 `className={({ isActive }) => ...}` 或等价本地函数消费自身 CSS Module；
- 活动源码没有 `activeClassName`、`activeStyle`，Message Center 也不再依赖 Router 自动生成 `.active`；
- `Site.scss` 的 `.page-link.active` 由 Foundation `Pager` 自己按 `active` prop 生产，不是 Router 隐式 DOM 合同，布局工具与其最终归位仍属于 C1.7.7。

## 5. 守卫、产物与停点

新增 `scripts/third-party-boundary.json` 与 `check-third-party-boundary.mjs`，接入 `npm run check:architecture`。守卫检查：

- AntD/Router 四个包的 114 条精确 import 边指纹；
- ConfigProvider、八类 AntD Portal 能力和两处 NavLink 的 consumer 指纹；
- 两个 AntD override 的 vendor owner、稳定根与业务 Module 零 `.ant-*`/`:global(...)`；
- Spectrum 脚本顺序、复制输入、父 owner 挂载、生成类、上游样式包裹；
- vendor 目录外不得出现 `.ant-*`、`.antd-*`、`.slick-*`、`.sp-*`，活动源码不得新增未登记 `createPortal`、`activeClassName` 或 `activeStyle`。

机械检查：

- `npm run check:architecture` 通过：327 个现代源码文件、1348 条 import、27 条既有 allowlist；110 个真实 CSS Module、29 个主题、0 处业务 global；动态内容守卫保持 18 条直接 import、63 条 UBB 注册、3 份样式边界、3 组 Storage 合同和 2 组内容类型合同；第三方守卫通过 114 条 import 边、35 条 Portal/配置 consumer 边和 2 份 vendor style owner。
- modern/legacy typecheck 均通过。
- 正式 build 首次在沙箱中因既有 `spawn EPERM` 失败；同一命令获准重跑后通过，仍转换 4116 个模块，只报告既有 Sass `@import`、Spectrum/Lightning CSS 恢复性警告和大 chunk 警告。
- 构建后仍为 9561 个文件、95 个 CSS；本批聚合算法得到全产物 SHA-256 `f276bbfe505ad614d15462eafcb9904a0eba88d64588fcf30f97ec38df427db9`、CSS SHA-256 `a36c365ada91e751785c5ee6b6678de2014ee0f1ca6bfe6e3c2790484ea90dc5`。主题 CSS、Board/New Topics lazy CSS 与 UBB Editor JS 的 hash 变化均由上述限界、两条休眠规则删除及 Spectrum 挂载参数产生；主题 key/id/顺序、静态 URL 和部署文件未改。
- `git diff --check`、未跟踪文件、BOM/EOL/EOF、注释和生成目录污染在整批结束时复核；`dist` 没有 tracked 差异。

浏览器运行时列表为空，无法执行 Board quick-jumper、New Topics Collapse、Modal/Select/DatePicker/Dropdown/Popover/Tooltip、message/notification、Spectrum 颜色面板、默认/暗色主题、z-index/overflow、键盘与真实 API 场景。以上全部保留为未运行验收；本批停在未提交工作树，不 commit、不 push，不自动进入 C1.7.7 或 Z。
