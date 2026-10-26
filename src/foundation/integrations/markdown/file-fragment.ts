/** Match the HTTPS upgrade already used when reading CC98 posts. */
export function normalizeUploadedFileUrl(url: string): string {
  return url.trim().replace(/^http:\/\/file\.cc98\.org(?=\/|$)/i, "https://file.cc98.org");
}

/**
 * 上传服务的返回 URL 只接受 http(s)（站内相对路径按当前 origin 解析），
 * 拒绝脚本类协议——组件接口只约束"返回字符串"，这里按服务合同兜底校验。
 */
export function isSafeUploadUrl(url: string): boolean {
  if (!url.trim() || /[\u0000-\u001f\u007f]/.test(url)) return false;
  try {
    const base =
      typeof window !== "undefined" ? window.location.href : undefined;
    const parsed = new URL(url, base);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/** 转义 Markdown 链接文字/图片 alt 中的结构字符（[] 与反斜杠）。 */
export function escapeMarkdownLabel(text: string): string {
  return text.replace(/([\\`*_[\]<>!])/g, "\\$1").replace(/[\r\n]/g, " ");
}

/** 链接目标：尖括号形式可承载空格与括号；内部的 < > 用百分号编码。 */
export function encodeMarkdownDestination(url: string): string {
  return `<${url.replace(/\\/g, "%5C").replace(/</g, "%3C").replace(/>/g, "%3E")}>`;
}

/** HTML 属性值转义（音/视频以裸 HTML 片段插入）。 */
export function escapeHtmlAttribute(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function buildFileMarkdown(file: File, url: string): string {
  url = normalizeUploadedFileUrl(url);
  if (!isSafeUploadUrl(url)) {
    // 无法安全表示的返回值按上传失败处理（调用方会提示文件名）。
    return "";
  }
  const label = escapeMarkdownLabel(file.name);
  const destination = encodeMarkdownDestination(url);
  if (file.type.startsWith("image/")) {
    return `![${label}](${destination})`;
  }
  if (file.type.startsWith("video/")) {
    return `<video src="${escapeHtmlAttribute(url)}" controls="controls"></video>`;
  }
  if (file.type.startsWith("audio/")) {
    return `<audio src="${escapeHtmlAttribute(url)}" controls="controls"></audio>`;
  }
  return `[${label}](${destination})`;
}
