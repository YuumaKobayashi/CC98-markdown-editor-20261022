export enum TopicState {
  Normal = 0,
  Locked = 1,
  Deleted = 2,
  Temporary = 3,
}

export enum TopicType {
  Normal = 0,
  SchoolEvent = 1,
  AcademicInfo = 2,
}

export enum TopicTopState {
  None = 0,
  BoardTop = 2,
  DistrictTop = 3,
  AllTop = 4,
}

export enum TopicBestState {
  None = 0,
  Best = 1,
  Save = 2,
}

export enum TopicAllowedViewerState {
  Forbid = 0,
  Stop = 1,
  Allow = 2,
}

/**
 * 主题内容类型枚举
 */
export enum TopicContentType {
  /**
   * 普通主题帖
   */
  Normal = 0,
  /**
   * 投票主题帖
   */
  VoteTopic = 1,
  /**
   * 视频主题帖
   */
  VideoTopic = 2,
  /**
   * 音频主题帖
   */
  AudioTopic = 3,
  /**
   * 图片主题帖
   */
  ImageTopic = 4,
  Lottery = 5,
}

export enum TopicSpecialStyle {
  Normal = 0,
  GrayScale = 1,
}

export enum LotteryTopicStatus {
  Waiting = 1,
  Finished = 2,
  FinishedWithoutDrawing = 3,
}

export enum LotteryMode {
  SingleCC98Account = 1,
  SingleZJUInfoId = 2,
}

export enum SearchResultOrder {
  ByCreationTime = 0,
  ByLastPostTime = 1,
}

export enum TopicSortMode {
  CreateTime = 0,
  LastReplyTime = 1,
}
