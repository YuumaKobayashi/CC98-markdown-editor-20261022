# UserCenterPager

- 原位置：`Components/UserCenter/Pager.tsx` / anonymous default class。
- 新位置：`src/pages/user-center/pagination/ui/UserCenterPager.tsx` / `UserCenterPager`。
- 之前：class render 分四段构造页码，少于等于 7 页时使用重复空 key，并输出 props 日志。
- 现在：具名函数保留四段算法，使用稳定 `href + page` key，移除调试日志。
- 行为：`hasTotal`、keyword、disabled、首尾页、省略号和 URL 合同不变。
- 兼容：旧路径保留 default re-export；用户中心六类列表改用 page 入口。
- 人工检查：总页数小于等于 7、起始/中间/末尾段、未知总页数和 keyword。
