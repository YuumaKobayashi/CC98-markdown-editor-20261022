/**
 * 首页话题类
 * 用于首页左侧下方的几栏，该类的对象（一条主题)需要标题和id
 **/
export interface MainPageTopicState {
  //属性
  title: string;
  id: number;

  //构造方法
}

/**
 * 首页话题更多参数
 * 拥有名称和链接两个属性
 */
export interface HomeSectionLink {
  name: string;
  url: string;
}

/**
 * 首页栏目类
 * 用于首页的栏目，包括推荐阅读、推荐功能以及校园新闻。
 * 该类的成员对象包括：图片url（校园新闻不需要），标题，url，以及摘要（仅推荐阅读需要）
 * 这部分栏目均设置在新窗口打开链接
 **/
export interface MainPageColumn {
  //属性
  imageUrl: string;
  title: string;
  url: string;
  content: string;

  //构造方法
}
