// 临时工具：枚举 KaTeX renderToString 产物中实际出现的内联 style 属性，
// 用于校验 markdown-config.ts 的 KaTeX 受限样式白名单覆盖面。
const katex = require(process.cwd() + "/node_modules/katex/dist/katex.min.js");
const formulas = [
  String.raw`x^2`,
  String.raw`\frac{a}{b}`,
  String.raw`\sqrt[n]{x}`,
  String.raw`x_i^j`,
  String.raw`\sum_{i=1}^n i`,
  String.raw`\begin{pmatrix} a & b \\ c & d \end{pmatrix}`,
  String.raw`\begin{aligned} x &= 1 \\ y &= 2 \end{aligned}`,
  String.raw`\int_0^1 f(x)dx`,
  String.raw`\overline{AB}`,
  String.raw`\underbrace{x}_{y}`,
  String.raw`\left(\dfrac{1}{2}\right)`,
  String.raw`\mathbb{R}`,
  String.raw`\alpha\beta`,
  String.raw`\xlongequal{abc}`,
  String.raw`\\[0.5em]`,
  String.raw`\color{red}x`,
  String.raw`\text{中文}`,
  String.raw`\substack{a \\ b}`,
  String.raw`\overset{a}{b}`,
  String.raw`\phantom{xx}`,
  String.raw`\begin{cases} a & b \end{cases}`,
  String.raw`\xrightarrow{a}`,
  String.raw`\widehat{x}`,
  String.raw`\cancel{x}`,
  String.raw`\begin{array}{c|c} a & b \end{array}`,
];
const props = new Map();
const posValues = new Set();
for (const f of formulas) {
  for (const mode of [false, true]) {
    try {
      const html = katex.renderToString(f, {
        displayMode: mode,
        throwOnError: false,
      });
      for (const m of html.matchAll(/style="([^"]*)"/g)) {
        for (const decl of m[1].split(";")) {
          const i = decl.indexOf(":");
          if (i === -1) continue;
          const p = decl.slice(0, i).trim().toLowerCase();
          const v = decl.slice(i + 1).trim();
          if (!p) continue;
          props.set(p, (props.get(p) || 0) + 1);
          if (p === "position") posValues.add(v);
        }
      }
    } catch (e) {
      console.log("ERR", JSON.stringify(f), String(e).slice(0, 60));
    }
  }
}
console.log([...props.keys()].sort().join("\n"));
console.log("position values:", [...posValues].join(", "));
