/**
 * 内联 style 白名单过滤（纯函数，无 DOM 依赖，可独立单测）。
 *
 * 通用白名单服务于用户 HTML 的排版类内联样式；KaTeX 子树使用附加白名单
 * （排版定位属性），因为 .katex/.katex-display class 可被作者伪造，不能
 * 作为"内容可信"的依据整树豁免（见 markdown-config.ts 的 DOMPurify 钩子）。
 */

const ALLOWED_STYLE_PROPERTIES = new Set([
  "color",
  "background-color",
  "font-size",
  "font-family",
  "font-weight",
  "font-style",
  "line-height",
  "text-align",
  "text-decoration",
  "letter-spacing",
  "word-break",
  "overflow-wrap",
  "vertical-align",
  "white-space",
  "opacity",
  "width",
  "min-width",
  "max-width",
  "height",
  "min-height",
  "max-height",
]);
// margin/padding/border 三族（含各方向子属性）按前缀放行；
// 仅保留 md-editor-rt 行号宽度使用的数值自定义属性，避免放行任意变量。
const ALLOWED_STYLE_PROPERTY_PREFIXES = [
  "margin",
  "padding",
  "border",
];
// 数值层面兜底：白名单内属性也不允许携带远程引用或表达式。
const FORBIDDEN_STYLE_VALUE_PATTERN = /url\s*\(|expression\s*\(|javascript\s*:/i;

// KaTeX 子树的附加属性：KaTeX 排版定位需要 top/left/right/bottom 与
// position（scripts/katex-style-props.cjs 对 26 种典型公式双模式枚举的
// 实际产物），这些不在通用白名单内。
export const KATEX_EXTRA_STYLE_PROPERTIES = new Set([
  "position",
  "top",
  "left",
  "right",
  "bottom",
]);
// position 只允许常规定位取值：fixed/sticky 可制造全屏覆盖层，KaTeX
// 从不使用（同上枚举验证），伪造 .katex class 也拿不到。
const ALLOWED_POSITION_VALUES = new Set(["absolute", "relative", "static"]);

/** 按 ";" 分割声明串；括号与引号内的 ";" 不分割（如 data URI）。 */
function splitStyleDeclarations(styleText: string): string[] {
  const parts: string[] = [];
  let current = "";
  let parenDepth = 0;
  let quote: string | null = null;
  for (const ch of styleText) {
    if (quote) {
      current += ch;
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      current += ch;
      continue;
    }
    if (ch === "(") parenDepth += 1;
    if (ch === ")") parenDepth = Math.max(0, parenDepth - 1);
    if (ch === ";" && parenDepth === 0) {
      parts.push(current);
      current = "";
      continue;
    }
    current += ch;
  }
  if (current.trim()) parts.push(current);
  return parts;
}

/** 过滤内联 style：白名单属性保留，其余剔除；返回空串表示整个属性移除。
 *  extraProperties：在通用白名单之上额外放行的属性（KaTeX 定位属性）。 */
export function filterInlineStyle(
  styleText: string,
  extraProperties?: ReadonlySet<string>,
): string {
  const kept: string[] = [];
  for (const declaration of splitStyleDeclarations(styleText)) {
    const colon = declaration.indexOf(":");
    if (colon === -1) continue;
    const property = declaration.slice(0, colon).trim().toLowerCase();
    const value = declaration.slice(colon + 1).trim();
    if (!property || !value) continue;
    const allowed =
      ALLOWED_STYLE_PROPERTIES.has(property) ||
      (extraProperties?.has(property) ?? false) ||
      ALLOWED_STYLE_PROPERTY_PREFIXES.some((prefix) => property === prefix || property.startsWith(prefix + "-")) ||
      (property === "--md-code-line-number-width" && /^\d+(?:\.\d+)?(?:px|em|rem|ch)$/.test(value));
    if (!allowed || /\\|\/\*|\*\//.test(value) || FORBIDDEN_STYLE_VALUE_PATTERN.test(value)) continue;
    // position 的取值单独约束（fixed/sticky 可覆盖整页 UI）。
    if (
      property === "position" &&
      !ALLOWED_POSITION_VALUES.has(value.toLowerCase())
    ) {
      continue;
    }
    kept.push(`${property}: ${value}`);
  }
  return kept.join("; ");
}
