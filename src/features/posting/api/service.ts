import $ from "jquery";
import { Constants } from "@shared/config/runtime-config";
import { getToken, formAuthorizeHeader } from "@features/auth/api/session";
import { cc98Fetch } from "@shared/api/http";
import { throwLegacyError } from "@shared/lib/legacy-utility-effects";

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

/**
 * 上传文件
 * 成功时isSuccess为true，content为返回的地址
 * 失败时isSuccess为false，content为错误原因
 * @param file
 */
export async function uploadFile(file: File) {
  try {
    // if (file.size > 5242880) {
    //     throw new Error('文件过大');
    // }
    const url = `/file`;
    const myHeaders = await formAuthorizeHeader();
    let formdata = new FormData();
    formdata.append("files", file, file.name);
    formdata.append("contentType", "multipart/form-data");
    let res = await cc98Fetch(url, {
      method: "POST",
      headers: myHeaders,
      body: formdata,
    });
    let data: string[] = await res.json();
    if (res.status === 200 && data.length !== 0) {
      return {
        isSuccess: true,
        content: data[0],
      };
    } else {
      throw {};
    }
  } catch (e) {
    return {
      isSuccess: false,
      content: e.message as string,
    };
  }
}

export function clickUploadIcon() {
  $("#upload-files").click();
}

export async function uploadEvent(e) {
  localStorage.setItem("react-mde-imageurl-status", "pending");
  const files = e.target.files;
  const res = await uploadFile(files[0]);
  if (res.isSuccess) {
    const url = res.content;
    localStorage.setItem("react-mde-imageurl-status", "success");
    localStorage.setItem("react-mde-imageurl", url);
    return url;
  } else {
    localStorage.setItem("react-mde-imageurl-status", "fail");
    return "";
  }

  // const baseUrl = getApiUrl();
  // const str = `![](${url})`;
  // console.log("in func "+str);
  // return url;
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
