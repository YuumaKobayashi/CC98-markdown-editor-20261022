import { formAuthorizeHeader, getToken } from "@modules/session";
import { cc98Fetch } from "@foundation/api/http";

import type {
  ForumIndexColumn,
  ForumIndexColumnInfo,
  IIndex,
  ISite,
  PostForumIndexColumnInfo,
} from "../model/dto";

export async function getGlobalConfig(): Promise<ISite> {
  const headers = await formAuthorizeHeader();
  const url = `/config/global`;
  const response = await cc98Fetch(url, { headers });
  const data = (await response.json()) as ISite;
  return data;
}

export async function getPublicGlobalConfig(): Promise<ISite> {
  const response = await cc98Fetch("/config/global");
  const data = (await response.json()) as ISite;
  return data;
}

export async function changeSiteAnnouncement(
  announcement: string,
): Promise<void> {
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

export async function clearMainPageCache(): Promise<void> {
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
  const data = (await response.json()) as IIndex;
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

export async function putIndexColumnInfo(
  id: number | null,
  body: PostForumIndexColumnInfo,
): Promise<void> {
  const url = id === null ? "/index/column/" : `/index/column/${id}`;
  const method = id === null ? "POST" : "PUT";
  const token = await getToken();
  const headers = new Headers();
  headers.append("Authorization", token);
  headers.append("Content-Type", "application/json");
  const response = await cc98Fetch(url, {
    method,
    headers,
    body: JSON.stringify(body),
  });
  if (response.status !== 200) throw new Error(response.status.toString());
}
