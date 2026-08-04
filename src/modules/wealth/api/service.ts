import { getMyInfo } from "@modules/session/api/session";
import { refreshUserInfo } from "@modules/session/api/refresh-user-info";
import { formAuthorizeHeader } from "@modules/session/api/session";
import { cc98Fetch } from "@foundation/api/http";
import type { RewardDailyRecordInfo, TransferWealthInfo } from "../model/dto";

export async function queryWealth(
  boardId: number,
): Promise<RewardDailyRecordInfo | null> {
  const headers = await formAuthorizeHeader();
  const url = `/manage/reward-daily-record?boardId=${boardId}`;
  const response = await cc98Fetch(url, { headers });
  const json = (await response.json()) as RewardDailyRecordInfo | null;
  return json;
}

/**
 * 返回用户当前财富值
 */
export async function getUserWealth(): Promise<number> {
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

/**
 * 给指定用户转账
 * @param userNames 要转账的用户名数组
 * @param wealth 转账数目
 * @param reason 理由
 * @author AsukaSong
 */
export async function transferWealth(
  userNames: string[],
  wealth: number,
  reason: string
): Promise<string[]> {
  const headers = await formAuthorizeHeader();
  headers.append("Content-Type", "application/json");
  const url = "/me/transfer-wealth";
  const body: TransferWealthInfo = {
    userNames,
    wealth,
    reason,
  };
  const response = await cc98Fetch(url, {
    method: "PUT",
    headers,
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  // 服务器返回转账成功的用户名数组
  return (await response.json()) as string[];
}
