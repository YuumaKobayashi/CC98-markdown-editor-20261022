/**
 * 「暂缓还原」的开关：工具栏插入公式块、外部回写 value 这类动作会合法地
 * 产生一个空公式块，此时不能把用户/代码刚建好的块又拆回 `$$`。
 * 用开关而不是时间窗——时间窗会在插入后的一次重渲染上漏掉，反而把块拆了。
 * 下一次真实输入（input 事件）会自动解除。
 */

/**
 * 公式/代码围栏还原逻辑的可变状态。这些状态必须**每个编辑器实例一份**：
 * 挂在模块级变量上时，同页多实例会互相重置基线、覆盖重置回调、共享"暂缓"
 * 开关（M05）。由 React 渲染期初始化的 ref 持有，随组件实例销毁。
 */
export interface RepairState {
  /** 公式还原的「暂缓」开关：工具栏建块时置位，真实键盘输入解除。 */
  repairHeld: boolean;
  /** 代码围栏还原的「暂缓」开关，语义与 repairHeld 同构。 */
  codeRepairHeld: boolean;
  /** 输入瞬间快照：光标前/后各有几个 `$`。 */
  dollarsBeforeCaret: number;
  dollarsAfterCaret: number;
  /** 输入瞬间光标所在段落里是否已有字面量 `$$`（此前已被还原过一轮）。 */
  pendingSpanAtCaret: boolean;
  /**
   * 上一轮扫描时的公式块数量，用于判定「新块」。-1 表示基线未知（粘贴、
   * 撤销、回车、外部换稿之后还没扫过），此时不判定，只重建基线。
   */
  lastMathBlockCount: number;
  /** 代码围栏还原的基线，语义与 lastMathBlockCount 同构。 */
  lastCodeBlockCount: number;
  /** 工具栏建块时调用的重置回调（由 guard 挂载时安装）。 */
  resetMathTyping: (() => void) | null;
  resetCodeTyping: (() => void) | null;
}

export function createRepairState(): RepairState {
  return {
    repairHeld: false,
    codeRepairHeld: false,
    dollarsBeforeCaret: 0,
    dollarsAfterCaret: 0,
    pendingSpanAtCaret: false,
    lastMathBlockCount: -1,
    lastCodeBlockCount: -1,
    resetMathTyping: null,
    resetCodeTyping: null,
  };
}

/**
 * 把「Lute 自动展开的公式块」还原成字面量 `$`，对齐 Obsidian Live Preview
 * 的公式输入方式。第一原则：输入一个 `$`，文档只多一个 `$`——空行上连续敲
 * 四个 `$` 必须依次得到 `$|`、`$$|`、`$$$|`、`$$$$|`，任何阶段都不能变成
 * 不可继续编辑的公式组件，也不能拦下第 3、4 个 `$`。
 *
 * 行首出现 `$$` 时 Lute 会立刻把它当公式块起始：自动补上收尾 `$$`、把本行
 * 余下的文字全部吸进块里、展开块组件。这与上面的原则冲突，所以对「刚诞生
 * 的块」（数量比上一轮多）按输入瞬间的快照（dollarsBeforeCaret 等，在
 * Lute 重渲染前捕获——渲染后自动补的收尾和亲手敲的收尾在 DOM 里长得一模
 * 一样）逐条判定：
 *
 *   1. 正文只有 `$`（或空白）→ 连敲定界符的中间态（`$$`/`$$$`/`$$$$`/…），
 *      还原成字面量，光标跟在末尾；
 *   2. 输入前光标两侧各有 ≥2 个 `$`（`$$|$$`）→ 定界符已闭合，往中间输入
 *      正文就是完整公式块，放行成块（块内保留源码并实时预览）；
 *   3. 输入前光标前不足 2 个 `$` → 行首定界符还没凑成一对，本行文字是被
 *      Lute 吸进去的，还原成字面量 `$$正文`，原文字一字不动；
 *   4. 正文以 `$` 结尾 → 收尾没敲完（Lute 把多出来的 `$` 留在正文里），
 *      还原成字面量；
 *   5. 其余（在 `$$` 后面接着敲正文等）→ 按 Markdown 解析结果渲染成块，
 *      不干预输入；块内可继续编辑，敲满收尾 `$$` 即闭合。
 *
 * 已存在的块（数量没增加）是输入者正在编辑的工作现场，绝不动。走 DOM 层
 * 是因为 Lute 没有关闭「空 `$$` 自动展开」的开关（已核对 lute.min.js）。
 * 还原后 DOM 对应的 Markdown 与 Vditor 上报的那份可能不一致，调用方据此
 * 把新的 Markdown 重新抛给 onChange。
 */
/**
 * 数编辑区里「真正的」公式块。不能直接数 `div[data-type="math-block"]`：
 * 每个块的预览层（.vditor-ir__preview）内部还有一层同名 div，一个块会被
 * 数成两个。
 */
function countMathBlocks(root: HTMLElement): number {
  return Array.from(
    root.querySelectorAll<HTMLElement>('div[data-type="math-block"]')
  ).filter((block) => !block.closest(".vditor-ir__preview")).length;
}

