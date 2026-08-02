# P06 文件映射

| P05 位置/状态 | P06 位置/状态 |
|---|---|
| `Main.tsx` | `src/app/bootstrap/index.tsx` |
| `Main.tsx` 内 Provider JSX | `src/app/providers/create-app-root.tsx`，元素层级不变 |
| 无目标源码边界 | `src/{app,pages,features,entities,shared,integrations}` 及 owner README |
| TypeScript 无源码别名 | 新增六个目标层别名和迁移期 `@legacy/*` |
| Vite 构建入口 `Main.tsx` | `src/app/bootstrap/index.tsx`，入口名仍为 `main` |
| 开发期 `/static/scripts/main.js` → `/Main.tsx` | 重写到 `/src/app/bootstrap/index.tsx` |

未移动 `Store.tsx`、`Components/App.tsx`、Router、Utility、config、IndexedDB、Pages、Styles、Themes 或 Ubb；它们仍由后续所属阶段处理。
