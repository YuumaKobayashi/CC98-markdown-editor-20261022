import { config } from "md-editor-rt";
import DOMPurify from "dompurify";
import { filterInlineStyle, KATEX_EXTRA_STYLE_PROPERTIES } from "./style-sanitize";

/**
 * KaTeX 静态资源地址。
 * 正式构建由 scripts/build-vite.mjs 从 node_modules/katex/dist 拷贝到
 * static/scripts/lib/katex；开发环境由 vite.config.mjs 的 devStaticRewrites
 * 直接映射到 node_modules。不依赖任何外部 CDN。
 */
const KATEX_JS_URL = "/static/scripts/lib/katex/katex.min.js";
const KATEX_CSS_URL = "/static/scripts/lib/katex/katex.min.css";

/**
 * highlight.js 静态资源地址（@highlightjs/cdn-assets，与 md-editor-rt
 * CDN 引用同版本 11.12.0）。正式构建由 scripts/build-vite.mjs 拷贝到
 * static/scripts/lib/highlight；开发环境由 vite.config.mjs 的
 * devStaticRewrites 直接映射到 node_modules。不依赖任何外部 CDN。
 * codeTheme 与包内默认值一致为 atom；previewTheme 为 default 时
 * md-editor-rt 固定取 dark 变体（默认预览的代码块是深色底）。
 */
const HIGHLIGHT_JS_URL = "/static/scripts/lib/highlight/highlight.min.js";
const HIGHLIGHT_CSS_URLS = {
  light: "/static/scripts/lib/highlight/styles/atom-one-light.min.css",
  dark: "/static/scripts/lib/highlight/styles/atom-one-dark.min.css",
};

/**
 * md-editor-rt 全局配置，是“预览、渲染、编辑同一套代码”的唯一入口。
 * MdEditor（编辑 + 内置预览）与 MdPreview（帖子展示）共用这一份配置。
 */
