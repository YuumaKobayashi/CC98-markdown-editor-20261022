import * as React from "react";
import * as Ubb from "../engine/Core";
import { ensureKatex } from "@foundation/integrations/markdown";

/**
 * 提供对 [math] 和 [m] 标签的解析。
 * [m] 为内联公式，[math] 为独立成行的展示公式。
 * 渲染基于按需加载的自托管 KaTeX（与 Markdown 预览共用同一份资源），
 * 加载或解析失败时回退为原始文本，不阻断楼层渲染。
 */
export class MathTagHandler extends Ubb.TextTagHandler {
  get supportedTagNames(): string[] {
    return ["math", "m"];
  }

  execCore(
    innerContent: string,
    tagData: Ubb.UbbTagData,
    _context: Ubb.UbbCodeContext
  ): React.ReactNode {
    // m 为内联模式，math 为完整模式
    const inlineMode = tagData.tagName === "m";
    return <MathFormula inline={inlineMode} math={innerContent} />;
  }
}

interface MathFormulaProps {
  math: string;
  inline: boolean;
}

function MathFormula({ math, inline }: MathFormulaProps) {
  const [html, setHtml] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    setHtml(null);
    ensureKatex()
      .then((katex) => {
        const rendered = katex.renderToString(math, {
          displayMode: !inline,
          throwOnError: false,
          strict: false,
          trust: false,
        });
        if (!cancelled) setHtml(rendered);
      })
      .catch(() => {
        // 加载失败时保留原始文本展示。
      });
    return () => {
      cancelled = true;
    };
  }, [math, inline]);

  if (html === null) {
    return inline ? <span>{math}</span> : <div>{math}</div>;
  }
  return inline ? (
    <span dangerouslySetInnerHTML={{ __html: html }} />
  ) : (
    <div dangerouslySetInnerHTML={{ __html: html }} />
  );
}