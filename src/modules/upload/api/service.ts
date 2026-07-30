import $ from "jquery";
import { formAuthorizeHeader } from "@modules/session";
import { cc98Fetch } from "@foundation/api/http";

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
