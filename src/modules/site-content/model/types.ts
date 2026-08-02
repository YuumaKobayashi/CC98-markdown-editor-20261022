import type { IBasicTopic } from "@modules/topic";

export interface ForumIndexColumnInfo {
  id: number;
  /** 1=推荐阅读，2=推荐功能，3=校园新闻，4=Banner，7=福利优惠 */
  type: number;
  /** 必须，Banner表示对Banner的简单描述 */
  title: string;
  /** 只有推荐阅读需要 */
  content: string;
  /** 校园新闻不需要 */
  url: string;
  /** 校园新闻不需要 */
  imageUrl: string;
  /** 排序权重，只有推荐阅读和推荐功能需要 */
  orderWeight: number;
  /** 是否显示 */
  enable: boolean;
  /** Banner和福利优惠需要，大于0的整数 */
  days: number;
  /** */
  isNew: boolean;
  /** */
  expiredTime: string;
  visibility: number;
}

export interface IRecommendationReading {
  /**
   * 标题
   */
  title: string;
  /**
   * 内容
   */
  content: string;
  /**
   * 帖子链接
   */
  url: string;
  /**
   * 图标链接
   */
  imageUrl: string;

  id: number;

  type: number;

  enable: boolean;

  time: string;

  expiredTime: string;
}

export interface IConfig {
  /**
   * 学术贴
   */
  academics: IBasicTopic[];
  /**
   * 公告
   */
  announcement: string;
  /**
   * 感性
   */
  emotion: IBasicTopic[];
  /**
   * 交易
   */
  fleaMarket: IBasicTopic[];
  /**
   * 十大
   */
  hotTopic: IBasicTopic[];
  lastUpdateTime: string;
  lastUpdateUser: string;
  /**
   * 在线用户数
   */
  onlineUserCount: number;
  /**
   * 兼职
   */
  partTimeJob: IBasicTopic[];
  /**
   * 总帖数
   */
  postCount: number;
  /**
   * 推荐功能
   */
  recommendationFunction: any[];
  /**
   * 推荐阅读
   */
  recommendationReading: IRecommendationReading[];
  /**
   * 校园活动
   */
  schoolEvent: IBasicTopic[];
  /**
   * 校园新闻
   */
  schoolNews: IBasicTopic[];
  /**
   * 学习天地
   */
  study: IBasicTopic[];
  /**
   * 今日贴数
   */
  todayCount: number;
  /**
   * 总主题
   */
  topicCount: number;
  /**
   * 总用户
   */
  userCount: number;
}

/** 首页 */
export interface IIndex {
  /** 全站公告 */
  announcement: string;
  /** 热门话题 */
  hotTopic: IIndexHotTopic[];
  /** 推荐阅读 */
  recommendationReading: IMainpageEditableContent[];
  /** 推荐功能 */
  recommendationFunction: IMainpageEditableContent[];
  /** 校园新闻 */
  schoolNews: IMainpageEditableContent[];
  /** 校园活动 */
  schoolEvent: IMainpageAutoContent[];
  /** 学术通知 */
  academics: IMainpageAutoContent[];
  /** 学习园地 */
  study: IMainpageAutoContent[];
  /** 感性·情感 */
  emotion: IMainpageAutoContent[];
  /** 跳蚤市场 */
  fleaMarket: IMainpageAutoContent[];
  /** 实习兼职 */
  partTimeJob: IMainpageAutoContent[];
  /** 求职广场 */
  fullTimeJob: IMainpageAutoContent[];
  /** 今日帖数 */
  todayCount: number;
  /** 总主题数 */
  topicCount: number;
  /** 总帖数 */
  postCount: number;
  /** 总用户数 */
  userCount: number;
  /** 最新注册用户名 */
  lastUserName: string;
  /** 当前在线用户数 */
  onlineUserCount: number;
  /** 首页数据最后刷新时间 */
  lastUpdateTime: string;
}

/** 热门话题 */
export interface IIndexHotTopic {
  /** 帖子id */
  id: number;
  /** 帖子标题 */
  title: string;
  /** 版面id */
  boardId: number;
  /** 版面名称 */
  boardName: string;
  /** 参与主题的用户数 */
  participantCount: number;
  /** 总回复数 */
  replyCount: number;
  /** 总点击数 */
  hitCount: number;
  /** 作者名，空值为匿名 */
  authorName: string | null;
  /** 发表时间 */
  createTime: string;
  /** 帖子类型 */
  type: number;
}

/**
 * 首页可编辑的内容
 * 包括推荐阅读、推荐功能和校园新闻
 */
export interface IMainpageEditableContent {
  /** 首页内容id */
  id: number;
  /**
   * 首页可编辑内容类型
   * 1为推荐阅读
   * 2为推荐功能
   * 3为校园新闻
   */
  type: number;
  /** 标题 */
  title: string;
  /** 内容 */
  content: string | null;
  /** 链接 */
  url: string;
  /** 图片链接 */
  imageUrl: string | null;
  /** 是否生效 */
  enable: boolean;
  /** 时间 */
  time: string;
  /** 排序权重 */
  orderWeight: number;
  /** 过期时间，空值为不过期 */
  expiredTime: null | string;
}

/**
 * 首页自动生成的内容
 * 包括
 */
export interface IMainpageAutoContent {
  /** 帖子id */
  id: number;
  /** 版面id */
  boardId: number;
  /** 帖子标题 */
  title: string;
  /** 帖子状态 */
  state: number;
  /** 帖子类型 */
  type: number;
  /** 是否仅限内部版面 */
  isInternalOnly: boolean;
  /** 是否是投票帖 */
  isVote: boolean;
}

export interface ISite {
  /**
   * 全站公告
   */
  announcement: string;
  /**
   * 全站管理员
   */
  anonymityAdmin: string[];
  /**
   * 是否开启生日提醒
   */
  birthdayActivityIsEnabled: boolean;
  /**
   * 生日提醒奖励配置
   */
  birthdayActivitySetting: string;
  /**
   * 是否维护中
   */
  isMaintaining: boolean;
  /**
   *
   */
  lastBirthdayActivityDay: string;
  /**
   * 最新注册用户
   */
  lastUserName: string;
  /**
   * 最高在线人数
   */
  maxOnlineCount: number;
  /**
   * 最高在线时间
   */
  maxOnlineDate: string;
  /**
   * 最高单日发帖数
   */
  maxPostCount: number;
  /**
   * 最高单日发帖时间
   */
  maxPostDate: string;
  /**
   * 全站贴总数
   */
  postCount: number;
  /**
   * 是否开启签到
   */
  signInEnabled: boolean;
  /**
   * 签到奖励区间
   */
  signInRewards: string[];
  /**
   * 签到楼id
   */
  signInTopicId: number;
  /**
   * 今日主题数
   */
  todayCount: number;
  /**
   * 今日发帖数
   */
  topicCount: number;
  /**
   * 用户总数
   */
  userCount: number;
}
