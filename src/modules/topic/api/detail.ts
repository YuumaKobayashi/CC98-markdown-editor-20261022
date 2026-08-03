import type {
  PostViewModel,
  SpecificUserPostInfo,
} from "@modules/post";
import type { PostInfo } from "@modules/post/model/dto";
import { toPostViewModel } from "@modules/post/model/mappers";
import { getUserInfo } from "@modules/user";
import { getUsersInfo } from "@modules/user";
import type { UserInfo } from "@modules/user";
import { getToken, formAuthorizeHeader } from "@modules/session";
import { cc98Fetch } from "@foundation/api/http";
import { getThisUserInfo } from "@modules/user";
import { replaceHttpToHttps } from "@foundation/lib/text";

export async function getTopic(
  topicid: number,
): Promise<PostViewModel | undefined> {
  try {
    const headers = await formAuthorizeHeader();
    const response = await cc98Fetch(`/Topic/${topicid}/post?from=0&size=1`, {
      headers,
    });
    const data = (await response.json()) as PostInfo[];
    let topicMessage = null;
    if (data[0].isAnonymous != true) {
      const userMesJson = await getUserInfo(data[0].userId);
      topicMessage = toPostViewModel(data[0], userMesJson, {
        postId: data[0].id,
      });
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
      topicMessage = toPostViewModel(data[0], userMesJson, {
        postId: data[0].id,
      });
    }

    return topicMessage;
  } catch (e) {
    //throwLegacyError('Disconnected');
  }
}

export async function getTopicContent(
  topicid: number,
  curPage: number,
): Promise<PostViewModel[] | undefined> {
  try {
    const startPage = (curPage - 1) * 10;
    const headers = await formAuthorizeHeader();
    const topic = await cc98Fetch(
      `/Topic/${topicid}/post?from=${startPage}&size=10`,
      { headers }
    );
    const rawContent = (await topic.json()) as PostInfo[];
    const content = rawContent.map((item) => ({
      ...item,
      content: replaceHttpToHttps(item.content),
    }));
    const post: PostViewModel[] = [];
    let topicNumberInPage = content.length;
    //收集id
    const usersId = [];
    let usersInfo: UserInfo[] = [];
    if (content.length === 0) return [];
    for (let j = 0; j < topicNumberInPage; j++) {
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
        post[i] = toPostViewModel(content[i], thisUserInfo, {
          postId: content[i].id,
        });
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
        post[i] = toPostViewModel(content[i], userMesJson, {
          postId: content[i].id,
          isAnonymous: true,
        });
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
        post[i] = toPostViewModel(content[i], userMesJson, {
          postId: content[i].id,
          isAnonymous: false,
          isDeleted: true,
          content: "该贴已被my cc98, my home",
        });
      }
    }

    return post;
  } catch (e) {
    console.error(e);
    //throwLegacyError('Disconnected');
  }
}