config({
  // 公式引擎：内容包含公式时才按需加载自托管静态资源。
  editorExtensions: {
    katex: { js: KATEX_JS_URL, css: KATEX_CSS_URL },
    // 代码高亮：同 KaTeX 走自托管资源，内容含代码块时按需加载。
    highlight: {
      js: HIGHLIGHT_JS_URL,
      css: { atom: { light: HIGHLIGHT_CSS_URLS.light, dark: HIGHLIGHT_CSS_URLS.dark } },
    },
  },
  katexConfig: (base) => ({ ...base, strict: false, throwOnError: false }),
  // html:true 兼容旧帖中的裸 HTML（<b>、<center> 等），最终输出统一经
  // sanitizeHtml（DOMPurify）过滤；breaks:false 与旧 showdown 行为一致，
  // 单个换行不产生 <br>。
  markdownItConfig: (md) => {
    md.set({ html: true, breaks: false, linkify: true });
    // 代码块语言标识预处理：信息串首词须为常规格式（字母/数字/+#_-，
    // ≤20 字符）且是 highlight.js 已注册的真实语言，否则统一替换为
    // 占位符 "code"（该占位词不属于任何已知语言，代码块回退为自动
    // 检测高亮，本身不受影响）。hljs 按需异步加载：尚未加载时无法
    // 判断语言是否存在，先保留原文——hljs 加载完成后 md-editor-rt
    // 会自动重渲染，届时本规则再次执行并完成替换。
    md.core.ruler.push("sanitize-fence-info", (state) => {
      const hljs = (window as unknown as { hljs?: { getLanguage?: (lang: string) => unknown } }).hljs;
      for (const token of state.tokens) {
        if (token.type !== "fence") continue;
        const lang = token.info.trim().split(/\s+/)[0] ?? "";
        if (!lang) continue;
        const formatValid = /^[A-Za-z0-9+#_-]{1,20}$/.test(lang);
        const known =
          !hljs || typeof hljs.getLanguage !== "function"
            ? true
            : Boolean(hljs.getLanguage(lang));
        if (!formatValid || !known) {
          token.info = "code";
        }
      }
    });
  },
});

/** KaTeX 静态资源地址，供 UBB [math]/[m] 公式处理复用。 */
export const KATEX_ASSETS = { js: KATEX_JS_URL, css: KATEX_CSS_URL };

/** highlight.js 静态资源地址，供需要手动加载高亮资源的场景复用。 */
export const HIGHLIGHT_ASSETS = { js: HIGHLIGHT_JS_URL, css: HIGHLIGHT_CSS_URLS };

/** 单个上传文件的大小上限（字节）。上传前预检，避免整包上传后才被服务端拒绝。 */
export const MAX_UPLOAD_FILE_SIZE = 10 * 1024 * 1024;

/**
 * 内联 style 属性白名单：仅保留排版类 CSS 属性。
 *
 * DOMPurify 默认整段保留 style 属性且不解析其内容，而 style 属性是
 * DOMPurify 放行的主要注入通道——position:fixed / z-index:2147483647 /
 * backdrop-filter / transform 等可实现全屏遮罩钓鱼、点击劫持与视觉致盲
 * （fixed 定位不受祖先 overflow:hidden 裁剪，可逃出预览容器覆盖全页，
 * 见《覆盖与上层显示干涉》测试卷）。这里采用属性名白名单而非黑名单：
 * 排版类属性逐项放行，其余一律剔除。
 */
// DOMPurify 实例为模块级单例，钩子只注册一次；uponSanitizeAttribute 在
// 每个属性校验后触发，这里仅拦截 style 属性并原地重写其值。
DOMPurify.addHook("uponSanitizeAttribute", (node, data) => {
  if (data.attrName !== "style") return;
  if (node?.closest?.(".katex, .katex-display")) {
    // KaTeX 输出的内联样式承载 TeX 排版定位（top/left/height 等），需要
    // 放行通用白名单之外的定位属性。但 .katex/.katex-display class 本身
    // 可被作者在裸 HTML 中伪造，不能作为"内容可信"的依据整树豁免——
    // 这里改用 KaTeX 专属受限白名单：通用排版白名单 + 定位属性，且
    // position 拒绝 fixed/sticky。伪造者拿不到 fixed 定位、inset、
    // z-index 与背景；KaTeX 真实产物（scripts/katex-style-props.cjs
    // 对 26 种典型公式双模式枚举）的属性与取值全部覆盖，排版不散架。
    data.attrValue = filterInlineStyle(
      String(data.attrValue ?? ""),
      KATEX_EXTRA_STYLE_PROPERTIES
    );
    data.keepAttr = data.attrValue !== "";
    return;
  }
  data.attrValue = filterInlineStyle(String(data.attrValue ?? ""));
  data.keepAttr = data.attrValue !== "";
});

/** 统一的 HTML 过滤入口，供 MdEditor / MdPreview 的 sanitize 使用。 */
export function sanitizeHtml(html: string): string {
  // FORBID_TAGS ["style"]：DOMPurify 默认白名单会放行 <style> 标签，
  // 允许帖子作者注入任意 CSS（界面破坏 / 覆盖层误导）。论坛帖子没有使用
  // <style> 的正常场景，且旧版 showdown-xss-filter（js-xss）同样不放过该标签，
  // 此处显式禁用以保持行为一致。style 属性经上方 uponSanitizeAttribute
  // 钩子按白名单过滤，排版类声明保留、遮罩类声明剔除。
  // FORBID_ATTR ["autoplay"]：禁止音视频自动播放（Chromium 对静音自动
  // 播放有额外策略，但显式剥掉 autoplay 属性是页面侧能做的完整封禁）。
  // ADD_ATTR ["rn-wrapper"]：md-editor-rt 行号占位符依赖该非标准属性
  // （.md-editor-scrn pre code [rn-wrapper]::before 显示行号），默认白名单会将其剥掉。
  return DOMPurify.sanitize(html, {
    FORBID_TAGS: ["style"],
    FORBID_ATTR: ["autoplay"],
    ADD_ATTR: ["rn-wrapper"],
  });
}