import type { UserGender } from "./enums";
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

export interface UserViewModel extends UserInfo {
  /**
   * 显示的用户组。
   * 旧页面读取但当前后端 `UserInfo` 不返回该字段。
   */
  displayTitle?: string;
  /**
   * 用户个人简介图片。
   * 旧页面字段；当前后端头像字段为 `portraitUrl`。
   */
  photourl?: string;
  /**
   * 自定义头衔。
   * 旧页面读取但当前后端 `UserInfo` 不返回该字段。
   */
  customTitle?: string;
}

/** 旧名兼容别名；实际 wire DTO 为 {@link UserInfo}。 */
export type IUser = UserViewModel;
