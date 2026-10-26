/**
 * Markdown 编辑器纯函数回归测试（由 run-markdown-tests.cjs 编译执行，兼容 Node 20）。
 * 覆盖：历史引用预处理（M02）、内联样式白名单（M01）、上传片段生成与转义（M07）。
 */
import { preprocessLegacyMarkdown } from "../src/foundation/integrations/markdown/markdown-preprocess.ts";
import { filterInlineStyle, KATEX_EXTRA_STYLE_PROPERTIES } from "../src/foundation/integrations/markdown/style-sanitize.ts";
import { buildFileMarkdown } from "../src/foundation/integrations/markdown/file-fragment.ts";

let passed = 0;
let failed = 0;

function check(name: string, actual: unknown, expected: unknown) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a === e) {
    passed += 1;
    console.log(`  ✓ ${name}`);
  } else {
    failed += 1;
    console.log(`  ✗ ${name}\n      期望 ${e}\n      实际 ${a}`);
  }
}

console.log("M02/R02 历史引用预处理：");
{
  // R02 用例 A：代码块正文逐字符保留（含 "> example" 与"发言"模板文字）
  const codeBlock = "```text\n> example\nplain\n\n```\n";
  check("代码块内 > 行保持原样", preprocessLegacyMarkdown(codeBlock), codeBlock);
  const codeBlock2 = "```text\n发言：**\nnext\n```\n";
  check("代码块内发言模板不加空行", preprocessLegacyMarkdown(codeBlock2), codeBlock2);
  // R02 用例 B：非闭合围栏（伪闭合行）不得提前结束代码保护
  const pseudoClose = "```text\n```not-a-close\n> example\nplain\n```\n";
  check("伪闭合行不结束围栏保护", preprocessLegacyMarkdown(pseudoClose), pseudoClose);
  // R02 用例 C：现代引用后的独立列表不被拉进引用
  check(
    "现代引用后列表不补前缀",
    preprocessLegacyMarkdown("> quote\n- outside\n"),
    "> quote\n- outside\n"
  );
  // 历史模板正向样例：历史头（含"发言："）之后的缺前缀行补 ">"
  check(
    "历史引用头后的行补 >",
    preprocessLegacyMarkdown(">**以下是引用1楼：用户甲在2026-10-26的发言：**\n内容行\n"),
    ">**以下是引用1楼：用户甲在2026-10-26的发言：**\n>\n>内容行\n"
  );
  check(
    "文档以引用开头同样补齐",
    preprocessLegacyMarkdown(">**以下是引用1楼：用户甲在2026-10-26的发言：**\n内容\n\n正文"),
    ">**以下是引用1楼：用户甲在2026-10-26的发言：**\n>\n>内容\n\n正文"
  );
  // 幂等：重复处理不叠加
  const once = preprocessLegacyMarkdown(">**以下是引用1楼：用户甲在2026-10-26的发言：**\n引用内容\n");
  check("幂等：二次处理不变", preprocessLegacyMarkdown(once), once);
  // 波浪线围栏
  const tilde = "~~~text\n> example\nplain\n~~~\n";
  check("波浪线围栏内保持原样", preprocessLegacyMarkdown(tilde), tilde);
  // 引用后直接跟标题：标题终止引用块且不补前缀
  check(
    "标题行终止引用块",
    preprocessLegacyMarkdown(">**以下是引用1楼：用户甲在2026-10-26的发言：**\n# heading\n"),
    ">**以下是引用1楼：用户甲在2026-10-26的发言：**\n# heading\n"
  );
  // CRLF 行尾不影响补前缀
  check(
    "CRLF 行尾正常处理",
    preprocessLegacyMarkdown(">**以下是引用1楼：用户甲在2026-10-26的发言：**\r\n内容\r\n"),
    ">**以下是引用1楼：用户甲在2026-10-26的发言：**\r\n>\r\n>内容\r\n"
  );
  // "发言：**" 行尾模板补空行（幂等：后面已有空行不补）
  check("裸模板文本不改写", preprocessLegacyMarkdown("发言：**\n"), "发言：**\n");
  check("发言模板后已有空行不重复补", preprocessLegacyMarkdown("发言：**\n\n"), "发言：**\n\n");
}