function repairBareMathPair(root: HTMLElement, state: RepairState): boolean {
  const blocks = Array.from(
    root.querySelectorAll<HTMLElement>('div[data-type="math-block"]')
  ).filter((block) => !block.closest(".vditor-ir__preview"));
  // 暂缓还原的轮次只重建「新块」基线，让下一轮有个可比对的起点。
  if (state.repairHeld) {
    state.lastMathBlockCount = blocks.length;
    return false;
  }
  const newborn =
    state.lastMathBlockCount >= 0 && blocks.length > state.lastMathBlockCount;
  let repaired = false;
  const selection = window.getSelection();
  const anchor = selection?.anchorNode ?? null;
  // 标记已就绪（`$$`/`$$`）的块才计入基线：块刚诞生的一两轮里标记可能还没
  // 渲染好，这时不能把它记进基线，否则下一轮就不再是「新块」、永远得不到还原。
  const recognizedCount = blocks.filter((block) => {
    const open = block.querySelector('[data-type="math-block-open-marker"]');
    const close = block.querySelector('[data-type="math-block-close-marker"]');
    return open?.textContent === "$$" && close?.textContent === "$$";
  }).length;
  for (const block of blocks) {
    const open = block.querySelector('[data-type="math-block-open-marker"]');
    const close = block.querySelector('[data-type="math-block-close-marker"]');
    if (open?.textContent !== "$$" || close?.textContent !== "$$") continue;
    const code = block.querySelector('code[data-type="math-block"]');
    const body = code?.textContent ?? "";
    // 只有光标本来就在这个块里时才接管光标；否则说明是 Vditor 在后台按旧
    // 的 Markdown 重渲染出来的块，用户此刻正在别处打字。
    const caretInside = !!anchor && block.contains(anchor);
    // 光标在块正文里的位置：0 = 正文开头（正文多半是被 Lute 吸进来的，
    // 不是输入者敲的），>0 = 输入者刚把字符敲进正文。
    let caretInBody = 0;
    if (caretInside && code?.contains(anchor) && anchor?.nodeType === Node.TEXT_NODE) {
      caretInBody = selection?.anchorOffset ?? 0;
    }
    if (!newborn) continue;
    const dollarish = /^\s*\$*\s*$/.test(body);
    // 规则 2：输入前光标两侧各有 ≥2 个 `$`（`$$|$$` 中间输入）——定界符
    // 已闭合，这是完整公式块，放行（块内保留源码并实时预览）。
    if (!dollarish && state.dollarsBeforeCaret >= 2 && state.dollarsAfterCaret >= 2) {
      continue;
    }
    // 规则 5：段落里已是还原出来的 `$$` 字面量（span 在场，说明上一轮就是
    // 字面量状态），在其后接着敲正文——按 Markdown 解析结果渲染，不干预
    // 输入。刚被 Lute 吸进正文的段落没有这个 span，走下面的还原。
    if (
      !dollarish &&
      state.pendingSpanAtCaret &&
      state.dollarsBeforeCaret >= 2 &&
      !body.endsWith("$")
    ) {
      continue;
    }

    const paragraph = document.createElement("p");
    const dataBlock = block.getAttribute("data-block");
    if (dataBlock !== null) paragraph.setAttribute("data-block", dataBlock);
    // 包一层 span 只为了上色：Obsidian 里连着敲 `$` 时定界符会变成强调色，
    // 一眼看出「这是公式语法」。Vditor 的 DOM→Markdown 不会把这个 span 写成
    // HTML（已验证 Markdown 仍是 `$$`…字面量），成块后整个段落会被 Lute
    // 重建，span 自然消失。
    const marker = document.createElement("span");
    marker.className = "cc98-math-pending";
    // 字面量里 `$` 的个数 = 光标所在段落里 `$` 的总数（快照取自插入后、
    // Lute 重渲染前的段落文本，正好是输入者刚敲完的进度，至少是一对定界
    // 符）；被吸进来的正文原样跟在后面。
    const run = Math.max(state.dollarsBeforeCaret + state.dollarsAfterCaret, 2);
    marker.textContent = "$".repeat(run);
    paragraph.appendChild(marker);
    let bodyText: Text | null = null;
    if (!dollarish) {
      bodyText = document.createTextNode(body);
      paragraph.appendChild(bodyText);
    }
    block.replaceWith(paragraph);

    const dollarText = marker.firstChild;
    if (caretInside && dollarText) {
      // 光标还原到输入者的自然落点：亲手敲过正文（光标在正文里且不在
      // 开头）→ 跟在正文后面；否则（只敲了 `$`，或正文是被吸进来的）→
      // 停在 `$` 与正文之间。
      const range = document.createRange();
      if (bodyText && caretInBody > 0) {
        range.setStart(bodyText, bodyText.length);
      } else {
        range.setStart(dollarText, run);
      }
      range.collapse(true);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
    repaired = true;
  }
  // 用「标记已就绪」的实际数量重建基线：还原掉的块如果被 Vditor 的迟到
  // 重渲染再次造出来，下一轮仍会判定为「新块」并再次还原，直到重渲染停止。
  state.lastMathBlockCount = recognizedCount;
  return repaired;
}

/**
 * 外部换稿（工具栏插入公式块、父组件回写 value）时放弃「新块」基线，由
 * 暂缓期间的下一轮扫描重建，避免把外部建好的块当成「刚敲出来的」拆掉。
 */
export function holdMathRepair(state: RepairState): void {
  state.repairHeld = true;
  state.codeRepairHeld = true;
  state.resetMathTyping?.();
  state.resetCodeTyping?.();
}

/**
 * 监听 IR 编辑区的输入，每次输入后检查有没有「刚敲出来的公式块」，有就按
 * Obsidian Live Preview 的规则还原成字面量 `$`（见 repairBareMathPair）。
 * 这里没有任何键盘拦截：`$`、Enter、Backspace 全部走 Vditor 原生行为，
 * 公式识别与渲染只跟随 Markdown 解析结果，绝不反过来干扰文本输入。
 * 粘贴/拖放/撤销进来的是现成内容，回车是明确的分块动作，都不还原。
 * 返回解绑函数。
 */
export function guardBareMathPair(
  root: HTMLElement,
  state: RepairState,
  onRepaired: () => void
): () => void {
  let active = true;
  let scheduled = false;
  // 新编辑区从零开始：基线在实例重挂载后已过期（重挂载后块数量不可比），
  // 置为 -1 由首轮扫描重建。
  state.lastMathBlockCount = -1;
  state.dollarsBeforeCaret = 0;
  state.dollarsAfterCaret = 0;
  state.pendingSpanAtCaret = false;

  state.resetMathTyping = () => {
    state.lastMathBlockCount = -1;
  };

  /**
   * 在 Lute 重渲染之前（捕获阶段先于 Vditor 的 input 处理，此刻文本已插入
   * DOM）记下光标两侧各有几个 `$`。这是区分「定界符是否已闭合」的唯一
   * 可靠时机，两者之和也是还原字面量的精确长度。
   */
  const snapshotCaretDollars = () => {
    state.dollarsBeforeCaret = 0;
    state.dollarsAfterCaret = 0;
    state.pendingSpanAtCaret = false;
    const selection = window.getSelection();
    const anchor = selection?.anchorNode;
    if (!anchor || !selection || selection.rangeCount === 0) return;
    const element =
      anchor.nodeType === Node.TEXT_NODE
        ? (anchor.parentElement as HTMLElement | null)
        : (anchor as HTMLElement | null);
    const paragraph = element?.closest("p");
    if (!paragraph) return;
    state.pendingSpanAtCaret = !!paragraph.querySelector(
      ":scope > .cc98-math-pending"
    );
    const text = paragraph.textContent ?? "";
    const before = document.createRange();
    before.selectNodeContents(paragraph);
    before.setEnd(anchor, selection.anchorOffset);
    const offset = before.toString().length;
    state.dollarsBeforeCaret = (text.slice(0, offset).match(/\$/g) ?? []).length;
    state.dollarsAfterCaret = (text.slice(offset).match(/\$/g) ?? []).length;
  };

  const onInput = (event: Event) => {
    const input = event as InputEvent;
    const inputType = input.inputType;
    // 粘贴/拖放是别人写好的公式块，撤销/重做是历史快照，回车（换行/分段）
    // 是明确的分块动作：都不还原，基线置为 -1 由其后的扫描重建。
    if (
      inputType === "insertFromPaste" ||
      inputType === "insertFromDrop" ||
      inputType === "insertLineBreak" ||
      inputType === "insertParagraph" ||
      inputType === "historyUndo" ||
      inputType === "historyRedo"
    ) {
      state.lastMathBlockCount = -1;
      return;
    }
    // 基线未知（刚挂载/粘贴/撤销后）时，趁 Lute 还没按这次输入重建 DOM，
    // 先按渲染前的块数量把基线立起来——否则「一次事件里提交 `$$`（输入法
    // 整段上屏）」诞生的块会因基线未知而被放过。
    if (state.lastMathBlockCount < 0) {
      state.lastMathBlockCount = countMathBlocks(root);
    }
    // 趁 DOM 还是「插入原始文本后、Lute 重渲染前」的状态抓快照。
    snapshotCaretDollars();
    // 真实的键盘/输入法输入到了，解除「暂缓还原」。
    state.repairHeld = false;
    if (scheduled) return;
    scheduled = true;
    // Vditor 的 input 处理是同步的，微任务里 DOM 已经由 Lute 重建完毕。
    queueMicrotask(() => {
      if (!active) return;
      scheduled = false;
      if (repairBareMathPair(root, state)) onRepaired();
    });
  };
  // 中文输入法：`$` 常常是随组合串一起提交的，Vditor 在 composingLock
  // 为 true 时会跳过这次输入解析，等到 compositionend 之后才重建 DOM——
  // 那时已经没有 input 事件了，所以组合结束时要再兜一次。
  const onCompositionEnd = () => {
    queueMicrotask(() => {
      if (!active) return;
      if (repairBareMathPair(root, state)) onRepaired();
    });
  };
  root.addEventListener("input", onInput, true);
  root.addEventListener("compositionend", onCompositionEnd, true);
  // 还要盯着 DOM：Vditor 的 IR 在输入之后可能自己再按 Markdown 重渲染一次
  // （Markdown 里行首 `$$` 就是公式块，重渲染必然把字面量又变成块），光靠
  // input 事件会在这种「迟到的重渲染」上翻车。MutationObserver 负责把迟到
  // 的块再拆回去（快照沿用最近一次输入的值）。
  const observer = new MutationObserver(() => {
    if (scheduled) return;
    scheduled = true;
    queueMicrotask(() => {
      if (!active) return;
      scheduled = false;
      if (repairBareMathPair(root, state)) onRepaired();
    });
  });
  observer.observe(root, { childList: true, subtree: true });
  return () => {
    active = false;
    observer.disconnect();
    root.removeEventListener("input", onInput, true);
    root.removeEventListener("compositionend", onCompositionEnd, true);
  };
}

/** 块内源码区自动补齐的对称符号（开符 → 闭符）。 */
const SYMMETRIC_PAIRS: Readonly<Record<string, string>> = {
  "(": ")",
  "[": "]",
  "{": "}",
};
/** 闭符 → 开符，用于「跳过收尾」与「空对退格」。 */
const SYMMETRIC_OPENERS: Readonly<Record<string, string>> = {
  ")": "(",
  "]": "[",
  "}": "{",
};
/**
 * 具备对称符补齐能力的源码区：代码块与公式块的可编辑源码（Vditor IR 用
 * pre.vditor-ir__marker--pre 标记，注意实际 DOM 里代码块不带
 * data-type="code-block" 属性），以及行内公式的 code。
 */
const PAIRED_CODE_SELECTOR =
  'pre.vditor-ir__marker--pre > code, code[data-type="math-inline"]';

/** 自动缩进的一级 = 四个空格（论坛代码块展示环境下最通用）。 */
const INDENT_UNIT = "    ";
/** 「行尾冒号开一级缩进」的语言（Python/YAML）。 */
const INDENT_COLON_LANGS: ReadonlySet<string> = new Set([
  "python",
  "py",
  "yaml",
  "yml",
]);
/** 「开标签开一级缩进」的标记语言。 */
const INDENT_MARKUP_LANGS: ReadonlySet<string> = new Set([
  "html",
  "xml",
  "svg",
  "vue",
  "svelte",
]);
/** HTML 里不会包含内容的标签：开标签不缩进。 */
const MARKUP_VOID_TAGS: ReadonlySet<string> = new Set([
  "br", "hr", "img", "input", "meta", "link", "area", "base", "col",
  "embed", "source", "track", "wbr", "param",
]);

/** 取一行的行首空白（缩进的基底）。 */
const leadingWhitespace = (line: string): string =>
  /^[ \t]*/.exec(line)?.[0] ?? "";

/**
 * 这一行会不会让下一行多缩进一级——按代码块的语言归类：
 *   - Python/YAML：行尾（去尾部空白后）是 `:`；
 *   - HTML/XML 等：行尾是一个未自闭合、非 void、非闭合的开标签；
 *   - 其余（JS/TS/C 家族/CSS/JSON/Go/Rust/…默认）：行尾是 `{`。
 */
const opensNestedBlock = (line: string, lang: string): boolean => {
  const trimmed = line.replace(/\s+$/, "");
  if (INDENT_COLON_LANGS.has(lang)) return trimmed.endsWith(":");
  if (INDENT_MARKUP_LANGS.has(lang)) {
    if (/\/>\s*$/.test(line)) return false;
    const tag = /<\s*(\/?)([a-zA-Z][\w:-]*)((?:"[^"]*"|'[^']*'|[^>"'])*)>\s*$/.exec(
      line
    );
    if (!tag) return false;
    if (tag[1]) return false;
    return !MARKUP_VOID_TAGS.has(tag[2].toLowerCase());
  }
  return trimmed.endsWith("{");
};

/** 代码块的缩进语言：优先 code 的 language-xxx 类名，退回语言标记文本。 */
const codeLanguage = (code: HTMLElement): string => {
  const fromClass = /language-([\w+#-]+)/.exec(code.className);
  if (fromClass) return fromClass[1].toLowerCase();
  const block = code.closest('div[data-type="code-block"]');
  const info = block?.querySelector("[data-type='code-block-info']");
  return (info?.textContent ?? "").replace(/\u200b/g, "").trim().toLowerCase();
};

/**
 * 代码块/公式块源码区的编辑增强——写代码和 LaTeX 的基础编辑能力：
 *   - 敲开符（([{）成对插入，光标落在两符中间；
 *   - 光标右侧已是同样的闭符时，敲闭符直接跨过去（不再插一个）；
 *   - 选中文字后敲开符，包裹选区并保持内层选中；
 *   - 光标落在空对中间按退格，两个符号一起删掉；
 *   - 代码块内回车自动缩进：沿用上一行的缩进，行尾按语言多缩进一级
 *     （花括号语言 `{`、Python/YAML 的 `:`、标记语言的开标签）；
 *   - 代码块内 Tab/Shift+Tab：插入/退掉一个缩进单位（散光标插入，
 *     有选区时按行进退）；
 *   - 在只有缩进的行首敲 `}`，先退掉一级缩进再插入（花括号语言）。
 * 只作用于块内源码区；普通 Markdown 正文不配对、不接管回车（Obsidian
 * 同款行为——正文里的括号就是普通字符，不替输入者做任何决定）。
 *
 * 实现上刻意避开「抢光标」：成对插入时让浏览器原生插入开符（Vditor 按
 * 普通字符处理，光标连续性与正常打字完全一致），闭符用 insertData 在
 * input 事件的捕获阶段（先于 Vditor 处理）静默补在光标处——不派发额外
 * 输入事件、不移动选区，Vditor 的重建/光标恢复无从插手。回车缩进同理：
 * 一次 execCommand 插入「换行 + 缩进」，光标自然落在缩进后面，与手敲
 * 完全等价；包裹选区与空对退格也全部走静默 DOM 修改或一次正规的删除。
 * 返回解绑函数。
 */
export function guardCodeEditing(
  root: HTMLElement,
  onRepaired: () => void
): () => void {
  /** 光标/选区是否完整落在同一个可配对源码区内，是则返回该区。 */
  const pairedCodeAtSelection = (): HTMLElement | null => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;
    const range = selection.getRangeAt(0);
    const toElement = (node: Node): HTMLElement | null =>
      (node.nodeType === Node.TEXT_NODE
        ? node.parentElement
        : node) as HTMLElement | null;
    const start =
      toElement(range.startContainer)?.closest<HTMLElement>(PAIRED_CODE_SELECTOR) ??
      null;
    const end =
      toElement(range.endContainer)?.closest<HTMLElement>(PAIRED_CODE_SELECTOR) ??
      null;
    return start && start === end ? start : null;
  };

  /** 光标是否在代码块（而非公式块）的源码区内，是则返回该 code。 */
  const codeBlockCodeAtCaret = (): HTMLElement | null => {
    const code = pairedCodeAtSelection();
    if (!code) return null;
    return code.closest('div[data-type="code-block"]') ? code : null;
  };

  /** 光标位置（节点+偏移）→ 源码区内的纯文本偏移。 */
  const textOffsetIn = (
    code: HTMLElement,
    node: Node,
    offset: number
  ): number => {
    const probe = document.createRange();
    probe.selectNodeContents(code);
    try {
      probe.setEnd(node, offset);
    } catch {
      return 0;
    }
    return probe.toString().length;
  };

  /** 源码区内的纯文本偏移 → 光标位置；到不了末尾时取最后一个文本节点。 */
  const positionAt = (
    code: HTMLElement,
    offset: number
  ): { node: Node; offset: number } | null => {
    const walker = document.createTreeWalker(code, NodeFilter.SHOW_TEXT);
    let rest = offset;
    let last: Text | null = null;
    while (walker.nextNode()) {
      const text = walker.currentNode as Text;
      if (text.length >= rest) return { node: text, offset: rest };
      rest -= text.length;
      last = text;
    }
    return last ? { node: last, offset: last.length } : null;
  };

  /** 把选区设置到源码区的 [start, end) 文本偏移上。 */
  const selectTextRange = (
    code: HTMLElement,
    start: number,
    end: number
  ): void => {
    const from = positionAt(code, start);
    const to = positionAt(code, end);
    if (!from || !to) return;
    const range = document.createRange();
    range.setStart(from.node, from.offset);
    range.setEnd(to.node, to.offset);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  };

  /**
   * input 事件的捕获阶段（先于 Vditor 的处理）：浏览器刚原生插入了开符、
   * 光标紧跟其后，在光标处静默补上闭符。insertData 不派发输入事件、不
   * 动选区（光标的数字偏移不变，正好落在开符与闭符之间），Vditor 随后的
   * 输入处理读到的 DOM 已是完整的一对，撤销快照也包含两者。
   */
  const onInput = (event: Event) => {
    const input = event as InputEvent;
    if (input.isComposing) return;
    if (input.inputType !== "insertText" || !input.data) return;
    const closer = SYMMETRIC_PAIRS[input.data];
    if (closer === undefined) return;
    const selection = window.getSelection();
    const anchor = selection?.anchorNode;
    if (!selection || !selection.isCollapsed) return;
    if (!anchor || anchor.nodeType !== Node.TEXT_NODE) return;
    const code = (anchor.parentElement as HTMLElement | null)?.closest(
      PAIRED_CODE_SELECTOR
    );
    if (!code) return;
    if ((selection.anchorOffset ?? 0) === 0) return;
    const text = anchor.textContent ?? "";
    // 光标前一个字符必须是刚输入的开符（防止别的路径插入的同名字符）。
    if (text.slice(selection.anchorOffset - 1, selection.anchorOffset) !== input.data) {
      return;
    }
    (anchor as Text).insertData(selection.anchorOffset, closer);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.isComposing || event.keyCode === 229) return;
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const code = pairedCodeAtSelection();
    if (!code) return;

    if (event.key === "Tab" && !event.shiftKey) {
      // 代码块内 Tab = 缩进。Vditor IR 对编辑区的 Tab 没有任何处理，
      // 原生行为会把焦点移出编辑框。散光标在插入点补一个缩进单位；
      // 有选区时给选区覆盖到的每一行行首加一个缩进单位（从最后一行
      // 往前处理，保证先算好的行首偏移不被自己的插入顶跑）。全部走
      // 静默 DOM 修改，与回车缩进同一套机制。公式块不接管。
      if (!codeBlockCodeAtCaret()) return;
      event.preventDefault();
      event.stopPropagation();
      const range = selection.getRangeAt(0);
      if (selection.isCollapsed) {
        const off = textOffsetIn(code, range.startContainer, range.startOffset);
        const pos = positionAt(code, off);
        if (!pos) return;
        if (pos.node.nodeType === Node.TEXT_NODE) {
          (pos.node as Text).insertData(pos.offset, INDENT_UNIT);
        } else {
          pos.node.insertBefore(
            document.createTextNode(INDENT_UNIT),
            pos.node.childNodes[pos.offset] ?? null
          );
        }
        selectTextRange(code, off + INDENT_UNIT.length, off + INDENT_UNIT.length);
      } else {
        const text = code.textContent ?? "";
        const start = textOffsetIn(code, range.startContainer, range.startOffset);
        const end = textOffsetIn(code, range.endContainer, range.endOffset);
        const lineStarts: number[] = [];
        let cursor = text.lastIndexOf("\n", Math.max(Math.min(start, end) - 1, 0)) + 1;
        const regionEnd = Math.max(start, end);
        while (cursor <= regionEnd && cursor <= text.length) {
          lineStarts.push(cursor);
          if (cursor > text.length) break;
          const next = text.indexOf("\n", cursor);
          if (next === -1 || next + 1 > regionEnd) break;
          cursor = next + 1;
        }
        for (let i = lineStarts.length - 1; i >= 0; i--) {
          const pos = positionAt(code, lineStarts[i]);
          if (!pos) continue;
          if (pos.node.nodeType === Node.TEXT_NODE) {
            (pos.node as Text).insertData(pos.offset, INDENT_UNIT);
          } else {
            pos.node.insertBefore(
              document.createTextNode(INDENT_UNIT),
              pos.node.childNodes[pos.offset] ?? null
            );
          }
        }
        const grown = lineStarts.length * INDENT_UNIT.length;
        selectTextRange(code, start + INDENT_UNIT.length, end + grown);
      }
      onRepaired();
      return;
    }

    if (event.key === "Tab" && event.shiftKey) {
      // Shift+Tab = 反缩进：光标/选区覆盖到的行行首去掉一个缩进单位
      //（不足 4 空格时去掉实际存在的空白前缀）。同样从最后一行往前
      // 处理，偏移不受自己影响。公式块不接管。
      if (!codeBlockCodeAtCaret()) return;
      event.preventDefault();
      event.stopPropagation();
      const range = selection.getRangeAt(0);
      const text = code.textContent ?? "";
      const start = textOffsetIn(code, range.startContainer, range.startOffset);
      const end = textOffsetIn(code, range.endContainer, range.endOffset);
      const regionStart = Math.min(start, end);
      const regionEnd = Math.max(start, end);
      let lineStart = text.lastIndexOf("\n", Math.max(regionStart - 1, 0)) + 1;
      const cuts: Array<{ at: number; len: number }> = [];
      while (lineStart <= regionEnd) {
        let len = 0;
        if (text.slice(lineStart, lineStart + INDENT_UNIT.length) === INDENT_UNIT) {
          len = INDENT_UNIT.length;
        } else if (text.charAt(lineStart) === "\t") {
          len = 1;
        } else {
          const run = /^[ ]{1,3}(?=\S)/.exec(text.slice(lineStart));
          len = run ? run[0].length : 0;
        }
        if (len > 0) cuts.push({ at: lineStart, len });
        const next = text.indexOf("\n", lineStart);
        if (next === -1 || next + 1 > regionEnd) break;
        lineStart = next + 1;
      }
      for (let i = cuts.length - 1; i >= 0; i--) {
        const cut = cuts[i];
        const pos = positionAt(code, cut.at);
        if (!pos || pos.node.nodeType !== Node.TEXT_NODE) continue;
        (pos.node as Text).deleteData(pos.offset, cut.len);
      }
      const shift = (off: number) =>
        off - cuts.filter((c) => c.at <= off).reduce((sum, c) => sum + c.len, 0);
      selectTextRange(code, shift(start), shift(end));
      onRepaired();
      return;
    }

    if (event.key === "Enter" && !event.ctrlKey && !event.metaKey && !event.altKey) {
      // 代码块内接管回车：换行 + 自动缩进。execCommand 的换行类命令会被
      // Vditor 的 beforeinput 处理拦下（insertLineBreak 返回成功但不插入），
      // 所以走静默插入：Text.insertData 把「换行 + 缩进」直接写进源码文本，
      // 不派发输入事件、不触发重渲染，光标显式放到缩进后面——没有光标
      // 可抢。Vditor 的 Markdown 同步由 onRepaired 立即补上，撤销在下一次
      // 真实输入时自然并入。公式块不接管（LaTeX 不做语言缩进）。
      if (!codeBlockCodeAtCaret()) return;
      event.preventDefault();
      event.stopPropagation();
      if (!selection.isCollapsed) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        selection.removeAllRanges();
        selection.addRange(range);
      }
      const text = code.textContent ?? "";
      const off = textOffsetIn(code, selection.anchorNode, selection.anchorOffset);
      const lineStart = text.lastIndexOf("\n", Math.max(off - 1, 0)) + 1;
      const lineEnd = (() => {
        const idx = text.indexOf("\n", off);
        return idx === -1 ? text.length : idx;
      })();
      const line = text.slice(lineStart, lineEnd);
      let indent = leadingWhitespace(line);
      if (opensNestedBlock(line, codeLanguage(code))) indent += INDENT_UNIT;
      const insert = "\n" + indent;
      const pos = positionAt(code, off);
      if (!pos) return;
      if (pos.node.nodeType === Node.TEXT_NODE) {
        (pos.node as Text).insertData(pos.offset, insert);
      } else {
        pos.node.insertBefore(
          document.createTextNode(insert),
          pos.node.childNodes[pos.offset] ?? null
        );
      }
      selectTextRange(code, off + insert.length, off + insert.length);
      onRepaired();
      return;
    }

    if (event.key === "}" && selection.isCollapsed) {
      // 行首电退格：这一行光标前后都只有缩进时，敲 `}` 先退掉一级再插入，
      // 让闭括号与上一级对齐（Python/YAML 无花括号，不适用）。
      const block = codeBlockCodeAtCaret();
      if (block && !INDENT_COLON_LANGS.has(codeLanguage(block))) {
        const text = code.textContent ?? "";
        const off = textOffsetIn(code, selection.anchorNode, selection.anchorOffset);
        const lineStart = text.lastIndexOf("\n", Math.max(off - 1, 0)) + 1;
        const lineEnd = (() => {
          const idx = text.indexOf("\n", off);
          return idx === -1 ? text.length : idx;
        })();
        const before = text.slice(lineStart, off);
        const after = text.slice(off, lineEnd);
        if (
          before.length > 0 &&
          /^[ \t]+$/.test(before) &&
          /^[ \t]*$/.test(after)
        ) {
          event.preventDefault();
          event.stopPropagation();
          const cut = Math.min(before.length, INDENT_UNIT.length);
          selectTextRange(code, off - cut, off);
          document.execCommand("insertText", false, "}");
          return;
        }
      }
    }

    if (SYMMETRIC_PAIRS[event.key] !== undefined) {
      if (selection.isCollapsed) {
        // 散光标敲开符：不拦截，让浏览器原生插入，闭符由 onInput 静默补上。
        return;
      }
      // 选区包裹：两处静默插入（不派发输入事件），再把内层文本重新选中。
      event.preventDefault();
      event.stopPropagation();
      const range = selection.getRangeAt(0);
      const start = textOffsetIn(code, range.startContainer, range.startOffset);
      const end = textOffsetIn(code, range.endContainer, range.endOffset);
      const from = positionAt(code, start);
      const to = positionAt(code, end);
      if (!from || !to) return;
      if (from.node.nodeType === Node.TEXT_NODE) {
        (from.node as Text).insertData(from.offset, event.key);
        // 开符插进了起始边界，同一文本节点上的终点要跟着 +1。
        if (to.node === from.node && to.offset >= from.offset) to.offset += 1;
      }
      if (to.node.nodeType === Node.TEXT_NODE) {
        (to.node as Text).insertData(to.offset, SYMMETRIC_PAIRS[event.key]);
      }
      selectTextRange(code, start + 1, end + 1);
      return;
    }

    if (SYMMETRIC_OPENERS[event.key] !== undefined) {
      // 闭符：光标右侧已是同样的闭符时跨过去，避免 `())`。纯光标移动，
      // 不产生输入事件、不会触发重渲染，同步放置即可。
      const text = code.textContent ?? "";
      const off = textOffsetIn(code, selection.anchorNode, selection.anchorOffset);
      if (selection.isCollapsed && text.slice(off, off + 1) === event.key) {
        event.preventDefault();
        event.stopPropagation();
        selectTextRange(code, off + 1, off + 1);
      }
      return;
    }

    if (event.key === "Backspace" && selection.isCollapsed) {
      // 退格：光标在空对中间（如 `(|)`）时两个符号一起删掉。删除后浏览器
      // 自然把光标留在原对的开头。
      const text = code.textContent ?? "";
      const off = textOffsetIn(code, selection.anchorNode, selection.anchorOffset);
      const prev = text.slice(off - 1, off);
      if (prev && SYMMETRIC_PAIRS[prev] === text.slice(off, off + 1)) {
        event.preventDefault();
        event.stopPropagation();
        selectTextRange(code, off - 1, off + 1);
        document.execCommand("delete");
      }
    }
  };

  root.addEventListener("input", onInput, true);
  root.addEventListener("keydown", onKeyDown, true);
  return () => {
    root.removeEventListener("input", onInput, true);
    root.removeEventListener("keydown", onKeyDown, true);
  };
}

