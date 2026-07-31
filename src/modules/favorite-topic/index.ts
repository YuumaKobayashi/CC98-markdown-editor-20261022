export {
  createFavGroup,
  type CurrentUserFavoriteTopicPage,
  deleteFavoriteTopic,
  deleteFavGroup,
  getCurrentUserFavoriteTopics,
  getFavoriteAllTopic,
  getFavState,
  setFavoriteTopic,
  updateFavGroup,
} from "./api/service";
export {
  defaultFavoriteTopicGroups,
  type FavoriteTopicGroup,
} from "./model/favorite-topic-group";
export {
  FavoriteTopicGroupSelect,
  FavoriteTopicGroupSelect as default,
} from "./ui/FavoriteTopicGroupSelect";
