# P01 工作区与文件映射

## 工作区映射

| 角色 | P01 前 | P01 后 |
|---|---|---|
| 基线参考 | `Forum` 暂时检出 `dev20260716` | `Forum` 检出 `main` |
| 正式迁移 | 失效记录指向 `Forum-frontend-refactor`，关联旧 refactor 分支 | `Forum-frontend-refactor` 正常检出 `dev20260716` |
| 旧迁移历史 | `refactor/frontend-modernization` 被失效记录占用 | 分支保留、未挂载、只读参考 |

## 源码文件迁移

本阶段没有移动、复制或修改任何源码、静态资源、配置、依赖或私有库文件。

唯一新增文件为 `docs/refactor-log/phase-01/**` 的阶段记录。P00 计划文档随 `dev20260716` 正常出现在迁移 worktree，没有复制到 `main`。
