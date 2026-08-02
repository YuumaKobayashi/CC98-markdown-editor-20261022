# P06 人工确认

> 当前状态：实现与机械验证完成；等待人工验收，不提交、不 push、不开始 P07

## 待确认内容

- 接受 `src` 六个目标层及其 owner/依赖合同；
- 接受入口迁至 `src/app/bootstrap/index.tsx`；
- 接受 Provider 元素树进入 `src/app/providers/create-app-root.tsx`；
- 接受六个目标路径别名和迁移期 `@legacy/*` 桥；
- 接受 Router、Store、Utility 和业务源码仍留在旧目录，由后续阶段迁移；
- 接受 `known-defects.md` 中的 legacy 桥、构建警告和未运行时验证保留项。

## 提交门禁

未经人工确认不创建提交、不 push、不开始 P07。建议提交：

1. `refactor(p06): establish source boundaries`；
2. `docs(p06): record source boundary evidence`。

## 确认记录

2026-07-18：P06 入口迁移、目录合同、路径别名和阶段文档完成；TypeScript、两次正式构建、完整产物复现、固定资源合同和隔离开发 HTTP 链路验证通过。等待人工浏览器验收与 diff 审查。
