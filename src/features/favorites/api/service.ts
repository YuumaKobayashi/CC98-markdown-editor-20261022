import { formAuthorizeHeader } from "@features/auth/api/session";
import { cc98Fetch } from "@foundation/api/http";

// export async function setFavoriteTopic(topicId) {
//   const headers = await formAuthorizeHeader();
//   const url = `/me/favorite/${topicId}`;
//   const reponse = await cc98Fetch(url, { method: "PUT", headers });
//   return "ok";
// }
//PUT 收藏帖子
export async function setFavoriteTopic(topicId, groupId = 0) {
  const headers = await formAuthorizeHeader();
  const url = `/me/favorite/${topicId}?groupid=${groupId}`;
  const reponse = await cc98Fetch(url, { method: "PUT", headers });
  return "ok";
}

export async function getFavoriteAllTopic() {
  const headers = await formAuthorizeHeader();
  const url = `/me/favorite-topic-group`
  const response = await cc98Fetch(url, { headers });
  const data = await response.json();
  return data;
}

export async function deleteFavoriteTopic(topicId) {
  const headers = await formAuthorizeHeader();
  const url = `/me/favorite/${topicId}`;
  const reponse = await cc98Fetch(url, { method: "DELETE", headers });
  return "ok";
}

export async function getFavState(topicId) {
  const headers = await formAuthorizeHeader();
  const url = `/topic/${topicId}/isfavorite`;
  const response = await cc98Fetch(url, { headers });
  const data = await response.json();
  return data;
}

//创建收藏夹
export async function createFavGroup(groupName: string) {
  const headers = await formAuthorizeHeader();
  const url = `/me/favorite-topic-group`;
  headers.append("Content-Type", "application/json");
  const response = await cc98Fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ name: groupName }),
  });
  if (response.status === 200) return "ok";
  else return "error";
}

//修改收藏夹名称
export async function updateFavGroup(groupId, groupName) {
  const headers = await formAuthorizeHeader();
  const url = `/me/favorite-topic-group/`;
  headers.append("Content-Type", "application/json");
  const response = await cc98Fetch(url, {
    method: "PUT",
    headers,
    body: JSON.stringify({ id: groupId, name: groupName }),
  });
  if (response.status === 200) return "ok";
  else return "error";
}

//删除收藏夹
export async function deleteFavGroup(groupId) {
  const headers = await formAuthorizeHeader();
  const url = `/me/favorite-topic-group?groupid=${groupId}`;
  headers.append("Content-Type", "application/json");
  const response = await cc98Fetch(url, {
    method: "DELETE",
    headers,
  });
  if (response.status === 200) return "ok";
  else return "error";
}
