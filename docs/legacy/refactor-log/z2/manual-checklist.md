# Z2 验证与人工审核记录

日期：2026-08-02

## 1. 机械检查

| 检查 | 结果 |
| --- | --- |
| `npm run typecheck` | 通过；modern 与 legacy 均通过 |
| `npm run check:architecture` | 通过；397 source files、1548 imports、0 allowed violations |
| 样式守卫 | 通过；132 个真实 CSS Module、0 transitional partial、0 business global、1 份冻结 Annual Review 全局样式 |
| 动态内容守卫 | 通过；18 条直接 consumer edge、63 条活动 UBB 注册、16 个 UBB 样式边界、3 组 Storage 合同、2 组 content type 合同 |
| 第三方/Foundation 守卫 | 通过；115 条第三方 import、35 条 Portal/config consumer、3 个 vendor owner、88 个布局 consumer |
| legacy UBB alias 与 Module 深层 import | 0 条 |
| 迁址文件 | 66 个 legacy 文件全部闭包；最终 Module 81 个文件 |
| 迁址内容比较 | 42 个非样式文件规范化文本完全一致；22 个文件只含已登记的 import、公共入口或 class mapping 修改 |
| 注释审计 | TypeScript scanner 与 SCSS 注释对照共 410 条，缺失 0 |
| 行尾/BOM/EOF | 81 个 Module 文件无混合行尾；62 个既有非空文件保持 CRLF，17 个新文件为 LF，2 个空文件；迁入既有文件保留 BOM 与原 EOF 形态 |
| `git diff --check` | 通过 |
| `npm run build` | 通过；4132 modules transformed；沙箱内先遇既知 `spawn EPERM`，允许子进程环境原命令重跑成功 |

## 2. 生产产物

- 构建后 `dist` 为 9564 个文件、96 个 CSS，其中 29 个主题 CSS 均存在。
- 以“排序后的相对路径 + tab + 单文件 SHA-256 + LF”聚合：全产物 SHA-256 `c80487a36a56d625699de574d3ebab33927ce6a0f4839c4573a8b8b0ad703eb3`，CSS SHA-256 `5e2e6ed784c476059342795e21cef353fd28e8a35a1b5744c04c59fd4f307678`。
- UBB 样式从两份全局 owner 拆为局部 Module，公开 import 图和 chunk 边也改变，因此不要求完整 JS/CSS 字节零漂移；未添加死代码、旧 class 双写或兼容 facade 伪造旧产物。
- 构建仍只有既有 Sass `@import`、Spectrum/Lightning CSS 和大 chunk 警告。

## 3. 主代理静态审核

- `UbbCodeExtension` 的两组 Engine 注册序列逐项与冻结清单一致，活动注册总数仍为 63；Math 与 BiliText 的禁用注释保留。
- Engine/Segment/Handler、quote、URL 安全、权限提示、图片/上传/音视频/Bilibili/Markdown/Math/sandbox 实现未现代化或修复。
- Editor 的按钮/emoji 数据、Storage key/TTL、选区、上传 URL/header/body、压缩参数、preview、事件和固定 ID 保留。
- 旧全局 selector 已随 producer 收口；精确旧 `.hiddenImage/.ubb-editor/.urlStyle/.UBBTableTag` 等 selector 在构建 CSS 中为 0，未形成全局兼容残留。
- 公开入口只包含 5 个当前业务合同；Application 和其他 Module 没有深层导入 handler 或实现文件。

## 4. 未执行验收

- 未执行浏览器 UBB 嵌套/空标签、quote、URL、签名、匿名/权限可见性和 XSS 边界验收。
- 未执行 Editor 光标/选区、撤销重做、快捷键、emoji、预览、上传/压缩、拖放/粘贴和草稿交互验收。
- 未执行图片 toolbox、APlayer、DPlayer、Bilibili、Markdown、MathJax、sandbox、默认/暗色主题与移动端视觉验收。
- 未执行真实登录、真实 API、上传权限、跨标签或生产浏览器验收；build 和 HTTP 200 不替代上述项目。
- 未 commit、未 push、未进入 Z3。
