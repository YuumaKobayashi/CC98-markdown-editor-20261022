import { cc98Fetch } from "@foundation/api/http";
import {
  formAuthorizeHeader,
  getToken,
} from "@modules/session";
import type { EditorPostRequest, EditorTopicRequest } from "../model/types";

function createJsonHeaders(token: string): Headers {
  const headers = new Headers();
  headers.append("Authorization", token);
  headers.append("Content-Type", "application/json");
  return headers;
}

export async function getEditorBoard(
  boardId: number | string,
  currentToken?: string
): Promise<Response> {
  const token = currentToken || (await getToken());
  const headers = new Headers();
  headers.append("Authorization", token);
  return cc98Fetch(`/Board/${boardId}`, { headers });
}

export async function getOriginalEditorPost(
  postId: number | string,
  currentToken?: string
): Promise<Response> {
  const token = currentToken || (await getToken());
  const headers = new Headers();
  headers.append("Authorization", token);
  return cc98Fetch(`/post/${postId}/original`, { headers });
}

export async function createEditorTopic(
  boardId: string,
  content: EditorTopicRequest,
  token: string
): Promise<Response> {
  return cc98Fetch(`/board/${boardId}/topic`, {
    method: "POST",
    headers: createJsonHeaders(token),
    body: JSON.stringify(content),
  });
}

export async function updateEditorPost(
  postId: string,
  content: EditorPostRequest,
): Promise<Response> {
  const headers = await formAuthorizeHeader();
  headers.append("Content-Type", "application/json");
  return cc98Fetch(`/post/${postId}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(content),
  });
}

export async function sendEditorAtNotification(
  topicId: number | string,
  postId: number | string,
  atUsers: string[],
  token: string
): Promise<Response> {
  return cc98Fetch(
    `/notification/at?topicid=${topicId}&postid=${postId}`,
    {
      method: "POST",
      headers: createJsonHeaders(token),
      body: JSON.stringify(atUsers),
    }
  );
}
