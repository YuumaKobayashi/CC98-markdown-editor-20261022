import {
  invalidateUserInfoCache,
  readLocalUserInfoCache,
} from "../cache/public-user-cache";
import { getUserInfo } from "./get-user-info";
import { UserGender } from "../model/enums";
import type { UserViewModel } from "../model/types";
import { cc98Fetch } from "@foundation/api/http";

export function getThisUserInfo(userId, usersInfo) {
  for (let i in usersInfo) {
    if (usersInfo[i]) {
      if (usersInfo[i].id === userId) {
        return usersInfo[i];
      }
    }
  }
  //查询失败
  let indexData = {
    id: userId,
    name: "ID不存在",
    portraitUrl: "/static/images/default_avatar_boy.png",
    birthday: "1993-03-25T00:00:00",
    fanCount: 0,
    followCount: 0,
    gender: UserGender.Female,
    lastLogOnTime: "2007-12-26T02:26:00",
    popularity: 0,
    prestige: 0,
    signatureCode: "此ID已不存在，qmd无法显示",
  };
  return indexData;
}

export function getThisUserInfobyName(userName, usersName) {
  for (let i in usersName) {
    if (usersName[i].name === userName) return usersName[i];
  }
  //查询失败
  let indexData = {
    id: null,
    name: "ID不存在",
    portraitUrl: "/static/images/default_avatar_boy.png",
    birthday: "1993-03-25T00:00:00",
    fanCount: 0,
    followCount: 0,
    gender: UserGender.Female,
    lastLogOnTime: "2007-12-26T02:26:00",
    popularity: 0,
    prestige: 0,
    signatureCode: "此ID已不存在，qmd无法显示",
  };
  return indexData;
}

/*export async function getTotalReplyCount(topicid, router) {
    try {
        let token = await await getToken();
        const headers = new Headers();
        headers.append('Authorization', token);
        const replyCountResponse = await cc98Fetch(`/Topic/${topicid}`, { headers });
        if (replyCountResponse.status === 401) {
            throwLegacyError('UnauthorizedTopic');
        }
        if (replyCountResponse.status === 404) {
            throwLegacyError('NotFoundTopic');
        }
        if (replyCountResponse.status === 500) {
            throwLegacyError('ServerError');
        }
        const replyCountJson = await replyCountResponse.json();
        const replyCount = replyCountJson.replyCount;
        if (replyCount >= 10) {
            return (replyCount - replyCount % 10) / 10 + 1;
        } else {
            return 1;
        }
    } catch (e) {
        //throwLegacyError('Disconnected');
    }
}
*/

export async function getUserDetails(userId) {
  try {
    const data = await getUserInfo(userId);
    const viewData: UserViewModel = data;
    const body = {
      portraitUrl: data.portraitUrl,
      userName: data.name,
      fanCount: data.fanCount,
      displayTitle: viewData.displayTitle,
      birthday: data.birthday,
      prestige: data.prestige,
      gender: data.gender,
      levelTitle: data.levelTitle,
      isFollowing: data.isFollowing,
    };
    return body;
  } catch (e) {
    //throwLegacyError('Disconnected');
  }
}

export async function getPortraitUrl(userName) {
  const url = `/user/name/${encodeURIComponent(userName)}`;
  const response = await cc98Fetch(url);
  const data = await response.json();
  return data.portraitUrl;
}

export async function updateUserInfo(id, name) {
  await invalidateUserInfoCache(id, name);
  await getUserInfo(id);
}

export async function getBasicUsersInfo(userIds: number[]) {
  let usersInfoNeeded = [];
  let finalUsersInfo = [];
  //检查本地是否有缓存
  for (let i = 0; i < userIds.length; i++) {
    let thisUserInfo = readLocalUserInfoCache(userIds[i]);
    if (thisUserInfo) {
      finalUsersInfo.push(thisUserInfo);
    } else {
      usersInfoNeeded.push(userIds[i]);
    }
  }
  if (usersInfoNeeded.length === 0) {
    return finalUsersInfo;
  } else {
    let url = "/user/basic";
    for (let i = 0; i < usersInfoNeeded.length; i++) {
      if (i === 0) {
        url = `${url}?id=${usersInfoNeeded[i]}`;
      } else {
        url = `${url}&id=${usersInfoNeeded[i]}`;
      }
    }
    try {
      //合并查询和缓存的
      let response = await cc98Fetch(url);
      var data = await response.json();
      for (let i of data) {
        finalUsersInfo.push(i);
      }
      return finalUsersInfo;
    } catch (e) {
      return [];
    }
  }
}
