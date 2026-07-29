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

逐阶段迁入的目标源码边界。当前入口位于 `src/app/bootstrap/index.tsx`，Provider 树位于 `src/app/providers`；其余旧业务源码会在对应阶段迁入 `pages`、`features`、`entities`、`shared` 或 `integrations`。

主依赖方向为 `app → pages → features → entities → shared`。`@legacy/*` 只作为新旧目录共存期间的临时兼容桥。

### ./Actions

react-redux 的 action

### ./AsyncActions

react-redux 的异步 action（用户中心）

### ./Components

- /Board 版面
  - /Board.tsx 版面内容
  - /BoardList.tsx 版面列表
- /Focus 关注
- /Message 私信
- /Search 搜索
- /SiteManage 全站管理
- /Topic 帖子
  - /Topic.tsx 帖子组件
  - /Topic-Award.tsx 风评/奖惩展示组件
  - /Topic-AwardInfo.tsx 单个风评/奖惩展示组件
  - /Topic-Category.tsx 导航条组件
  - /Topic-Hot-Monthly 每月热门话题
  - /Topic-Hot-Weekly 每周热门话题
  - /Topic-Judge 风评组件
  - /Topic-New 新帖
  - /Topic-PostManagement 楼层管理
  - /Topic-Replier 用户信息组件
  - /Topic-ReplierSignature 用户签名档/楼层按钮组件
  - /Topic-Reply 楼层组件
  - /Topic-ReplyContent 帖子内容
  - /Topic-SendTopic 回帖
  - /Topic-TopicInfo 主题信息
  - /Topic-TopicManagement 主题管理
  - /Topic-Trace 追踪
- /UbbEditor Ubb 编辑器
- /UserCenter 用户中心
- /App.tsx 路由中心
- /Category.tsx 导航条
- /Constant.tsx 全局变量
- /DocumentTitle.tsx 网页标题
- /Edit.tsx 发表/编辑主题
- /ErrorControl.tsx 错误页面管理
- /FindIP.tsx 查询 IP
- /Footer.tsx 网站底部
- /Header.tsx 网站头部
- /LogOn.tsx 登录组件
- /MainPage.tsx 网站主页
- /NoticeMessage.tsx 消息提醒
- /Pager.tsx 翻页器
- /RouteComponent.tsx 路由组件基类
- /SignIn.tsx 签到
- /Status.tsx 报错页面
- /UbbContainer.tsx Ubb 解析器
- /UbbEditor.tsx Ubb 编辑器
- /IndexedDB Indexed 数据库 用户信息缓存
- /Match Redux 组件
- /Props React 组件的 Props 类
- /Reducers Redux 组件
- /States React 组件的 State 类
- /src/foundation/theme/themes 网站主题
- /Ubb Ubb 解析引擎
- /Utility 函数集
- /ActionTypes.tsx Redux 的 Action 类型
- /src/app/bootstrap/index.tsx 程序入口
- /adddna.scss zza 的样式表
- /package.json 项目依赖
- /src/foundation/styles/Site.scss 网站的主样式表
- /Store.tsx Redux 的 store 组件
- /UbbEditor.scss Ubb 编辑器样式表
- /UserCenter.scss 用户中心样式表
- /Utility.tsx 函数集
- /vite.config.mjs Vite 开发服务器与正式构建配置
- /scripts/build-vite.mjs 正式构建及部署依赖复制入口
