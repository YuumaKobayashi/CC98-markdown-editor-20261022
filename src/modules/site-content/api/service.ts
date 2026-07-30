import { formAuthorizeHeader, getToken } from "@modules/session";
import { cc98Fetch } from "@foundation/api/http";

import type { ForumIndexColumnInfo } from "../model/types";

export async function getGlobalConfig() {
  const headers = await formAuthorizeHeader();
  const url = `/config/global`;
  const response = await cc98Fetch(url, { headers });
  const data = await response.json();
  return data;
}

export async function getPublicGlobalConfig() {
  const response = await cc98Fetch("/config/global");
  const data = await response.json();
  return data;
}

export async function changeSiteAnnouncement(announcement: string) {
  const token = await getToken();
  const headers = new Headers();
  headers.append("Authorization", token);
  headers.append("Content-Type", "application/json");
  const response = await cc98Fetch("/config/global/announcement", {
    method: "PUT",
    headers,
    body: JSON.stringify({ announcement }),
  });
  if (response.status !== 200) throw new Error(response.status.toString());
}

export async function clearMainPageCache() {
  const headers = await formAuthorizeHeader();
  const response = await cc98Fetch("/config/index/update", {
    method: "PUT",
    headers,
  });
  if (response.status !== 200) throw new Error(response.status.toString());
}

export async function getAdvertisements() {
  const token = await getToken();
  const headers = new Headers();
  headers.append("Authorization", token);
  headers.append("Content-Type", "application/json");
  const response = await cc98Fetch("/config/global/advertisement", {
    method: "GET",
    headers,
  });
  const data = await response.json();
  return data;
}

export async function getMainPageData() {
  const response = await cc98Fetch("/config/index");
  const data = await response.json();
  return data;
}

export async function getIndexColumnInfo(url: string) {
  const token = await getToken();
  const headers = new Headers();
  headers.append("Authorization", token);
  const response = await cc98Fetch(`${url}/all`, { headers });
  const data = await response.json();
  return data;
}

export async function putIndexColumnInfo(item: ForumIndexColumnInfo) {
  const url = item.isNew ? "/index/column/" : `/index/column/${item.id}`;
  const method = item.isNew ? "POST" : "PUT";
  const token = await getToken();
  const headers = new Headers();
  headers.append("Authorization", token);
  headers.append("Content-Type", "application/json");
  const response = await cc98Fetch(url, {
    method,
    headers,
    body: JSON.stringify(item),
  });
  if (response.status !== 200) throw new Error(response.status.toString());
}
