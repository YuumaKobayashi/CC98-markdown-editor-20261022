# Z0 tracked file map

基线：`dev20260716@de6eca90`。计数来自 `git ls-files`，因此不把未跟踪文件、构建产物或 `node_modules` 当作源码候选。

273 个 path 的逐文件快照见 `tracked-files.txt`；下表是同一快照的 owner/可达性聚合。

## 1. 根级 legacy tracked 文件

| 旧 owner | tracked 文件 | TypeScript/JavaScript 文件 | 从应用 bootstrap 可达 | 计划去向 |
| --- | ---: | ---: | ---: | --- |
| `@types/@cc98` | 19 | 19 | 0（ambient 编译输入，不按运行图加载） | Z1 按 Board/Topic/Post/User/Message 等真实 Module 拆分 |
| `Components` | 131 | 124 | 18 | Z2 迁 UBB；Z3 处理其余 facade/UI |
| `IndexedDB` | 2 | 2 | 0 | Z3；活动实现已在 `foundation/storage`，先证明兼容入口闭包 |
| `Match` | 1 | 1 | 0 | Z1，Route 私有类型归 Application Route |
| `Pages` | 31 | 30 | 0 | Z3 处理 11 个非 AnnualReview facade；Z4 删除 20 个 AnnualReview 文件 |
| `Props` | 16 | 16 | 5 | Z1 按业务 owner 迁移 |
| `States` | 13 | 13 | 2 | Z1 迁 12 个业务模型；`UbbEditorState` 属 Z2 |
| `Ubb` | 49 | 49 | 47 | Z2 整体迁入 `modules/ubb`；两个被注释禁用的 Handler 仍随迁 |
| `Utility` | 7 | 7 | 2 | Z3 逐导出归真实 owner |
| `Utility.ts` | 1 | 1 | 1 | Z3 facade；AnnualReview 导出在 Z4 才删除 |
| `Store.tsx` | 1 | 1 | 0 | Z3 在零 consumer 后删除 |
| `SignalR.ts` | 1 | 1 | 0 | Z3 核对 Notification 实现与兼容 consumer 后处理 |
| `config` | 1 | 1 | 0 | Z3 归 `foundation/config` 或在零 consumer 后删除 |
| **合计** | **273** | **266** | **75** | Z1–Z4；Z5 做 alias/目录/双编译闭包 |

“可达”只表示从 `src/application/bootstrap/index.tsx` 经可解析的静态或 lazy import 边可以到达；不等于真实交互已执行。样式、JSON 和 ambient declaration 不按 JavaScript 运行图统计。

## 2. 阶段分配

| 阶段 | 当前文件数 | 边界 |
| --- | ---: | --- |
| Z1 | 48 | `@types/@cc98` 19、`Props` 16、`Match` 1、`States` 中除 `UbbEditorState` 外 12 |
| Z2 | 66 | `Ubb/**` 49、`Components/UbbContainer.{tsx,scss}` 2、`Components/UbbEditor/**` 14、`States/UbbEditorState.tsx` 1 |
| Z3 | 139 | `Components` 其余 115、`Pages` 非 AnnualReview 11、`Utility`/`IndexedDB`/根 facade/config 共 13 |
| Z4 | 20 个根级文件 + 2 个 Module 文件 | 两棵 AnnualReview 页面树 20；另有 `src/modules/annual-review` 2 个文件 |

Z1–Z4 的根级文件数为 `48 + 66 + 139 + 20 = 273`。Z4 的两个 Module 文件不重复计入根级 legacy 总数。

## 3. 构建、模板与公开资源入口

| 类别 | 当前入口/合同 | Z0 结论 |
| --- | --- | --- |
| 应用 JS | `src/application/bootstrap/index.tsx` | Vite 唯一主应用 entry；开发期 `/static/scripts/main.js` 重写到该入口 |
| HTML 模板 | `Template.ejs` | 保留主脚本、29 主题 CSS、jQuery/Moment/Spectrum/MathJax 与播放器资源顺序 |
| 独立页面 | `error.html`、`reset.html`、`unsupported.html` | 不经 React Router；属于固定公开入口 |
| IIS | `deploy/iis/web.config` | 冻结 `index.asp`、`list.asp`、`dispbbs.asp`、`dispuser.asp` redirect 和 SPA/static rewrite |
| 构建静态资源 | `vite.config.mjs`、`scripts/build-vite.mjs` | 冻结 `/static/scripts/lib/**`、font-awesome、APlayer/DPlayer、HLS、主题和公开资源复制合同 |
| 公开目录 | `public/**` | Z0 不以“源码无 import”推断资源可删除；Z2/Z4 必须从 producer、CSS URL、模板与固定 URL 反查 |

## 4. 双编译边界

- `tsconfig.json` 当前只包含 `src/**/*.ts(x)` 和 `@types/@cc98/**/*.ts`。
- `tsconfig.legacy.json` 当前包含根级 `*.ts(x)`、Components/config/IndexedDB/Match/Pages/Props/States/Ubb/Utility，并显式提供 Foundation 环境声明。
- 现代与 legacy 两套编译都属于 Z0 基线；仅 Z5 在所有旧 owner consumer 归零后删除 legacy 分支。
