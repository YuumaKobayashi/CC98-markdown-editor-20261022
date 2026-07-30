import { getMyInfo, refreshUserInfo } from "@modules/session";
import { formAuthorizeHeader } from "@modules/session";
import { cc98Fetch } from "@foundation/api/http";

export async function queryWealth(boardId) {
  const headers = await formAuthorizeHeader();
  const url = `/manage/reward-daily-record?boardId=${boardId}`;
  const response = await cc98Fetch(url, { headers });
  const json = await response.json();
  return json;
}

/**
 * 返回用户当前财富值
 */
export async function getUserWealth() {
  //更改为直接从userinfo中获取
  let userInfo = getMyInfo();
  let wealth = userInfo.wealth;
  if (!wealth) {
    //如果没有财富值，刷新用户信息
    await refreshUserInfo();
    userInfo = getMyInfo();
    wealth = userInfo.wealth;
  }
  if (!wealth) {
    //如果还是没有财富值，那么就是获取失败了
    return -1;
  }
  // let wealth = getLocalStorage("wealth");
  // if (!wealth) {
  //   await refreshUserInfo();
  //   let userInfo = getMyInfo();
  //   wealth = userInfo.wealth;
  //   setLocalStorage("wealth", wealth, 300);
  // }
  return wealth;
}
