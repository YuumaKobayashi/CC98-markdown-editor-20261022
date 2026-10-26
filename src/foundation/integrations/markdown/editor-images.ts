import { imageToggleLayout } from "./image-toggle-layout";
import { normalizeUploadedFileUrl } from "./file-fragment";
import type { UploadedImagePreviews } from "./uploaded-image-previews";

/** Buttons stay outside contenteditable; CSS reserves their own row above the source/image. */
export function installImageControls(host: HTMLElement, root: HTMLElement, expanded: Set<string>, previews: UploadedImagePreviews) {
  const entries = new Map<HTMLElement, {
    controls: HTMLSpanElement;
    toggle: HTMLButtonElement;
    status: HTMLSpanElement;
    retry: HTMLButtonElement;
    img: HTMLImageElement;
    url: string;
  }>();
  const observed = new Set<HTMLImageElement>();
  const source = (node: HTMLElement, img: HTMLImageElement) =>
    node.querySelector<HTMLElement>(".vditor-ir__marker--link")?.textContent?.trim() || img.getAttribute("src") || "";

  function position() {
    const hostBox = host.getBoundingClientRect();
    const box = root.getBoundingClientRect();
    const viewport = { ...box.toJSON(), top: Math.max(0, box.top), bottom: Math.min(window.innerHeight, box.bottom),
      left: Math.max(0, box.left), right: Math.min(window.innerWidth, box.right) };
    entries.forEach(({ controls }, node) => {
      const layout = imageToggleLayout(node.getBoundingClientRect(), viewport, hostBox,
        { width: controls.offsetWidth || 104, height: 36 }, expanded.has(entries.get(node)!.url));
      controls.style.top = `${layout.top}px`;
      controls.style.left = `${layout.left}px`;
      controls.style.visibility = layout.hidden ? "hidden" : "visible";
    });
  }

  const observer = new ResizeObserver(position);
  function refresh() {
    root.querySelectorAll<HTMLElement>('span[data-type="img"]').forEach((node) => {
      const img = node.querySelector("img");
      if (!img) return;
      const url = source(node, img);
      const local = previews.get(url);
      // Lute serializes the URL marker, not this display-only img.src. Keep
      // source editable and persist the uploaded server URL, never blob URLs.
      const secure = normalizeUploadedFileUrl(url);
      const preview = local || (secure !== url ? secure : undefined);
      if (preview && img.getAttribute("src") !== preview) img.src = preview;
      const open = expanded.has(url);
      node.classList.add("cc98-img-node");
      node.classList.toggle("cc98-img-expanded", open);
      node.classList.toggle("cc98-img-collapsed", !open);
      if (!observed.has(img)) { observer.observe(img); observed.add(img); }
      let entry = entries.get(node);
      if (!entry) {
        const controls = document.createElement("span");
        controls.className = "cc98-img-controls";
        const toggle = document.createElement("button");
        toggle.type = "button";
        toggle.className = "cc98-img-toggle";
        const status = document.createElement("span");
        status.className = "cc98-img-status";
        status.setAttribute("role", "status");
        const retry = document.createElement("button");
        retry.type = "button";
        retry.className = "cc98-img-retry";
        retry.textContent = "重试加载";
        controls.append(toggle, status, retry);
        controls.addEventListener("mousedown", (event) => event.preventDefault());
        toggle.addEventListener("click", (event) => {
          event.preventDefault(); event.stopPropagation();
          const current = entries.get(node);
          if (!current) return;
          if (expanded.has(current.url)) expanded.delete(current.url); else expanded.add(current.url);
          refresh();
        });
        retry.addEventListener("click", (event) => {
          event.preventDefault(); event.stopPropagation();
          const current = entries.get(node);
          if (!current) return;
          current.img.removeAttribute("src");
          current.img.src = previews.get(current.url) || normalizeUploadedFileUrl(current.url);
          refresh();
        });
        host.appendChild(controls);
        entry = { controls, toggle, status, retry, img, url };
        entries.set(node, entry);
      }
      entry.img = img; entry.url = url;
      const label = open ? "折叠图片" : "展开图片";
      if (entry.toggle.textContent !== label) entry.toggle.textContent = label;
      entry.toggle.setAttribute("aria-expanded", String(open));
      const incomplete = !url || /^https?:\/*$/i.test(url);
      const failed = open && img.complete && img.naturalWidth === 0;
      const status = open && incomplete ? "图片地址不完整，请重新插入" : failed ? "图片加载失败" : "";
      if (entry.status.textContent !== status) entry.status.textContent = status;
      entry.retry.hidden = !failed || incomplete;
    });
    entries.forEach((entry, node) => {
      if (!root.contains(node)) { entry.controls.remove(); entries.delete(node); }
    });
    observed.forEach((img) => {
      if (!root.contains(img)) { observer.unobserve(img); observed.delete(img); }
    });
    position();
  }
  const onLoad = (event: Event) => { if ((event.target as Element)?.tagName === "IMG") refresh(); };
  root.addEventListener("load", onLoad, true);
  root.addEventListener("error", onLoad, true);
  return {
    refresh,
    position,
    dispose() {
      observer.disconnect();
      root.removeEventListener("load", onLoad, true);
      root.removeEventListener("error", onLoad, true);
      entries.forEach(({ controls }) => controls.remove());
      entries.clear(); observed.clear();
    },
  };
}
