# DailySigninPage

- 旧位置：`Components/Signin.tsx` 的 `Signin` class。
- 新 owner：`src/pages/daily-signin/ui/DailySigninPage.tsx` 具名函数。
- 路由：Router 直接加载签到页。
- 行为：account service、冻结 UBB editor、补签日历、storage key、签到 POST 与配置刷新/reload 顺序保持。
- 兼容：旧文件继续导出 `Signin` 和 `ShowSignin`。
- 缺陷：签到 POST 仍不等待；失败路径仍可能写 storage 并 reload。

人工重点：已签到/未签到、补签、UBB 内容、storage、reload、未登录和异常 API。
