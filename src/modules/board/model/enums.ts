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
