export interface UserSignInStateInfo {
  /*
   *今日是否已签到
   */
  hasSignedInToday: boolean;
  /*
   *连续签到天数
   */
  lastSignInCount: number;
  /*
   *上次签到时间
   */
  lastSignInTime: string;
  /*
   * 上次签到奖励
   */
  lastReward: number;
}

/** 旧名兼容别名；实际 wire DTO 为 {@link UserSignInStateInfo}。 */
export type ISignIn = UserSignInStateInfo;
