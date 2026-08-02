# P12 验证与人工验收清单

## Codex 机械检查

- [x] 开始时仅有用户未跟踪的 `.vscode/`，且全程未触碰；
- [x] 删除 `.npmrc` 的 `legacy-peer-deps=true`；
- [x] `npm ci --legacy-peer-deps=false --no-audit --no-fund` 成功；
- [x] `npm ls --depth=0` 以 0 退出，目标版本与 React/ReactDOM 16.14.0、watermark commit 均已核对；
- [x] `npm run typecheck:modern` 成功；
- [x] `npm run typecheck:legacy` 成功；
- [x] 聚合 `npm run typecheck` 成功；
- [x] `npm run build` 成功；
- [x] `git diff --check` 成功；
- [x] 产物为 9,450 个文件、29 个 `css_*.css` 主题；`index/reset/IIS` 存在，error 模板嵌入 index；
- [x] Bootstrap、Bootstrap Icons、Font Awesome 固定资源与 reset/error 固定 URL 存在；
- [x] 无 `Form.create/getFieldDecorator`、旧 editor、Draft.js、React Bootstrap 或组件级 AntD 深路径残留；
- [x] `Ubb/**`、`Components/UbbContainer.tsx`、`Components/UbbEditor/**` 无 diff；
- [x] Codex 未启动或重启 P12 开发服务器，未访问真实账号/API；已按用户逐批审批创建本地提交，未 push、未进入 P13。

## 用户人工验收

- [ ] Header：显隐图标、Popover、Tooltip 与通知正常；
- [ ] `P12-CSS-001` 记录的样式覆盖问题尚未统一修复；相关按钮、Select、表格、分页、Transfer、Radio/Checkbox 不得标记视觉通过；
- [ ] Board：分页、Popover、Tooltip、管理弹窗和通知正常；
- [ ] Topic：发帖、回帖、编辑、8000 字限制、提交与跳转正常；
- [ ] Markdown：工具栏顺序、编辑/预览、Showdown 输出、图片上传插入格式和 input 清空正常；
- [ ] UBB/Markdown 切换与草稿语义正常；
- [ ] Topic 管理、发言管理与评分表单的默认分支、条件字段、校验、reset、loading 和提交顺序正常；
- [ ] 用户中心：收藏分组管理、历史弹窗和 Dropdown 正常；新增分组的上限提示在 `Form.Item extra` 中间距、对齐和主题表现可接受；
- [ ] 补签日历：月份选择、前后月按钮与日期选择器对齐、箭头垂直居中、边界禁用与消息提示正常；
- [ ] `/annual-review-2025`：柱状图、tooltip y 辅助线、上下页图标和尺寸正常；
- [ ] SiteManage：表格、Input、Checkbox、Modal 与操作正常；
- [ ] 默认主题及至少一个非默认主题下完成 Header、Board、Topic、用户中心、管理弹窗与编辑器视觉检查；
- [ ] reset/error：Bootstrap 弹窗、Bootstrap Icons 与固定资源正常；
- [ ] UBB 图片：延迟加载、显隐、旋转和工具箱正常，确认冻结源码未变。

机械检查不代表浏览器视觉、控制台、真实登录态、权限路径或真实 API 验收完成。P11 未完成的浏览器验收也仍然保持未完成。
