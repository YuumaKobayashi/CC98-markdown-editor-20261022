import { KATEX_ASSETS } from "./markdown-config";
import { createResourceLoader } from "./resource-loader";

export interface KatexRenderer {
  renderToString(tex: string, options?: {
    displayMode?: boolean;
    throwOnError?: boolean;
    strict?: boolean | "ignore";
    trust?: boolean;
  }): string;
}

let loader: ReturnType<typeof createResourceLoader> | undefined;
let katexPromise: Promise<KatexRenderer> | null = null;

/** Both script and CSS must be ready. Failed requests can be retried. */
export function ensureKatex(): Promise<KatexRenderer> {
  if (!katexPromise) {
    loader ??= createResourceLoader(document);
    const task = Promise.all([
      loader.script(KATEX_ASSETS.js, () => typeof window.katex?.renderToString === "function"),
      loader.stylesheet(KATEX_ASSETS.css),
    ]).then(() => window.katex as KatexRenderer);
    katexPromise = task;
    void task.catch(() => { if (katexPromise === task) katexPromise = null; });
  }
  return katexPromise;
}
