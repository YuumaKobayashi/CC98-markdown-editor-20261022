import type { PostContentType } from "@modules/post/model/enums";
import type {
  TopicAllowedViewerState,
  TopicType,
} from "@modules/topic/model/enums";

/** 创建投票主题时提交给主后端的投票设置。 */
export interface NewVoteRequestDto {
  voteItems: string[];
  expiredDays: number;
  maxVoteCount: number;
  needVote: boolean;
}

interface NewTopicRequestBaseDto {
  title: string;
  content: string;
  contentType: PostContentType;
  type: TopicType;
  tag1?: number;
  tag2?: number;
  notifyPoster: boolean;
  isAnonymous: boolean;
  clientType: number;
}

/** 发表普通主题或投票主题时提交给主后端的请求体。 */
export type NewTopicRequestDto = NewTopicRequestBaseDto &
  (
    | {
        isVote?: never;
        voteInfo?: never;
      }
    | {
        isVote: true;
        voteInfo: NewVoteRequestDto;
      }
  );

/** 新建或编辑回复时提交给主后端的请求体。 */
export interface NewPostRequestDto {
  content: string;
  title?: string | null;
  contentType: PostContentType;
  parentId?: number;
  tag1?: number;
  tag2?: number;
  allowedViewers?: string | null;
  allowedViewerState?: TopicAllowedViewerState;
  type?: TopicType;
  notifyPoster?: boolean;
  isAnonymous?: boolean;
  notifyAllReplier?: boolean;
  clientType?: number;
}
