import { message } from "@foundation/ui/feedback";
import { installImageControls } from "./editor-images";
import type { UploadedImagePreviews } from "./uploaded-image-previews";

/** Visual helpers stay outside contenteditable and never enter Markdown serialization. */
export function installEditorDecorations(host: HTMLElement, irRoot: HTMLElement, expandedImages: Set<string>, imagePreviews: UploadedImagePreviews): () => void {
    /** 经隐藏 textarea 兜底复制（非安全上下文没有 clipboard API）。 */
    const copyViaTextarea = (text: string) => {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        if (!document.execCommand("copy")) throw new Error("copy failed");
      } finally {
        textarea.remove();
      }
    };

    const copyCode = (text: string) => {
      if (navigator.clipboard?.writeText) {
        navigator.clipboard
          .writeText(text)
          .then(() => message.success("代码已复制"))
          .catch(() => {
            try {
              copyViaTextarea(text);
              message.success("代码已复制");
            } catch {
              message.error("复制失败，请手动选择复制");
            }
          });
        return;
      }
      try {
        copyViaTextarea(text);
        message.success("代码已复制");
      } catch {
        message.error("复制失败，请手动选择复制");
      }
    };

    // pre → 复制按钮。按钮挂在 host（editable 之外），随 pre 位置浮动。
    const copyButtons = new Map<HTMLElement, HTMLButtonElement>();
    const positionCopyButtons = () => {
      const hostRect = host.getBoundingClientRect();
      copyButtons.forEach((button, pre) => {
        const preRect = pre.getBoundingClientRect();
        button.style.top = `${Math.round(preRect.top - hostRect.top + 2)}px`;
        button.style.left = `${Math.round(preRect.right - hostRect.left - 31)}px`;
        // 源码编辑态（围栏展开）与不可见时不显示。折叠态下源码 pre
        // 高度塌成 0 但宽度仍在，必须连高度一起判，否则按钮会叠在
        // 预览层按钮上方，右上角出现两个复制图标。
        const hidden =
          Boolean(pre.closest(".vditor-ir__node--expand")) ||
          preRect.width === 0 ||
          preRect.height === 0;
        button.style.display = hidden ? "none" : "";
      });
    };

    const images = installImageControls(host, irRoot, expandedImages, imagePreviews);
    const positionImageButtons = images.position;

    // 尾部垫白：内容末尾垫 3/4 编辑框高的空白（随视口与放大态高度变化
    // 重算），手动把滚动条拉到底时，最后一行内容正好停在编辑框上方
    // 1/4 处——配合输入时的末尾打字机滚动（见 freezeScrollOnInput），
    // 两种到达方式得到同一画面。经 CSS 变量喂给 .vditor-reset::after
    // 伪元素（见 markdown.module.scss）：滚动容器自身的 padding-bottom
    // 不计入 Chrome 的滚动范围，伪元素才计入。Vditor 每次重渲染都会
    // 重置 .vditor-reset 的内联样式，因此 annotate 每次都要补写（幂等）。
    const applyTailPadding = () => {
      irRoot.style.setProperty(
        "--cc98-tail-space",
        `${Math.round(irRoot.clientHeight * 0.75)}px`
      );
    };

    const annotate = () => {
      // 尾部垫白补写（applyTailPadding 幂等，仅写同值）。
      applyTailPadding();
      const hljs = (
        window as unknown as { hljs?: { getLanguage?: (lang: string) => unknown } }
      ).hljs;
      host.querySelectorAll("pre > code").forEach((code) => {
        const pre = code.parentElement;
        if (!pre) return;
        const match = /language-([\w+#-]+)/.exec(code.className);
        if (!match) {
          pre.removeAttribute("data-lang");
          copyButtons.get(pre)?.remove();
          copyButtons.delete(pre);
          return;
        }
        const lang = match[1];
        const valid =
          /^[A-Za-z0-9+#_-]{1,20}$/.test(lang) &&
          (!hljs?.getLanguage || Boolean(hljs.getLanguage(lang)));
        pre.setAttribute("data-lang", valid ? lang : "code");
        // 复制按钮只放预览层（.vditor-ir__preview）。源码编辑层的
        // pre.vditor-ir__marker--pre 折叠时高度为 0、宽度仍在，若也
        // 配按钮会与预览层按钮上下叠出两个复制图标。
        if (pre.classList.contains("vditor-ir__marker--pre")) {
          copyButtons.get(pre)?.remove();
          copyButtons.delete(pre);
          return;
        }
        let button = copyButtons.get(pre);
        if (!button) {
          button = document.createElement("button");
          button.type = "button";
          button.className = "cc98-code-copy";
          button.title = "复制代码";
          button.setAttribute("aria-label", "复制代码");
          button.innerHTML =
            '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>';
          button.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            // 点击时实时取 code 内容：Vditor 重渲染会替换 code 元素，
            // 闭包里的旧引用内容可能已过期。
            copyCode(
              (pre.querySelector("code") ?? pre).innerText
            );
          });
          host.appendChild(button);
          copyButtons.set(pre, button);
        }
      });
      images.refresh();
      // 链接模板预填清理：Vditor 插入链接（工具栏按钮/Ctrl+K）时 URL 位
      // 预填 "https://"，而光标落在文字位——留着会让用户误以为 URL 已填
      // 好，生成的链接 href 无效。清空恰好为 "https://" 的 URL 位；真实
      // URL（哪怕以 https:// 开头）不受影响。模板插入本身触发本循环，
      // 两条插入路径都覆盖。
      irRoot
        .querySelectorAll<HTMLElement>(
          'span[data-type="a"] .vditor-ir__marker--link'
        )
        .forEach((link) => {
          if (link.textContent === "https://") {
            link.textContent = "";
          }
        });
      // 清理已随内容更新消失的代码块对应的按钮。
      copyButtons.forEach((button, pre) => {
        if (!pre.isConnected || !host.contains(pre)) {
          button.remove();
          copyButtons.delete(pre);
        }
      });
      positionCopyButtons();
      // 图片按钮定位随每轮标注立即执行（R01）：首次创建、展开/折叠、
      // DOM 重建后不依赖用户先滚动窗口才对齐。
      positionImageButtons();
    };
    annotate();
    const observer = new MutationObserver((records) => {
      if (records.some((record) => record.type === "childList" ||
        (record.type === "attributes" && record.oldValue !== (record.target as Element).getAttribute("class")))) annotate();
    });
    // 观察根只覆盖可编辑内容（irRoot）：Vditor 的内容重建、折叠态 class
    // 变化都发生在这里；而 annotate 自己注入的辅助按钮挂在 host（irRoot
    // 之外）——缩小观察根后，观察器不会看到自己创建的辅助 DOM，从根上
    // 消除自触发循环（R01）。
    observer.observe(irRoot, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class"],
      attributeOldValue: true,
    });
    // 内容滚动（编辑框内部滚动条）与窗口尺寸变化时同步按钮位置。
    const positionAllButtons = () => {
      positionCopyButtons();
      positionImageButtons();
    };
    host.addEventListener("scroll", positionAllButtons, true);
    window.addEventListener("scroll", positionAllButtons, true);
    window.addEventListener("resize", positionAllButtons);
    // 编辑期间冻结一切自动滚动（需求：打字时页面与编辑框都不要自动滑）。
    // 两个来源：浏览器在输入时为「保证光标可见」滚动所有可滚动的祖先
    // （整页 + 编辑框内部滚动条）；Vditor 的输入重渲染也会晚一拍重置编辑
    // 框内部滚动。
    //
    // 同一编辑器同时只有一个滚动控制任务（M04）：每次输入刷新该任务的
    // 目标坐标与时间窗，而不是各自新建互相竞争的恢复循环；任务按时间戳
    // 结束（约 600ms，不依赖屏幕刷新率），rAF 句柄保存以便卸载/收起时
    // 取消。滚轮/触摸滚动立即解除锁定（监听器随 effect 装卸一次）；
    // 箭头键等纯光标移动不触发锁定，保留原生跟随。
    //
    // 滚到底的留白（需求：滑到底时已编辑内容最多占编辑框 1/4）由尾部
    // 垫白实现（applyTailPadding + ::after 伪元素，见下）：纯静态空白，
    // 不参与任何自动滚动——本机制只冻结、不驱动。
    const innerScrollerOf = () =>
      host.querySelector<HTMLElement>(".vditor-ir .vditor-reset");
    const SCROLL_LOCK_WINDOW_MS = 600;
    interface ScrollLock {
      raf: number;
      pageY: number;
      innerY: number;
      inner: HTMLElement | null;
      startedAt: number;
    }
    let scrollLock: ScrollLock | null = null;
    const releaseScrollLock = () => {
      if (!scrollLock) return;
      cancelAnimationFrame(scrollLock.raf);
      scrollLock = null;
    };
    const restoreLoop = () => {
      const lock = scrollLock;
      if (!lock) return;
      if (performance.now() - lock.startedAt >= SCROLL_LOCK_WINDOW_MS) {
        scrollLock = null;
        return;
      }
      if (Math.abs(window.scrollY - lock.pageY) > 0.5) {
        window.scrollTo(0, lock.pageY);
      }
      const selection = window.getSelection();
      const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
      const caret = range?.getBoundingClientRect();
      const bounds = lock.inner?.getBoundingClientRect();
      if (caret && bounds && caret.height && (caret.bottom > bounds.bottom || caret.top < bounds.top)) {
        releaseScrollLock();
        return;
      }
      if (lock.inner && Math.abs(lock.inner.scrollTop - lock.innerY) > 0.5) {
        lock.inner.scrollTop = lock.innerY;
      }
      lock.raf = requestAnimationFrame(restoreLoop);
    };
    const onUserWheel = () => releaseScrollLock();
    window.addEventListener("wheel", onUserWheel, { passive: true, capture: true });
    window.addEventListener("touchmove", onUserWheel, { passive: true, capture: true });
    const freezeScrollOnInput = () => {
      const inner = innerScrollerOf();
      // 刷新既有任务：新输入以最新坐标重启时间窗，避免旧坐标与新任务竞争。
      releaseScrollLock();
      scrollLock = {
        raf: requestAnimationFrame(restoreLoop),
        pageY: window.scrollY,
        inner,
        innerY: inner ? inner.scrollTop : 0,
        startedAt: performance.now(),
      };
    };
    const onNavigation = (event: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "PageUp", "PageDown", "Home", "End"].includes(event.key)) releaseScrollLock();
    };
    host.addEventListener("keydown", onNavigation, true);
    document.addEventListener("pointerdown", releaseScrollLock, true);
    host.addEventListener("input", freezeScrollOnInput, true);

    const heightObserver = new ResizeObserver(() => {
      applyTailPadding();
      positionAllButtons();
    });
    heightObserver.observe(irRoot);
    heightObserver.observe(host);
    return () => {
      heightObserver.disconnect();
      images.dispose();
      observer.disconnect();
      releaseScrollLock();
      window.removeEventListener("wheel", onUserWheel, true);
      window.removeEventListener("touchmove", onUserWheel, true);
      host.removeEventListener("scroll", positionAllButtons, true);
      window.removeEventListener("scroll", positionAllButtons, true);
      window.removeEventListener("resize", positionAllButtons);
      host.removeEventListener("input", freezeScrollOnInput, true);
      host.removeEventListener("keydown", onNavigation, true);
      document.removeEventListener("pointerdown", releaseScrollLock, true);
      copyButtons.forEach((button) => button.remove());
      copyButtons.clear();
    };
}
