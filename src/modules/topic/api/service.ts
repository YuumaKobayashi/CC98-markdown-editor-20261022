import type { UserRecentTopic } from "../model/types";
import { TopicSortMode } from "../model/enums";
import { getUserInfo } from "@modules/user";
import { getUsersInfo } from "@modules/user";
import { readTagInfoCache, writeTagInfoCache } from "../cache/tag-cache";
import { getToken, formAuthorizeHeader, isLogOn } from "@modules/session";
import { cc98Fetch } from "@foundation/api/http";
import { throwLegacyError } from "@foundation/lib/legacy-utility-effects";
import { getBoardName } from "@modules/board";
import { getBasicUsersInfo, getThisUserInfo } from "@modules/user";
import { replaceHttpToHttps } from "@foundation/lib/text";
import { transerRecentTime, transerTimeToYearMonthDay } from "@foundation/lib/time";

export async function getTopic(topicid: number) {
  try {
    const headers = await formAuthorizeHeader();
    const response = await cc98Fetch(`/Topic/${topicid}/post?from=0&size=1`, {
      headers,
    });
    const data = await response.json();
    let topicMessage = null;
    if (data[0].isAnonymous != true) {
      const userMesJson = await getUserInfo(data[0].userId);
      topicMessage = { ...data[0], userInfo: userMesJson, postId: data[0].id };
    } else {
      const anonymousUserName = `匿名${data[0].userName.toUpperCase()}`;
      let purl = "/static/images/心灵头像.gif";
      const userMesJson = {
        name: anonymousUserName,
        portraitUrl: purl,
        id: null,
        privilege: "匿名用户",
        popularity: 0,
        signatureCode: "",
        postCount: 0,
      };
      topicMessage = { ...data[0], userInfo: userMesJson, postId: data[0].id };
    }

    return topicMessage;
  } catch (e) {
    //throwLegacyError('Disconnected');
  }
}

export async function getTopicContent(topicid: number, curPage: number) {
  try {
    const startPage = (curPage - 1) * 10;
    const headers = await formAuthorizeHeader();
    const topic = await cc98Fetch(
      `/Topic/${topicid}/post?from=${startPage}&size=10`,
      { headers }
    );
    const content = await topic.json();
    const post = [];
    let topicNumberInPage = content.length;
    //收集id
    const usersId = [];
    let usersInfo = [];
    if (content.length === 0) return [];
    for (let j = 0; j < topicNumberInPage; j++) {
      content[j].content = replaceHttpToHttps(content[j].content);
      if (content[j].isAnonymous == false) {
        for (let i in content) {
          usersId[i] = content[i].userId;
        }
        usersInfo = await getUsersInfo(usersId);
      }
    }
    for (let i = 0; i < topicNumberInPage; i++) {
      if (content[i].isAnonymous != true && content[i].isDeleted != true) {
        let thisUserInfo = getThisUserInfo(content[i].userId, usersInfo);
        post[i] = {
          ...content[i],
          userInfo: thisUserInfo,
          postId: content[i].id,
        };
      } else if (content[i].isAnonymous && !content[i].isDeleted) {
        let purl = "/static/images/心灵头像.gif";
        const anonymousUserName = `匿名${content[i].userName.toUpperCase()}`;

        const userMesJson = {
          name: anonymousUserName,
          portraitUrl: purl,
          id: null,
          privilege: "匿名用户",
          popularity: 0,
          signatureCode: null,
          postCount: 0,
        };
        post[i] = {
          ...content[i],
          userInfo: userMesJson,
          postId: content[i].id,
          isAnonymous: true,
        };
      } else {
        const userMesJson = {
          name: "98Deleter",
          portraitUrl: "/static/images/deleter2.png",
          id: null,
          privilege: "匿名用户",
          popularity: 0,
          signatureCode: null,
          postCount: 0,
        };
        post[i] = {
          ...content[i],
          userInfo: userMesJson,
          postId: content[i].id,
          isAnonymous: false,
          isDeleted: true,
          content: "该贴已被my cc98, my home",
        };
      }
    }

    return post;
  } catch (e) {
    console.error(e);
    //throwLegacyError('Disconnected');
  }
}

export async function getHotReplyContent(topicid: number) {
  try {
    const headers = await formAuthorizeHeader();
    const response = await cc98Fetch(`/Topic/${topicid}/hot-post`, { headers });
    const content = await response.json();
    const post = [];
    let topicNumberInPage: number = content.length;
    for (let i = 0; i < topicNumberInPage; i++) {
      if (content[i].isAnonymous != true) {
        const userMesResponse = await cc98Fetch(
          `/user/name/${encodeURIComponent(content[i].userName)}`
        );
        const userMesJson = await userMesResponse.json();
        post[i] = {
          ...content[i],
          userInfo: userMesJson,
          postId: content[i].id,
        };
      } else {
        let purl = "/static/images/心灵头像.gif";
        const anonymousUserName = `匿名${content[i].userName.toUpperCase()}`;
        let anonymousLastReplierName = null;
        if (content[i].lastUpdateAuthor)
          anonymousLastReplierName = `匿名${content[
            i
          ].lastUpdateAuthor.toUpperCase()}`;
        const userMesJson = {
          name: anonymousUserName,
          portraitUrl: purl,
          id: null,
          privilege: "匿名用户",
          popularity: 0,
          signatureCode: null,
          postCount: 0,
        };
        post[i] = {
          ...content[i],
          userInfo: userMesJson,
          postId: content[i].id,
        };
      }
    }
    return post;
  } catch (e) {
    //throwLegacyError('Disconnected');
  }
}

