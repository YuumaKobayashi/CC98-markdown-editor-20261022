/** Repair only the forum's old quote header; never normalize arbitrary Markdown. */
export function preprocessLegacyMarkdown(content: string): string {
  let fence: { marker: string; length: number } | null = null;
  let quotePrefix: string | null = null;
  return content.split("\n").map((line, index, lines) => {
    // Recognize fences inside blockquotes too. Original lines and CRLF stay intact.
    const source = line.replace(/\r$/, "");
    const quoted = /^( {0,3}(?:> ?)+)(.*)$/.exec(source);
    const body = quoted ? quoted[2] : source;
    const fenceBody = body.replace(/^ {0,3}(?:[-+*]|\d+[.)])[ \t]+/, "");
    const opening = /^ {0,3}(`{3,}|~{3,})(.*)$/.exec(fenceBody);
    if (fence) {
      if (opening && opening[1][0] === fence.marker &&
          opening[1].length >= fence.length && /^\s*$/.test(opening[2])) fence = null;
      return line;
    }
    if (opening && (opening[1][0] !== "`" || !opening[2].includes("`"))) {
      fence = { marker: opening[1][0], length: opening[1].length };
      quotePrefix = null;
      return line;
    }
    if (/^(?: {4}|\t)/.test(line)) { quotePrefix = null; return line; }
    if (quoted) {
      if (/^\*\*以下是引用.+的发言：\*\*\s*$/.test(body)) {
        quotePrefix = quoted[1];
        const next = lines[index + 1];
        // Separate the legacy header and body inside the same blockquote.
        // Do not add another separator when processing the result a second time.
        if (next?.trim() && !/^ {0,3}(?:> ?)+\s*$/.test(next) &&
            !/^ {0,3}(?:#{1,6}(?:\s|$)|[-+*]\s|\d+[.)]\s|`{3,}|~{3,}|<)/.test(next)) {
          return `${line}\n${quotePrefix}${line.endsWith("\r") ? "\r" : ""}`;
        }
      }
      return line;
    }
    // A blank line or a new block ends legacy lazy continuation.
    if (!line.trim() || /^ {0,3}(?:#{1,6}(?:\s|$)|[-+*]\s|\d+[.)]\s|(?:[-*_]\s*){3,}$|<)/.test(line)) {
      quotePrefix = null;
    }
    return quotePrefix ? `${quotePrefix}${line}` : line;
  }).join("\n");
}
