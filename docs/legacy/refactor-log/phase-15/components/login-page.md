# LoginPage

- 旧位置：`Components/LogOn.tsx` 的 `LogOnExact` class。
- 新 owner：`src/pages/auth/login` 的具名函数。
- 状态：用户名、密码、提示和提交状态使用 `useState`，输入与 shake 使用 refs。
- 副作用：shake 和成功跳转 timer 在卸载时 cleanup；Router 不再注入 legacy history。
- 行为：token 请求、用户刷新、锁定检查、主题、Redux action、广告缓存清理和整页返回保持。
- 修复：返回地址缺失、损坏或跨域时安全回退 `/`。

人工重点：全部校验/错误分支、重复提交、成功返回、刷新后的登录态和主题。