export async function getCurUserTopic(topicid: number, userId: number) {
  try {
    const headers = await formAuthorizeHeader();
    const response = await cc98Fetch(
      `/post/topic/user?topicid=${topicid}&userid=${userId}&from=0&size=1`,
      { headers }
    );
    const data = await response.json();
    const userMesResponse = await cc98Fetch(
      `/user/name/${encodeURIComponent(data[0].userName)}`
    );
    const userMesJson = await userMesResponse.json();
    data[0].userInfo = userMesJson;
    return data[0];
  } catch (e) {
    //throwLegacyError('Disconnected');
  }
}

export async function getCurUserTopicContent(
  topicid: number,
  curPage: number,
  userId: number
) {
  try {
    const topicMessage = await getTopic(topicid);
    let start: number;
    let isUserPoster: boolean;
    start = (curPage - 1) * 10;

    const token = await getToken();
    const headers = new Headers();
    headers.append("Authorization", token);
    const topic = await cc98Fetch(
      `/Post/topic/user?topicid=${topicid}&userId=${userId}&from=${start}&size=10`,
      { headers }
    );
    const content = await topic.json();

    let post = [];
    let topicNumberInPage: number = content.length;
    const replyCount = content[0].count;
    const userMesJson = await getUserInfo(content[0].userId);
    for (let i = 0; i < topicNumberInPage; i++) {
      if (content[i].isAnonymous != true) {
        post[i] = {
          ...content[i],
          userInfo: userMesJson,
          postId: content[i].id,
        };
      } else {
        let purl = "/static/images/_心灵之约.png";
        const anonymousUserName = `匿名${content[i].userName.toUpperCase()}`;
        const userMesJson = {
          name: anonymousUserName,
          portraitUrl: purl,
          id: null,
          privilege: "匿名用户",
          popularity: 0,
          signatureCode: null,
          postCount: 0,
        };
        post[i] = {
          ...content[i],
          userInfo: userMesJson,
        };
      }
    }
    return post;
  } catch (e) {
    //throwLegacyError('Disconnected');
  }
}

/**
 * 获取随机精选（推荐）帖
 */
export async function getRandomRecommendedTopic(size: number) {
  //如果未登录,直接跳转至登录页面
  if (!isLogOn()) {
    throwLegacyError("LogOut");
    return null;
  }
  try {
    const headers = await formAuthorizeHeader();
    /**
     * 通过api获取到主题之后转成json格式
     */
    const response = await cc98Fetch(`/topic/random-recommendation?size=${size}`, {
      headers,
    });
    switch (response.status) {
      case 401:
        throwLegacyError("UnauthorizedTopic");
      case 403:
        throwLegacyError("OperationForbidden");
      case 404:
      //throwLegacyError('NotFoundTopic');
      case 500:
      //throwLegacyError('ServerError');
    }
    let newTopic = await response.json();
    //console.log("获取到的数据", newTopic);
    let aTopic = [];
    let aTopicId = [];
    let bTopic = [];
    for (let item of newTopic) {
      //时间转换
      item.topic.time = transerTimeToYearMonthDay(item.topic.time);
      item.topic.lastPostTime = transerTimeToYearMonthDay(item.topic.lastPostTime);

      //阅读数转换
      if (item.topic.hitCount > 10000) {
        if (item.topic.hitCount > 100000) {
          let index = parseInt(`${item.topic.hitCount / 10000}`);
          item.hitCount = `${index}万`;
        } else {
          let index = parseInt(`${item.topic.hitCount / 1000}`) / 10;
          item.topic.hitCount = `${index}万`;
        }
      }
      //计算总楼层
      item.topic.floorCount = item.topic.replyCount + 1;
      //回复数转换
      if (item.topic.replyCount > 10000) {
        if (item.topic.replyCount > 100000) {
          let index = parseInt(`${item.topic.replyCount / 10000}`);
          item.topic.replyCount = `${index}万`;
        } else {
          let index = parseInt(`${item.topic.replyCount / 1000}`) / 10;
          item.topic.replyCount = `${index}万`;
        }
      }
      //标签转换
      if (item.topic.tag1) {
        item.topic.tag1 = await getTagNamebyId(item.topic.tag1);
        if (item.topic.tag2) {
          item.topic.tag2 = await getTagNamebyId(item.topic.tag2);
        }
      }
      //处理匿名与非匿名主题，非匿名主题用户批量获取信息
      if (!item.topic.isAnonymous) {
        //获取所在版面名称
        item.topic.boardName = await getBoardName(item.topic.boardId);
        aTopic.push(item);
        aTopicId.push(item.topic.userId);
      } else {
        item.topic.portraitUrl = "/static/images/_心灵之约.png";
        item.topic.userName = "匿名用户";
        item.topic.boardName = await getBoardName(item.topic.boardId);
        bTopic.push(item);
      }
    }
    //对于非匿名数据批量获取头像地址
    let usersInfo = await getBasicUsersInfo(aTopicId);
    for (let i in aTopic) {
      let thisUserInfo = getThisUserInfo(aTopic[i].topic.userId, usersInfo);
      aTopic[i].topic.portraitUrl = thisUserInfo.portraitUrl;
    }
    for (let i = 0, j = 0, k = 0; i < newTopic.length; i++) {
      //console.log(`进入循环`);
      if (j === aTopic.length) {
        newTopic[i] = bTopic[k];
        k++;
      } else if (newTopic[i].id === aTopic[j].id) {
        //console.log(`条件1 i=${i} j = ${j}`);
        newTopic[i] = aTopic[j];
        j++;
      } else {
        //console.log(`条件2 i=${i} k = ${k}`);
        newTopic[i] = bTopic[k];
        k++;
      }
    }
    return newTopic;
  } catch (e) {
    //throwLegacyError('Disconnected');
  }
}

