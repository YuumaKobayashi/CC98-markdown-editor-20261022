import * as React from "react";
import { MdPreview } from "md-editor-rt";
import "md-editor-rt/lib/preview.css";

import { sanitizeHtml } from "./markdown-config";
import { preprocessLegacyMarkdown } from "./markdown-preprocess";
import styles from "./markdown.module.scss";

export interface MarkdownViewProps {
  /** 原始 Markdown 文本。 */
  content: string;
  /** 覆盖默认生成的实例 id（多实例场景由调用方保证唯一）。 */
  id?: string;
  className?: string;
}

let nextViewId = 0;

/**
 * 统一的 Markdown 展示组件。
 * 帖子渲染（TopicReplyContent）、UBB [md] 标签（MdTagHandler）与
 * 编辑器预览共用同一套 md-editor-rt 管线，配置见 markdown-config.ts。
 */
export function MarkdownView({ content, id, className }: MarkdownViewProps) {
  const [viewId] = React.useState(
    () => id ?? `cc98-md-view-${(nextViewId += 1)}`
  );
  const containerRef = React.useRef<HTMLDivElement>(null);

  // 行间公式宽度超过正文栏宽时无法呈现居中观感（内容放不下，左右无
  // 留白）。这里把超出栏宽 90% 的公式按比例整体缩小到目标宽度，并向
  // 两侧居中；缩放后仍低于 0.5 倍的超长公式不缩放（字形过小难读），
  // 维持原有的横向滚动查看方式。KaTeX 脚本异步加载完成后 md-editor-rt
  // 会重绘 DOM，因此用 MutationObserver 在每次 DOM 变化后重新测量。
  // 注意 transform 不改变布局宽度，缩放后的视觉居中需要用 translateX
  // 补偿（transform-origin 无法让单侧溢出的内容居中）。
  React.useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const fitKatexDisplay = () => {
      root.querySelectorAll<HTMLElement>(".katex-display").forEach((el) => {
        const inner = el.firstElementChild as HTMLElement | null;
        if (!inner) return;
        const naturalWidth = inner.scrollWidth;
        const containerWidth = el.clientWidth;
        const target = containerWidth * 0.9;
        const ratio = target / naturalWidth;
        // 比例低于 0.5（超长公式）不缩放，字形过小难读，保持横向滚动。
        const shouldShrink = naturalWidth > containerWidth && ratio >= 0.5;
        let transform = "";
        if (shouldShrink) {
          const offsetX = (containerWidth - naturalWidth * ratio) / 2;
          transform = `translateX(${offsetX}px) scale(${ratio})`;
        }
        if (inner.style.transform !== transform) {
          inner.style.transform = transform;
          inner.style.transformOrigin = "left top";
        }
        const overflowX = shouldShrink ? "hidden" : "";
        if (el.style.overflowX !== overflowX) {
          el.style.overflowX = overflowX;
        }
      });
    };

    fitKatexDisplay();
    const observer = new MutationObserver(fitKatexDisplay);
    observer.observe(root, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [content]);

  return (
    <div ref={containerRef} className={`${styles.view}${className ? ` ${className}` : ""}`}>
      <MdPreview
        id={viewId}
        value={preprocessLegacyMarkdown(content)}
        previewTheme="default"
        sanitize={sanitizeHtml}
        noMermaid
        noEcharts
        showCodeRowNumber
      />
    </div>
  );
}