# P11 验证与人工验收清单

## Codex 机械检查

- [x] 开始时位于 `dev20260716`，HEAD 为 P10 提交 `bbeb3927`；
- [x] 除用户未跟踪的 `.vscode/` 外无既有工作树改动；
- [x] 4 个旧文件只保留兼容导出，已知调用方改走 4 个窄入口；
- [x] 4 个组件本身均使用具名 `function` 声明；
- [x] 组件内部 7 个具名函数均使用 `const + 箭头函数`，目标实现中无内部普通 `function` 声明；
- [x] Focus 和 MessageSetting/NoticeSetting 的原始注释已原文迁入新 owner，Board/TopicIPData 原实现无注释；
- [x] `npm run typecheck:modern` 成功；
- [x] `npm run typecheck:legacy` 成功；
- [x] 聚合 `npm run typecheck` 成功；
- [x] `git diff --check` 成功；
- [x] 正式构建通过：2,389 个模块、9,449 个文件、29 个主题 CSS，index/reset/IIS 均存在；
- [x] 有界开发服务的四个窄入口、静态资源和 HTML fallback 检查完成，5174 端口已无监听；
- [x] 未修改 UBB、UBB Editor、Router、Store、样式、依赖或 `.vscode/`。

## 人工验收

- [ ] Board 第 1 页与后续页的大字报展开状态、版面信息和图片 fallback 正常；
- [ ] 登录用户关注/取关按钮的 loading、文字和结果顺序正常；
- [ ] 版主编辑大字报时 TextArea、UBB 预览、确认和取消正常；
- [ ] 有权限用户在 Topic 管理区点击“查看IP”，折叠列表、确认和取消正常；
- [ ] `/focus/favorite` 页签高亮和收藏主题列表正常；
- [ ] `/message/setting` 能读取既有设置、保存五项设置并显示成功提示；
- [ ] 回帖后的“跳至最新回复”行为仍遵循保存的 `noticeSetting.post`。

机械检查不代表浏览器视觉、真实登录态或真实 API 验收完成。
