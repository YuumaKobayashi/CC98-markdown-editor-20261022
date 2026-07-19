# P13.5 服务运行记录

> 当前状态：仅建立阶段文档，未执行 typecheck、build、开发服务或浏览器检查。

## 计划机械门禁

实施完成后依次执行：

```text
npm run typecheck:modern
npm run typecheck:legacy
npm run typecheck
npm run build
git diff --check
```

## 计划有界开发服务

如用户授权运行开发服务，使用仓库既有有界流程启动固定端口，记录 launcher/listener PID、代表 URL 和响应；验证后只停止已确认属于本仓库的进程树，并复查端口无监听。

代表 URL 至少包括：

- `/message`、`/message/response`、`/message/message`；
- `/focus/board`、`/focus/favorite`；
- `/search`、`/searchBoard`；
- 一个 Topic 页面。

开发服务可转换、HTTP 200 或正式构建通过都不代表登录态、真实 API、浏览器控制台或交互验收完成。
