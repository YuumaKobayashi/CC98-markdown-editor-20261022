# P02 前后对照

## 原状态

```text
dist/
├── web.config             手工维护的 IIS 配置
└── static/
    ├── images/**          手工维护资源
    ├── *.json / *.ico     手工维护资源
    ├── content/**         构建产物
    ├── scripts/**         构建产物
    ├── index.html         构建产物
    └── reset.html         构建产物
```

`dist` 同时是源文件目录、部署配置目录和构建输出目录，无法安全地整体删除后重建。

## 现状态

```text
public/static/**            手工维护的固定 URL 资源
deploy/iis/web.config       手工维护的 IIS 配置
reset.html                  reset 页面的维护源

dist/**                     被忽略的纯构建输出
```

Webpack 在构建时将维护源复制到原部署位置；浏览器仍访问 `/static/**`，IIS 仍从输出根目录读取 `web.config`。

## 行为与接口变化

无应用行为或公开 URL 变化：

- `/static/images/**`、JSON 和 favicon URL 不变；
- `/reset` 仍 rewrite 到 `/static/reset.html`；
- `/static/*` 仍被排除在 SPA fallback 之外；
- 29 个主题 entry、main/vendors chunk 和 HTML 模板约定不变。

## 回滚原则

人工不接受 P02 时，将 `public/static` 原样移回 `dist/static`、将 `deploy/iis/web.config` 移回 `dist/web.config`，再撤销三套 Webpack 配置、忽略规则和说明文档的 P02 diff。禁止使用 `git reset --hard`。
