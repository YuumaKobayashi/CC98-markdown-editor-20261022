import { uploadFile } from "@modules/upload/api/service";

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
