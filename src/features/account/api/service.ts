import { getMyInfo } from "@modules/user";
import { setLocalStorage, getLocalStorage } from "@foundation/storage/web-storage";
import { formAuthorizeHeader, isLogOn } from "@features/auth/api/session";
import { cc98Fetch } from "@foundation/api/http";
import { changeLegacyCurrentUser, throwLegacyError } from "@foundation/lib/legacy-utility-effects";

/**
 * 刷新当前用户信息
 */
export async function refreshUserInfo() {
  if (getLocalStorage("refresh_token")) {
    let headers = await formAuthorizeHeader();
    let response = await cc98Fetch(`/me`, {
      headers,
    });

    let userInfo = await response.json();
    changeLegacyCurrentUser(userInfo);
    setLocalStorage("userInfo", userInfo, 2592000);
  }
}

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

export async function getGlobalConfig() {
  const headers = await formAuthorizeHeader();
  const url = `/config/global`;
  const response = await cc98Fetch(url, { headers });
  const data = await response.json();
  return data;
}

export async function queryWealth(boardId) {
  const headers = await formAuthorizeHeader();
  const url = `/manage/reward-daily-record?boardId=${boardId}`;
  const response = await cc98Fetch(url, { headers });
  const json = await response.json();
  return json;
}

export async function getAnnualReview() {
  if (!isLogOn()) {
    throwLegacyError("LogOut");
    return null;
  }
  const url = "/me/annual-review-2022";
  const headers = await formAuthorizeHeader();
  const response = await cc98Fetch(url, { headers });
  return await response.json();
}

/**
 * 获取年度总结v2.0
 * @param year 年度总结的年份
 * @returns 年度总结数据
 */
export async function getAnnualReviewV2(year) {
  if (!isLogOn()) {
    throwLegacyError("LogOut");
    return null;
  }
  const url = `/me/annual-review-${year}`;
  const headers = await formAuthorizeHeader();
  const response = await cc98Fetch(url, { headers });
  return await response.json();
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

export async function setUserTopicViewMode(mode: number) {
  let url = `/me/topic-view-mode?mode=${mode}`;
  let headers = await formAuthorizeHeader();
  let response = await cc98Fetch(url, { headers, method: "PUT" });
  if (response.ok) {
    refreshUserInfo();
  }
}
