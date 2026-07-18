import { Constants } from "@shared/config/runtime-config";

export async function cc98Fetch(
  url: string,
  init?: RequestInit
): Promise<Response> {
  const fetchUrl = new URL(url, Constants.config.apiUrl).toString();
  return init ? fetch(fetchUrl, init) : fetch(fetchUrl);
}

/**
 * 获取 API 的 URL 基础路径。
 */
export function getApiUrl(): string {
  return Constants.config.apiUrl;
}
