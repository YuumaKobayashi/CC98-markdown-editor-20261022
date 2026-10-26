# Markdown 编辑器修复记录

日期：2026-10-26。

对应任务书：`markdown-editor-review-for-zcode.md`、`markdown-editor-rereview-for-zcode.md`。保留两份审查文档作为原始记录，本文件描述当前实现与验证范围。

## 已实施的修改

| 任务 | 当前实现 | 主要文件 |
| --- | --- | --- |
| M01 | 保留受限 KaTeX 属性策略；收紧属性前缀、CSS 变量和转义/注释值，避免任意自定义变量及混淆 URL 放行 | `style-sanitize.ts`、`markdown-config.ts` |
| M02 / R02 | 只识别论坛实际引用模板；保护普通、引用内和列表围栏；严格闭合；保护缩进代码；保留 CRLF；不再全文替换“发言”文字 | `markdown-preprocess.ts` |
| M03 / R05 | 公式守卫仅在实际修复后请求同步；原始输入、修复和 IME 完成共用微任务同步；相同字符串不上报；提交前同步剩余变更 | `editor-input.ts`、`markdown-editor.tsx` |
| M04 | 保留单一可取消滚动任务，补充方向键、翻页、指针操作解除及光标越出编辑区时解除 | `editor-decorations.ts` |
| M05 | 保留实例级 RepairState；守卫卸载后不运行排队回调；延后构造并隔离每次挂载的 DOM，避免旧实例迟到初始化写入新挂载点 | `editor-input.ts`、`markdown-editor.tsx` |
| M06 / R06 | 脚本与 CSS 共同就绪；并发共享；校验 renderToString；成功/失败/超时清理监听和定时器；仅移除自己创建的失败标签；允许重试 | `resource-loader.ts`、`katex-loader.ts` |
| M07 | 保留协议和属性转义；补充 Markdown 标签特殊字符、反斜杠目标和控制字符防护 | `file-fragment.ts` |
| M08 / R03 | 每份稿件独立队列；换稿及卸载使旧队列失效；旧请求不再清空新队列；保留逐文件异常处理和选择顺序；提示按任务隔离并在失效时关闭 | `upload-queue.ts`、`markdown-editor.tsx` |
| M09 | 输入守卫、视觉辅助、上传队列、资源加载、片段生成和过滤分离；React 组件集中负责组合、工具栏及弹层 | Markdown 集成目录 |
| M10 / R04 | 用现有 TypeScript 编译器运行辅助检查，不依赖 Node 24 类型剥离；新增生命周期测试与浏览器测试入口 | `scripts/run-markdown-tests.cjs` 等 |
| R01 | 保留只观察 irRoot、按钮文案幂等更新及立即定位；补充忽略同值 class 通知，辅助按钮留在可编辑区外 | `editor-decorations.ts` |

核心 React 文件从本轮开始时约 1900 行拆分到约 660 行。未替换 Vditor、MdPreview、正文格式或自托管资源路径。

## 行为选择

- 同稿件内，上传结果插入到完成时的当前光标位置；不同稿件之间不继承任务。
- 外部非回显的内容回填视为换稿，立即使旧队列失效；正常输入的父组件回显不取消上传。
- 当前上传接口没有 AbortSignal，所以失效采用停止队列和忽略返回结果；已经发出的网络请求可能继续，但不能写回新稿。
- 旧引用头与正文之间使用空引用行分段，避免把代码或任意现代引用纳入旧模板修复；重复处理不继续增加空行。
- 正文输入立即同步到父组件；Vditor 自己的撤销快照延迟保持原设置，不改为长时间正文 debounce。
- 图片展开/折叠辅助 DOM 不进入 Markdown 序列化。

## 已通过的验证

