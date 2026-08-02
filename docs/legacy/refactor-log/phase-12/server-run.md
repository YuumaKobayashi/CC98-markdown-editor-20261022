# P12 服务运行记录

## 开发服务器

按阶段计划，Codex 没有启动持久 Node/Vite 开发服务器，也没有打开图形浏览器。开发服务和全部交互场景留给用户按 `manual-checklist.md` 执行。

## 严格安装期间的文件锁

首次严格 `npm ci` 因 `node_modules/sass-embedded-win32-x64/dart-sass/src` 被占用而返回 `EBUSY`。只读进程检查确认锁持有者为本仓库已有的 Vite PID 42472 及其 dart-sass 子进程 PID 41456；在获得执行许可后仅停止这两个精确进程，再运行严格安装。

随后沙箱内安装因无法在用户 npm cache 创建临时 Git clone 目录而返回 `EPERM`；相同 `npm ci --legacy-peer-deps=false --no-audit --no-fund` 在允许访问 npm cache 的环境中成功。spatial-watermark 仍解析到既有 commit。

最终收口复跑严格安装时，检查到用户已有的本仓库 `npm run dev` PID 34912、Vite PID 8852 和 dart-sass PID 23064 再次占用同一目录。经用户明确许可后只停止这三个已核对命令行的仓库进程，复查确认退出；没有处理其他 Node、Codex 或 Adobe 进程，也没有重启开发服务器。随后严格安装成功并安装 1,099 个包，`npm ls --depth=0` 以 0 退出。

## 正式构建

沙箱内正式 build 因 Windows helper `spawn EPERM` 失败；相同 `npm run build` 在允许子进程的环境中成功：

```text
vite v8.1.4
3964 modules transformed
9450 files (9449 under dist/static)
29 css_*.css theme files
```

没有由 P12 留下的持久开发服务或新增监听端口。
