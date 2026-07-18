# P05 前后对照

## 命令

- 之前：Webpack 负责默认 `dev`、debug、release，Vite 只提供 shadow 命令；
- 之后：`npm run dev` 与 `npm run build` 均只使用 Vite；旧命令名不保留兼容别名。

## 产物

- 之前：Webpack 写 `dist/`，Vite 写 `dist-vite/`；
- 之后：Vite 直接写正式 `dist/`，继续复制 IIS、reset 和固定 URL 第三方资源；
- `dist/static/index.html` 继续使用 module script，主题索引仍为 placeholder 加 29 个显式主题。

## 依赖

- 之前：manifest 直接声明 Webpack 4、WDS、loaders、plugins 和旧 Sass；
- 之后：上述直接依赖已从 manifest/lock 删除；clean install 后 `npm ls webpack --all` 为空。`dplayer@1.24.0` 仍按允许边界传递安装 `webpack-cli@3.0.4` 和 `webpack-sources@1.4.3`，P05 不为清零第三方构建依赖而替换播放器。

## 回滚

P05 不在仓库保留第二套构建链。人工不接受时，通过 Git 恢复 P04 提交状态后执行 `npm ci`；禁止使用 `git reset --hard` 清理用户工作区。
