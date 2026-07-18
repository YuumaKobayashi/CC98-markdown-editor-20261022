# app

应用级启动、Provider、Router、Store 和持久布局的 owner。P06 只迁入 `bootstrap` 与最小 Provider 树；Router、Store、Header 和 Footer 仍按后续阶段处理。

`app` 可以组合其他源码层，其他层不得 import `app`。
