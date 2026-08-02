# UserProfile class → function 对照

- 原文件/符号：`Components/UserCenter/ExactProfile.tsx` / anonymous default class
- 新文件/符号：`src/entities/user/ui/UserProfile.tsx` / `UserProfile`
- 原 props/state：完整 `UserInfo`；无 state/lifecycle
- 依赖：Router Link、AntD Tag、时间格式化、冻结 UBB 与 options
- 新 hooks/cleanup：均无；权限颜色为内部 `const + arrow` helper
- 保持不变：全部资料字段、私信 URL、权限颜色、生日图标、签名 UBB options
- 行为修复：生日非空但格式不匹配时不再访问空正则结果
- 人工路径：用户中心主页；待验收

## 原写法 / 新写法

纯 render class 改为具名函数；生日判断增加 `match` 存在性门禁。

## 审核结论

待人工填写。
