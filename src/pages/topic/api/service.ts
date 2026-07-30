import { formAuthorizeHeader } from "@modules/session";
import { cc98Fetch } from "@foundation/api/http";
import { getAccessToken } from "@foundation/storage/web-storage";

export async function updateFollowedUser(
  userId: number,
  method: "PUT" | "DELETE"
) {
  const headers = new Headers();
  headers.append("Authorization", getAccessToken());
  return cc98Fetch(`/me/followee/${userId}`, {
    method,
    headers,
  });
}

export async function getTopicVote(topicId: number) {
  const headers = await formAuthorizeHeader();
  const response = await cc98Fetch(`/topic/${topicId}/vote`, { headers });
  return response.json();
}

export async function submitTopicVote(topicId: number, items: number[]) {
  const headers = await formAuthorizeHeader();
  headers.append("Content-Type", "application/json");
  return cc98Fetch(`/topic/${topicId}/vote`, {
    method: "POST",
    headers,
    body: JSON.stringify({ items }),
  });
}

export async function submitTopicReply(
  topicId: number,
  token: string,
  body: unknown
) {
  const headers = new Headers();
  headers.append("Authorization", token);
  headers.append("Content-Type", "application/json");
  return cc98Fetch(`/topic/${topicId}/post`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
}

export async function sendAtNotification(
  topicId: number,
  postId: string,
  token: string,
  atUsers: unknown
) {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Authorization", token);
  return cc98Fetch(
    `/notification/at?topicid=${topicId}&postid=${postId}`,
    {
      method: "POST",
      headers,
      body: JSON.stringify(atUsers),
    }
  );
}
