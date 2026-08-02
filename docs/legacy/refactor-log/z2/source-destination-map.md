# Z2 源文件、公共入口与样式 owner 映射

日期：2026-08-02

## 1. 源文件迁址

| 原 owner | 数量 | 新 owner | 处理 |
| --- | ---: | --- | --- |
| `Ubb/**` | 49 | `src/modules/ubb/renderer/**` | 整体迁址；14 个文件仅增加 owner/style import 或替换局部 class mapping，其余 35 个文本逻辑不变 |
| `Components/UbbContainer.tsx` | 1 | `src/modules/ubb/UbbContainer.tsx` | 修正 Engine import，增加 Container Module root |
| `Components/UbbContainer.scss` | 1 | Container 与 Handler 同名 Module | 原声明和注释按真实 DOM producer 拆分 |
| `Components/UbbEditor/**` | 14 | `src/modules/ubb/editor/**` | Editor 主 owner、配置、资源和子组件整体迁址；全局 SCSS 拆为同名 Module |
| `States/UbbEditorState.tsx` | 1 | `src/modules/ubb/editor/UbbEditorState.tsx` | 文件、class 与注释原样迁址；不强行删除或改 interface |

最终 `src/modules/ubb` 共 81 个文件，其中 16 个真实 CSS Module；原 66 个 legacy 文件全部闭包，新增文件仅为公共入口和单 owner 样式拆分。

## 2. Module 根入口

| 导出 | 真实 owner | 当前用途 |
| --- | --- | --- |
| `UbbContainer` | `UbbContainer.tsx` | Board、Topic、User、Message、Notification、Site Content 与 Editor preview |
| `UbbEditor` | `editor/UbbEditor.tsx` | Daily Signin、Editor、Topic Reply Composer |
| `UbbCodeOptions` | `renderer/Core.tsx` | Board、Topic、User 的解析选项 |
| `UbbCompatiblityMode` | `renderer/Core.tsx` | Notification 兼容渲染选项 |
| `RightTagHandler` | `renderer/RightTagHandler.tsx` | Topic Reply Composer 的必要扩展点 |

Module 外部没有 handler/renderer/editor 实现深层 import；`UbbContainerProps` 和 Editor 内部配置未扩大为根级公共 API。

## 3. 样式 owner

| owner | Module | producer/边界 |
| --- | --- | --- |
| Container | `UbbContainer.module.scss` | `article/blockquote` root 与休眠 `photoFrame` 规则 |
| Editor | `UbbEditor.module.scss` | Editor root、textarea/reset 与 preview |
| Editor buttons/emoji/extends/message | 各自同名 `.module.scss` | 各 React 子组件；Spectrum replacer class 由 Buttons Module mapping 传入插件 |
| Image/Quote/Upload/Table/Code Handler | 各自同名 `.module.scss` | 图片显示/工具箱、引用展开、下载、表格、代码行号 |
| BiliText/URL/UrlText/UrlText2/User Handler | 各自同名 `.module.scss` | 对应 link producer；固定语义色继续读取 Foundation Sass token |

16 个 Module 均只有一个直接 owner，普通业务 Module 中没有 `:global(...)`。第三方动态 DOM 继续由已登记的 Foundation vendor root 限界，不复制第三方样式。

## 4. 依赖替换

| 原依赖 | 新依赖 | 语义 |
| --- | --- | --- |
| `Components/Common/MessageBar` | `@foundation/ui/feedback` | 原 facade 的真实实现与相同导出 |
| 根 `Utility.formAuthorizeHeader` | `@modules/session` | 既有 Session 公共入口 |
| 根 `Utility.cc98Fetch` | `@foundation/api/http` | 既有 HTTP 实现 |
| 根 `Utility` Storage 导出 | `@foundation/storage/web-storage` | 相同键、TTL 与序列化函数 |

未引入 Module → Application、Module → legacy 或 Module 深层公共 import 违规。
