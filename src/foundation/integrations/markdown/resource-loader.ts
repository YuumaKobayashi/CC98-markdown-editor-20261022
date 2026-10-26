/** Shared self-hosted assets. Foreign tags are observed, never removed. */
export function createResourceLoader(doc: Document, timeoutMs = 30_000) {
  const tasks = new Map<string, Promise<void>>();
  const failed = new WeakSet<Element>();
  function load(kind: "script" | "style", url: string, ready?: () => boolean) {
    const absoluteUrl = new URL(url, doc.baseURI).href;
    const key = `${kind}:${absoluteUrl}`;
    const existingTask = tasks.get(key);
    if (existingTask) return existingTask;
    const task = new Promise<void>((resolve, reject) => {
      if (ready?.()) { resolve(); return; }
      const existing = Array.from(doc.querySelectorAll<HTMLScriptElement | HTMLLinkElement>(
        kind === "script" ? "script[src]" : 'link[rel="stylesheet"][href]'
      )).find((el) => !failed.has(el) &&
        (el.tagName === "SCRIPT" ? (el as HTMLScriptElement).src : (el as HTMLLinkElement).href) === absoluteUrl);
      const owned = !existing;
      const element = existing ?? doc.createElement(kind === "script" ? "script" : "link");
      if (kind === "style" && (element as HTMLLinkElement).sheet) { resolve(); return; }
      let timer: ReturnType<typeof setTimeout>;
      const finish = (error?: Error) => {
        clearTimeout(timer);
        element.removeEventListener("load", onLoad);
        element.removeEventListener("error", onError);
        if (error) {
          failed.add(element);
          if (owned) element.remove();
          reject(error);
        } else resolve();
      };
      const onLoad = () => finish(ready && !ready()
        ? new Error(`静态资源未提供预期接口：${url}`) : undefined);
      const onError = () => finish(new Error(`加载静态资源失败：${url}`));
      element.addEventListener("load", onLoad);
      element.addEventListener("error", onError);
      timer = setTimeout(() => finish(new Error(`加载静态资源超时：${url}`)), timeoutMs);
      if (owned) {
        if (kind === "script") (element as HTMLScriptElement).src = url;
        else {
          (element as HTMLLinkElement).rel = "stylesheet";
          (element as HTMLLinkElement).href = url;
        }
        doc.head.appendChild(element);
      }
    });
    tasks.set(key, task);
    void task.catch(() => { if (tasks.get(key) === task) tasks.delete(key); });
    return task;
  }
  return {
    script: (url: string, ready: () => boolean) => load("script", url, ready),
    stylesheet: (url: string) => load("style", url),
  };
}