/**
 * 获取全站新帖
 * @param curPage
 */
export async function getAllNewTopic(from: number, mediaOnly: boolean = false) {
  //如果未登录,直接跳转至登录页面
  if (!isLogOn()) {
    throwLegacyError("LogOut");
    return null;
  }
  try {
    /**
     * 一次性可以获取20个主题
     */
    var size = 20;
    if (from > 480) {
      size = 500 - from;
    }
    const headers = await formAuthorizeHeader();
    /**
     * 通过api获取到主题之后转成json格式
     */
    var url = '';
    if (mediaOnly === true) {
      url = `/topic/new-media?from=${from}&size=${size}`;
    } else {
      url = `/topic/new?from=${from}&size=${size}`;
      //url = `/board/245/topic?from=${from}&size=${size}`; // for dev
    }
    const response = await cc98Fetch(url, {
      headers,
    });
    switch (response.status) {
      case 401:
        throwLegacyError("UnauthorizedTopic");
      case 403:
        throwLegacyError("OperationForbidden");
      case 404:
      //throwLegacyError('NotFoundTopic');
      case 500:
      //throwLegacyError('ServerError');
    }
    let newTopic = await response.json();
    //console.log("获取到的数据", newTopic);
    let aTopic = [];
    let aTopicId = [];
    let bTopic = [];
    for (let item of newTopic) {
      //时间转换
      item.time = transerRecentTime(item.time, false);
      item.lastPostTime = transerRecentTime(item.lastPostTime, false);

      //阅读数转换
      if (item.hitCount > 10000) {
        if (item.hitCount > 100000) {
          let index = parseInt(`${item.hitCount / 10000}`);
          item.hitCount = `${index}万`;
        } else {
          let index = parseInt(`${item.hitCount / 1000}`) / 10;
          item.hitCount = `${index}万`;
        }
      }
      //计算总楼层
      item.floorCount = item.replyCount + 1;
      //回复数转换
      if (item.replyCount > 10000) {
        if (item.replyCount > 100000) {
          let index = parseInt(`${item.replyCount / 10000}`);
          item.replyCount = `${index}万`;
        } else {
          let index = parseInt(`${item.replyCount / 1000}`) / 10;
          item.replyCount = `${index}万`;
        }
      }
      //标签转换
      if (item.tag1) {
        item.tag1 = await getTagNamebyId(item.tag1);
        if (item.tag2) {
          item.tag2 = await getTagNamebyId(item.tag2);
        }
      }
      //处理匿名与非匿名主题，非匿名主题用户批量获取信息
      if (!item.isAnonymous) {
        //获取所在版面名称
        item.boardName = await getBoardName(item.boardId);
        aTopic.push(item);
        aTopicId.push(item.userId);
      } else {
        item.portraitUrl = "/static/images/_心灵之约.png";
        item.userName = "匿名用户";
        item.boardName = await getBoardName(item.boardId);
        bTopic.push(item);
      }
    }
    //对于非匿名数据批量获取头像地址
    let usersInfo = await getBasicUsersInfo(aTopicId);
    for (let i in aTopic) {
      let thisUserInfo = getThisUserInfo(aTopic[i].userId, usersInfo);
      aTopic[i].portraitUrl = thisUserInfo.portraitUrl;
    }
    for (let i = 0, j = 0, k = 0; i < newTopic.length; i++) {
      //console.log(`进入循环`);
      if (j === aTopic.length) {
        newTopic[i] = bTopic[k];
        k++;
      } else if (newTopic[i].id === aTopic[j].id) {
        //console.log(`条件1 i=${i} j = ${j}`);
        newTopic[i] = aTopic[j];
        j++;
      } else {
        //console.log(`条件2 i=${i} k = ${k}`);
        newTopic[i] = bTopic[k];
        k++;
      }
    }
    //console.log("这里会执行吗");
    return newTopic;
  } catch (e) {
    //throwLegacyError('Disconnected');
  }
}

