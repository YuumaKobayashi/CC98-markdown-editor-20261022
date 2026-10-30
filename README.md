# Forum

基于 React 的浙江大学 CC98 论坛网站前端项目

CC98 Durian 开发组

_[Auser](https://github.com/sgjsakura), [Madridista](https://github.com/Tsukiko15), [董松松松](https://github.com/AsukaSong), [明一 gg](https://github.com/mingyigg), [adddna](https://github.com/adddna), [Dearkano](https://github.com/Dearkano), SummerD, [Deturium](https://github.com/Deturium)_

## How To Run

```
git clone https://github.com/ZJU-CC98/Forum.git
cd Forum
nvm use 20.20.0
npm ci
npm run dev
```

正式构建：

```
npm run build
```

开发服务器和正式构建均由 Vite 提供；正式部署产物生成到 `dist/`。

### Notes

- 本分支固定使用 `Node 20.20.0` 和 `npm 10.8.2`；Node 版本同时记录在 `.nvmrc`，npm 版本同时记录在 `packageManager`/`engines`；
- 安装依赖使用 `npm ci`。仓库 `.npmrc` 固定了当前 React 16 依赖树所需的 `legacy-peer-deps` 解析策略；
- `spatial-watermark` 来自固定 Git commit，clean install 需要当前环境能够通过 SSH 访问对应私有仓库；仓库不保存该私有库的源码或二进制；
- PR 请提交至默认 `main` 分支，其余皆为开发用分支。

## File Intro

### ./public/static

构建时原样复制并保持 `/static/*` 固定 URL 的手工维护资源：

- /images 网站的表情包、头图等图片文件
- /boardinfo.json 版面信息表
- /98icon.ico 网站标识
- /config.json 项目默认配置
- /portrait.json 头饰配置

### ./deploy/iis

- /web.config 手工维护的 IIS 部署配置

### ./dist

可删除、可由 `npm run build` 通过 Vite 重新生成且不提交到 Git 的构建产物，包括复制后的公开资源、IIS 配置、脚本、样式、index 和 reset 页面。

### ./src

浏览器业务源码只位于三个已收口的 owner 边界：

- `src/application`：启动入口、Provider、Router、Store、持久布局和 Route；
- `src/modules`：按业务能力划分的 Module，包括 UBB renderer 与 UBB Editor；
- `src/foundation`：API/Storage 基础设施、第三方适配、通用库、全局样式、主题与环境类型。

应用入口为 `src/application/bootstrap/index.tsx`，依赖方向固定为 `application → modules → foundation`。路径别名只保留 `@application/*`、`@modules/*` 和 `@foundation/*`。

### ./build 与 ./scripts

- `build/` 保存主题 manifest 和 HTML 模板合同等 Node.js 构建输入；
- `scripts/build-vite.mjs` 执行正式构建与部署依赖复制。

### ./docs/legacy

已完成的前端迁移计划、架构盘点和各阶段审计记录归档。该目录不参与主线构建或运行。

## 分享包脱敏说明

登录与刷新令牌代码中的 OAuth `client_secret` 已覆盖为 `REDACTED_CLIENT_SECRET`。此占位符不能用于真实认证；部署前需由维护者配置有效凭据。浏览器前端中的凭据对访问者可见，不能作为服务端秘密保存。

历史文档中的个人电脑路径已匿名化；CC98 公开联系邮箱、项目作者署名和公开服务地址保留。分享目录时排除 `.git/`、`node_modules/` 及本地凭据文件；本次覆盖不清除 Git 历史中的旧内容。
