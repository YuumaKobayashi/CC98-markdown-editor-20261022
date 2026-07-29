"use strict";

// P04 构建期主题 ABI。
// 数组顺序就是服务端/本地存储使用的主题数字索引；不要按文件名排序。
const themePlaceholder = "default_theme_placeholder";

const themes = Object.freeze([
  { id: 1, key: "css_blue", entry: "./src/foundation/theme/themes/wuteng_blue.scss" },
  { id: 2, key: "css_green", entry: "./src/foundation/theme/themes/forgive_green.scss" },
  { id: 3, key: "css_more_green", entry: "./src/foundation/theme/themes/deep_dark_green.scss" },
  { id: 4, key: "css_summer", entry: "./src/foundation/theme/themes/summer.scss" },
  { id: 5, key: "css_autumn_orange", entry: "./src/foundation/theme/themes/autumn_orange.scss" },
  { id: 6, key: "css_autumn_red", entry: "./src/foundation/theme/themes/autumn_red.scss" },
  { id: 7, key: "css_singleday", entry: "./src/foundation/theme/themes/singleday_pink.scss" },
  { id: 8, key: "css_mid_autumn_dark", entry: "./src/foundation/theme/themes/mid_autumn_dark.scss" },
  { id: 9, key: "css_mid_autumn_light", entry: "./src/foundation/theme/themes/mid_autumn_light.scss" },
  { id: 10, key: "css_light_snow_dark", entry: "./src/foundation/theme/themes/light_snow_dark.scss" },
  { id: 11, key: "css_light_snow_light", entry: "./src/foundation/theme/themes/light_snow_light.scss" },
  { id: 12, key: "css_spring_festival_dark", entry: "./src/foundation/theme/themes/spring_festival_dark.scss" },
  { id: 13, key: "css_spring_festival_light", entry: "./src/foundation/theme/themes/spring_festival_light.scss" },
  { id: 14, key: "css_zhongchun", entry: "./src/foundation/theme/themes/zhongchun.scss" },
  { id: 15, key: "css_dragon_boat_festival", entry: "./src/foundation/theme/themes/dragon_boat_festival.scss" },
  { id: 16, key: "css_qingming", entry: "./src/foundation/theme/themes/qingming.scss" },
  { id: 17, key: "css_autumn_2022_dark", entry: "./src/foundation/theme/themes/autumn_2022_dark.scss" },
  { id: 18, key: "css_autumn_2022_light", entry: "./src/foundation/theme/themes/autumn_2022_light.scss" },
  { id: 19, key: "css_winter_2022_dark", entry: "./src/foundation/theme/themes/winter_2022_dark.scss" },
  { id: 20, key: "css_winter_2022_light", entry: "./src/foundation/theme/themes/winter_2022_light.scss" },
  { id: 21, key: "css_spring_2023_dark", entry: "./src/foundation/theme/themes/spring_2023_dark.scss" },
  { id: 22, key: "css_spring_2023_light", entry: "./src/foundation/theme/themes/spring_2023_light.scss" },
  { id: 23, key: "css_chongyang_dark", entry: "./src/foundation/theme/themes/chongyang_dark.scss" },
  { id: 24, key: "css_chongyang_light", entry: "./src/foundation/theme/themes/chongyang_light.scss" },
  { id: 25, key: "css_spring_festival_2025_dark", entry: "./src/foundation/theme/themes/spring_festival_2025_dark.scss" },
  { id: 26, key: "css_spring_festival_2025_light", entry: "./src/foundation/theme/themes/spring_festival_2025_light.scss" },
  { id: 27, key: "css_new_year_2026_dark", entry: "./src/foundation/theme/themes/new_year_2026_dark.scss" },
  { id: 28, key: "css_new_year_2026_light", entry: "./src/foundation/theme/themes/new_year_2026_light.scss" },
  { id: 29, key: "css_cc98_23rd_light", entry: "./src/foundation/theme/themes/cc98_23rd_light.scss" },
]);

for (const [offset, theme] of themes.entries()) {
  if (theme.id !== offset + 1) {
    throw new Error(`主题 ${theme.key} 的 id 必须连续且从 1 开始`);
  }
}

const themeEntries = Object.freeze(
  Object.fromEntries(themes.map(({ key, entry }) => [key, entry]))
);

module.exports = { themePlaceholder, themes, themeEntries };
