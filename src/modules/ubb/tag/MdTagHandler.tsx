import * as React from "react";
import * as Ubb from "../engine/Core";
import { MarkdownView } from "@foundation/integrations/markdown";
import styles from "./MdTagHandler.module.scss";

/**
 * 提供对 [md] 标签的解析：在 UBB 内容中嵌入 Markdown。
 * 渲染复用统一的 Markdown 管线（与帖子展示、编辑器预览一致）。
 */
export class MdTagHandler extends Ubb.TextTagHandler {
  get supportedTagNames(): string {
    return "md";
  }

  execCore(
    content: string,
    _tagData: Ubb.UbbTagData,
    context: Ubb.UbbCodeContext
  ): React.ReactNode {
    const { allowMarkDown } = context.options;
    if (!allowMarkDown) return <div>{content}</div>;
    return (
      <div className={styles.markdown}>
        <MarkdownView content={content} />
      </div>
    );
  }
}