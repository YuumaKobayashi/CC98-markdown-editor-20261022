# P13.5 服务与机械门禁记录

> 实施基线：`9392e6a4`。本阶段没有启动开发服务，没有创建 launcher/listener PID，也没有占用端口。

## TypeScript

以下命令均成功：

```text
npm run typecheck:modern
npm run typecheck:legacy
npm run typecheck
```

聚合命令再次依次执行 modern 与 legacy，两项均成功。

## 正式构建

第一次在受限环境执行 `npm run build` 时，Vite 加载配置阶段因 Windows 子进程策略失败：

```text
[plugin externalize-deps]
Error: spawn EPERM
```

在允许子进程的同一工作树重跑完全相同命令后成功：Vite `8.1.4` 转换 3907 个模块，正式产物写入 `dist`。构建仍输出既有 Sass `@import` deprecation、legacy CSS hack minify 与大 chunk 警告；P13.5 未修改相关样式或构建配置。

## 静态核对

- `git diff --check`：成功；
- 目标组件 `this.context.router` / `declare context` 搜索：0 个匹配；
- service 业务 Router 形参搜索：0 个匹配；保留的 `router` 标识只属于 Redux router state、普通局部变量/类型名或注释；
- 实际 `<BrowserRouter>`：只保留 Message 与 Focus 两处；
- `package.json`、lockfile、`src/app/store`、root provider、冻结 UBB、样式和主题：无 diff。

## 未执行

- 未启动开发服务，未做 HTTP deep-link 探测；
- 未使用真实登录态/API；
- 未做浏览器控制台、Message/Focus/Search/Topic reaction 交互验收。

正式构建成功不代表上述人工路径已经通过。
