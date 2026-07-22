import * as React from "react";

export {
  AnnouncementComponent,
  MainPageColumn,
  MainPageTopicComponent,
  MainPageTopicMoreProps,
  MainPageTopicState,
  QRCode,
  RecommendedFunctionComponent,
  SchoolSuggestionBox,
  SpecialOfferComponent,
} from "@pages/home";
export {
  HomeAdvertisementCarousel as AdsComponent,
  HomeHotTopics as HotTopicComponent,
  HomePage as MainPage,
  HomeStatistics as MainPageCountComponent,
  RecommendedReading as RecommendedReadingComponent,
} from "@pages/home";

/**
 * 首页热门话题类
 * 用于首页的热门话题(十大），该类的对象（一条热门话题)需要标题，id，所在版面，及所在版面id等几个属性
 **/
export class HotTopicState {
  title: string;
  id: number;
  boardName: string;
  boardId: number;

  constructor(title, id, boardName, boardId) {
    this.title = title;
    this.id = id;
    this.boardName = boardName;
    this.boardId = boardId;
  }
}

/**
 * 推荐版面组件
 */
export class RecommendedBoardComponent extends React.Component<{}, {}> {
  render() {
    return <div></div>;
  }
}

/**
 * 首页统计类
 * 包括今日帖数，总主题数，总回复数，总用户数，最新用户
 */
export class MainPageCountProps {
  todayCount: number;
  todayTopicCount: number;
  topicCount: number;
  postCount: number;
  onlineUserCount: number;
  userCount: number;
  lastUserName: string;

  constructor(
    todayCount,
    todayTopicCount,
    topicCount,
    postCount,
    onlineUserCount,
    userCount,
    lastUserName
  ) {
    this.todayCount = todayCount;
    this.todayTopicCount = todayTopicCount;
    this.topicCount = topicCount;
    this.postCount = postCount;
    this.onlineUserCount = onlineUserCount;
    this.userCount = userCount;
    this.lastUserName = lastUserName;
  }
}
