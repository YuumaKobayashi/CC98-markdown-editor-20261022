export enum PostState {
  Normal = 0,
  Deleted = 2,
}

export enum PostContentType {
  Ubb = 0,
  Markdown = 1,
}

export enum LikeState {
  None = 0,
  Like = 1,
  Dislike = 2,
}

export enum PostUserOperationType {
  Bonus = 0,
  Punishment = 1,
}

export enum RatingType {
  Add = 1,
  Subtract = 2,
}

export enum PostAwardType {
  OldVersion = 0,
  Bonus = 1,
  Punishment = 2,
  UserRating = 3,
}
