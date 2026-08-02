# P03 文件映射

| 文件 | P03 前 | P03 后 |
|---|---|---|
| `package.json` | 未声明工具版本；`moment` 已为 `2.30.1` | 增加 `packageManager` 和精确 `engines`；业务依赖声明不变 |
| `package-lock.json` | lockfile v2；根 `moment@2.22.2`；与 manifest 不一致 | lockfile v3；按 P03 开始时的本地依赖版本重建；根 `moment@2.30.1` |
| `.nvmrc` | 不存在 | 固定 `20.20.0` |
| `.npmrc` | 不存在 | 固定 `legacy-peer-deps=true` |
| `tsconfig.json` | 未排除生成目录，watch 会扫描复制到输出目录的 MathJax TS | 排除 `node_modules`、`dist`、`vscodeConfig/dist` |
| `README.md` | 要求 Node 16 或更早、使用 `npm i` | 记录 Node/npm、`npm ci`、peer 策略和私有 Git 访问前提 |
| `docs/refactor-log/phase-03/**` | 不存在 | P03 范围、差异、检查、缺陷和人工门禁记录 |

没有移动、复制或修改业务源码、Webpack 配置、公开资源、部署配置或私有库文件；唯一编译配置变化是排除依赖目录和生成目录。
