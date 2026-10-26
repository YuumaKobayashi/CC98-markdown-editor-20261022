import { strict as assert } from "node:assert";
import { createUploadQueue } from "../src/foundation/integrations/markdown/upload-queue.ts";
import { createResourceLoader } from "../src/foundation/integrations/markdown/resource-loader.ts";
import { createRepairState, guardBareMathPair } from "../src/foundation/integrations/markdown/editor-input.ts";
import { imageToggleLayout } from "../src/foundation/integrations/markdown/image-toggle-layout.ts";
import { createUploadedImagePreviews } from "../src/foundation/integrations/markdown/uploaded-image-previews.ts";

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => { resolve = done; });
  return { promise, resolve };
}

export async function run() {
  const bounds = (left: number, top: number, width: number, height: number) => ({
    left, top, width, height, right: left + width, bottom: top + height,
  });
  const host = { left: 10, top: 20 };
  const viewport = bounds(20, 70, 400, 300);
  const button = { width: 104, height: 36 };
  const tallImage = imageToggleLayout(bounds(20, -200, 350, 800), viewport, host, button, true);
  assert.equal(tallImage.hidden, true); // header scrolls away instead of covering picture pixels
  const enlarged = imageToggleLayout(bounds(20, 400, 350, 200), bounds(20, 70, 400, 600), host, button, true);
  assert.equal(enlarged.hidden, false); // visible in the enlarged editor
  assert.equal(enlarged.top, 384);
  assert.ok(enlarged.top + host.top + button.height <= 400 + 44);
  const rightEdge = imageToggleLayout(bounds(390, 100, 40, 80), viewport, host, button, true);
  assert.ok(rightEdge.left + host.left + button.width <= viewport.right);
  assert.equal(imageToggleLayout(bounds(20, -200, 350, 100), viewport, host, button, true).hidden, true);
  console.log("✓ 图片按钮只占独立标题行，滚动或放大均不挤入原图区域");

  const revoked: string[] = [];
  let previewId = 0;
  const previews = createUploadedImagePreviews({
    createObjectURL: () => `blob:test-${++previewId}`,
    revokeObjectURL: (url) => { revoked.push(url); },
  });
  previews.remember("https://example.com/a b.jpg", new File(["image"], "original.jpg", { type: "image/jpeg" }));
  assert.equal(previews.get("https://example.com/a%20b.jpg"), "blob:test-1");
  previews.remember("https://example.com/a%20b.jpg", new File(["image"], "original.jpg", { type: "image/jpeg" }));
  assert.deepEqual(revoked, ["blob:test-1"]);
  previews.clear();
  previews.clear();
  assert.deepEqual(revoked, ["blob:test-1", "blob:test-2"]);
  assert.equal(previews.get("https://example.com/a%20b.jpg"), undefined);
  assert.equal(previews.get("https://"), undefined);
  console.log("✓ 原图本地预览地址匹配与对象 URL 清理");

  const inserted: string[] = [];
  const failures: string[][] = [];
  const files = ["first", "broken", "last"].map((name) => new File(["x"], name));
  const queue = createUploadQueue({
    upload: async (file) => { if (file.name === "broken") throw new Error("network"); return file.name; },
    insert: (_file, url) => { inserted.push(url); },
    finish: (failed) => failures.push(failed),
  });
  await Promise.all([queue.enqueue(files.slice(0, 2)), queue.enqueue(files.slice(2))]);
  assert.deepEqual(inserted, ["first", "last"]);
  assert.deepEqual(failures, [["broken"]]);

  const pending = deferred<string>();
  let oldRequests = 0;
  const oldQueue = createUploadQueue({
    upload: () => { oldRequests++; return pending.promise; },
    insert: () => { throw new Error("stale insertion"); },
  });
  const oldTask = oldQueue.enqueue(files);
  await Promise.resolve();
  oldQueue.invalidate();
  const fresh: string[] = [];
  const newQueue = createUploadQueue({ upload: async () => "new", insert: (_f, url) => { fresh.push(url); } });
  await newQueue.enqueue([files[0]]);
  pending.resolve("old");
  await oldTask;
  assert.equal(oldRequests, 1);
  assert.deepEqual(fresh, ["new"]);

  // Real guard scheduling with an empty root: unrelated DOM activity must not
  // ask the parent to serialize; queued work must stop when the guard detaches.
  const globals = globalThis as any;
  const previousWindow = globals.window;
  const previousObserver = globals.MutationObserver;
  const callbacks: Array<() => void> = [];
  try {
    globals.window = { getSelection: () => null };
    globals.MutationObserver = class {
      constructor(callback: () => void) { callbacks.push(callback); }
      observe() {}
      disconnect() {}
    };
    const root = new EventTarget() as unknown as HTMLElement;
    root.querySelectorAll = (() => []) as any;
    let repairs = 0;
    const stateA = createRepairState();
    const detach = guardBareMathPair(root, stateA, () => { repairs++; });
    stateA.dollarsBeforeCaret = 3;
    const detachB = guardBareMathPair(root, createRepairState(), () => { repairs++; });
    assert.equal(stateA.dollarsBeforeCaret, 3);
    for (let i = 0; i < 1000; i++) callbacks[0]();
    await Promise.resolve();
    assert.equal(repairs, 0);
    callbacks[0]();
    detach(); detachB();
    await Promise.resolve();
    assert.equal(repairs, 0);
  } finally {
    if (previousWindow === undefined) delete globals.window; else globals.window = previousWindow;
    if (previousObserver === undefined) delete globals.MutationObserver; else globals.MutationObserver = previousObserver;
  }

  // Minimal DOM transport tests verify ownership and actual load/error/timeout ordering.
  class Tag extends EventTarget {
    tagName: string;
    src = "";
    href = "";
    rel = "";
    sheet = null;
    removed = false;
    constructor(name: string) { super(); this.tagName = name.toUpperCase(); }
    remove() { this.removed = true; }
  }
  const tags: Tag[] = [];
  const doc = {
    baseURI: "https://forum.test/",
    head: { appendChild(tag: Tag) { tags.push(tag); } },
    createElement: (name: string) => new Tag(name),
    querySelectorAll: () => tags.filter((tag) => !tag.removed),
  } as unknown as Document;
  const loader = createResourceLoader(doc, 20);
  let available = false;
  const foreign = new Tag("script");
  foreign.src = "https://forum.test/katex.js";
  tags.push(foreign);
  const first = loader.script(foreign.src, () => available);
  assert.equal(first, loader.script(foreign.src, () => available));
  foreign.dispatchEvent(new Event("error"));
  await assert.rejects(first);
  assert.equal(foreign.removed, false);
  const second = loader.script(foreign.src, () => available);
  const owned = tags.at(-1)!;
  assert.notEqual(owned, foreign);
  available = true;
  owned.dispatchEvent(new Event("load"));
  await second;
  const timeout = loader.stylesheet("https://forum.test/timeout.css");
  const timedOut = tags.at(-1)!;
  await assert.rejects(timeout, /超时/);
  assert.equal(timedOut.removed, true);
  const retry = loader.stylesheet("https://forum.test/timeout.css");
  tags.at(-1)!.dispatchEvent(new Event("load"));
  await retry;
  console.log("✓ 上传异常/入队顺序/换稿隔离、输入守卫调度/卸载、资源并发/归属/超时/重试通过");
}
