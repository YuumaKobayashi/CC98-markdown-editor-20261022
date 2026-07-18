# P11 服务运行记录

## 正式构建

沙箱内首次执行 `npm run build` 时，Vite 配置加载因 Windows helper `spawn EPERM` 失败；相同命令在允许子进程的环境中成功，因此未归因为仓库代码缺陷。

构建结果：

```text
vite v8.1.4
2389 modules transformed
9449 files
29 css_*.css theme files
```

`dist/static/index.html`、`dist/static/reset.html` 和 `dist/web.config` 均存在。Sass `@import`、Spectrum 星号 hack 和大 chunk 警告与既有构建一致。

## 有界开发服务

沙箱内启动同样因 `spawn EPERM` 失败，且确认 5174 无监听。随后在允许子进程的环境中执行：

```text
npm run dev -- --host 127.0.0.1 --port 5174 --strictPort
```

以下资源返回 200：

- `/`；
- `/src/pages/board/index.ts`；
- `/src/pages/focus/index.ts`；
- `/src/features/moderation/index.ts`；
- `/src/features/message/index.ts`；
- `/static/images/hot.png`；
- `/static/config.json`。

首次额外探测 `/board/1` 时使用默认 `Accept: */*`，按既有 middleware 合同返回 404；该进程树 PID `45432`/`43672` 随即回收，5174 无监听。复验改用浏览器导航语义 `Accept: text/html`，`/board/1`、`/focus/favorite` 和 `/message/setting` 均返回 200。

补充“组件内函数使用 `const + 箭头函数`、原始注释必须保留”的约束后，再次运行正式构建，结果仍为 2,389 个模块、9,449 个文件和 29 个主题 CSS。随后复验四个窄入口及三个 `Accept: text/html` SPA 路径，launcher/listener PID 为 `1304`/`45220`；验证后两者均停止，5174 无监听，临时日志已删除。

没有打开图形浏览器、访问真实 CC98/OpenID、写入业务数据或验证登录权限；HTTP 200 不代表视觉、控制台和交互验收完成。
