import { formAuthorizeHeader, isLogOn } from "@modules/session";
import { cc98Fetch } from "@foundation/api/http";
import { throwLegacyError } from "@foundation/lib/legacy-utility-effects";
import { getBasicUsersInfo, getThisUserInfo } from "@modules/user";
import { transerTime } from "@foundation/lib/time";
import type { UserBasicInfo, UserInfo } from "@modules/user";
import type { MessagePersonInfo } from "../model/MessagePersonInfo";
import type {
  MessageInfo,
  MessageViewModel,
  RecentContactUserInfo,
} from "../model/types";

/**
 * 发送私信的函数
 * @param bodyContent
 */
export async function sendMessage(bodyContent: string): Promise<Response> {
  const myHeaders = await formAuthorizeHeader();
  myHeaders.append("content-type", "application/json");
  let response = await cc98Fetch("/message", {
    method: "POST",
    headers: myHeaders,
    body: bodyContent,
  });
  if (response.status === 401) {
    throwLegacyError("LogOut");
  }
  if (response.status === 500) {
    throwLegacyError("ServerError");
  }
  return response;
}

/*
 * 获取最近N个联系人的信息
 */
export async function getRecentContact(
  from: number,
  size: number,
): Promise<MessagePersonInfo[] | null> {
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
    const recentContactId =
      (await response.json()) as RecentContactUserInfo[];
    //console.log("最近联系人列表id", recentContactId);
    const userId: number[] = [];
    for (let i in recentContactId) {
      userId[i] = recentContactId[i].userId;
    }

    const usersInfo = await getBasicUsersInfo(userId);
    const recentContact: MessagePersonInfo[] = [];
    for (let i in recentContactId) {
      recentContact.push(
        getThisUserInfo(
          recentContactId[i].userId,
          usersInfo,
        ) as MessagePersonInfo,
      );
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
  size: number,
): Promise<MessageViewModel[] | null | undefined> {
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
    const response1 = (await response.json()) as MessageInfo[];
    const recentMessage = sortRecentMessage(response1);
    return recentMessage;
  } catch (e) {
    //throwLegacyError(('Disconnected'));
  }
}

/**
 * 处理最新消息列表，时间间隔短的消息只显示第一条消息的时间
 * @param recentMessage
 */
export function sortRecentMessage(
  recentMessage: MessageInfo[] | MessageViewModel[],
): MessageViewModel[] {
  const viewMessages = recentMessage as MessageViewModel[];
  if (recentMessage.length === 0 || !recentMessage) {
    return viewMessages;
  } else {
    for (let i = 0; i < recentMessage.length; i++) {
      if (i + 1 == recentMessage.length) {
        viewMessages[i].showTime = true;
      } else if (
        transerTime(recentMessage[i].time) -
        transerTime(recentMessage[i + 1].time) <
        60000
      ) {
        viewMessages[i].showTime = false;
      } else {
        viewMessages[i].showTime = true;
      }
    }

    return viewMessages;
  }
}

/**
 * 对联系人列表重新排序，看是否有从其他页面发起的聊天
 * @param recentContact
 */
export async function sortContactList(
  recentContact: MessagePersonInfo[] | null,
  urlId: RegExpMatchArray | null,
  urlName: RegExpMatchArray | null,
): Promise<MessagePersonInfo[] | null> {
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
        chatMan = (await response.json()) as UserBasicInfo;
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
          chatMan = (await response.json()) as UserBasicInfo;
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
          response1 = (await response0.json()) as UserInfo;
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
            response1 = (await response0.json()) as UserInfo;
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
