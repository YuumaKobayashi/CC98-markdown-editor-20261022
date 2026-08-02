import { formAuthorizeHeader, getToken } from "@modules/session";
import { cc98Fetch } from "@foundation/api/http";

import type {
  ForumIndexColumn,
  ForumIndexColumnInfo,
  IIndex,
  ISite,
  PostForumIndexColumnInfo,
  SiteIndexColumnEditorItem,
} from "../model/types";

export async function getGlobalConfig(): Promise<ISite> {
  const headers = await formAuthorizeHeader();
  const url = `/config/global`;
  const response = await cc98Fetch(url, { headers });
  const data = await response.json();
  return data;
}

export async function getPublicGlobalConfig(): Promise<ISite> {
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

export async function getAdvertisements(): Promise<ForumIndexColumnInfo[]> {
  const token = await getToken();
  const headers = new Headers();
  headers.append("Authorization", token);
  headers.append("Content-Type", "application/json");
  const response = await cc98Fetch("/config/global/advertisement", {
    method: "GET",
    headers,
  });
  const data = (await response.json()) as ForumIndexColumnInfo[];
  return data;
}

export async function getMainPageData(): Promise<IIndex> {
  const response = await cc98Fetch("/config/index");
  const data = await response.json();
  return data;
}

export async function getIndexColumnInfo(
  url: string
): Promise<ForumIndexColumn[]> {
  const token = await getToken();
  const headers = new Headers();
  headers.append("Authorization", token);
  const response = await cc98Fetch(`${url}/all`, { headers });
  const data = (await response.json()) as ForumIndexColumn[];
  return data;
}

export async function putIndexColumnInfo(item: SiteIndexColumnEditorItem) {
  const url = item.isNew ? "/index/column/" : `/index/column/${item.id}`;
  const method = item.isNew ? "POST" : "PUT";
  const token = await getToken();
  const headers = new Headers();
  headers.append("Authorization", token);
  headers.append("Content-Type", "application/json");
  const body = item as PostForumIndexColumnInfo;
  const response = await cc98Fetch(url, {
    method,
    headers,
    body: JSON.stringify(body),
  });
  if (response.status !== 200) throw new Error(response.status.toString());
}