- `npm run typecheck`：通过。
- `npm run test:helpers`：40 项辅助函数检查通过；另有上传顺序/失败/换稿隔离、输入守卫无修复调度/卸载、资源并发/归属/超时/重试断言通过。
- `node --no-experimental-strip-types scripts/run-markdown-tests.cjs`：通过，确认测试不依赖 Node 24 的原生类型剥离。
- `npm run test:math`：通过。
- `npm run build`：通过。保留项目现有 Sass @import 弃用及大 chunk 提示，没有借此改动无关主题代码。

实际运行环境是 Node 24.15.0。测试运行器使用项目已有 TypeScript 编译器和 Node 20 支持的接口，但没有在本机实际执行 Node 20.20.0；不把兼容设计写成已经完成的 Node 20 实跑。

## 浏览器验证

现已通过隔离的真实 Edge 浏览器回归。测试将实际 React、Vditor、MdPreview 和样式打包到内存中，拦截全部资源请求，使用仓库内图片和模拟上传结果；不再依赖本地 HTTP 开发服务器。

已实际断言：

- DOMPurify/KaTeX 管线、多实例和 StrictMode 可运行。
- 图片确实完成解码（naturalWidth > 0），不只检查按钮文案或 CSS。
- 点击图片后可以编辑 URL 语法，修改后的地址被保存。
- 普通/放大状态下，按钮底边不进入图片区域；按钮最小 104 × 36 像素。
- 原始输入即时同步、撤销重做、美元符号输入和公式回填正常。
- 上传图片的完整 HTTPS 地址得到保留；即使远端返回 404，上传的本地原图仍可预览，blob 地址不会写入 Markdown。
- 换稿后旧上传结果被丢弃，新稿上传结果保留。

真实中文输入法、移动端软键盘、Node 20 实跑和用户实际图片服务器的可用性尚未实测。浏览器中的 HTTP 404 为故意模拟，不能据此判断用户服务器的实际状态。

## 复验方式

### 图片展开交互补充修复

截图中的破图图标和文件名是加载失败的替代内容。真实上传回归最终定位到根因：Vditor 的 insertValue 先按 HTML 解释字符串，Markdown 图片目标中的 `<https://…>` 会被当作标签，地址被截成 `https:`。上传片段已改用 insertMD，因此图片、附件及音视频的完整 Markdown 得到正确插入。

图片控件现在独占节点顶部预留的 44 像素行，按钮不再随滚动粘到原图上方。恢复由 Vditor 决定语法标记的可见性，光标进入时可编辑语法；预览展开/折叠仅控制图片，不再强制隐藏源码。对刚上传的图片保留会话内本地原文件预览，换稿或卸载时释放对象 URL；持久化内容始终保留服务器地址。CC98 文件域名的旧 HTTP 地址在插入时升级为 HTTPS，与帖子读取端保持一致。

旧版本已经保存为 `https:` 的地址缺少原始路径，无法从文件名自动恢复；这类旧稿会显示“图片地址不完整，请重新插入”。其他加载失败会显示失败提示及重试入口，不会把文件名当作正常预览。

基础检查不需要新增依赖：

```sh
npm run typecheck
npm run test:helpers
npm run test:math
npm run build
```

交互入口：启动 `npm run dev` 后，访问开发服务器的 `/scripts/markdown-browser.html`。测试页面只属于开发资源，不是生产构建入口。

浏览器脚本需要可解析的 Playwright 模块（本轮使用环境提供的模块，通过 NODE_PATH 配置，没有新增生产依赖）。在开发机安装或提供该测试工具后运行：

```sh
npm run test:browser
```

Windows 默认使用本机 Edge，其他平台使用 Playwright Chromium；可用 `CC98_BROWSER_CHANNEL` 指定浏览器通道。脚本在内存中构建测试包，并拦截全部浏览器资源请求，使用虚构上传结果，不登录论坛、不调用真实发帖或上传接口。

隔离浏览器自动化已通过；Node 20、真实输入法和实际上传服务仍应在目标开发环境复验。