/**
 * 获取关注帖子,borderId == -2 为收藏的帖子，boardId == -1为关注用户帖子, boardId === 0 为全部关注版面帖子, boardId > 0则为对应版面帖子
 * @param curPage
 */
export async function getFocusTopic(
  boardId: number,
  boardName: string,
  from: number
) {
  //如果未登录,直接跳转至登录页面
  if (!isLogOn()) {
    throwLegacyError("LogOut");
    return null;
  }
  try {
    /**
     * 一次性可以获取20个主题
     */
    var size = 20;
    if (from > 180) {
      size = 200 - from;
    }
    const headers = await formAuthorizeHeader();
    /**
     * 通过api获取到主题之后转成json格式
     */
    let response;
    if (boardId === -1) {
      response = await cc98Fetch(
        `/me/followee/topic?from=${from}&size=${size}&order=${TopicSortMode.CreateTime}`,
        { headers }
      );
    } else if (boardId === 0) {
      response = await cc98Fetch(
        `/me/custom-board/topic?from=${from}&size=${size}`,
        { headers }
      );
    } else if (boardId === -2) {
      response = await cc98Fetch(
        `/topic/me/favorite?from=${from}&size=${size}&order=1`,
        { headers }
      );
    } else {
      response = await cc98Fetch(
        `/board/${boardId}/topic?from=${from}&size=${size}`,
        { headers }
      );
    }
    switch (response.status) {
      case 401:
        throwLegacyError("UnauthorizedTopic");
      case 403:
        throwLegacyError("OperationForbidden");
      case 404:
      //throwLegacyError('NotFoundTopic');
      case 500:
      //throwLegacyError('ServerError');
    }
    let newTopic = await response.json();
    let aTopic = [];
    let aTopicId = [];
    let bTopic = [];
    for (let item of newTopic) {
      //时间转换
      item.time = transerRecentTime(item.time);
      item.lastPostTime = transerRecentTime(item.lastPostTime);

      //阅读数转换
      if (item.hitCount > 10000) {
        if (item.hitCount > 100000) {
          let index = parseInt(`${item.hitCount / 10000}`);
          item.hitCount = `${index}万`;
        } else {
          let index = parseInt(`${item.hitCount / 1000}`) / 10;
          item.hitCount = `${index}万`;
        }
      }
      //计算总楼层
      item.floorCount = item.replyCount + 1;
      //回复数转换
      if (item.replyCount > 10000) {
        if (item.replyCount > 100000) {
          let index = parseInt(`${item.replyCount / 10000}`);
          item.replyCount = `${index}万`;
        } else {
          let index = parseInt(`${item.replyCount / 1000}`) / 10;
          item.replyCount = `${index}万`;
        }
      }
      //标签转换
      if (item.tag1) {
        item.tag1 = await getTagNamebyId(item.tag1);
        if (item.tag2) {
          item.tag2 = await getTagNamebyId(item.tag2);
        }
      }
      //处理匿名与非匿名主题，非匿名主题批量获取信息
      if (!item.isAnonymous) {
        //获取所在版面名称
        item.boardName = await getBoardName(item.boardId);
        aTopic.push(item);
        aTopicId.push(item.userId);
      } else {
        item.portraitUrl = "/static/images/_心灵之约.png";
        item.userName = "匿名用户";
        item.boardName = await getBoardName(item.boardId);
        bTopic.push(item);
      }
    }
    //对于非匿名数据批量获取头像地址
    let usersInfo = await getBasicUsersInfo(aTopicId);
    for (let i in aTopic) {
      let thisUserInfo = getThisUserInfo(aTopic[i].userId, usersInfo);
      aTopic[i].portraitUrl = thisUserInfo.portraitUrl;
    }
    for (var i = 0, j = 0, k = 0; i < newTopic.length; i++) {
      if (j === aTopic.length) {
        newTopic[i] = bTopic[k];
        k++;
      } else if (newTopic[i].id === aTopic[j].id) {
        newTopic[i] = aTopic[j];
        j++;
      } else {
        newTopic[i] = bTopic[k];
        k++;
      }
    }
    return newTopic;
  } catch (e) {
    //throwLegacyError('Disconnected');
  }
}

export async function getCurUserTotalReplyPage(topicId, userId) {
  try {
    const headers = await formAuthorizeHeader();
    const replyCountResponse = await cc98Fetch(
      `/post/topic/user?topicid=${topicId}&userid=${userId}&from=0&size=1`,
      { headers }
    );
    const replyCountJson = await replyCountResponse.json();
    const replyCount = replyCountJson[0].count;
    return replyCount % 10 === 0
      ? replyCount / 10
      : (replyCount - (replyCount % 10)) / 10 + 1;
  } catch (e) {
    //throwLegacyError('Disconnected');
  }
}

