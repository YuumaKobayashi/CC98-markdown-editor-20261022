# Z2 UBB Module 收口范围

日期：2026-08-02

实施基线：干净的 `dev20260716@84e5c736`

范围：只实施 Z2；不进入 Z3，不处理其他根级 `Pages/Components/Utility`，不删除 Annual Review，不替换 Markdown，不 commit、不 push

## 1. 本批完成项

- 将计划冻结的 66 个 legacy 文件完整迁入 `src/modules/ubb`：`Ubb/**` 49 个、`UbbContainer` 2 个、`UbbEditor/**` 14 个、`UbbEditorState` 1 个。
- 将内部实现分为 `renderer`、`editor` 和公共 `UbbContainer` owner；新增 Module 根入口，只公开当前业务需要的 `UbbContainer`、`UbbEditor`、`UbbCodeOptions`、`UbbCompatiblityMode` 与 `RightTagHandler`。
- 16 个业务调用方统一改经 `@modules/ubb` 根入口消费；`@legacy/Ubb/*`、`@legacy/Components/Ubb*`、`@legacy/States/UbbEditorState` 和 `@modules/ubb/*` 深层 import 均归零。
- UBB 对 legacy `MessageBar`、根 `Utility` 的依赖分别切到既有 Foundation feedback/http/storage 与 Session 公共入口；architecture allowlist 从 10 条降为 0。
- 删除两份活动 UBB 全局 SCSS，将 Container、Editor 子组件及有独立 DOM 的 Handler 拆为 16 份同名 CSS Module；React producer 使用 Module mapping，未建立全局 class 双写或兼容 facade。
- 从 legacy typecheck include 中移除已不存在的 `States` 与 `Ubb`；迁入文件进入 modern typecheck，剩余 legacy 源码继续由 `tsconfig.legacy.json` 覆盖。

## 2. 明确保留的合同

- `UbbCodeExtension` 的 63 条活动 Handler/TextHandler 注册顺序及 Math/BiliText 禁用注释不变。
- Engine、Segment、Handler class、解析算法、嵌套/空标签、quote、URL、安全判断、权限标签、媒体播放器、数学公式、sandbox 和错误降级逻辑不现代化、不修复。
- Editor 的按钮/emoji JSON、`defaultEmojiType` 键、2592000 秒 TTL、`#color`、`ubbFileUpload`、`shouldCompassImage`、选区、预览、上传、压缩和回调行为保留。
- DPlayer/APlayer、Font Awesome 与 Spectrum 的第三方 DOM/class 合同继续保留；Spectrum 仍限定在 `cc98-vendor-spectrum-color-picker` owner 下并使用 `appendTo: 'parent'`。
- 旧 UBB 业务 className 不作为兼容合同；对应 selector 已随 producer 改为局部 hash。历史误写 `.UBBTabletTag` 规则仍以无 producer 的局部规则保留，未借机修复；原全局 `td` 命中被限界到 UBB table owner。

## 3. 当前停点

代码、调用闭包、样式 owner、守卫和静态审核已完成。机械检查与构建结果见 `manual-checklist.md`；浏览器 UBB/editor/media/permission/theme/真实上传验收未执行。本批停在未提交工作树，等待人工验收与单独提交授权。
