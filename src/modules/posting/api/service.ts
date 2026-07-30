import { Constants } from "@foundation/config/runtime-config";
import { getToken, formAuthorizeHeader } from "@modules/session";
import { cc98Fetch } from "@foundation/api/http";
import { throwLegacyError } from "@foundation/lib/legacy-utility-effects";

export async function sendTopic(topicId) {
  try {
    const url = `/post/topic/${topicId}`;
    const c = Constants.testEditor.getMarkdown();
    const content = {
      content: c,
      contentType: 1,
      title: "",
    };
    const contentJson = JSON.stringify(content);
    const token = await getToken();
    const myHeaders = new Headers();
    myHeaders.append("Authorization", token);
    myHeaders.append("Content-Type", "application/json");
    const mes = await cc98Fetch(url, {
      method: "POST",
      headers: myHeaders,
      body: contentJson,
    });
    switch (mes.status) {
      case 401:
        throwLegacyError("LogOut");
      case 402:
        throwLegacyError("ContentNeeded");
      case 403:
        throwLegacyError("OperationForbidden");
      case 404:
        throwLegacyError("NotFoundTopic");
      case 500:
        throwLegacyError("ServerError");
    }
  } catch (e) {
    //throwLegacyError('Disconnected');
  }
}

//移动已收藏帖子的分组
//注意，这个需要帖子已收藏，否则报400。
// export async function moveFavTopic(topicId, groupId) {
//   const headers = await formAuthorizeHeader();
//   const url = `/me/favorite/${topicId}/move?groupid=${groupId}`;
//   headers.append("Content-Type", "application/json");
//   const response = await cc98Fetch(url, {
//     method: "PUT",
//     headers,
//   });
//   if (response.status === 200) return "ok";
//   else return "error";
// }

export async function editPost(postId, contentType, title, content) {
  const headers = await formAuthorizeHeader();
  const url = `/post/${postId}`;
  const bodyInfo = { content: content, title: title, contentType: contentType };
  const body = JSON.stringify(bodyInfo);
  const response = await cc98Fetch(url, { method: "PUT", headers, body });
  return "ok";
}