export async function getTraceTopicsCount(topicId, postId) {
  try {
    const headers = await formAuthorizeHeader();
    const response = await cc98Fetch(
      `/post/topic/specific-user?topicid=${topicId}&postid=${postId}&from=0&size=1`,
      { headers }
    );
    const data = await response.json();
    return data[0].count % 10 === 0
      ? data[0].count / 10
      : (data[0].count - (data[0].count % 10)) / 10 + 1;
  } catch (e) {
    //throwLegacyError('Disconnected');
  }
}

export async function getTraceTopics(topicId, postId, page) {
  const start = (page - 1) * 10;
  try {
    const headers = await formAuthorizeHeader();
    const response = await cc98Fetch(
      `/post/topic/specific-user?topicid=${topicId}&postid=${postId}&from=${start}&size=10`,
      { headers }
    );
    const data = await response.json();
    if (data[0] && data[0].isAnonymous) {
      let purl = "/static/images/心灵头像.gif";
      for (let i in data) {
        const anonymousUserName = `匿名${data[i].userName.toUpperCase()}`;
        const userMesJson = {
          name: anonymousUserName,
          portraitUrl: purl,
          id: null,
          privilege: "匿名用户",
          popularity: 0,
          signatureCode: null,
          postCount: 0,
          fanCount: 0,
        };
        data[i].userInfo = userMesJson;
        data[i].postId = postId;
      }
    } else {
      const userMesJson = await getUserInfo(data[0].userId);
      for (let i in data) {
        data[i].userInfo = userMesJson;
        data[i].postId = postId;
      }
    }
    console.log(data);
    return data;
  } catch (e) {
    //throwLegacyError('Disconnected');
  }
}

export async function getAnonymousTraceTopics(topicId, postId, page) {
  try {
    const start = (page - 1) * 10;
    const headers = await formAuthorizeHeader();
    const response = await cc98Fetch(
      `/post/topic/anonymous/user?topicid=${topicId}&postid=${postId}&from=${start}&size=10`,
      { headers }
    );
    const data = await response.json();
    let purl = "/static/images/心灵头像.gif";
    const anonymousUserName = `匿名${data[0].userName.toUpperCase()}`;
    const userMesJson = {
      name: anonymousUserName,
      portraitUrl: purl,
      id: null,
      privilege: "匿名用户",
      popularity: 0,
      signatureCode: null,
      postCount: 0,
      fanCount: 0,
    };
    for (let i in data) {
      data[i].userInfo = userMesJson;
    }
    return data;
  } catch (e) {
    //throwLegacyError('Disconnected');
  }
}

/**
 * 搜索指定关键词主题
 * @param boardId
 * @param words
 * @param from
 * @param rouer
 */
export async function getSearchTopic(
  boardId: number,
  words: string[],
  from: number
) {
  //如果未登录,直接跳转至登录页面
  if (!isLogOn()) {
    throwLegacyError("LogOut");
    return null;
  }
  if (words) {
    const headers = await formAuthorizeHeader();
    let keyword = words[0];
    for (let i in words) {
      if (i != "0") {
        keyword = `${keyword} ${words[i]}`;
      }
    }
    let size = 20;
    let newTopic;
    if (boardId === 0) {
      try {
        const response = await cc98Fetch(
          `/topic/search?keyword=${encodeURIComponent(
            keyword
          )}&size=${size}&from=${from}`,
          {
            headers: headers,
          }
        );
        switch (response.status) {
          case 401:
            throwLegacyError("UnauthorizedTopic");
          case 403:
            throwLegacyError("TooFrequentSearch");
          case 404:
          //throwLegacyError('NotFoundTopic');
          case 500:
          //throwLegacyError('ServerError');
        }
        newTopic = await response.json();
      } catch (e) {
        return -1;
      }
    } else {
      try {
        const response = await cc98Fetch(
          `/topic/search/board/${boardId}?keyword=${encodeURIComponent(
            keyword
          )}&size=${size}&from=${from}`,
          {
            headers: headers,
          }
        );
        if (response.status === 401) {
          throwLegacyError("LogOut");
        }
        if (response.status === 403) {
          throwLegacyError("OperationForbidden");
        }
        if (response.status === 404) {
          throwLegacyError("NotFoundTopic");
        }
        if (response.status === 500) {
          throwLegacyError("ServerError");
        }
        newTopic = await response.json();
      } catch (e) {
        return -1;
      }
    }
    //如果有搜索结果就处理一下
    if (newTopic && newTopic.length != 0) {
      let aTopic = [];
      let aTopicId = [];
      let bTopic = [];
      for (let item of newTopic) {
        //时间转换
        item.time = transerRecentTime(item.time);
        item.lastPostTime = transerRecentTime(item.lastPostTime);

        //阅读数转换
        if (item.hitCount > 10000) {
          if (item.hitCount > 100000) {
            let index = parseInt(`${item.hitCount / 10000}`);
            item.hitCount = `${index}万`;
          } else {
            let index = parseInt(`${item.hitCount / 1000}`) / 10;
            item.hitCount = `${index}万`;
          }
        }
        //计算总楼层
        item.floorCount = item.replyCount + 1;
        //回复数转换
        if (item.replyCount > 10000) {
          if (item.replyCount > 100000) {
            let index = parseInt(`${item.replyCount / 10000}`);
            item.replyCount = `${index}万`;
          } else {
            let index = parseInt(`${item.replyCount / 1000}`) / 10;
            item.replyCount = `${index}万`;
          }
        }
        //标签转换
        if (item.tag1) {
          item.tag1 = await getTagNamebyId(item.tag1);
          if (item.tag2) {
            item.tag2 = await getTagNamebyId(item.tag2);
          }
        }
        //处理匿名与非匿名主题，非匿名主题用户批量获取信息
        if (item.userId) {
          //获取所在版面名称
          item.boardName = await getBoardName(item.boardId);
          aTopic.push(item);
          aTopicId.push(item.userId);
        } else {
          item.portraitUrl = "/static/images/_心灵之约.png";
          item.userName = "匿名用户";
          item.boardName = await getBoardName(item.boardId);
          bTopic.push(item);
        }
      }
      //对于非匿名数据批量获取头像地址
      let usersInfo = await getBasicUsersInfo(aTopicId);
      for (let i in aTopic) {
        let thisUserInfo = getThisUserInfo(aTopic[i].userId, usersInfo);
        aTopic[i].portraitUrl = thisUserInfo.portraitUrl;
      }
      //合并成原来的数据
      for (var i = 0, j = 0, k = 0; i < newTopic.length; i++) {
        if (j === aTopic.length) {
          newTopic[i] = bTopic[k];
          k++;
        } else if (newTopic[i].id === aTopic[j].id) {
          newTopic[i] = aTopic[j];
          j++;
        } else {
          newTopic[i] = bTopic[k];
          k++;
        }
      }

      return newTopic;
    }
    //如果没有搜索结果就返回0
    else {
      return 0;
    }
  }
}

