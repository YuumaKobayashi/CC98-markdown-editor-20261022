import $ from "jquery";

/**
 *滚动条在Y轴上的滚动距离,为isBottom()服务
 */
export function getScrollTop() {
  let scrollTop = 0;
  let bodyScrollTop = 0;
  let documentScrollTop = 0;
  if (document.body) {
    bodyScrollTop = document.body.scrollTop;
  }
  if (document.documentElement) {
    documentScrollTop = document.documentElement.scrollTop;
  }
  scrollTop =
    bodyScrollTop - documentScrollTop > 0 ? bodyScrollTop : documentScrollTop;
  return scrollTop;
}

/**
 *文档的总高度，为isBottom()服务
 */
export function getScrollHeight() {
  let scrollHeight = 0;
  let bodyScrollHeight = 0;
  let documentScrollHeight = 0;
  if (document.body) {
    bodyScrollHeight = document.body.scrollHeight;
  }
  if (document.documentElement) {
    documentScrollHeight = document.documentElement.scrollHeight;
  }
  scrollHeight =
    bodyScrollHeight - documentScrollHeight > 0
      ? bodyScrollHeight
      : documentScrollHeight;
  return scrollHeight;
}

/**
 *浏览器视口的高度，为isBottom()服务
 */
export function getWindowHeight() {
  let windowHeight = 0;
  if (document.compatMode == "CSS1Compat") {
    windowHeight = document.documentElement.clientHeight;
  } else {
    windowHeight = document.body.clientHeight;
  }
  return windowHeight;
}

/**
 *判断滚动条是否滚动到底部
 */

export function isBottom() {
  /*
   * 预留300px给“正在加载”的提示标志
   */
  if (
    window.innerHeight + window.pageYOffset + 300 >=
    document.documentElement.scrollHeight
  ) {
    return true;
  } else {
    return false;
  }
}

export async function copyToClipboard(text: string) {
  if (!navigator.clipboard) {
    const textArea = document.createElement("textarea");
    let successful = false;
    try {
      textArea.value = text;
      Object.assign(textArea.style, {
        top: "-999",
        left: "-999",
        outerWidth: "0",
        outerHeight: "0",
        position: "fixed",
      });
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      successful = document.execCommand("copy");
    } finally {
      textArea.remove();
    }
    if (successful) {
      return;
    }
    throw new Error("Failed to run document.execCommand().");
  }
  await navigator.clipboard.writeText(text);
}
