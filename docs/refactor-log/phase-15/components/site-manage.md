# SiteManage class → function 对照

- 原文件/符号：`Components/SiteManage/Index.tsx` / `SiteManage`
- 新文件/符号：`src/pages/site-manage/ui/SiteManagePage.tsx` / `SiteManage`
- 原 props/state/lifecycle：均无
- 依赖：legacy Announcement、Advertisement
- 新 hooks/cleanup：均无
- 保持不变：标题、布局和两个子组件顺序
- 人工路径：`/sitemanage`；待验收

## 原写法 / 新写法

纯页面 wrapper class 改为具名函数，并移除未使用 Utility/UBB import。

## 审核结论

待人工填写。
