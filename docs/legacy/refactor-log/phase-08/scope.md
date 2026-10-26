# P08 TypeScript 过渡基线范围

> 状态：实现与全部有界机械验证完成；等待人工验收；不提交、不 push、不开始 P09

## 唯一大事

将项目升级到 TypeScript 5.9 兼容档，并为 `src/**` 与遗留源码建立可执行、可检查的编译配置边界。

## 允许范围

- 将 TypeScript 升级并锁定在 5.9 minor；
- 抽取共享 compiler options，分别建立现代和 legacy tsconfig；
- 让 Vite 按文件路径选择现代或 legacy TypeScript 编译选项；
- 增加现代、legacy 和聚合 typecheck 命令；
- 记录安装、类型检查、构建和人工验收证据。

## 禁止范围

- 不开启全仓 strict，不修复旧源码的隐式 any 或旧第三方声明；
- 不升级 React、Router、Redux、jQuery、类型依赖或其他业务依赖；
- 不修改业务 API、Redux state、路由、主题、固定 URL 或浏览器生产 target；
- 不修改、移动或格式化 `Ubb/**`、`Components/UbbContainer.tsx`、`Components/UbbEditor/**`；
- 不访问真实 CC98/OpenID，不提交、不 push、不进入 P09。

## 完成条件

1. clean install 后实际 TypeScript 为 5.9.3；
2. 现代、legacy 和聚合 typecheck 均通过；
3. Vite 正式构建通过，9,449 个文件、29 个主题和固定部署文件仍存在；
4. `src/**` 使用 ES2022/Bundler/automatic JSX，其他源码使用 ES2015/Node10/classic JSX；
5. 冻结岛和业务源码保持零 diff，人工运行路径明确保留为待验收。
