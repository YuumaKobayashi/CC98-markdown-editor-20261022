export enum UserGender {
  Male = 1,
  Female = 0,
}

export enum UserState {
  Normal = 0,
  Locked = 1,
  Shielded = 2,
  StopPost = 3,
}

export enum UserTopicViewMode {
  Classic = 0,
  Card = 1,
  CardMediaOnly = 2,
}

export enum TargetWindow {
  CurrentWindow = 0,
  NewWindow = 1,
}

export enum UserRateState {
  None = 0,
  Warning = 1,
  Stop30Days = 2,
  StopPermanent = 3,
}

export enum ForumUserOperationType {
  Cancel = 0,
  Do = 1,
}