export async function getTopicInfo(topicId) {
  const headers = await formAuthorizeHeader();
  const url = `/topic/${topicId}`;
  const response = await cc98Fetch(url, { headers });
  switch (response.status) {
    case 401:
      //如果未登录,直接返回未登录
      if (!isLogOn()) {
        throwLegacyError("LogOut");
        return null;
      } else {
        throwLegacyError("UnauthorizedTopic");
        return null;
      }
    case 403:
      throwLegacyError("OperationForbidden");
      return null;
    case 404:
      throwLegacyError("NotFoundTopic");
      return null;
    case 500:
      throwLegacyError("ServerError");
      return null;
  }

  const data = await response.json();
  return data;
}

export async function getPostInfo(postId) {
  const headers = await formAuthorizeHeader();
  const url = `/post/basic?id=${postId}`;
  const response = await cc98Fetch(url, { headers });
  switch (response.status) {
    case 404:
      return "not found";
    case 500:
      return "server error";
  }

  const data = await response.json();
  if (data.canEntry === false) {
    return "unauthorized";
  }
  return data[0];
}

export async function getTagInfo() {
  if (readTagInfoCache()) {
    return readTagInfoCache();
  } else {
    return await getNewTagInfo();
  }
}

export async function getNewTagInfo() {
  const url = `/config/global/alltag`;
  const headers = await formAuthorizeHeader();
  const response = await cc98Fetch(url, { headers });
  const data = await response.json();
  writeTagInfoCache(data);
  return data;
}

export async function getTagIdbyName(name) {
  const tagInfo = await getTagInfo();
  for (let item of tagInfo) {
    if (item.name === name) return item.id;
  }
  const newTagInfo = await getNewTagInfo();
  for (let item of newTagInfo) {
    if (item.name === name) return item.id;
  }
  return false;
}

export async function getTagNamebyId(id) {
  const tagInfo = await getTagInfo();
  for (let item of tagInfo) {
    if (item.id === id) return item.name;
  }
  return false;
}

//批量查询post的基础信息
export async function getBasicPostsInfo(postIds: any[]) {
  if (!postIds || postIds.length === 0) {
    return [];
  }
  const headers = await formAuthorizeHeader();
  let url = "/post/basic";
  for (let i = 0; i < postIds.length; i++) {
    if (i === 0) {
      url = `${url}?id=${postIds[i]}`;
    } else {
      url = `${url}&id=${postIds[i]}`;
    }
  }
  try {
    let response = await cc98Fetch(url, { headers });
    var data = await response.json();
    return data;
  } catch (e) {
    return [];
  }
}

//在postsId中查询postId，查到了就返回对应的信息，没有就设置一个默认的,post信息包括楼层信息和回复者信息
export function getThisPostInfo(postId, postIds) {
  for (let i in postIds) {
    if (postIds[i].id === postId) {
      return postIds[i];
    }
  }
  //查询失败
  let indexData = {
    id: postId,
    floor: 1,
    userId: -1,
    userName: "有人",
  };
  return indexData;
}