console.log("M01 内联样式白名单：");
{
  // 通用白名单：排版类保留
  check(
    "通用排版样式保留",
    filterInlineStyle("color: red; width: 100px"),
    "color: red; width: 100px"
  );
  // 危险属性剔除
  check(
    "非白名单属性剔除",
    filterInlineStyle("position: fixed; z-index: 9; inset: 0"),
    ""
  );
  // url() 表达式拒绝
  check("url() 值拒绝", filterInlineStyle("background: url(https://x)"), "");
  // 伪造 .katex class 的 style 走附加白名单：定位属性受限
  const forged = filterInlineStyle(
    "position: fixed; inset: 0; z-index: 2147483647; background: white",
    KATEX_EXTRA_STYLE_PROPERTIES
  );
  check("伪造 katex 拿不到 fixed/inset/z-index/背景", forged, "");
  // KaTeX 真实产物（枚举到的属性与取值）全部保留
  const katexReal = filterInlineStyle(
    "height: 1.2em; vertical-align: -0.3em; position: relative; top: -0.25em; margin-left: -0.06em; border-bottom-width: 0.04em",
    KATEX_EXTRA_STYLE_PROPERTIES
  );
  check(
    "KaTeX 真实排版样式保留",
    katexReal,
    "height: 1.2em; vertical-align: -0.3em; position: relative; top: -0.25em; margin-left: -0.06em; border-bottom-width: 0.04em"
  );
  // position 值校验：fixed/sticky 拒绝，absolute/relative 放行
  check(
    "position:fixed 拒绝",
    filterInlineStyle("position: fixed", KATEX_EXTRA_STYLE_PROPERTIES),
    ""
  );
  check(
    "position:absolute 放行",
    filterInlineStyle("position: absolute", KATEX_EXTRA_STYLE_PROPERTIES),
    "position: absolute"
  );
  // data URI 里的分号不被误分割（括号感知）；属性名在白名单内即保留，
  // 无效值交由浏览器 CSS 解析器忽略。
  check(
    "括号内分号不分割",
    filterInlineStyle("background-color: rgb(1, 2; 3)"),
    "background-color: rgb(1, 2; 3)"
  );
}

console.log("M07 上传片段生成：");
{
  const file = (name: string, type = "image/png") =>
    new File(["x"], name, { type });
  // 普通图片
  check(
    "普通图片片段",
    buildFileMarkdown(file("pic.png"), "https://a.cc98.org/pic.png"),
    "![pic.png](<https://a.cc98.org/pic.png>)"
  );
  // 文件名含方括号：转义后仍是一个完整链接
  const bracket = buildFileMarkdown(file("a[b].png"), "https://a.cc98.org/x.png");
  check("方括号文件名转义", bracket, "![a\\[b\\].png](<https://a.cc98.org/x.png>)");
  // 文件名含反斜杠
  const bs = buildFileMarkdown(file("a\\b.png"), "https://a.cc98.org/x.png");
  check("反斜杠文件名转义", bs, "![a\\\\b.png](<https://a.cc98.org/x.png>)");
  // URL 含括号与空格：尖括号目标形式不被截断
  const parens = buildFileMarkdown(file("r.png"), "https://a.cc98.org/a(1).png");
  check("URL 括号不截断", parens, "![r.png](<https://a.cc98.org/a(1).png>)");
  // 不安全协议拒绝（返回空串 = 上传失败提示）
  check(
    "javascript: 协议拒绝",
    buildFileMarkdown(file("x.png"), "javascript:alert(1)"),
    ""
  );
  // 附件链接文字转义
  check(
    "附件链接文字转义",
    buildFileMarkdown(file("report].txt", "text/plain"), "https://a.cc98.org/r.txt"),
    "[report\\].txt](<https://a.cc98.org/r.txt>)"
  );
  // 音视频：HTML 属性转义（引号无法逃逸 src 属性）
  const video = buildFileMarkdown(file("v.mp4", "video/mp4"), 'https://a.cc98.org/v.mp4?x="1"');
  check(
    "视频 src 属性转义",
    video,
    '<video src="https://a.cc98.org/v.mp4?x=&quot;1&quot;" controls="controls"></video>'
  );
}

console.log("补充边界回归：");
{
  check("CC98 文件地址升级 HTTPS", buildFileMarkdown(new File(["x"], "a.jpg", { type: "image/jpeg" }),
    "http://file.cc98.org/v2/a.jpg"), "![a.jpg](<https://file.cc98.org/v2/a.jpg>)");
  check("不改写相似域名", buildFileMarkdown(new File(["x"], "a.jpg", { type: "image/jpeg" }),
    "http://file.cc98.org.example.com/a.jpg"), "![a.jpg](<http://file.cc98.org.example.com/a.jpg>)");
  const header = ">**以下是引用1楼：用户甲在2026-10-26的发言：**";
  for (const source of [
    `\`\`\`\`text\n\`\`\`\n${header}\ncode\n\`\`\`\``,
    `> \`\`\`text\n${header}\ncode\n> \`\`\``,
    `- \`\`\`text\n${header}\ncode\n  \`\`\``,
    `    ${header}\n    code`,
    `~~~text\r\n${header}\r\ncode\r\n~~~`,
  ]) check("代码上下文不修复历史头", preprocessLegacyMarkdown(source), source);
  const repaired = preprocessLegacyMarkdown(`${header}\n>already quoted\ncontinued\n\nend`);
  check("历史模板混合已引用/缺前缀行", repaired, `${header}\n>\n>already quoted\n>continued\n\nend`);
  check("历史引用分段幂等", preprocessLegacyMarkdown(repaired), repaired);
  check("CSS 转义 URL 拒绝", filterInlineStyle(String.raw`border-image-source: u\72l(https://example.com)`), "");
  check("任意 CSS 变量拒绝", filterInlineStyle("--arbitrary: fixed"), "");
  check("行号宽度变量保留", filterInlineStyle("--md-code-line-number-width: 2em"), "--md-code-line-number-width: 2em");
  check("URL 换行拒绝", buildFileMarkdown(new File(["x"], "a.txt"), "https://example.com/a\nb"), "");
}
console.log(`\n结果：${passed} 通过，${failed} 失败`);
if (failed) process.exitCode = 1;
