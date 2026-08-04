import type { UserGender } from "./dto";
import type { UserBasicInfo, UserInfo } from "./dto";

export type {
  ChangeUserInfo,
  UserActivityPointInfo,
  UserBasicInfo,
  UserBoardMasterInfo,
  UserInfo,
  UserPrivacySetting,
} from "./dto";

/**
 * 旧查询 helper 在用户不存在时返回的本地占位模型。
 */
export interface UserLookupFallback {
  id: number | null;
  name: string;
  portraitUrl: string;
  birthday: string;
  fanCount: number;
  followCount: number;
  gender: UserGender;
  lastLogOnTime: string;
  popularity: number;
  prestige: number;
  signatureCode: string;
}

export type UserLookupResult = UserInfo | UserBasicInfo | UserLookupFallback;
