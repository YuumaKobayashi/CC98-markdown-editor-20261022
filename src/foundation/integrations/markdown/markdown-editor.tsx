import * as React from "react";
import { flushSync } from "react-dom";
import Vditor from "vditor";
import "vditor/dist/index.css";

import { message } from "@foundation/ui/feedback";
import { MAX_UPLOAD_FILE_SIZE } from "./markdown-config";
import { buildFileMarkdown } from "./file-fragment";
import { createUploadQueue } from "./upload-queue";
import { createUploadedImagePreviews } from "./uploaded-image-previews";
import { installEditorDecorations } from "./editor-decorations";
import styles from "./markdown.module.scss";
import { createRepairState, holdMathRepair, guardBareMathPair, guardCodeEditing, guardBareCodeFence, type RepairState } from "./editor-input";

/** Vditor 初始化配置类型（vditor 未具名导出，经构造参数提取）。 */
type VditorOptions = NonNullable<ConstructorParameters<typeof Vditor>[1]>;
type VditorMenuItem = NonNullable<VditorOptions["toolbar"]>[number];

/**
 * Vditor 运行时按需加载的静态资源（Lute 引擎、highlight.js、KaTeX、
 * i18n、图片）的自托管根地址。构建时由 scripts/build-vite.mjs 把
 * node_modules/vditor/dist 拷贝到该路径（Vditor 的资源地址拼接规则为
 * `${cdn}/dist/...`，故拷贝目标保留 dist 一层），开发环境由
 * vite.config.mjs 的 devStaticRewrites 直接映射 node_modules。
 * 不依赖任何外部 CDN，校园网等无外网环境完整可用。
 */
const VDITOR_CDN = "/static/scripts/lib/vditor";

/** 悬浮网格选择器的最大行列数。 */
const GRID_SIZE = 8;
/** 行列数输入的上下限。 */
const SIZE_LIMITS = { min: 1, max: 50 };
/** 行列输入的默认值。 */
const DEFAULT_ROWS = 3;
const DEFAULT_COLS = 3;

/**
 * 字符类工具栏图标（>/←/→）：放进与线条 svg 一致的 15px 定宽槽内
 * 居中。工具栏按钮 css 带 font-size:0 且会继承进子元素，字符图标
 * 必须用内联样式 span 声明真实字号；定宽居中保证相邻按钮间距与
 * svg 图标完全同构（无宽度差 → 无左右间距差）。
 * 字形墨迹由字体度量决定、天然落在槽中心偏下约 1.5px，统一上移
 * 1.5px，让字符图标与 svg 图标在同一条水平中线上。
 */
const textIcon = (glyph: string, fontSize: number, extra = "") =>
  `<span style="display:block;width:15px;height:15px;line-height:15px;text-align:center;transform:translateY(-1.5px);font-family:Consolas,Monaco,'Courier New',monospace;font-weight:600;font-size:${fontSize}px;${extra}">${glyph}</span>`;

/**
 * 预载 Vditor 首次初始化必需的运行时脚本（Lute 引擎与中文语言包）。
 * 注入的 script id 与 Vditor 内部约定一致（vditorLuteScript /
 * vditorI18nScriptzh_CN），Vditor 初始化时检测到同名 id 会直接复用、
 * 不再重新下载执行——UBB→Markdown 切换因此无需等待引擎加载，
 * 也不会闪现灰色加载态。模块被编辑页导入时即开始预载。
 */
