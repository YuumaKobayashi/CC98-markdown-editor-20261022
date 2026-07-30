import { formAuthorizeHeader, refreshUserInfo } from "@modules/session";
import { cc98Fetch } from "@foundation/api/http";

export async function setUserTopicViewMode(mode: number) {
  let url = `/me/topic-view-mode?mode=${mode}`;
  let headers = await formAuthorizeHeader();
  let response = await cc98Fetch(url, { headers, method: "PUT" });
  if (response.ok) {
    refreshUserInfo();
  }
}
