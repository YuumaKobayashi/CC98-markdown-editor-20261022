# P10 人工与机械检查清单

## 已完成机械检查

- [x] 开始时位于 `dev20260716@9cd5ae55`，除 `.vscode/` 外工作区干净；
- [x] 13 个目标符号均为具名函数，不含 class/state/lifecycle/hooks/memo；
- [x] 新 UI 不 import Redux、Router、DOM、fetch、storage 或旧 Utility；
- [x] `Ubb/**`、`Components/UbbEditor/**`、Store、Router、样式、主题和依赖无修改；
- [x] `npm ls --depth=0` 退出码 0，仅保留既有 optional/extraneous 安装项；
- [x] `npm run typecheck:modern`、`typecheck:legacy`、`typecheck` 均成功；
- [x] `npm run build` 成功，转换 2,384 个模块；
- [x] 产物为 9,449 个文件、29 个主题，index/reset/IIS 存在；
- [x] 隔离端口 5174 的入口、新模块和代表固定资源为 200，进程树已回收；
- [x] `git diff --check` 成功，`.vscode/` 未被修改或纳入范围。

## 待人工验收

- [ ] `/`：公告有值/空值、首页话题栏目、福利、推荐功能、意见箱和三个二维码与 P09 一致；
- [ ] `/index`：公告有值与空值行为与 P09 一致；
- [ ] Topic：普通楼层、楼主、超大楼层及可获得的热门图标显示正常；
- [ ] 登录后 `/message`：私信发送/接收气泡、时间、头像和 UBB 正常；
- [ ] 回复、@ 和系统消息的已读/未读、链接、日期与 UBB 输出正常；
- [ ] 浏览器控制台无新增错误，Network/Redux/storage 无新增行为；
- [ ] 人工审阅 13 份 class→function 对照及当前 diff；
- [ ] 完成以上项目后授权 P10 提交。
