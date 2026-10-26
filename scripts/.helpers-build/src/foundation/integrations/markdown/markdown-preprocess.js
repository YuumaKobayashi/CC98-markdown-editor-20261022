"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.preprocessLegacyMarkdown = preprocessLegacyMarkdown;
/**
 * 旧帖兼容预处理。
 *
 * 历史上部分帖子（旧版引用模板）的 Markdown 引用块缺少空行分隔与行首
 * ">"，旧版 showdown 渲染路径会把引用头与正文割裂。这里只在**可识别的
 * 历史引用模板**内补齐，避免改写现代 Markdown 与代码内容：
 *
 *   - 历史引用头：以 ">" 开头且含「发言：**」的行。只有识别到历史头时，
 *     其后连续的非空行才视为旧数据补 ">"——普通引用（如 `> quote`）后
 *     面的独立列表、段落保持原样；
 *   - 围栏代码块（``` / ~~~）内的内容原样保留：闭合围栏要求同字符、
 *     长度不小于开栏**且标记之后只剩空白**（```not-a-close 这类行是
 *     围栏内容，不是闭合栏）；「发言：**」模板也只在非围栏行应用；
 *   - 标题行是块级边界，终止历史引用块（CommonMark 不允许标题被 lazy
 *     continuation 吸收）；
 *   - 「发言：**」行尾缺空行时补一行空行，后面已是空行（或文档尾）时
 *     不补——负向前瞻等价的行内写法，幂等且天然支持 CRLF。
 *
 * 逐行替换不吞任何分隔字符，整体幂等。本函数仅作用于展示，不回写存储。
 */
function preprocessLegacyMarkdown(content) {
    const lines = content.split("\n");
    const out = [];
    let inFence = false;
    let fenceMarker = "";
    let inLegacyQuote = false;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const fenceMatch = /^ {0,3}(`{3,}|~{3,})/.exec(line);
        if (inFence) {
            out.push(line);
            // 闭合围栏：同字符、长度不小于开栏，且标记之后只剩空白。
            if (fenceMatch &&
                fenceMatch[1][0] === fenceMarker[0] &&
                fenceMatch[1].length >= fenceMarker.length &&
                /^\s*$/.test(line.slice(fenceMatch.index + fenceMatch[1].length))) {
                inFence = false;
            }
            continue;
        }
        if (fenceMatch) {
            inFence = true;
            fenceMarker = fenceMatch[1];
            inLegacyQuote = false;
            out.push(line);
            continue;
        }
        if (/^ {0,3}>/.test(line)) {
            // 历史引用头识别（见函数头注释）。
            inLegacyQuote = /发言：\s*\*\*/.test(line);
            out.push(line);
            continue;
        }
        if (inLegacyQuote && /^ {0,3}#{1,6} /.test(line)) {
            inLegacyQuote = false;
            out.push(line);
            continue;
        }
        if (inLegacyQuote && line.trim() !== "") {
            out.push(`>${line}`);
            continue;
        }
        // 「发言：**」行尾模板（非围栏行）：其后缺空行则补；下一行已是空行
        // 且后面还有内容时不补，保证幂等。CRLF 的 \r 保留在行尾，行为与 LF
        // 一致；文档末尾的发言行（含尾随换行/无尾随换行）都补。
        if (/发言：\*\*\s*$/.test(line)) {
            out.push(line);
            const next = lines[i + 1];
            const nextIsTrailingEmpty = i + 1 === lines.length - 1 && next !== undefined && next.trim() === "";
            if (next === undefined || nextIsTrailingEmpty || next.trim() !== "") {
                out.push("");
            }
            continue;
        }
        inLegacyQuote = false;
        out.push(line);
    }
    return out.join("\n");
}
