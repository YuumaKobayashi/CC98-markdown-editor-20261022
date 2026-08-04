import type { PostInfo } from "./dto";
import type {
  AnonymousPostUserInfo,
  PostViewModel,
  UserRecentPost,
} from "./view-model";
import type { UserInfo } from "@modules/user/model/dto";
import type { UserLookupFallback } from "@modules/user/model/types";

export interface PostViewModelOptions {
  postId?: number;
  content?: string;
  isAnonymous?: boolean;
  isDeleted?: boolean;
}

export function toPostViewModel(
  post: Readonly<PostInfo>,
  userInfo: UserInfo | UserLookupFallback | AnonymousPostUserInfo,
  options: Readonly<PostViewModelOptions> = {},
): PostViewModel {
  return {
    ...post,
    ...("content" in options ? { content: options.content! } : {}),
    ...("isAnonymous" in options
      ? { isAnonymous: options.isAnonymous! }
      : {}),
    ...("isDeleted" in options ? { isDeleted: options.isDeleted! } : {}),
    userInfo,
    ...(options.postId === undefined ? {} : { postId: options.postId }),
  };
}

export function toUserRecentPost(
  post: Readonly<PostInfo>,
  boardName: string,
): UserRecentPost {
  return {
    boardName,
    time: post.time,
    floor: post.floor,
    title: post.title,
    userName: post.userName,
    isAnonymous: post.isAnonymous,
    id: post.id,
    topicId: post.topicId,
    boardId: post.boardId,
    content: post.content,
    likeCount: post.likeCount,
    dislikeCount: post.dislikeCount,
  };
}
