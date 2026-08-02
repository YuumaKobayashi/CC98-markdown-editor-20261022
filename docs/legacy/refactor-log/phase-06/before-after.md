# P06 前后对照

## 源码归属

- 之前：应用入口、Provider、Store、Router 和全部业务源码都位于仓库根级旧目录；
- 之后：入口和最小 Provider 树进入 `src/app`，其余旧实现通过受限的 `@legacy/*` 桥继续运行。

## Provider 树

前后均为：

```text
ErrorBoundary
  └─ Redux Provider
      └─ AntD LocaleProvider
          └─ App
```

`createAppRoot()` 直接返回原元素树，没有增加新的 React 包装组件。

## 构建和运行入口

- 之前：Vite 正式入口和开发重写目标为根 `Main.tsx`；
- 之后：两者统一指向 `src/app/bootstrap/index.tsx`；
- 对外仍由模板加载 `/static/scripts/main.js` 或带 hash 的正式 main chunk，固定 URL 合同不变。

## 目录合同

- 主依赖方向固定为 `app → pages → features → entities → shared`；
- `integrations` 只依赖第三方包和 `shared`；
- `shared/ui` 在 P06 只定义边界，不建立提前抽象；
- `@legacy/*` 只承担迁移期新旧共存，不是新业务代码的常规入口。
