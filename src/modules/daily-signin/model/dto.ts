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

export interface ServerNowResultDto {
  errorCode: number;
  data: string;
  extra: string | null;
}

export interface UserSignInDailyInfo {
  year: number;
  month: number;
  day: number;
  useCard: boolean;
  reward: number;
}

export interface MakeUpMissedSigninResponseDto {
  errorCode: number;
  data: number;
  extra: string | null;
}

export type MakeUpMissedSigninResult =
  | { readonly ok: true; readonly lastSignInCount: number }
  | { readonly ok: false; readonly errorMessage: string };
