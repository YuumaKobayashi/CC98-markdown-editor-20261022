import type { RecommendedTopicInfo } from "./dto";
import type {
  FocusTopic,
  MediaTopicContent,
  RecommendedTopic,
  UserRecentTopic,
} from "./view-model";

interface RecentTopicSource {
  id: number;
  boardId: number;
  title: string;
  time: string;
  userName: string | null;
  isAnonymous: boolean;
  likeCount?: number;
  dislikeCount?: number;
}

export function toUserRecentTopic(
  topic: Readonly<RecentTopicSource>,
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

export interface FocusTopicSource {
  id: number;
  boardId: number;
  title: string;
  time: string;
  userId: number | null;
  userName: string | null;
  isAnonymous: boolean;
  replyCount: number;
  hitCount: number;
  likeCount?: number;
  dislikeCount?: number;
  lastPostUser: string | null;
  lastPostTime: string;
  tag1?: number;
  tag2?: number;
  mediaContent: unknown;
  contentType: import("./dto").TopicContentType;
}

export interface FocusTopicEnrichment {
  boardName: string;
  portraitUrl: string;
  userName: string;
  displayTime: string;
  displayLastPostTime: string;
  tag1Name: string | null;
  tag2Name: string | null;
}

function formatTopicCount(count: number): number | string {
  if (count > 100000) {
    return `${parseInt(`${count / 10000}`)}万`;
  }
  if (count > 10000) {
    return `${parseInt(`${count / 1000}`) / 10}万`;
  }
  return count;
}
//TODO: 需要优化类型 这个类型校验太严了
function toMediaTopicContent(value: unknown): MediaTopicContent | null {
  if (value === null || typeof value !== "object") return null;
  const media = value as Record<string, unknown>;
  if (
    !Array.isArray(media.thumbnail) ||
    !media.thumbnail.every((item) => typeof item === "string") ||
    typeof media.duration !== "number" ||
    typeof media.height !== "number" ||
    typeof media.width !== "number" ||
    typeof media.audio !== "string" ||
    typeof media.video !== "string"
  ) {
    return null;
  }
  return {
    thumbnail: media.thumbnail,
    duration: media.duration,
    height: media.height,
    width: media.width,
    audio: media.audio,
    video: media.video,
  };
}

export function toFocusTopic(
  topic: Readonly<FocusTopicSource>,
  enrichment: Readonly<FocusTopicEnrichment>,
): FocusTopic {
  const tag1 = topic.tag1;
  const tag2 = topic.tag2;
  return {
    isAnonymous: topic.isAnonymous,
    title: topic.title,
    hitCount: topic.hitCount,
    displayHitCount: formatTopicCount(topic.hitCount),
    id: topic.id,
    boardId: topic.boardId,
    boardName: enrichment.boardName,
    replyCount: topic.replyCount,
    displayReplyCount: formatTopicCount(topic.replyCount),
    floorCount: topic.replyCount + 1,
    userId: topic.userId,
    userName: enrichment.userName,
    portraitUrl: enrichment.portraitUrl,
    time: topic.time,
    displayTime: enrichment.displayTime,
    ...(topic.likeCount === undefined ? {} : { likeCount: topic.likeCount }),
    ...(topic.dislikeCount === undefined
      ? {}
      : { dislikeCount: topic.dislikeCount }),
    lastPostUser: topic.lastPostUser,
    lastPostTime: topic.lastPostTime,
    displayLastPostTime: enrichment.displayLastPostTime,
    ...(tag1 === undefined ? {} : { tag1 }),
    tag1Name: enrichment.tag1Name,
    ...(tag2 === undefined ? {} : { tag2 }),
    tag2Name: enrichment.tag2Name,
    mediaContent: toMediaTopicContent(topic.mediaContent),
    contentType: topic.contentType,
  };
}

export function toRecommendedTopic(
  recommendation: Readonly<RecommendedTopicInfo>,
  topic: FocusTopic,
): RecommendedTopic {
  return {
    content: recommendation.content,
    topic,
    ...(recommendation.topic.hitCount > 100000
      ? { hitCount: `${parseInt(`${recommendation.topic.hitCount / 10000}`)}万` }
      : {}),
  };
}
