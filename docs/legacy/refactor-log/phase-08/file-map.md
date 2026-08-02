# P08 文件与配置映射

| 原位置/接口 | P08 后 | 说明 |
|---|---|---|
| `typescript` `^4.8.4`，lock 实装 4.9.5 | `typescript` `~5.9.3`，lock 实装 5.9.3 | 只升级 TypeScript，不漂移其他主动依赖 |
| 单一根 `tsconfig.json` | `tsconfig.base.json` + 现代根 `tsconfig.json` | 共享 alias/兼容选项；根配置只声明 `src/**` 和仓库 ambient 类型为入口 |
| 无 legacy 独立配置 | `tsconfig.legacy.json` | 明确列出根遗留目录，包含全部冻结 UBB 范围 |
| Vite 硬编码 ES2015/classic JSX | 按规范化绝对路径选择现代或 legacy compiler options | `src/**` 自动 JSX；其他源码保持 classic JSX；最终 bundle target 仍为 ES2015 |
| 临时 `npx tsc --noEmit --skipLibCheck` | `typecheck:modern`、`typecheck:legacy`、`typecheck` | `skipLibCheck` 固化为过渡配置，避免命令调用方漏写 |

无业务源码、样式、主题、Store、路由、UBB 源码或公开运行时接口变化。
