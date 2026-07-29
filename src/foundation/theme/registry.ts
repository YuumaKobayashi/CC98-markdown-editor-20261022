import * as React from "react";

export interface ThemeItem {
  /**主题的顺序 */
  order: number;
  /**主题的名字 */
  name: string;
  /**按钮的样式 */
  style: React.CSSProperties;
}

/**
 * 具体的主题按钮样式
 * 每次添加新主题时修改这里,这里的背景图片为小图
 */
export const themeList: ThemeItem[] = [
  {
    order: 0,
    name: "系统默认",
    style: { color: "black", backgroundColor: "#ffffff" },
  },
  {
    order: 1,
    name: "冬季",
    style: {
      backgroundColor: "#79b8ca",
      backgroundImage: "url(/static/images/header-image-thumb/winter.jpg)",
    },
  },
  {
    order: 2,
    name: "春季（浅）",
    style: {
      backgroundColor: "#b1d396",
      backgroundImage: "url(/static/images/header-image-thumb/spring.jpg)",
    },
  },
  {
    order: 3,
    name: "春季（深）",
    style: {
      backgroundColor: "#95b675",
      backgroundImage: "url(/static/images/header-image-thumb/spring.jpg)",
    },
  },
  {
    order: 4,
    name: "夏季",
    style: {
      backgroundColor: "#5198d8",
      backgroundImage: "url(/static/images/header-image-thumb/summer.jpg)",
    },
  },
  {
    order: 5,
    name: "秋季（橙）",
    style: {
      backgroundColor: "#F4A460",
      backgroundImage: "url(/static/images/header-image-thumb/autumn.jpg)",
    },
  },
  {
    order: 6,
    name: "秋季（红）",
    style: {
      backgroundColor: "#B22222",
      backgroundImage: "url(/static/images/header-image-thumb/autumn.jpg)",
    },
  },
  {
    order: 7,
    name: "双十一交友",
    style: {
      backgroundColor: "rgb(240,125,145)",
      backgroundImage: "url(/static/images/header-image-thumb/singleday.jpg)",
    },
  },
  {
    order: 8,
    name: "中秋（暗）",
    style: {
      backgroundColor: "rgb(38,118,129)",
      backgroundImage: "url(/static/images/header-image-thumb/mid_autumn.jpg)",
    },
  },
  {
    order: 9,
    name: "中秋（亮）",
    style: {
      backgroundColor: "rgb(52,150,159)",
      backgroundImage: "url(/static/images/header-image-thumb/mid_autumn.jpg)",
    },
  },
  {
    order: 10,
    name: "小雪（暗）",
    style: {
      backgroundColor: "rgb(3, 57, 117)",
      backgroundImage: "url(/static/images/header-image-thumb/light_snow.jpg)",
    },
  },
  {
    order: 11,
    name: "小雪（亮）",
    style: {
      backgroundColor: "rgb(122, 146, 194)",
      backgroundImage: "url(/static/images/header-image-thumb/light_snow.jpg)",
    },
  },
  {
    order: 12,
    name: "春节（暗）",
    style: {
      backgroundColor: "rgb(205,0,0)",
      backgroundImage:
        "url(/static/images/header-image-thumb/spring_festival_dark.jpg)",
    },
  },
  {
    order: 13,
    name: "春节（亮）",
    style: {
      backgroundColor: "rgb(214,14,36)",
      backgroundImage:
        "url(/static/images/header-image-thumb/spring_festival_light.jpg)",
    },
  },
  {
    order: 14,
    name: "仲春",
    style: {
      backgroundColor: "rgb(70, 141, 57)",
      backgroundImage: "url(/static/images/header-image-thumb/zhongchun.jpg)",
    },
  },
  {
    order: 15,
    name: "端午",
    style: {
      backgroundColor: "rgb(53, 120, 188)",
      backgroundImage:
        "url(/static/images/header-image-thumb/dragon_boat_festival.jpg)",
    },
  },
  {
    order: 16,
    name: "清明",
    style: {
      backgroundColor: "rgb(106, 132, 113)",
      backgroundImage: "url(/static/images/header-image-thumb/qingming.jpg)",
    },
  },
  {
    order: 17,
    name: "秋色之空（暗）",
    style: {
      backgroundColor: "rgb(183, 115, 65)",
      backgroundImage: "url(/static/images/header-image-thumb/autumn_2022.jpg)",
    },
  },
  {
    order: 18,
    name: "秋色之空（亮）",
    style: {
      backgroundColor: "rgb(235, 142, 85)",
      backgroundImage: "url(/static/images/header-image-thumb/autumn_2022.jpg)",
    },
  },
  {
    order: 19,
    name: "冬日暖雪（暗）",
    style: {
      backgroundColor: "rgb(125,85,119)",
      backgroundImage:
        "url(/static/images/header-image-thumb/winter_2022_dark.jpg)",
    },
  },
  {
    order: 20,
    name: "冬日暖雪（亮）",
    style: {
      backgroundColor: "rgb(181, 127, 163)",
      backgroundImage: "url(/static/images/header-image-thumb/winter_2022.jpg)",
    },
  },
  {
    order: 21,
    name: "春樱日和（暗）",
    style: {
      backgroundColor: "rgb(131,150,55)",
      backgroundImage: "url(/static/images/header-image-thumb/spring_2023.jpg)",
    },
  },
  {
    order: 22,
    name: "春樱日和（亮）",
    style: {
      backgroundColor: "rgb(171,195,73)",
      backgroundImage: "url(/static/images/header-image-thumb/spring_2023.jpg)",
    },
  },
  {
    order: 23,
    name: "重阳（暗）",
    style: {
      backgroundColor: "rgb(122, 109, 153)",
      backgroundImage: "url(/static/images/header-image-thumb/chongyang.jpg)",
    },
  },
  {
    order: 24,
    name: "重阳（亮）",
    style: {
      backgroundColor: "rgb(122, 109, 153)",
      backgroundImage: "url(/static/images/header-image-thumb/chongyang.jpg)",
    },
  },
  {
    order: 25,
    name: "金舞迎春（暗）",
    style: {
      backgroundColor: "rgb(197,61,55)",
      backgroundImage: "url(/static/images/header-image-thumb/spring_festival_2025.jpg)",
    },
  },
  {
    order: 26,
    name: "金舞迎春（亮）",
    style: {
      backgroundColor: "rgb(255,103,84)",
      backgroundImage: "url(/static/images/header-image-thumb/spring_festival_2025.jpg)",
    },
  },
  {
    order: 27,
    name: "新岁花朝（暗）",
    style: {
      backgroundColor: "rgba(180, 84, 71, 1)",
      backgroundImage: "url(/static/images/header-image-thumb/new_year_2026_dark.jpg)",
    },
  },
  {
    order: 28,
    name: "新岁花朝（亮）",
    style: {
      backgroundColor: "rgba(223, 108, 93, 1)",
      backgroundImage: "url(/static/images/header-image-thumb/new_year_2026.jpg)",
    },
  },
  {
    order: 29,
    name: "沧海启明",
    style: {
      backgroundColor: "rgb(57,70,118)",
      backgroundImage: "url(/static/images/header-image-thumb/cc98_23rd_light.jpg)",
    },
  },
];

/**
 * 定义具有日夜模式的皮肤关系。
 */
export interface ThemeDayNightGroup {
  /**
   * 日间主题名称。
   */
  day: string;
  /**
   * 夜间主题名称。
   */
  night: string;
}

/**
 * 具有日夜关系的主题列表。
 */
export const themeDayNightGroups: ThemeDayNightGroup[] = [
  { day: "中秋（亮）", night: "中秋（暗）" },
  { day: "小雪（亮）", night: "小雪（暗）" },
  { day: "春节（亮）", night: "春节（暗）" },
  { day: "秋色之空（亮）", night: "秋色之空（暗）" },
  { day: "冬日暖雪（亮）", night: "冬日暖雪（暗）" },
  { day: "春樱日和（亮）", night: "春樱日和（暗）" },
  { day: "重阳（亮）", night: "重阳（暗）" },
  { day: "金舞迎春（亮）", night: "金舞迎春（暗）" },
  { day: "新岁花朝（亮）", night: "新岁花朝（暗）" },
];
