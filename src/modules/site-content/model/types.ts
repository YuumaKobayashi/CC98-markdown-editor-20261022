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