function preloadVditorAssets(): void {
  if (typeof document === "undefined") return;
  const inject = (id: string, src: string) => {
    if (document.getElementById(id)) return;
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    // Vditor 的 addScript 以「标签持有 id」表示「脚本已执行完毕」（它自己
    // 也是 onload 后才给标签挂 id，见到同 id 标签会直接复用、不再等待）。
    // 预载脚本若在下载中就先挂上 id，Vditor 会在引擎未就绪时抢跑 init，
    // 编辑器静默卡死（无 DOM、无报错）。照抄它的约定：onload 后再领 id，
    // 撞车（Vditor 自己的标签先到）时把预载标签移除让位。
    script.onload = () => {
      const winner = document.getElementById(id);
      if (winner && winner !== script) {
        script.remove();
        return;
      }
      script.id = id;
    };
    document.head.appendChild(script);
  };
  inject("vditorLuteScript", `${VDITOR_CDN}/dist/js/lute/lute.min.js`);
  inject("vditorI18nScriptzh_CN", `${VDITOR_CDN}/dist/js/i18n/zh_CN.js`);
}
preloadVditorAssets();

export interface MarkdownEditorProps {
  /** 当前 Markdown 内容。 */
  value: string;
  /** 内容变化回调。 */
  onChange: (value: string) => void;
  /**
   * 上传单个文件并返回其 URL（失败返回空字符串则跳过插入）。
   * 图片/音视频/附件与粘贴、拖拽上传都走这里，支持多选。
   */
  uploadImage: (file: File) => Promise<string>;
  /** 兼容旧接口：与 uploadImage 等价，可忽略。 */
  uploadFile?: (file: File) => Promise<string>;
  /** 编辑区高度（px），默认 430。 */
  editorHeight?: number;
}

/** 生成 rows 行（含表头）cols 列的 Markdown 表格，单元格留空待填写。 */
function buildTableMarkdown(rows: number, cols: number): string {
  const emptyRow = `| ${Array.from({ length: cols }, () => " ").join(" | ")} |`;
  const divider = `| ${Array.from({ length: cols }, () => "---").join(" | ")} |`;
  return [
    emptyRow,
    divider,
    ...Array.from({ length: rows - 1 }, () => emptyRow),
  ].join("\n");
}

/**
 * 统一的 Markdown 编辑组件（Obsidian 式即时渲染）。
 * 基于 Vditor 的 IR 模式：在同一个框内输入 Markdown，语法即时编译为
 * 排版结果，光标停在某个元素上时才显示其源码，如同写代码。Vditor
 * 只承担编辑体验；发帖内容仍走 md-editor-rt + DOMPurify 的统一渲染
 * 管线（见 markdown-config.ts / markdown-view.tsx），安全边界不变。
 * 注意 Vditor 实例为一次性初始化，回调经 ref 间接引用最新 props。
 */
