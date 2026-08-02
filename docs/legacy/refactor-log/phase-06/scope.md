# P06 范围

## 唯一大事

建立目标源码边界和新旧源码共存合同，并将应用入口与最小 Provider 树机械迁入 `src/app`。

## 允许范围

- 建立 `src/app`、`pages`、`features`、`entities`、`shared`、`integrations` 及 owner/依赖说明；
- 在 TypeScript 与 Vite 中建立对应路径别名和迁移期 `@legacy/*` 桥；
- 将根 `Main.tsx` 迁至 `src/app/bootstrap/index.tsx`；
- 将原 Provider 元素树提取到 `src/app/providers/create-app-root.tsx`；
- 更新 Vite 入口、README、总计划和 P06 阶段证据；
- 保持部署 URL、初始化顺序和业务行为。

## 禁止范围

- 不迁移或重构 Router、Store、Utility、config、IndexedDB、页面或业务组件；
- 不创建 P12 才需要的 `shared/ui` adapter；
- 不修改 React、Redux、Router、TypeScript、依赖或 lock；
- 不修改 Styles、Themes、Ubb 或 `Components/UbbEditor`；
- 不提交、不 push、不进入 P07。

## 完成条件

1. 新入口和旧业务源码可以通过别名共同完成类型检查、正式构建和开发转换；
2. 原 ErrorBoundary、Redux Provider、AntD LocaleProvider、App 层级不变；
3. 两次正式构建产物可复现，固定静态资源与部署合同保持；
4. 隔离开发服务完成新入口、Provider、主题、配置和 SPA fallback HTTP 检查；
5. 人工确认前只保留未提交 diff。
