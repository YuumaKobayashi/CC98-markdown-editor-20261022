import { formAuthorizeHeader } from "@modules/session";
import { cc98Fetch } from "@foundation/api/http";
import { getAccessToken } from "@foundation/storage/web-storage";
import type { NewPostInfo } from "@modules/post";
import type { VoteInfo } from "@modules/topic";

export async function updateFollowedUser(
  userId: number,
  method: "PUT" | "DELETE"
): Promise<Response> {
  const headers = new Headers();
  headers.append("Authorization", getAccessToken());
  return cc98Fetch(`/me/followee/${userId}`, {
    method,
    headers,
  });
}

export async function getTopicVote(topicId: number): Promise<VoteInfo> {
  const headers = await formAuthorizeHeader();
  const response = await cc98Fetch(`/topic/${topicId}/vote`, { headers });
  return (await response.json()) as VoteInfo;
}

export async function submitTopicVote(
  topicId: number,
  items: number[],
): Promise<Response> {
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
  body: NewPostInfo
): Promise<Response> {
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
  atUsers: string[]
): Promise<Response> {
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
