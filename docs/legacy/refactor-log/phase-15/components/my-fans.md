# MyFans

- 原位置：`Components/UserCenter/MyFans.tsx` / `Fans`。
- 新位置：`src/pages/user-center/my-fans/ui/MyFans.tsx` / `MyFans`。
- 之前：`connect(withRouter(class))` 在 mount 取数、收到 page props 时滚动和重取。
- 现在：具名函数用 typed hooks、`useParams` 和既有页码解析，拆分页签、取数和视口 effect。
- 行为：thunk、Redux 列表、切片、loading/空态、Pager URL、`hasTotal={true}` 和用户卡片不变。
- 已授权变化：首次进入也滚动到顶部，非正页码回退第 1 页。
- 人工检查：分页、back/forward、空态、用户卡片和真实请求次数。
