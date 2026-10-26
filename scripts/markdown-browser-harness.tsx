import * as React from "react";
import { createRoot, type Root } from "react-dom/client";
import { MarkdownEditor } from "../src/foundation/integrations/markdown/markdown-editor";
import { MarkdownView } from "../src/foundation/integrations/markdown/markdown-view";
export { sanitizeHtml } from "../src/foundation/integrations/markdown/markdown-config";
export { ensureKatex } from "../src/foundation/integrations/markdown/katex-loader";
export { createResourceLoader } from "../src/foundation/integrations/markdown/resource-loader";
export { buildFileMarkdown } from "../src/foundation/integrations/markdown/file-fragment";
export { createRepairState, guardBareMathPair } from "../src/foundation/integrations/markdown/editor-input";

let root: Root | undefined;
export const values = ["", ""];
export const changes = [0, 0];
export const pendingUploads: Array<(url: string) => void> = [];
let update: React.Dispatch<React.SetStateAction<string[]>>;
export function setValue(index: number, value: string) {
  update((current) => current.map((text, i) => i === index ? value : text));
}
function Harness({ initial }: { initial: string[] }) {
  const [text, setText] = React.useState(initial);
  update = setText;
  return <>{text.map((value, index) => <section key={index} data-editor={index}>
    <MarkdownEditor value={value} editorHeight={300}
      onChange={(next) => {
        values[index] = next;
        changes[index]++;
        setText((current) => current.map((item, i) => i === index ? next : item));
      }}
      uploadImage={() => new Promise((resolve) => pendingUploads.push(resolve))} />
    <output data-value={index}>{value}</output>
    <MarkdownView content={value} />
  </section>)}</>;
}
export function mount(initial = ["", ""], strict = false) {
  root?.unmount();
  values.splice(0, 2, ...initial);
  changes.fill(0);
  pendingUploads.length = 0;
  document.body.innerHTML = '<main id="test-root"></main>';
  root = createRoot(document.getElementById("test-root")!);
  const harness = <Harness initial={initial} />;
  root.render(strict ? <React.StrictMode>{harness}</React.StrictMode> : harness);
}
export function unmount() { root?.unmount(); root = undefined; }