export function MarkdownEditor({
  value,
  onChange,
  uploadImage,
  uploadFile,
  editorHeight = 430,
}: MarkdownEditorProps) {
  const hostRef = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const pickerRef = React.useRef<HTMLDivElement>(null);
  const vditorRef = React.useRef<Vditor | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [ready, setReady] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [tablePickerOpen, setTablePickerOpen] = React.useState(false);
  const [gridHover, setGridHover] = React.useState({ rows: 0, cols: 0 });
  const [gridRows, setGridRows] = React.useState(DEFAULT_ROWS);
  const [gridCols, setGridCols] = React.useState(DEFAULT_COLS);

  // Vditor 只在挂载时初始化一次，闭包里不能直接用 props——经 ref
  // 始终读取最新值。
  const onChangeRef = React.useRef(onChange);
  const lastEmittedRef = React.useRef(value);
  // 公式/代码围栏还原的可变状态：每个编辑器实例一份（M05）。
  const repairStateRef = React.useRef<RepairState | null>(null);
  if (!repairStateRef.current) repairStateRef.current = createRepairState();
  const repairState = repairStateRef.current;
  // 已展开的图片 URL 集合：图片默认折叠，用户展开的图片按 URL 记忆
  // （Vditor 重渲染重建节点 DOM 后由 annotate 依此恢复折叠状态）。
  const expandedImagesRef = React.useRef<Set<string>>(new Set());
  const imagePreviewsRef = React.useRef<ReturnType<typeof createUploadedImagePreviews> | null>(null);
  if (!imagePreviewsRef.current) imagePreviewsRef.current = createUploadedImagePreviews();
  const uploadRef = React.useRef(uploadFile ?? uploadImage);
  const uploadQueueRef = React.useRef<ReturnType<typeof createUploadQueue> | null>(null);
  const syncContentRef = React.useRef<() => void>(() => {});
  React.useLayoutEffect(() => {
    onChangeRef.current = onChange;
    uploadRef.current = uploadFile ?? uploadImage;
  });

  const handleUploadFiles = React.useCallback(async (fileList: File[]) => {
    const accepted = fileList.filter((file) => file.size <= MAX_UPLOAD_FILE_SIZE);
    const rejected = fileList.filter((file) => file.size > MAX_UPLOAD_FILE_SIZE);
    if (rejected.length) message.error(`以下文件超过 10MB，已跳过：${rejected.map((file) => file.name).join("、")}`);
    if (!accepted.length || !vditorRef.current) return;
    if (!uploadQueueRef.current) {
      const key = `cc98-md-upload-${Math.random().toString(36).slice(2)}`;
      uploadQueueRef.current = createUploadQueue({
        upload: (file) => uploadRef.current(file),
        insert: (file, url) => {
          const snippet = buildFileMarkdown(file, url);
          if (!snippet) throw new Error("无效的上传地址");
          imagePreviewsRef.current!.remember(url, file);
          // insertValue parses its argument as HTML first: <https://...> in a
          // Markdown destination becomes a tag and loses the URL. Use the
          // engine's Markdown API for images, attachments and media snippets.
          vditorRef.current?.insertMD(snippet + "\n\n");
          syncContentRef.current();
        },
        start: () => message.info({ content: "正在上传文件（单个最大 10MB）…", duration: 3600, key }),
        finish: (failed) => {
          message.destroy(key);
          if (failed.length) message.error(`以下文件上传失败：${failed.join("、")}`);
        },
      });
    }
    await uploadQueueRef.current.enqueue(accepted);
  }, []);

  const insertTable = React.useCallback((rows: number, cols: number) => {
    vditorRef.current
      ?.insertValue(buildTableMarkdown(rows, cols) + "\n\n", true);
    setTablePickerOpen(false);
  }, []);

  // 初始化：整个生命周期仅执行一次，高度等初值按首次渲染时的 props 固定。
  React.useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    // 上传：实心「带折角文件」图标（用户指定）。viewBox 收紧到纸张本身，
    // 否则 Vditor 强制 svg 15px 后按 24 units 映射会把图形再缩小一圈。
    const uploadMenuItem: VditorMenuItem = {
      name: "cc98-upload",
      icon: `<svg viewBox="4.5 1.5 16 21" width="15" height="15"><path fill="currentColor" fill-rule="evenodd" d="M6 2h8l6 6v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Zm8 0v6h6z"/></svg>`,
      tip: "上传文件（图片/音视频/附件）",
      tipPosition: "n",
      click: () => fileInputRef.current?.click(),
    };
    // 表格：等分 3×3 网格（lucide「Table」的几何，站点文章预览用的
    // md-editor-rt 表格按钮就是它，两处图形语言一致）。此前是「实心表头
    // + 空白表格区」的 Word 式画法，15px 下顶部那条 3.75px 黑带太抢眼，
    // 整体读起来像浏览器窗口而不是表格，故改为纯网格、不加填充。
    // 注意 fill/stroke 全部在各元素上显式声明：Vditor 的 CSS 会给
    // svg 根强写 fill:currentColor/stroke-width:0，靠根属性会被覆盖，
    // 把整个图标填成一块深色。
    const tableMenuItem: VditorMenuItem = {
      name: "cc98-table",
      icon: `<svg viewBox="0 0 24 24" width="15" height="15"><rect x="1.2" y="1.2" width="21.6" height="21.6" rx="2.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M1.2 8.4h21.6" fill="none" stroke="currentColor" stroke-width="2"/><path d="M1.2 15.6h21.6" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8.4 1.2v21.6" fill="none" stroke="currentColor" stroke-width="2"/><path d="M15.6 1.2v21.6" fill="none" stroke="currentColor" stroke-width="2"/></svg>`,
      tip: "插入表格",
      tipPosition: "n",
      click: () => setTablePickerOpen((open) => !open),
    };
    // 放大：右下↙、右上↗两支对角箭头（用户指定样式，箭头从中心指向
    // 对角、端头为横竖两段）。按钮本身排在工具栏最末（见 toolbar 数组），
    // 紧贴字数统计左侧。
    // fill="none" 必须写在每个 path 上（理由同上），否则箭杆会被
    // Vditor 的 fill:currentColor 填成实心块。
    const expandMenuItem: VditorMenuItem = {
      name: "cc98-expand",
      icon: `<svg viewBox="0 0 24 24" width="15" height="15"><path d="M13.5 10.5L20 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M15 4H20V9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.5 13.5L4 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M9 20H4V15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
      tip: "放大编辑框（编辑长文本时使用，回复按钮保持可见）",
      tipPosition: "n",
      click: () => setExpanded((open) => !open),
    };
    // 公式块：圆角方框内嵌 Σ（SquareSigma）。方框=块级、独占一行，
    // 与下面行内公式的裸 Σ 一眼区分；站点文章预览用的 md-editor-rt
    // 公式按钮也是 SquareSigma，两处图形语言一致。
    // 注意 fill/stroke 必须写在每个元素上：Vditor 的 CSS 会给 svg 根
    // 强写 fill:currentColor/stroke-width:0，只写在根上会被覆盖成实心块。
    // 尺寸对齐内置图标：外框连描边 14.3px，与 check/link/表格/放大
    // 那几个 15x15 的图标同一视觉重量，不会在工具栏里显得缩水。
    const mathMenuItem: VditorMenuItem = {
      name: "cc98-math",
      icon: `<svg viewBox="0 0 24 24" width="15" height="15"><rect x="1.55" y="1.55" width="20.9" height="20.9" rx="3.3" fill="none" stroke="currentColor" stroke-width="1.9"/><path d="M16.4 6.3H7.6L12 12L7.6 17.7H16.4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
      tip: "插入公式块（$$…$$，或行首敲 $$ 后按回车）",
      tipPosition: "n",
      click: () => {
        // 这个按钮要的就是一个空公式块，别让 `$$` 的还原逻辑把它拆掉。
        holdMathRepair(repairState);
        vditorRef.current?.insertValue("$$\n\n$$", true);
      },
    };
    // 行内公式：裸 Σ（求和记号）。数学符号本身就是「公式」的通用图形，
    // 字符 $ 在 15px 下太像货币符号、$$ 连写又会挤成一团，故换成线稿图标。
    // 墨迹 11.8x14px，与内置 H/I 等 15px 高的字符图标同高，避免比
    // 旁边的方框 Σ 小一圈。
    const inlineMathMenuItem: VditorMenuItem = {
      name: "cc98-inline-math",
      icon: `<svg viewBox="0 0 24 24" width="15" height="15"><path d="M20.37 1.85H3.63L12 12L3.63 22.15H20.37" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
      tip: "插入行内公式（$…$）",
      tipPosition: "n",
      click: () => {
        // 插入一个已闭合的行内公式模板 `$x$` 并预选占位符：输入者第一下
        // 键击直接覆盖 x，之后在节点里打公式、实时预览——与在公式块里编辑
        // 同一套体验。Vditor 的行内公式只有「输入数据里带 `$`」才会被输入
        // 规则识别（预置一对 `$` 再往中间填字永远不渲染，已实测），所以
        // 按钮必须一次性插出完整模板；占位符已被选中，没有删除负担。
        vditorRef.current?.insertValue("$x$", true);
        const root = host.querySelector<HTMLElement>(".vditor-ir .vditor-reset");
        requestAnimationFrame(() => {
          if (!root) return;
          const selection = window.getSelection();
          if (!selection) return;
          // 选中新插入节点里的占位符：insertValue 后光标就落在它附近，
          // 优先取包含/紧邻光标的行内公式节点，兜底取最后一个。
          const codes = Array.from(
            root.querySelectorAll<HTMLElement>('code[data-type="math-inline"]')
          );
          const anchor = selection.anchorNode;
          const target =
            codes.find((code) => anchor && code.contains(anchor)) ??
            codes.find((code) => anchor && code.parentElement?.contains(anchor)) ??
            codes[codes.length - 1];
          if (!target?.firstChild) return;
          const range = document.createRange();
          range.selectNodeContents(target.firstChild);
          selection.removeAllRanges();
          selection.addRange(range);
        });
      },
    };
    // 引用：用一对引号形状做图标。字符「>」在工具栏里更像「下一级/展开」，
    // 读不出引用语义，所以换成引号。轮廓取 lucide 的 Quote（站点预览
    // 编辑器 md-editor-rt 的引用按钮就是它），15px 下两枚实心引号仍分得清；
    // 空心描边版在 15px 会糊成一团，故用实心。name 沿用内置 "quote"，
    // Vditor 会沿用内置的引用行为与快捷键，仅覆盖 icon/tip。
    // 注：Vditor 的工具栏 CSS 给 svg 根写了 fill:currentColor 与
    // stroke-width:0，故填充色必须写在每个 path 上。
    const quoteMenuItem: VditorMenuItem = {
      name: "quote",
      icon: `<svg viewBox="0 0 24 24" width="15" height="15"><path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z" fill="currentColor"/><path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z" fill="currentColor"/></svg>`,
      tip: "引用",
      tipPosition: "n",
    };
    // name 用内置的 "undo"/"redo"：Vditor 会沿用内置的撤销/重做行为，
    // 仅以这里的 icon/tip 覆盖默认图标与提示。按钮文案叫「返回/前进」，
    // 图标用字符箭头「←」「→」（用户指定），字号给足保证与其他图标同高。
    // 字号 26：箭头墨迹约 13.6x10px，宽度对齐 15px 槽，不再比邻座细弱。
    const undoMenuItem: VditorMenuItem = {
      name: "undo",
      icon: textIcon("←", 26),
      tip: "返回",
      hotkey: "⌘Z",
      tipPosition: "nw",
    };
    const redoMenuItem: VditorMenuItem = {
      name: "redo",
      icon: textIcon("→", 26),
      tip: "前进",
      hotkey: "⌘Y",
      tipPosition: "ne",
    };

    // 空 `$$` 公式块拦截与代码/公式块对称符补齐的解绑函数，
    // Vditor 初始化完成后才有值。
    let detachMathPairGuard: (() => void) | undefined;
    let detachCodePairsGuard: (() => void) | undefined;
    let detachCodeFenceGuard: (() => void) | undefined;

    let active = true;
    let initialized = false;
    let syncScheduled = false;
    let dirty = false;
    let composing = false;
    const emit = (markdown: string) => {
      if (!active || markdown === lastEmittedRef.current) return;
      lastEmittedRef.current = markdown;
      onChangeRef.current(markdown);
    };
    const flush = () => {
      if (active && initialized && dirty && !composing && vditorRef.current) {
        dirty = false;
        emit(vditorRef.current.getValue());
      }
    };
    const scheduleSync = () => {
      dirty = true;
      if (syncScheduled || composing) return;
      syncScheduled = true;
      queueMicrotask(() => { syncScheduled = false; flush(); });
    };
    const startComposition = () => { composing = true; };
    const endComposition = () => { composing = false; scheduleSync(); };
    const flushBeforeSubmit = () => { if (dirty && !composing) flushSync(flush); };
    host.addEventListener("input", scheduleSync);
    host.addEventListener("compositionstart", startComposition, true);
    host.addEventListener("compositionend", endComposition);
    // Host pages submit in click handlers. Flush first, without moving the caret.
    document.addEventListener("click", flushBeforeSubmit, true);
    document.addEventListener("submit", flushBeforeSubmit, true);
    syncContentRef.current = scheduleSync;
    // StrictMode's trial effect is cancelled before construction. A detached old
    // instance can never append late initialization DOM into a new instance.
    const mount = document.createElement("div");
    host.appendChild(mount);
    let vditor: Vditor | undefined;
    queueMicrotask(() => {
      if (!active) return;
      vditor = new Vditor(mount, {
      cdn: VDITOR_CDN,
      // 即时渲染：Obsidian/Typora 式单框实时编译。
      mode: "ir",
      lang: "zh_CN",
      value,
      height: editorHeight,
      placeholder: "请输入内容",
      // 站点已有自己的草稿体系，禁用 Vditor 的 localStorage 缓存，
      // 避免多实例/换版面时串内容。
      cache: { enable: false },
      counter: { enable: true, type: "text" },
      undoDelay: 400,
      toolbar: [
        "headings",
        "bold",
        "italic",
        "strike",
        "|",
        quoteMenuItem,
        "list",
        "ordered-list",
        "check",
        "|",
        "inline-code",
        "code",
        inlineMathMenuItem,
        mathMenuItem,
        "link",
        uploadMenuItem,
        tableMenuItem,
        "|",
        undoMenuItem,
        redoMenuItem,
        // 放大独占最末：Vditor 的字数统计元素追加在全部工具栏项之后，
        // 排最末正好紧贴计数器左侧（用户指定的位置）。
        expandMenuItem,
      ],
      // 与帖子展示一致的代码外观：atom-one-dark 配色 + 行号
      // （对齐 md-editor-rt 预览的代码块样式）。
      preview: {
        hljs: { style: "atom-one-dark", lineNumber: true },
      },
      // 编辑中点击链接不跳转，避免误触离开编辑页。
      link: { isOpen: false },
      upload: {
        // 自定义上传：接住工具栏选择、粘贴图片与拖拽文件，返回 null
        // 阻止 Vditor 内置的 xhr 上传，由站点上传接口处理。
        handler: (files) => {
          void handleUploadFiles(Array.from(files));
          return null;
        },
      },
      input: (markdown) => {
        if (!syncScheduled && !composing) emit(markdown);
      },
      after: () => {
        if (!active) { vditor?.destroy(); return; }
        initialized = true;
        setReady(true);
        const irRoot = host.querySelector<HTMLElement>(".vditor-ir .vditor-reset");
        if (!irRoot) return;
        // 「$$ 不自动展开」的拦截：还原后 DOM 已经不是 Vditor 上报的那份
        // Markdown，得重新抛一次，否则父组件拿到的是公式块的写法。
        // 统一的「修复后重抛」出口：修复可能改变 DOM 对应的 Markdown，需要
        // 重新上报；但与最近一次上报相同时不再发（M03：避免同一内容被守卫
        // 与 Vditor input 回调重复序列化/上报）。
        const emitRepaired = scheduleSync;
        detachMathPairGuard = guardBareMathPair(irRoot, repairState, emitRepaired);
        // 代码块/公式块内的 ()/{}/[] 对称符补齐与回车自动缩进。
        detachCodePairsGuard = guardCodeEditing(irRoot, emitRepaired);
        // 「``` 不自动展开」的拦截：还原后同样要重抛 Markdown。
        detachCodeFenceGuard = guardBareCodeFence(irRoot, repairState, emitRepaired);
      },
    });
      vditorRef.current = vditor;
    });
    return () => {
      active = false;
      syncContentRef.current = () => {};
      uploadQueueRef.current?.invalidate();
      uploadQueueRef.current = null;
      imagePreviewsRef.current?.clear();
      host.removeEventListener("input", scheduleSync);
      host.removeEventListener("compositionstart", startComposition, true);
      host.removeEventListener("compositionend", endComposition);
      document.removeEventListener("click", flushBeforeSubmit, true);
      document.removeEventListener("submit", flushBeforeSubmit, true);
      detachMathPairGuard?.();
      detachCodePairsGuard?.();
      detachCodeFenceGuard?.();
      if (initialized) vditor?.destroy();
      mount.remove();
      vditorRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 代码块语言标注与复制按钮：Vditor 渲染出的代码块本身不显示语言名
  // 与复制入口。IR 渲染产物的 code 元素带 language-* 类（Lute 输出），
  // 这里把语言名写到所属 pre 的 data-lang 属性，由 CSS ::after 展示在
  // 代码块左上角；复制按钮则注入到编辑框根节点（editable DOM 之外，
  // 避免进入 Lute 的 DOM→Markdown 转换）并绝对定位到代码块右上角。
  // 语言名须为常规格式且是 highlight.js 已注册的真实语言（与
  // markdown-config.ts 的帖子渲染管线同一规则），否则统一标注 "code"。
  // highlight.js 由 Vditor 按需异步加载，未就绪时仅校验格式。
  React.useEffect(() => {
    if (!ready) return;
    const host = hostRef.current;
    if (!host) return;
    const irRoot = host.querySelector<HTMLElement>(".vditor-ir .vditor-reset");
    if (!irRoot) return;

    return installEditorDecorations(host, irRoot, expandedImagesRef.current, imagePreviewsRef.current!);
  }, [ready]);

  // 表格弹层定位：出现在工具栏「插入表格」按钮的正下方；超出编辑框
  // 右边界时向左收拢。
  React.useEffect(() => {
    if (!tablePickerOpen) return;
    const container = containerRef.current;
    const picker = pickerRef.current;
    if (!container || !picker) return;
    const button = container.querySelector<HTMLElement>(
      '[data-type="cc98-table"]'
    );
    if (!button) return;
    const containerRect = container.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    const maxLeft = Math.max(container.clientWidth - picker.offsetWidth - 8, 8);
    const left = Math.min(
      Math.max(buttonRect.left - containerRect.left, 8),
      maxLeft
    );
    picker.style.left = `${left}px`;
    picker.style.top = `${buttonRect.bottom - containerRect.top + 6}px`;
  }, [tablePickerOpen]);

  // 弹层打开时点击表格按钮与弹层之外的区域自动关闭。
  React.useEffect(() => {
    if (!tablePickerOpen) return;
    const onDocMouseDown = (event: MouseEvent) => {
      const picker = pickerRef.current;
      const container = containerRef.current;
      if (!picker || !container) return;
      const target = event.target as Node;
      if (picker.contains(target)) return;
      if (container.querySelector('[data-type="cc98-table"]')?.contains(target)) {
        return;
      }
      setTablePickerOpen(false);
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [tablePickerOpen]);

  // 放大态：编辑框高度撑到「视口顶 → 其后操作按钮行（回复等）顶」之间，
  // 保证按钮行不被挡住；随窗口尺寸变化重算，展开时滚动对齐到视口顶。
  React.useEffect(() => {
    if (!expanded) return;
    const container = containerRef.current;
    if (!container) return;
    const applyHeight = () => {
      // 操作按钮行（回复等）在不同宿主里位置不同：有的是编辑框根的
      // 兄弟节点（发帖页），有的隔了一层（回帖页），逐级向上找。
      const sibling = (container.nextElementSibling ??
        container.parentElement?.nextElementSibling ??
        null) as HTMLElement | null;
      // 预留操作按钮行高度 + 安全间距；找不到时兜底 120px。
      const reserve = (sibling?.offsetHeight > 0 ? sibling.offsetHeight : 96) + 24;
      const target = Math.max(window.innerHeight - reserve, 320);
      container.style.setProperty("--cc98-editor-expanded-height", `${target}px`);
    };
    applyHeight();
    window.addEventListener("resize", applyHeight);
    const raf = requestAnimationFrame(() => {
      container.scrollIntoView({ block: "start" });
    });
    return () => {
      window.removeEventListener("resize", applyHeight);
      cancelAnimationFrame(raf);
    };
  }, [expanded]);

  // 外部值同步（草稿载入、发送后清空等）：仅当值不是编辑器自己
  // 上报的时才回写，避免打断光标与撤销栈。
  React.useLayoutEffect(() => {
    if (!ready) return;
    // 只差尾部空白（父组件 trim、草稿存取）时不能回写：把 `$$` 重新塞回
    // Vditor 会被 Lute 当成公式块起始，正在写的行内公式会当场变成公式块。
    if (value === lastEmittedRef.current) return;
    if (value !== "" && value.trimEnd() === lastEmittedRef.current.trimEnd()) return;
    // 换稿/清空/载入草稿（R03）：稿件版本号递增，使在途上传任务的结果
    // 失效——普通输入不经过这里（值是编辑器自己上报的回显），不会误伤
    // 上传期间的合法任务。
    uploadQueueRef.current?.invalidate();
    uploadQueueRef.current = null;
    expandedImagesRef.current.clear();
    imagePreviewsRef.current?.clear();
    // 外部写进来的可能是别人写好的空公式块，别让观察者立刻把它拆开。
    holdMathRepair(repairState);
    vditorRef.current?.setValue(value, true);
    lastEmittedRef.current = value;
  }, [ready, value]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? []);
    // 重置 input.value，保证同一文件可重复选择。
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (selected.length === 0) return;
    void handleUploadFiles(selected);
  };

  return (
    <div
      ref={containerRef}
      className={`${styles.editor}${ready ? ` ${styles.editorReady}` : ""}${expanded ? ` ${styles.editorExpanded}` : ""}`}
    >
      <div ref={hostRef} className={styles.editorHost} />
      {tablePickerOpen && (
        <div ref={pickerRef} className={styles.tablePicker}>
          {/* 网格区阻止 mousedown 默认行为，避免点击时夺走编辑器焦点
              （内容失焦会导致选区丢失/界面变灰）。输入框保持默认行为
              以便正常聚焦输入。 */}
          <div
            className={styles.tableGrid}
            onMouseDown={(event) => event.preventDefault()}
          >
            {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, index) => {
              const row = Math.floor(index / GRID_SIZE);
              const col = index % GRID_SIZE;
              const active = row < gridHover.rows && col < gridHover.cols;
              return (
                <button
                  key={index}
                  type="button"
                  className={`${styles.tableGridCell}${active ? ` ${styles.tableGridCellActive}` : ""}`}
                  onMouseEnter={() =>
                    setGridHover({ rows: row + 1, cols: col + 1 })
                  }
                  onClick={() => insertTable(row + 1, col + 1)}
                />
              );
            })}
          </div>
          <div className={styles.tablePickerHint}>
            {`${gridHover.rows} × ${gridHover.cols}`}
          </div>
          <div className={styles.tablePickerForm}>
            <label className={styles.tablePickerField}>
              行
              <input
                type="number"
                min={SIZE_LIMITS.min}
                max={SIZE_LIMITS.max}
                value={gridRows}
                onChange={(event) => setGridRows(Number(event.target.value))}
              />
            </label>
            <label className={styles.tablePickerField}>
              列
              <input
                type="number"
                min={SIZE_LIMITS.min}
                max={SIZE_LIMITS.max}
                value={gridCols}
                onChange={(event) => setGridCols(Number(event.target.value))}
              />
            </label>
            <span className={styles.tablePickerActions}>
              <button
                type="button"
                className={styles.tablePickerSubmit}
                onClick={() => {
                  const rows = Math.min(
                    Math.max(gridRows, SIZE_LIMITS.min),
                    SIZE_LIMITS.max
                  );
                  const cols = Math.min(
                    Math.max(gridCols, SIZE_LIMITS.min),
                    SIZE_LIMITS.max
                  );
                  insertTable(rows, cols);
                }}
              >
                插入
              </button>
            </span>
          </div>
        </div>
      )}
      {/* input 作为兄弟节点放在 Vditor 工具栏之外，避免点击事件被
          工具栏吞掉或循环触发。 */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        style={{ display: "none" }}
        onChange={handleFileSelect}
      />
    </div>
  );
}
