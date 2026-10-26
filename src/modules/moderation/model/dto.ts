import type {
  ForumUserOperationType,
  UserState,
} from "@modules/user/model/dto";
import type { ResultWithCount } from "@foundation/api/contracts";
import type { BoardEvent } from "@modules/board/model/dto";

export interface PostSimpleInfo {
  floor: number;
  userId: number;
  userName: string;
  content: string;
}

export interface PostWithIpInfo {
  ip: string;
  posts: PostSimpleInfo[];
}

export type TopicManageHistory = ResultWithCount<BoardEvent>;

export interface ForumUserOperationRequest {
  /**
   * 1=锁定，2=屏蔽，3=tp
   */
  PunishmentType?: UserState.Locked | UserState.Shielded | UserState.StopPost;
  /**
   * 0=取消，1=执行
   */
  OperationType?: ForumUserOperationType;
  /**
   * -1表示永久，其余7<Days<1000
   */
  Days?: number;
  /**
   * 理由
   */
  Reason?: string;
}
