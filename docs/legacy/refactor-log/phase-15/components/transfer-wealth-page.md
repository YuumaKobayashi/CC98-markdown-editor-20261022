# TransferWealthPage

- 旧位置：`Components/UserCenter/TransferWealth.tsx` / `Wealth`。
- 新位置：`src/pages/user-center/transfer-wealth/ui/TransferWealthPage.tsx` / `TransferWealthPage`。
- 之前：connected class 通过 `componentWillReceiveProps` 比较共享 loading/error 前后值生成结果提示。
- 现在：具名函数使用 typed hooks，并由本次提交的显式 pending workflow 等待既有 thunk 完成，不模拟 previous props。
- 保持不变：`sendWealthTo` thunk、Redux 字段、收款人拆分/去重、金额/余额/理由校验、手续费预览、成功/失败文案、DOM/CSS。
- 延期：异常小数、前导空用户名、最多十人未校验、10 与“大于10”文案差异、共享 loading/error 和 thunk 原地修改用户对象。
- 兼容：旧文件保留 default 与 `Wealth`；Router 使用 transfer-wealth 窄入口。
- 人工检查：单人/多人、输入边界、余额、并发提交、API 成功/失败和未登录。
