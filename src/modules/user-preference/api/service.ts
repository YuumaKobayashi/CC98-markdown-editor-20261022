import { formAuthorizeHeader } from "@modules/session/api/session";
import { refreshUserInfo } from "@modules/session/api/refresh-user-info";
import { cc98Fetch } from "@foundation/api/http";
import type { UserTopicViewMode } from "@modules/user/model/enums";

export async function setUserTopicViewMode(
  mode: UserTopicViewMode,
): Promise<void> {
  let url = `/me/topic-view-mode?mode=${mode}`;
  let headers = await formAuthorizeHeader();
  let response = await cc98Fetch(url, { headers, method: "PUT" });
  if (response.ok) {
    refreshUserInfo();
  }
}
