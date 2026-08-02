export enum AnonymousState {
  NotAllowed = 0,
  Force = 1,
  Allowed = 2,
  OnlyPosterAllowed = 3,
}

export enum BoardInternalState {
  None = 0,
  InternalOnly = 1,
  NeedReview = 2,
}

export enum BoardPosterOnlyState {
  Forbid = 0,
  Stop = 1,
  BandMaster = 2,
  AllUser = 3,
}

/**
 * 版面内容的保密设置。
 *
 * 后端将该类型定义为 flags enum，各值可以按位组合。
 */
export enum BoardPrivacyState {
  None = 0,
  NotHot = 1,
  NotSearchable = 2,
  NotNewTopic = 4,
}

export enum ViewerFilterState {
  Forbidden = 0,
  NotEnabled = 1,
  EnabledByAdmin = 2,
  Enabled = 3,
}

export enum BoardProtectionLevel {
  None = 0,
  RequireLogOn = 1,
  RequireSpecifiedUser = 2,
  Hidden = 3,
}
