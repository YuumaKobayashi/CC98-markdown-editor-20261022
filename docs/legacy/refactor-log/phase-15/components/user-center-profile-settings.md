# UserCenterProfileSettings

- 旧位置：`Components/UserCenter/ConfigOthers.tsx` / anonymous default class。
- 新位置：`src/pages/user-center/settings/ui/UserCenterProfileSettings.tsx` / `UserCenterProfileSettings`。
- 之前：匿名 class mount 请求全部头衔，render 临时构造年/月/日选项。
- 现在：具名函数用普通 effect 请求头衔并以受控字段调用父级 `handleChange`。
- 保持不变：头衔请求失败静默、1920–2019、未选择/保密值、月份/日期禁用条件、可选头衔过滤、字段长度、DOM/CSS 与文案。
- 兼容：旧文件保留 default 与 `ConfigOthers`；公开 `{ userinfo, handleChange }` 合同不变。
- 人工检查：头衔有/无/失败、生日选项、性别、QQ、邮箱和简介输入。
