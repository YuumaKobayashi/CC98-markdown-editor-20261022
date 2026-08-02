# Pager

- 原位置：`Components/Pager.tsx` / `Pager`。
- 新位置：`src/shared/ui/pagination/Pager.tsx` / `Pager`。
- 之前：class state 保存合法 Go 页码，render 计算当前页左右各 3 页的窗口。
- 现在：具名函数以一个 `useState` 保存相同值；不随 `page` props 变化主动同步，保持原实例语义。
- 行为：首尾页、前后页、超过 20 页时的 Go、所有 `#1` URL 和非法输入忽略规则不变。
- 兼容：旧路径保留具名 re-export；Board、Topic、Message 调用方改用 shared 入口。
- 人工检查：起始/中间/末尾页、合法与非法 Go 输入及 back/forward。
