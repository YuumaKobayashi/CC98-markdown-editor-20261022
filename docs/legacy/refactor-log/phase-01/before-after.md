# P01 前后对照

## 原状态

```text
Forum
└── dev20260716

Forum-frontend-refactor
└── 空目录；Git 中残留一条指向不存在 gitdir 的旧记录

refactor/frontend-modernization
└── 被失效 worktree 记录标记为已占用
```

## 现状态

```text
Forum
└── main                    基线参考

Forum-frontend-refactor
└── dev20260716             后续迁移

refactor/frontend-modernization
└── 未挂载、未修改，只作历史参考
```

## 行为变化

无应用行为变化。P01 只改变 Git 工作区组织方式，不改变代码、构建、部署或运行时。

## 回滚原则

如人工不接受该布局，应先保留或明确放弃本阶段未提交文档，再使用正常的 `git worktree remove` 解除兄弟 worktree，最后按人工指定的分支布局恢复。禁止使用 `git reset --hard` 或强制删除来回滚。
