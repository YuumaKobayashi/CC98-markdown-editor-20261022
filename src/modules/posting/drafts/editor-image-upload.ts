import { uploadFile } from "@modules/upload/api/service";

/**
 * 上传单张图片，成功返回图片 URL，失败返回空字符串。
 * 由统一 Markdown 编辑器的 uploadImage prop 调用。
 */
export async function uploadImageFile(file: File): Promise<string> {
  const res = await uploadFile(file);
  return res.isSuccess ? res.content : "";
}