# Footer class → function 对照

- 原文件/符号：`Components/Footer.tsx` / `Footer`
- 新文件/符号：`src/app/layouts/footer.tsx` / `Footer`
- 原 props/state：无实际 props/state；旧泛型错误标注 `AppState`
- 原 lifecycle/依赖：无 lifecycle
- 新 hooks/cleanup：均无
- 保持不变：全部链接、文字、样式、年份和 footer DOM
- 人工路径：任意持久壳层页面；待验收

## 原写法 / 新写法

纯 render class 改为 app layout 具名函数，并删除未使用的 `AppState` 类型依赖。

## 审核结论

待人工填写。