/**
 * 把「刚敲出来的空代码块」还原成字面量反引号，与 repairBareMathPair 对
 * 公式块的做法同构：行首敲第 3 个反引号时 Lute 立刻把它当代码围栏起始——
 * 自动补上收尾 ```、把语言名吸进 info 标记、展开成块组件，而且往返回散
 * 会把原文 `` ``` `` 改写成 `` ```\n\n``` ``（已核对）。按 Obsidian 的输入
 * 方式，此时应该只是三个普通反引号 + 语言文本：
 *   - 敲 ```` ``` ````/```` ```` ```` → 字面量（高亮），光标跟在末尾；
 *   - 接着敲语言名（```python）→ 仍是字面量；
 *   - 按 Enter（明确的分块动作）→ 放行原生建块，语言标记保留、光标进入
 *     代码区，收尾围栏由 Vditor 自动补齐（规格允许保留的原有增强）。
 * 只有「数量比上一轮多的新块 + 正文为空」才还原；已有正文的块是输入者的
 * 工作现场，绝不动。返回是否发生了还原。
 */
function repairBareCodeFence(root: HTMLElement, state: RepairState): boolean {
  // 空的 pending span 清扫：全选删除等操作经 Lute 往返后，会把这个
  // 未知内联 span 保留下来（内容被清空），残留一个带高亮样式的空段。
  // pending span 只在持有时有意义（文本就是 ```），空壳一律摘除。
  root.querySelectorAll(".cc98-code-pending").forEach((span) => {
    if (!span.textContent) span.remove();
  });
  const blocks = Array.from(
    root.querySelectorAll<HTMLElement>('div[data-type="code-block"]')
  ).filter((block) => !block.closest(".vditor-ir__preview"));
  if (state.codeRepairHeld) {
    state.lastCodeBlockCount = blocks.length;
    return false;
  }
  const newborn =
    state.lastCodeBlockCount >= 0 && blocks.length > state.lastCodeBlockCount;
  let repaired = false;
  const selection = window.getSelection();
  const anchor = selection?.anchorNode ?? null;
  // 标记已就绪的块才计入基线（与公式块的 recognizedCount 同理）。
  const recognizedCount = blocks.filter((block) => {
    const open = block.querySelector('[data-type="code-block-open-marker"]');
    const close = block.querySelector('[data-type="code-block-close-marker"]');
    return !!open?.textContent && !!close?.textContent;
  }).length;
  for (const block of blocks) {
    if (!newborn) continue;
    const code = block.querySelector("pre.vditor-ir__marker--pre > code");
    const body = (code?.textContent ?? "").replace(/\u200b/g, "");
    if (!/^\s*$/.test(body)) continue;
    const openMarker = block.querySelector(
      '[data-type="code-block-open-marker"]'
    );
    if (!openMarker?.textContent) continue;
    const info = block.querySelector('[data-type="code-block-info"]');
    // 语言标记里 Lute 会垫一个零宽字符，还原时剥掉。
    const infoText = (info?.textContent ?? "").replace(/\u200b/g, "");
    const paragraph = document.createElement("p");
    const dataBlock = block.getAttribute("data-block");
    if (dataBlock !== null) paragraph.setAttribute("data-block", dataBlock);
    const marker = document.createElement("span");
    marker.className = "cc98-code-pending";
    marker.textContent = openMarker.textContent;
    paragraph.appendChild(marker);
    let tail: Text | null = null;
    if (infoText) {
      tail = document.createTextNode(infoText);
      paragraph.appendChild(tail);
    }
    const caretInside = !!anchor && block.contains(anchor);
    block.replaceWith(paragraph);
    const end = tail ?? (marker.firstChild as Text | null);
    if (caretInside && end) {
      const range = document.createRange();
      range.setStart(end, end.length);
      range.collapse(true);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
    repaired = true;
  }
  state.lastCodeBlockCount = recognizedCount;
  return repaired;
}

/**
 * Enter 建块后修剪正文开头多出的空行：Lute 把「```lang + Enter」的换行
 * 吸收成两个换行（正文 "\n\n"、光标在两者之间），代码块首行会渲染成空行。
 * 只处理这一种确切形状（正文全为换行、光标紧随第一个换行之后），静默删掉
 * 光标右侧的换行，正文回到 "\n"。返回是否发生了修改。
 */
function trimNewbornCodeBody(root: HTMLElement): boolean {
  const selection = window.getSelection();
  const anchor = selection?.anchorNode;
  if (!anchor) return false;
  const code = (
    anchor.nodeType === Node.TEXT_NODE ? anchor.parentElement : (anchor as HTMLElement)
  )?.closest<HTMLElement>("pre.vditor-ir__marker--pre > code");
  if (!code || !code.contains(anchor)) return false;
  const walker = document.createTreeWalker(code, NodeFilter.SHOW_TEXT);
  let full = "";
  const nodes: Text[] = [];
  while (walker.nextNode()) {
    const text = walker.currentNode as Text;
    nodes.push(text);
    full += text.data;
  }
  if (full.replace(/\u200b/g, "") !== "\n\n") return false;
  // 光标在整段文本偏移 1（第一个换行之后）才处理。
  const probe = document.createRange();
  probe.selectNodeContents(code);
  try {
    probe.setEnd(anchor, selection?.anchorOffset ?? 0);
  } catch {
    return false;
  }
  if (probe.toString().replace(/\u200b/g, "").length !== 1) return false;
  // 删掉光标右侧那个换行：单一文本节点直接 deleteData；拆成多个节点时
  // 移除光标后面的纯换行节点。均为静默 DOM 修改，不动光标。
  if (nodes.length === 1) {
    nodes[0].deleteData(1, 1);
    return true;
  }
  const anchorIdx = nodes.findIndex(
    (n) => n === anchor || (anchor.nodeType === Node.TEXT_NODE && n === anchor)
  );
  const next = nodes[anchorIdx + 1] ?? null;
  if (next && !next.data.replace(/\u200b/g, "")) {
    next.remove();
    return true;
  }
  if (anchor.nodeType === Node.TEXT_NODE && (anchor as Text).data.endsWith("\n")) {
    (anchor as Text).deleteData((anchor as Text).length - 1, 1);
    return true;
  }
  return false;
}

/**
 * 监听 IR 编辑区的输入，把「刚敲出来的空代码块」还原成字面量反引号
 * （见 repairBareCodeFence）。与 guardBareMathPair 同一套节奏：粘贴/拖放/
 * 撤销/回车不还原，MutationObserver 兜住 Vditor 迟到的重渲染，还原后把
 * 新的 Markdown 重新抛给 onChange（否则父组件会拿到被自动补了收尾围栏的
 * 写法）。工具栏按钮（Vditor 内置的代码块）经 insertValue 类路径插入、
 * 不派发 input 事件，点击工具栏即视为「明确要一个块」，暂缓到下一次真实
 * 输入。返回解绑函数。
 */
export function guardBareCodeFence(
  root: HTMLElement,
  state: RepairState,
  onRepaired: () => void
): () => void {
  let active = true;
  let scheduled = false;
  // 新编辑区从零开始：基线与「暂缓」开关在实例重挂载后已过期（比如重挂载
  // 前点过工具栏），一并重置。
  state.lastCodeBlockCount = -1;
  state.codeRepairHeld = false;

  state.resetCodeTyping = () => {
    state.lastCodeBlockCount = -1;
  };

  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    queueMicrotask(() => {
      if (!active) return;
      scheduled = false;
      if (repairBareCodeFence(root, state)) onRepaired();
    });
  };

  const onInput = (event: Event) => {
    const inputType = (event as InputEvent).inputType;
    if (
      inputType === "insertFromPaste" ||
      inputType === "insertFromDrop" ||
      inputType === "insertLineBreak" ||
      inputType === "insertParagraph" ||
      inputType === "historyUndo" ||
      inputType === "historyRedo"
    ) {
      state.lastCodeBlockCount = -1;
      if (inputType === "insertParagraph") {
        // Enter 建块后 Lute 会把换行吸收成正文开头的额外空行（正文变成
        // "\n\n"，光标落在 1）——渲染出的代码块第一行是空的。这里在
        // Vditor 重建完成后静默删掉光标右侧那个多余换行，正文回到 "\n"，
        // 光标正好在第一行行首，与 Obsidian 一致。
        queueMicrotask(() => {
      if (!active) return;
          if (trimNewbornCodeBody(root)) onRepaired();
        });
      }
      return;
    }
    if (state.lastCodeBlockCount < 0) {
      state.lastCodeBlockCount = Array.from(
        root.querySelectorAll<HTMLElement>('div[data-type="code-block"]')
      ).filter((block) => !block.closest(".vditor-ir__preview")).length;
    }
    state.codeRepairHeld = false;
    schedule();
  };
  const onCompositionEnd = () => schedule();
  const observer = new MutationObserver(schedule);
  observer.observe(root, { childList: true, subtree: true });
  root.addEventListener("input", onInput, true);
  root.addEventListener("compositionend", onCompositionEnd, true);

  const toolbar = root
    .closest(".vditor")
    ?.querySelector<HTMLElement>(".vditor-toolbar");
  const onToolbarClick = () => {
    state.codeRepairHeld = true;
    state.resetCodeTyping?.();
  };
  toolbar?.addEventListener("click", onToolbarClick, true);

  return () => {
    active = false;
    observer.disconnect();
    toolbar?.removeEventListener("click", onToolbarClick, true);
    root.removeEventListener("input", onInput, true);
    root.removeEventListener("compositionend", onCompositionEnd, true);
  };
}

