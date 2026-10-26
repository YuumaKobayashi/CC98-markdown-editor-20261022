import { formAuthorizeHeader } from "@modules/session/api/session";
import { refreshUserInfo } from "@modules/session/api/refresh-user-info";
import { cc98Fetch } from "@foundation/api/http";
import type { ThemeSetting } from "../model/dto";
import type { UserTopicViewMode } from "@modules/user/model/dto";

export async function updateThemeSetting(
  setting: ThemeSetting,
): Promise<Response> {
  const headers = await formAuthorizeHeader();
  headers.append("Content-Type", "application/json");
  return cc98Fetch("me/theme-setting", {
    headers,
    method: "PUT",
    body: JSON.stringify(setting),
  });
}

export async function updateTheme(theme: number): Promise<Response> {
  const headers = await formAuthorizeHeader();
  return cc98Fetch(`/me/theme?id=${theme}`, {
    headers,
    method: "PUT",
  });
}

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