//批量查询topic的基础信息
export async function getBasicTopicsInfo(topicIds: any[]) {
  if (!topicIds || topicIds.length === 0) {
    return [];
  }
  const headers = await formAuthorizeHeader();
  let url = "/topic/basic";
  for (let i = 0; i < topicIds.length; i++) {
    if (i === 0) {
      url = `${url}?id=${topicIds[i]}`;
    } else {
      url = `${url}&id=${topicIds[i]}`;
    }
  }
  try {
    let response = await cc98Fetch(url, { headers });
    var data = await response.json();
    return data;
  } catch (e) {
    return [];
  }
}

//在topicsId中查询topicId，查到了就返回对应的信息，没有就设置一个默认的
export function getThisTopicInfo(topicId, topicIds) {
  for (let i in topicIds) {
    if (topicIds[i].id === topicId) {
      return topicIds[i];
    }
  }
  //查询失败
  let indexData = {
    id: topicId,
    title: "未知主题（该主题已被删除或者无权限获取）",
    boardId: 0,
  };
  return indexData;
}

/**
 * 获取本周/月热门话题
 * @returns {data} 处理好的热门话题数据
 * @author adddna //基于明一gg的获取新帖
 */
export async function getMonthlyHotTopic(type: string) {
  const headers = await formAuthorizeHeader();
  const response = await cc98Fetch(`/topic/hot-${type}`);

  switch (response.status) {
    case 401:
      throwLegacyError("UnauthorizedTopic");
    case 403:
      throwLegacyError("OperationForbidden");
    case 404:
    //throwLegacyError('NotFoundTopic');
    case 500:
    //throwLegacyError('ServerError');
  }

  let data = await response.json();

  let aTopic = [];
  let aTopicId = [];
  let bTopic = [];
  for (let item of data) {
    //时间转换
    item.time = transerRecentTime(item.time);
    item.lastPostTime = transerRecentTime(item.lastPostTime);

    //阅读数转换
    if (item.hitCount > 10000) {
      if (item.hitCount > 100000) {
        let index = parseInt(`${item.hitCount / 10000}`);
        item.hitCount = `${index}万`;
      } else {
        let index = parseInt(`${item.hitCount / 1000}`) / 10;
        item.hitCount = `${index}万`;
      }
    }
    //计算总楼层
    item.floorCount = item.replyCount + 1;
    //回复数转换
    if (item.replyCount > 10000) {
      if (item.replyCount > 100000) {
        let index = parseInt(`${item.replyCount / 10000}`);
        item.replyCount = `${index}万`;
      } else {
        let index = parseInt(`${item.replyCount / 1000}`) / 10;
        item.replyCount = `${index}万`;
      }
    }
    //标签转换
    if (item.tag1) {
      item.tag1 = await getTagNamebyId(item.tag1);
      if (item.tag2) {
        item.tag2 = await getTagNamebyId(item.tag2);
      }
    }
    //处理匿名与非匿名主题，非匿名主题用户批量获取信息
    if (item.userId) {
      //获取所在版面名称
      item.boardName = await getBoardName(item.boardId);
      aTopic.push(item);
      aTopicId.push(item.userId);
    } else {
      item.portraitUrl = "/static/images/_心灵之约.png";
      item.userName = "匿名用户";
      item.boardName = await getBoardName(item.boardId);
      bTopic.push(item);
    }
  }
  //对于非匿名数据批量获取头像地址
  let usersInfo = await getBasicUsersInfo(aTopicId);
  for (let i in aTopic) {
    let thisUserInfo = getThisUserInfo(aTopic[i].userId, usersInfo);
    aTopic[i].portraitUrl = thisUserInfo.portraitUrl;
  }
  for (let i = 0, j = 0, k = 0; i < data.length; i++) {
    if (j === aTopic.length) {
      data[i] = bTopic[k];
      k++;
    } else if (data[i].id === aTopic[j].id) {
      data[i] = aTopic[j];
      j++;
    } else {
      data[i] = bTopic[k];
      k++;
    }
  }
  return data;
}

/**
 * 获取随机(最近)帖
 */
