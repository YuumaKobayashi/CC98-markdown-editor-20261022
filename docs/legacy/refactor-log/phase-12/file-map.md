# P12 文件、依赖与接口映射

## 依赖映射

| P12 前 | P12 后 | 说明 |
|---|---|---|
| `antd@3.26.20` | `antd@4.24.16` + `@ant-design/icons@4.8.3` | React 16.14 与 Moment 保留 |
| `bizcharts@3.5.5` 直接散落在年度报告 | `bizcharts@4.1.23` + `@integrations/charts` | 调用方只传通用 interval chart 参数 |
| `@cc98/hell-react-mde` + `draft-js` + 两份 command | `react-markdown-editor-lite@1.4.2` + `@integrations/markdown-editor` | Showdown 与 Utility 上传仍由调用方注入 |
| `react-lazyload@2` + 类型包 | `react-lazyload@3.2.1` | 冻结 UBB 原导入不变，不增加 alias 或 adapter |
| `react-bootstrap` 的单个 `ControlLabel` | 原生 `<label className="control-label">` | 既有 class 和表单 DOM 顺序保留 |
| `.npmrc legacy-peer-deps=true` | 删除 | lockfile 可由严格 npm peer 解析重建 |

`@popperjs/core@2.11.8` 被显式固定；`@types/node@20.19.43` 是严格安装发现的 Vite 8 peer 要求，Node runtime 仍为仓库既有 20.20.0。

## 新窄入口

| 入口 | 实现 | 对外合同 |
|---|---|---|
| `@integrations/markdown-editor` | `src/integrations/markdown-editor/markdown-editor.tsx` | `value/onChange/renderPreview/uploadImage/minEditorHeight/maxEditorHeight` |
| `@integrations/charts` | `src/integrations/charts/interval-chart.tsx` | data、字段名、尺寸、autoFit、crosshair 与字段显示名映射 |

## 主要调用点

- app provider：`src/app/providers/create-app-root.tsx`；
- class 表单：`Components/Edit.tsx`、`Topic-Judge-v2.tsx`、`Topic-Judge-v3.tsx`、`Topic-PostManagement-v2.tsx`、`Topic-TopicManagement-v2.tsx`、`UserCenter/MyFavortitesManage.tsx`；
- Markdown：`Components/Edit.tsx`、`Components/Topic/Topic-SendTopic.tsx`；
- 年度报告图表：`Pages/AnnualReview/page5.tsx`、`Pages/AnnualReviewV2/page6.tsx`；
- 官方图标组件：Header、补签日历、Topic 新帖、收藏、Board Footer 与两个年度报告入口直接导入 `@ant-design/icons`；
- AntD 公开组件入口与 Modal `open`：Board、Topic、UserCenter、SiteManage 及 P11 已归位组件的现有调用点。

旧 Markdown command 文件已删除；冻结 UBB 与它的原 `react-lazyload` import 没有改动。
