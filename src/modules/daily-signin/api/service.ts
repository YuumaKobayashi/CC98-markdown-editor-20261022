import { formAuthorizeHeader } from "@modules/session";
import { cc98Fetch } from "@foundation/api/http";

export async function signin(content) {
  const headers = await formAuthorizeHeader();
  headers.append("Content-Type", "application/json");
  const url = `/me/signin`;
  const response = await cc98Fetch(url, {
    method: "POST",
    headers,
    body: content,
  });
}

export async function getSigninInfo() {
  const headers = await formAuthorizeHeader();
  const url = `/me/signin`;
  const response = await cc98Fetch(url, { headers });
  const data = await response.json();
  return data;
}