export async function getRandomTopic(size: number) {
  //如果未登录,直接跳转至登录页面
  if (!isLogOn()) {
    throwLegacyError("LogOut");
    return null;
  }
  try {
    /**
     * 一次性固定获取个主题
     */
    const headers = await formAuthorizeHeader();
    /**
     * 通过api获取到主题之后转成json格式
     */
    const response = await cc98Fetch(`/topic/random-recent?size=${size}`, {
      headers,
    });
    switch (response.status) {
      case 401:
        throwLegacyError("UnauthorizedTopic");
      case 403:
        throwLegacyError("OperationForbidden");
      case 404:
      //throwLegacyError('NotFoundTopic');
      case 500:
      //throwLegacyError('ServerError');
    }
    let newTopic = await response.json();
    //console.log("获取到的数据", newTopic);
    let aTopic = [];
    let aTopicId = [];
    let bTopic = [];
    for (let item of newTopic) {
      //时间转换
      item.time = transerRecentTime(item.time, false);
      item.lastPostTime = transerRecentTime(item.lastPostTime, false);

      //阅读数转换
      if (item.hitCount > 10000) {
        if (item.hitCount > 100000) {
          let index = parseInt(`${item.hitCount / 10000}`);
          item.hitCount = `${index}万`;
        } else {
          let index = parseInt(`${item.hitCount / 1000}`) / 10;
          item.hitCount = `${index}万`;
        }
      }
      //计算总楼层
      item.floorCount = item.replyCount + 1;
      //回复数转换
      if (item.replyCount > 10000) {
        if (item.replyCount > 100000) {
          let index = parseInt(`${item.replyCount / 10000}`);
          item.replyCount = `${index}万`;
        } else {
          let index = parseInt(`${item.replyCount / 1000}`) / 10;
          item.replyCount = `${index}万`;
        }
      }
      //标签转换
      if (item.tag1) {
        item.tag1 = await getTagNamebyId(item.tag1);
        if (item.tag2) {
          item.tag2 = await getTagNamebyId(item.tag2);
        }
      }
      //处理匿名与非匿名主题，非匿名主题用户批量获取信息
      if (!item.isAnonymous) {
        //获取所在版面名称
        item.boardName = await getBoardName(item.boardId);
        aTopic.push(item);
        aTopicId.push(item.userId);
      } else {
        item.portraitUrl = "/static/images/_心灵之约.png";
        item.userName = "匿名用户";
        item.boardName = await getBoardName(item.boardId);
        bTopic.push(item);
      }
    }
    //对于非匿名数据批量获取头像地址
    let usersInfo = await getBasicUsersInfo(aTopicId);
    for (let i in aTopic) {
      let thisUserInfo = getThisUserInfo(aTopic[i].userId, usersInfo);
      aTopic[i].portraitUrl = thisUserInfo.portraitUrl;
    }
    for (let i = 0, j = 0, k = 0; i < newTopic.length; i++) {
      //console.log(`进入循环`);
      if (j === aTopic.length) {
        newTopic[i] = bTopic[k];
        k++;
      } else if (newTopic[i].id === aTopic[j].id) {
        //console.log(`条件1 i=${i} j = ${j}`);
        newTopic[i] = aTopic[j];
        j++;
      } else {
        //console.log(`条件2 i=${i} k = ${k}`);
        newTopic[i] = bTopic[k];
        k++;
      }
    }
    //console.log("这里会执行吗");
    console.log("获取到的数据", newTopic);
    return newTopic;
  } catch (e) {
    //throwLegacyError('Disconnected');
  }
}

export interface CurrentUserRecentTopicPage {
  topics: UserRecentTopic[];
  hasMore: boolean;
}

/**
 * 获取当前用户最近发表的主题。
 * 接口通过多请求一条来探测是否还有下一页，页面仍只展示前 10 条。
 * @param page 当前页数
 * @author AsukaSong
 */
export async function getCurrentUserRecentTopics(
  page: number,
): Promise<CurrentUserRecentTopicPage> {
  console.log("请求最近发过的主题");
  const headers = await formAuthorizeHeader();
  const response = await cc98Fetch(
    `/me/recent-topic?from=${(page - 1) * 10}&size=11`,
    { headers },
  );

  if (response.status !== 200) {
    throw new Error(response.statusText);
  }

  const result: UserRecentTopic[] = await response.json();
  const hasMore = result.length === 11;
  const topics = hasMore ? result.slice(0, 10) : result;

  for (let index = topics.length; index--;) {
    topics[index].boardName = await getBoardName(topics[index].boardId);
  }

  return { topics, hasMore };
}

interface CurrentUserBrowsingHistoryResponse {
  data?: UserRecentTopic[] | null;
  count?: number;
}

export interface CurrentUserBrowsingHistoryPage {
  topics: UserRecentTopic[];
  totalPage?: number;
}

/**
 * 获取当前用户的主题浏览历史。
 * 接口请求 11 条记录，页面仍只展示前 10 条。
 * @param page 当前页数
 * @author XSYangtuo
 */
export async function getCurrentUserBrowsingHistory(
  page: number,
): Promise<CurrentUserBrowsingHistoryPage> {
  console.log("getHistoryPosts", page, true);
  const from = (page - 1) * 10;
  const headers = await formAuthorizeHeader();
  const response = await cc98Fetch(
    `/me/browsing-record?from=${from}&size=11`,
    { headers },
  );

  if (response.status === 403) {
    alert("你刷新的太快啦！可以晚些刷新");
  }
  if (response.status !== 200) {
    throw new Error(response.statusText);
  }

  const result =
    (await response.json()) as CurrentUserBrowsingHistoryResponse | null;
  const topics = result?.data;

  if (!topics || topics.length === 0) {
    console.log("no posts");
    return { topics: [] };
  }

  if (topics.length !== 11) {
    console.log("total loaded");
    return { topics, totalPage: page };
  }

  return {
    topics,
    totalPage: Math.ceil((result?.count as number) / 10) || page + 1,
  };
}
