// 数学公式解析自检：直接用 Vditor 自带的 Lute 引擎，把一段 Markdown
// 解析成 IR DOM，再统计行内公式 / 公式块 / 代码块的数量，并做一次
// DOM→Markdown 往返回归（源码必须原样保留）。
//
//   node scripts/check-math.cjs
//
// 只依赖 node_modules 里的 vditor：不需要浏览器，也不启动 dev server。
// 覆盖需求文档「验收测试」中所有由 Markdown 语法决定的行为；渲染与
// 交互（光标进出、点击定位、撤销重做）由浏览器 harness 覆盖。
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
require(path.join(repoRoot, "node_modules/vditor/dist/js/lute/lute.min.js"));

const Lute = globalThis.Lute;
if (!Lute) {
  console.error("未能加载 Lute（node_modules/vditor/dist/js/lute/lute.min.js）");
  process.exit(1);
}

const lute = Lute.New();

const parse = (markdown) => {
  const dom = lute.Md2VditorIRDOM(markdown);
  const count = (needle) => (dom.match(new RegExp(needle, "g")) ?? []).length;
  // 注意：公式块节点里 data-type="math-block" 会出现多次（节点自身的 div、
  // 源码 code、预览 div），所以只数源码那个 code；行内代码的 data-type="code"
  // 又是 "code-block" 的前缀，需要相减。
  const codeBlock = count('data-type="code-block"');
  return {
    dom,
    inlineMath: count('data-type="math-inline"'),
    mathBlock: count('<code data-type="math-block"'),
    codeBlock,
    inlineCode: count('data-type="code"') - codeBlock,
  };
};

let failed = 0;
const check = (name, markdown, expect) => {
  const got = parse(markdown);
  const problems = [];
  for (const key of ["inlineMath", "mathBlock", "codeBlock", "inlineCode"]) {
    if (expect[key] !== undefined && got[key] !== expect[key]) {
      problems.push(`${key}=${got[key]}（期望 ${expect[key]}）`);
    }
  }
  if (problems.length === 0) {
    console.log(`  ✓ ${name}`);
  } else {
    failed += 1;
    console.log(`  ✗ ${name}\n      ${problems.join("；")}\n      DOM: ${got.dom.slice(0, 240)}`);
  }
};

console.log("行内公式");
check("$x^2$", "圆的面积为 $x^2$。", { inlineMath: 1, mathBlock: 0 });
check("一行多个行内公式", "$a$ 与 $b$ 与 $c$", { inlineMath: 3, mathBlock: 0 });
check("相邻行内公式", "$a$$b$", { inlineMath: 2, mathBlock: 0 });
check("不完整的 $x^2", "$x^2", { inlineMath: 0, mathBlock: 0 });
check("金额 $5 与 $10", "价格是 $5 和 $10", { inlineMath: 0 });
check("转义的 \\$", "价格是 \\$5 不是公式", { inlineMath: 0 });

console.log("公式块");
check("单行 $$E=mc^2$$", "$$E=mc^2$$", { mathBlock: 1, inlineMath: 0 });
check("三行公式块", "$$\nE=mc^2\n$$", { mathBlock: 1 });
check(
  "多行 aligned",
  "$$\n\\begin{aligned}\na+b &= c \\\\\nx+y &= z\n\\end{aligned}\n$$",
  { mathBlock: 1 }
);
check("空公式块", "$$\n\n$$", { mathBlock: 1 });
check("公式块前后有正文", "前\n\n$$\na\n$$\n\n后", { mathBlock: 1 });

console.log("代码上下文（不应识别为公式）");
check("围栏代码块里的 $x$", "```\n$x$\n$$\ny\n$$\n```", {
  inlineMath: 0,
  mathBlock: 0,
  codeBlock: 1,
});
check("行内代码里的 $x$", "`$x$`", { inlineMath: 0, mathBlock: 0, inlineCode: 1 });

console.log("往返（源码必须保持不变）");
const stable = (name, markdown) => {
  const back = lute.VditorIRDOM2Md(lute.Md2VditorIRDOM(markdown));
  const ok = back.trim() === markdown.trim();
  console.log(ok ? `  ✓ ${name}` : `  ✗ ${name}\n      往返后: ${JSON.stringify(back)}`);
  if (!ok) failed += 1;
};
stable("行内公式往返", "圆的面积为 $S=\\pi r^2$。");
{
  const image = "![原图](https://example.com/image.png)";
  const dom = lute.Md2VditorIRDOM(image);
  const preview = dom.replace('class="vditor-ir__node" data-type="img"',
    'class="vditor-ir__node cc98-img-expanded vditor-ir__node--expand" data-type="img"');
  const ok = lute.VditorIRDOM2Md(preview).trim() === image;
  console.log(ok ? "  ✓ 图片预览 class 不改变 Markdown" : "  ✗ 图片预览 class 改变了 Markdown");
  if (!ok) failed += 1;
  const localPreview = dom.replace('<img src="https://example.com/image.png"', '<img src="blob:http://cc98.test/original-file"');
  const localOk = lute.VditorIRDOM2Md(localPreview).trim() === image;
  console.log(localOk ? "  ✓ 本地原图预览不写入 Markdown" : "  ✗ 本地预览地址泄漏到 Markdown");
  if (!localOk) failed += 1;
}
stable("公式块往返", "$$\nE=mc^2\n$$");
stable("多行 aligned 往返", "$$\n\\begin{aligned}\na+b &= c \\\\\nx+y &= z\n\\end{aligned}\n$$");

console.log("");
if (failed > 0) {
  console.log(`${failed} 项未通过`);
  process.exit(1);
}
console.log("全部通过");
