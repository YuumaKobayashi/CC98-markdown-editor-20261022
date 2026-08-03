import type { PostInfo } from "./dto";
import type { UserRecentPost } from "./view-model";

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
