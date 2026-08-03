import type {
  SearchedTopicInfo,
  TopicInfo,
  UserBrowsingTopicInfo,
} from "./dto";
import type { UserRecentTopic } from "./view-model";

type RecentTopicDto =
  | Readonly<TopicInfo>
  | Readonly<SearchedTopicInfo>
  | Readonly<UserBrowsingTopicInfo>;

export function toUserRecentTopic(
  topic: RecentTopicDto,
  boardName: string,
): UserRecentTopic {
  return {
    boardName,
    time: topic.time,
    title: topic.title,
    userName: topic.userName,
    isAnonymous: topic.isAnonymous,
    id: topic.id,
    boardId: topic.boardId,
    ...("likeCount" in topic ? { likeCount: topic.likeCount } : {}),
    ...("dislikeCount" in topic ? { dislikeCount: topic.dislikeCount } : {}),
  };
}
