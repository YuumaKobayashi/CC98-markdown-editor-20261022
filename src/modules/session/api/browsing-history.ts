import { cc98Fetch } from "@foundation/api/http";
import { formAuthorizeHeader } from "./session";

/**
 * 更改当前用户是否记录主题浏览历史。
 * @param enabled 是否开启历史记录功能
 * @author XSYangtuo
 */
export async function setBrowsingHistoryEnabled(
  enabled: boolean,
): Promise<void> {
  const url = `/me/browsing-history?enabled=${enabled ? "true" : "false"}`;
  const headers = await formAuthorizeHeader();
  const response = await cc98Fetch(url, { method: "PUT", headers });

  if (response.status !== 200) {
    throw new Error(response.statusText);
  }
}
