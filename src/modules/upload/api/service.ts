import $ from "jquery";
import { formAuthorizeHeader, getToken } from "@modules/session/api/session";
import { cc98Fetch } from "@foundation/api/http";

/**
 * 上传文件
 * 成功时isSuccess为true，content为返回的地址
 * 失败时isSuccess为false，content为错误原因
 * @param file
 */
export interface UploadResult {
  isSuccess: boolean;
  content: string;
}

export async function uploadFile(file: File): Promise<UploadResult> {
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
    const data = (await res.json()) as string[];
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

export async function uploadPortraitFile(
  file: Blob & { name: string },
): Promise<Response> {
  const headers = new Headers();
  headers.append("Authorization", await getToken());
  const formdata = new FormData();
  formdata.append("files", file, file.name);
  formdata.append("contentType", "multipart/form-data");
  return cc98Fetch("/file/portrait", {
    method: "POST",
    headers,
    body: formdata,
  });
}

export async function uploadEditorFiles(
  files: File[],
  shouldCompassImage?: boolean,
): Promise<Response> {
  const url = !shouldCompassImage ? "/file?compressImage=false" : "/file";
  const headers = await formAuthorizeHeader();
  const formdata = new FormData();
  formdata.append("contentType", "multipart/form-data");
  files.map((item) => formdata.append("files", item, item.name));
  return cc98Fetch(url, {
    method: "POST",
    headers,
    body: formdata,
  });
}

export function clickUploadIcon() {
  $("#upload-files").click();
}
