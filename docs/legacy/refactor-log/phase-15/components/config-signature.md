# ConfigSignature class → function 对照

- 原文件/符号：`Components/UserCenter/ConfigSignature.tsx` / anonymous default class
- 新文件/符号：`src/features/account/ui/ConfigSignature.tsx` / `ConfigSignature`
- 原 props/state：signature、onchange；无 state/lifecycle
- 新 hooks/cleanup：均无；textarea handler 为 `const + arrow`
- 保持不变：`SignatureCode` 字段名、受控值、spellCheck、回调参数顺序和说明文字
- 人工路径：`/usercenter/config`；待验收

## 原写法 / 新写法

class render 与内联回调改为具名函数加 `handleChange` 箭头函数。

## 审核结论

待人工填写。
