import { getToken, formAuthorizeHeader, isLogOn } from "@features/auth/api/session";
import { cc98Fetch } from "@foundation/api/http";
import { throwLegacyError } from "@foundation/lib/legacy-utility-effects";
import { getBoardName } from "@entities/board/api/service";
import { getBasicTopicsInfo, getThisTopicInfo } from "@entities/topic/api/service";
import { getBasicUsersInfo, getThisUserInfo } from "@entities/user/api/service";
import { transerTime } from "@foundation/lib/time";

/*
 * 获取最近N个联系人的信息
 */
export async function getRecentContact(from: number, size: number) {
  //如果未登录,直接跳转至登录页面
  if (!isLogOn()) {
    throwLegacyError("LogOut");
    return null;
  }
  try {
    const headers = await formAuthorizeHeader();
    let response = await cc98Fetch(
      `/message/recent-contact-users?from=${from}&size=${size}`,
      { headers }
    );
    if (response.status === 401) {
      throwLegacyError("UnauthorizedTopic");
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
    let recentContactId = await response.json();
    //console.log("最近联系人列表id", recentContactId);
    let userId = [];
    for (let i in recentContactId) {
      userId[i] = recentContactId[i].userId;
    }

    let usersInfo = await getBasicUsersInfo(userId);
    let recentContact = [];
    for (let i in recentContactId) {
      recentContact.push(getThisUserInfo(recentContactId[i].userId, usersInfo));
    }

    for (let i in recentContactId) {
      recentContact[i].message = [];
      recentContact[i].lastContent = recentContactId[i].lastContent;
      recentContact[i].isRead = recentContactId[i].isRead;
    }
    //console.log("最近联系人列表", recentContact);

    return recentContact;
  } catch (e) {
    //throwLegacyError(('Disconnected'));
    // 出错后返回空数组，防止缓存存储和提取时对格式解析错误
    return [];
  }
}

/*
 * 获取最近N个联系人的信息
 */
export async function getRecentMessage(
  userId: number,
  from: number,
  size: number
) {
  //如果未登录,直接跳转至登录页面
  if (!isLogOn()) {
    throwLegacyError("LogOut");
    return null;
  }
  try {
    const headers = await formAuthorizeHeader();
    let response = await cc98Fetch(
      `/message/user/${userId}?from=${from}&size=${size}`,
      { headers }
    );
    if (response.status === 401) {
      throwLegacyError("UnauthorizedTopic");
    }

    if (response.status === 403) {
      throwLegacyError("OperationForbidden");
    }
    if (response.status === 404) {
      throwLegacyError("NotFoundTopic");
    }
    if (response.status === 500) {
      //throwLegacyError('ServerError');
    }
    let response1 = await response.json();
    let recentMessage = sortRecentMessage(response1);
    return recentMessage;
  } catch (e) {
    //throwLegacyError(('Disconnected'));
  }
}

/**
 * 处理最新消息列表，时间间隔短的消息只显示第一条消息的时间
 * @param recentMessage
 */
export function sortRecentMessage(recentMessage) {
  if (recentMessage.length === 0 || !recentMessage) {
    return recentMessage;
  } else {
    for (let i = 0; i < recentMessage.length; i++) {
      if (i + 1 == recentMessage.length) {
        recentMessage[i].showTime = true;
      } else if (
        transerTime(recentMessage[i].time) -
        transerTime(recentMessage[i + 1].time) <
        60000
      ) {
        recentMessage[i].showTime = false;
      } else {
        recentMessage[i].showTime = true;
      }
    }

    return recentMessage;
  }
}

/**
 * 对联系人列表重新排序，看是否有从其他页面发起的聊天
 * @param recentContact
 */
export async function sortContactList(recentContact) {
  //看url中是否携带id信息，如果有的话就作为第一个联系人
  let urlId = location.href.match(/id=(\d+)/);
  if (urlId) {
    let chatManId = parseInt(urlId[1]);
    //如果联系人为空，则查找该联系人信息并作为联系人数组的元素
    if (!recentContact || recentContact.length === 0) {
      let response;
      let chatMan;
      let flag = 1;
      try {
        response = await cc98Fetch(`/user/basic/${chatManId}`);
        if (response.status === 404) {
          throwLegacyError("NotFoundUser");
        }
        if (response.status === 500) {
          throwLegacyError("ServerError");
        }
        chatMan = await response.json();
      } catch (e) {
        throwLegacyError("Disconnected");
        flag = 0;
      }
      if (flag === 1) {
        chatMan.message = await getRecentMessage(chatMan.id, 0, 10);
        if (chatMan.message) {
          chatMan.lastContent = chatMan.message[0]?.content ?? "";
        }
        chatMan.isRead = true;
        recentContact = [chatMan];
      }
    } else {
      //先看一下该聊天对象在不在联系人列表里
      for (var i = 0; i < recentContact.length; i++) {
        if (recentContact[i].id == chatManId) {
          break;
        }
      }
      //如果恰好是联系人列表第一那就什么都不做
      if (i == 0) {
        recentContact[0].isRead = true;
      }
      //如果在列表里但不是第一个，就把他提到第一个
      else if (i < recentContact.length) {
        let indexData = recentContact[i];
        indexData.isRead = true;
        recentContact.splice(i, 1);
        recentContact.unshift(indexData);
      }
      //如果不在联系人列表里，那就查找该人信息并作为列表第一个
      else {
        let response;
        let chatMan;
        let flag = 1;
        try {
          response = await cc98Fetch(`/user/basic/${chatManId}`);
          if (response.status === 401) {
            throwLegacyError("UnauthorizedTopic");
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
          chatMan = await response.json();
        } catch (e) {
          throwLegacyError("Disconnected");
          flag = 0;
        }
        if (flag === 1) {
          chatMan.message = await getRecentMessage(chatMan.id, 0, 10);
          if (chatMan.message) {
            chatMan.lastContent = chatMan.message[0]?.content ?? "";
          }
          chatMan.isRead = true;
          let chatContact = [chatMan];
          recentContact = chatContact.concat(recentContact);
        }
      }
    }
  } else {
    //看url中是否携带name信息，如果有的话就作为第一个联系人
    let urlName = location.href.match(/name=(\S+)/);
    if (urlName) {
      console.log("联系人姓名", urlName[1]);
      let chatManName = urlName[1];
      //如果联系人为空，则查找该联系人信息并作为联系人数组的元素
      if (!recentContact || recentContact.length === 0) {
        console.log("如果联系人为空，则查找该联系人信息并作为联系人数组的元素");
        let response0;
        let response1;
        let flag = 1;
        try {
          response0 = await cc98Fetch(
            `/user/name/${encodeURIComponent(chatManName)}`
          );
          switch (response0.status) {
            case 401:
              throwLegacyError("LogOut");
            case 403:
              throwLegacyError("OperationForbidden");
            case 404:
              throwLegacyError("NotFoundTopic");
            case 500:
              throwLegacyError("ServerError");
          }
          response1 = await response0.json();
        } catch (e) {
          throwLegacyError("Disconnected");
          flag = 0;
        }
        if (flag == 1) {
          let chatMan = {
            id: response1.id,
            name: response1.name,
            portraitUrl: response1.portraitUrl,
            message: [],
            lastContent: "",
            isRead: true,
          };
          chatMan.message = await getRecentMessage(chatMan.id, 0, 10);
          if (chatMan.message) {
            chatMan.lastContent = chatMan.message[0]?.content ?? "";
          }
          recentContact = [chatMan];
        }
      } else {
        //先看一下该聊天对象在不在联系人列表里
        console.log("先看一下该聊天对象在不在联系人列表里");
        for (var i = 0; i < recentContact.length; i++) {
          if (recentContact[i].name == chatManName) {
            break;
          }
        }
        //如果恰好是联系人列表第一那就什么都不做
        if (i == 0) {
        }
        //如果在列表里但不是第一个，就把他提到第一个
        else if (i < recentContact.length) {
          console.log("如果在列表里但不是第一个，就把他提到第一个");
          let indexData = recentContact[i];
          recentContact.splice(i, 1);
          recentContact.unshift(indexData);
        }
        //如果不在联系人列表里，那就查找该人信息并作为列表第一个
        else {
          console.log("如果不在联系人列表里，那就查找该人信息并作为列表第一个");
          let response0;
          let response1;
          let flag = 1;
          try {
            response0 = await cc98Fetch(
              `/user/name/${encodeURIComponent(chatManName)}`
            );
            switch (response0.status) {
              case 401:
                throwLegacyError("UnauthorizedTopic");
              case 403:
                throwLegacyError("OperationForbidden");
              case 404:
                throwLegacyError("NotFoundTopic");
              case 500:
                throwLegacyError("ServerError");
            }
            response1 = await response0.json();
          } catch (e) {
            throwLegacyError("Disconnected");
            flag = 0;
          }
          if (flag == 1) {
            let chatMan = {
              id: response1.id,
              name: response1.name,
              portraitUrl: response1.portraitUrl,
              message: [],
              lastContent: "",
              isRead: true,
            };
            chatMan.message = await getRecentMessage(chatMan.id, 0, 10);
            if (chatMan.message) {
              chatMan.lastContent = chatMan.message[0]?.content ?? "";
            }
            let chatContact = [chatMan];
            recentContact = chatContact.concat(recentContact);
          }
        }
      }
    }
  }
  return recentContact;
}

/**
 * 获取系统通知
 * @param from 获取消息起点
 * @param size 一次性获取消息数量
 */
export async function getMessageSystem(from: number, size: number) {
  const myHeaders = await formAuthorizeHeader();
  try {
    let response = await cc98Fetch(
      `/notification/system?from=${from}&size=${size}`,
      { headers: myHeaders }
    );
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
    var newTopic = await response.json(); //先从api得到原始的系统消息数据
  } catch {
    return [];
  }

  //补充楼层信息
  for (let i in newTopic) {
    if (newTopic[i].postId) {
      newTopic[i].floor = newTopic[i].postBasicInfo.floor;
    } else {
      newTopic[i].floor = 0;
    }
  }
  //console.log("返回前数据", newTopic);
  return newTopic;
}

//获取回复我的通知
export async function getMessageResponse(from: number, size: number) {
  try {
    let result = [];
    const myHeaders = await formAuthorizeHeader();

    let response = await cc98Fetch(
      `/notification/reply?from=${from}&size=${size}`,
      { headers: myHeaders }
    );
    switch (response.status) {
      case 401:
        //如果未登录,直接返回未登录
        if (!isLogOn()) {
          throwLegacyError("LogOut");
          return [];
        } else {
          throwLegacyError("UnauthorizedTopic");
          return [];
        }
      case 403:
        throwLegacyError("OperationForbidden");
        return [];
      case 404:
        throwLegacyError("NotFoundTopic");
        return [];
      case 500:
        throwLegacyError("ServerError");
        return [];
    }
    let newTopic = await response.json();
    //把postId、topicId分别统计存到一个数组里，然后批量查询一下
    let topicsId = [];
    for (let item of newTopic) {
      if (item.topicId) {
        topicsId.push(item.topicId);
      }
    }
    let topicsInfo = await getBasicTopicsInfo(topicsId);
    //补充帖子标题，版面id和版面名称信息
    if (newTopic) {
      for (let i in newTopic) {
        if (newTopic[i].topicId) {
          let topicInfo = getThisTopicInfo(newTopic[i].topicId, topicsInfo);
          newTopic[i].topicTitle = topicInfo.title;
          newTopic[i].boardId = topicInfo.boardId;
          newTopic[i].boardName = await getBoardName(newTopic[i].boardId);
        }
        //获取楼层信息和回复者信息
        if (newTopic[i].postId) {
          newTopic[i].floor = newTopic[i].postBasicInfo.floor;
          newTopic[i].userId = newTopic[i].postBasicInfo.userId;
          newTopic[i].userName = newTopic[i].postBasicInfo.userName;
        } else {
          newTopic[i].floor = 1;
          newTopic[i].userId = -1;
          newTopic[i].userName = "有人";
        }
        result.push(newTopic[i]);
      }
    }
    return result;
  } catch (e) {
    //throwLegacyError('Disconnected');
  }
}

//获取@我的通知
export async function getMessageAttme(from: number, size: number) {
  try {
    let result = [];
    let token = await getToken();
    let myHeaders = new Headers();
    myHeaders.append("Authorization", token);
    let response = await cc98Fetch(
      `/notification/at?from=${from}&size=${size}`,
      { headers: myHeaders }
    );
    switch (response.status) {
      case 401:
        //如果未登录,直接返回未登录
        if (!isLogOn()) {
          throwLegacyError("LogOut");
          return [];
        } else {
          throwLegacyError("UnauthorizedTopic");
          return [];
        }
      case 403:
        throwLegacyError("OperationForbidden");
        return [];
      case 404:
        throwLegacyError("NotFoundTopic");
        return [];
      case 500:
        throwLegacyError("ServerError");
        return [];
    }
    let newTopic = await response.json();
    //console.log("获取到的新@数据", newTopic);
    //把postId、topicId分别统计存到一个数组里，然后批量查询一下
    let topicsId = [];
    for (let item of newTopic) {
      if (item.topicId) {
        topicsId.push(item.topicId);
      }
    }
    let topicsInfo = await getBasicTopicsInfo(topicsId);
    //补充帖子标题，版面id和版面名称信息
    if (newTopic) {
      for (let i in newTopic) {
        if (newTopic[i].topicId) {
          let topicInfo = getThisTopicInfo(newTopic[i].topicId, topicsInfo);
          newTopic[i].topicTitle = topicInfo.title;
          newTopic[i].boardId = topicInfo.boardId;
          newTopic[i].boardName = await getBoardName(newTopic[i].boardId);
        }
        //获取楼层信息和回复者信息
        if (newTopic[i].postId) {
          newTopic[i].floor = newTopic[i].postBasicInfo.floor;
          newTopic[i].userId = newTopic[i].postBasicInfo.userId;
          newTopic[i].userName = newTopic[i].postBasicInfo.userName;
        } else {
          newTopic[i].floor = 1;
          newTopic[i].userId = -1;
          newTopic[i].userName = "有人";
        }
        result.push(newTopic[i]);
      }
    }
    return result;
  } catch (e) {
    //throwLegacyError('Disconnected');
  }
}
