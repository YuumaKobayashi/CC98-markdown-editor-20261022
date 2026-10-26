interface BodyScrollLockState {
  count: number;
  styleElement: HTMLStyleElement;
}

// 弹窗可能嵌套，因此每个 document 通过引用计数共享一份滚动锁。
const bodyScrollLocks = new WeakMap<Document, BodyScrollLockState>();

// 测量当前 document 中原生滚动条占用的宽度。
function measureScrollbarWidth(doc: Document) {
  // 使用屏幕外的滚动容器测量原生滚动条宽度，也能兼容 iframe。
  const probe = doc.createElement("div");
  Object.assign(probe.style, {
    position: "absolute",
    top: "-9999px",
    left: "0",
    width: "100px",
    height: "100px",
    overflow: "scroll",
    visibility: "hidden",
  });
  doc.body.appendChild(probe);
  const width = probe.offsetWidth - probe.clientWidth;
  probe.remove();
  return Math.max(0, width);
}

// 判断页面内容是否产生了占用布局宽度的纵向滚动条。
function isBodyOverflowing(doc: Document, win: Window) {
  return (
    doc.body.scrollHeight >
      (win.innerHeight || doc.documentElement.clientHeight) &&
    win.innerWidth > doc.body.offsetWidth
  );
}

// 获取一份背景滚动锁，并返回用于释放该锁的清理函数。
export function acquireBodyScrollLock(doc: Document) {
  const existing = bodyScrollLocks.get(doc);
  if (existing) {
    existing.count += 1;
    return () => releaseBodyScrollLock(doc);
  }

  const win = doc.defaultView;
  if (!win || !doc.body || !doc.head) return () => undefined;

  const scrollbarWidth = measureScrollbarWidth(doc);
  // 隐藏滚动条会使页面变宽，补偿这部分宽度以避免内容横向跳动。
  const widthRule =
    isBodyOverflowing(doc, win) && scrollbarWidth > 0
      ? `\n  width: calc(100% - ${scrollbarWidth}px);`
      : "";
  const styleElement = doc.createElement("style");
  styleElement.setAttribute("data-owned-dialog-scroll-lock", "");
  styleElement.textContent = `html body {\n  overflow-y: hidden;${widthRule}\n}`;
  doc.head.appendChild(styleElement);
  bodyScrollLocks.set(doc, { count: 1, styleElement });

  return () => releaseBodyScrollLock(doc);
}

// 释放一份背景滚动锁；仅在引用计数归零时恢复页面滚动。
function releaseBodyScrollLock(doc: Document) {
  const state = bodyScrollLocks.get(doc);
  if (!state) return;

  state.count -= 1;
  if (state.count > 0) return;

  state.styleElement.remove();
  bodyScrollLocks.delete(doc);
}