export async function getHotReplyContent(
  topicid: number,
): Promise<PostViewModel[] | undefined> {
  try {
    const headers = await formAuthorizeHeader();
    const response = await cc98Fetch(`/Topic/${topicid}/hot-post`, { headers });
    const content = (await response.json()) as PostInfo[];
    const post: PostViewModel[] = [];
    let topicNumberInPage: number = content.length;
    for (let i = 0; i < topicNumberInPage; i++) {
      if (content[i].isAnonymous != true) {
        const userMesResponse = await cc98Fetch(
          `/user/name/${encodeURIComponent(content[i].userName)}`
        );
        const userMesJson = (await userMesResponse.json()) as UserInfo;
        post[i] = toPostViewModel(content[i], userMesJson, {
          postId: content[i].id,
        });
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
        post[i] = toPostViewModel(content[i], userMesJson, {
          postId: content[i].id,
        });
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
    const data = (await response.json()) as SpecificUserPostInfo[];
    const userMesResponse = await cc98Fetch(
      `/user/name/${encodeURIComponent(data[0].userName)}`
    );
    const userMesJson = await userMesResponse.json();
    return toPostViewModel(data[0], userMesJson, { postId: data[0].id });
  } catch (e) {
    //throwLegacyError('Disconnected');
  }
}

export async function getCurUserTopicContent(
  topicid: number,
  curPage: number,
  userId: number
): Promise<PostViewModel[] | undefined> {
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
    const content = (await topic.json()) as SpecificUserPostInfo[];

    const post: PostViewModel[] = [];
    let topicNumberInPage: number = content.length;
    const replyCount = content[0].count;
    const userMesJson = await getUserInfo(content[0].userId!);
    for (let i = 0; i < topicNumberInPage; i++) {
      if (content[i].isAnonymous != true) {
        post[i] = toPostViewModel(content[i], userMesJson, {
          postId: content[i].id,
        });
      } else {
        let purl = "/static/images/_心灵之约.png";
        const anonymousUserName = `匿名${content[i].userName!.toUpperCase()}`;
        const userMesJson = {
          name: anonymousUserName,
          portraitUrl: purl,
          id: null,
          privilege: "匿名用户",
          popularity: 0,
          signatureCode: null,
          postCount: 0,
        };
        post[i] = toPostViewModel(content[i], userMesJson);
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
export async function getCurUserTotalReplyPage(
  topicId: number,
  userId: number,
) {
  try {
    const headers = await formAuthorizeHeader();
    const replyCountResponse = await cc98Fetch(
      `/post/topic/user?topicid=${topicId}&userid=${userId}&from=0&size=1`,
      { headers }
    );
    const replyCountJson =
      (await replyCountResponse.json()) as SpecificUserPostInfo[];
    const replyCount = replyCountJson[0].count;
    return replyCount % 10 === 0
      ? replyCount / 10
      : (replyCount - (replyCount % 10)) / 10 + 1;
  } catch (e) {
    //throwLegacyError('Disconnected');
  }
}

export async function getTraceTopicsCount(
  topicId: number,
  postId: number,
): Promise<number | undefined> {
  try {
    const headers = await formAuthorizeHeader();
    const response = await cc98Fetch(
      `/post/topic/specific-user?topicid=${topicId}&postid=${postId}&from=0&size=1`,
      { headers }
    );
    const data = (await response.json()) as SpecificUserPostInfo[];
    return data[0].count % 10 === 0
      ? data[0].count / 10
      : (data[0].count - (data[0].count % 10)) / 10 + 1;
  } catch (e) {
    //throwLegacyError('Disconnected');
  }
}

export async function getTraceTopics(
  topicId: number,
  postId: number,
  page: number,
): Promise<PostViewModel[] | undefined> {
  const start = (page - 1) * 10;
  try {
    const headers = await formAuthorizeHeader();
    const response = await cc98Fetch(
      `/post/topic/specific-user?topicid=${topicId}&postid=${postId}&from=${start}&size=10`,
      { headers }
    );
    const rawPosts = (await response.json()) as SpecificUserPostInfo[];
    let data: PostViewModel[];
    if (rawPosts[0] && rawPosts[0].isAnonymous) {
      let purl = "/static/images/心灵头像.gif";
      data = rawPosts.map((post) => {
        const anonymousUserName = `匿名${post.userName.toUpperCase()}`;
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
        return toPostViewModel(post, userMesJson, { postId });
      });
    } else {
      const userMesJson = await getUserInfo(rawPosts[0].userId);
      data = rawPosts.map((post) =>
        toPostViewModel(post, userMesJson, { postId }),
      );
    }
    console.log(data);
    return data;
  } catch (e) {
    //throwLegacyError('Disconnected');
  }
}

export async function getAnonymousTraceTopics(
  topicId: number,
  postId: number,
  page: number,
) {
  try {
    const start = (page - 1) * 10;
    const headers = await formAuthorizeHeader();
    const response = await cc98Fetch(
      `/post/topic/anonymous/user?topicid=${topicId}&postid=${postId}&from=${start}&size=10`,
      { headers }
    );
    const rawPosts = (await response.json()) as SpecificUserPostInfo[];
    let purl = "/static/images/心灵头像.gif";
    const anonymousUserName = `匿名${rawPosts[0].userName.toUpperCase()}`;
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
    const data = rawPosts.map((post) => toPostViewModel(post, userMesJson));
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
