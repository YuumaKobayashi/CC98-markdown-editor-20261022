# P02 文件映射

## 维护源迁移

| P02 前 | P02 后 | 数量/说明 |
|---|---|---|
| `dist/static/images/**` | `public/static/images/**` | 2,509 个文件，路径和内容不变 |
| `dist/static/98icon.ico` | `public/static/98icon.ico` | favicon，内容不变 |
| `dist/static/boardinfo.json` | `public/static/boardinfo.json` | 版面信息，内容不变 |
| `dist/static/config.json` | `public/static/config.json` | 默认运行时配置，内容不变 |
| `dist/static/portrait.json` | `public/static/portrait.json` | 头饰配置，内容不变 |
| `dist/web.config` | `deploy/iis/web.config` | IIS 维护源，内容不变 |

静态资源合计 2,513 个。迁移前 Git blob 与迁移后工作区文件逐项比较，差异为 0；IIS 配置的 Git blob 也一致。

## 构建映射

| 维护源 | 构建输出 |
|---|---|
| `public/static/**` | `dist/static/**` 对应固定路径 |
| `deploy/iis/web.config` | `dist/web.config` |
| `reset.html` | `dist/static/reset.html` |
| `Template.ejs` | `dist/static/index.html` |
| `Main.tsx`、29 个主题 SCSS entry | `dist/static/scripts/**`、`dist/static/content/**` |

`dist/` 现在只承载被忽略的构建输出，不再是 authored assets 或部署配置的维护位置。
