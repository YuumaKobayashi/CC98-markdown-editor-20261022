/**
 * 转账时要提供的body
 */
export interface TransferWealthInfo {
  /**
   * 用户名数组，最多10个
   */
  userNames: string[];
  /**
   * 要转账的数目
   */
  wealth: number;
  /**
   * 理由
   */
  reason: string;
}

export enum RewardType {
  Wealth = 0,
  Prestige = 1,
}

export interface RewardDailyRecordInfo {
  rewardType: RewardType;
  rewardTotalValue: number;
  rewardMaxValue: number | null;
}
