"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSafeUploadUrl = isSafeUploadUrl;
exports.escapeMarkdownLabel = escapeMarkdownLabel;
exports.encodeMarkdownDestination = encodeMarkdownDestination;
exports.escapeHtmlAttribute = escapeHtmlAttribute;
exports.buildFileMarkdown = buildFileMarkdown;
/**
 * 上传服务的返回 URL 只接受 http(s)（站内相对路径按当前 origin 解析），
 * 拒绝脚本类协议——组件接口只约束"返回字符串"，这里按服务合同兜底校验。
 */
function isSafeUploadUrl(url) {
    try {
        const base = typeof window !== "undefined" ? window.location.href : undefined;
        const parsed = new URL(url, base);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
    }
    catch {
        return false;
    }
}
/** 转义 Markdown 链接文字/图片 alt 中的结构字符（[] 与反斜杠）。 */
function escapeMarkdownLabel(text) {
    return text
        .replace(/\\/g, "\\\\")
        .replace(/\[/g, "\\[")
        .replace(/\]/g, "\\]");
}
/** 链接目标：尖括号形式可承载空格与括号；内部的 < > 用百分号编码。 */
function encodeMarkdownDestination(url) {
    return `<${url.replace(/</g, "%3C").replace(/>/g, "%3E")}>`;
}
/** HTML 属性值转义（音/视频以裸 HTML 片段插入）。 */
function escapeHtmlAttribute(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}
function buildFileMarkdown(file, url) {
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
