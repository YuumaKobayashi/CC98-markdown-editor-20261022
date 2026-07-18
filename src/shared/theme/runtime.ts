import { Constants } from "@shared/config/runtime-config";
import { getLocalStorage, setLocalStorage } from "@shared/storage/web-storage";
import { themeDayNightGroups, themeList } from "@shared/theme/registry";
import $ from "jquery";

interface ThemeSetting {
  enableDayNightSwitch: boolean;
  syncWithBrowserDayNightMode: boolean;
  dayStartTime: string;
  nightStartTime: string;
}

/**
 * 表示用户希望设置的主题的键。
 */
const userSetThemeKey = "user-set-theme";

/**
 * 表示实际使用的主题的键。
 */
const useThemeKey = "use-theme";

/**
 * 执行更新主题的核心操作。
 * @param {number} theme 要更新的主题编号。
 */
function changeThemeCore(theme: number) {
  // 存入实际设置值
  setLocalStorage(useThemeKey, theme);

  // 防止缓存未更新导致的样式错误
  if (theme === 0 || !themeNames[theme]) {
    theme = themeNames.length - 1;
  }

  // 更改样式表
  $("#mainStylesheet").attr("href", `/static/content/${themeNames[theme]}`);
}

declare let themeNames: string[];

/**
 * 切换主题。
 * @param {number} theme 要更换的主题。
 */
export function changeTheme(theme: number) {
  // 存入设置值。
  setLocalStorage(userSetThemeKey, theme);

  // 获取真正的主题值（根据日夜设置，该值可能和用户希望设置的值并不相同）。
  const realTheme = getRealThemeNumber(theme);

  // 执行更新主题操作。
  changeThemeCore(realTheme);
}

/**
 * 从存储区检查主题设置并判断是否需要更新主题。
 */
export function checkThemeToChange(): void {
  // 当前存储值
  const currentSetTheme = parseInt(
    getLocalStorage<string>(userSetThemeKey),
    10
  );
  const currentUsedTheme = parseInt(getLocalStorage<string>(useThemeKey), 10);

  if (Number.isNaN(currentSetTheme) || Number.isNaN(currentUsedTheme)) {
    return;
  }
  // 新主题值
  const newTheme = getRealThemeNumber(currentSetTheme);

  // 无需改变主题则不进行任何操作
  if (newTheme === currentUsedTheme) {
    return;
  }

  // 执行更新主题操作
  changeThemeCore(newTheme);
}

/**
 * 根据用户的主题设置，获取实际生效的主题。
 */

/**
 * 根据第二个参数提供的设置，或本地缓存的用户的主题设置，获取实际生效的主题。
 * @param {number} themeIndex 用户希望设置的主题值。
 * @param {State.ThemeSetting} setting 用户希望使用的主题设置。如果参数为 null 则表示使用系统内的设置。
 * @returns {number} 实际应当生效的主题值。
 */
export function getRealThemeNumber(
  themeIndex: number,
  setting?: ThemeSetting
): number {
  /**
   * 用户选择默认主题，则使用系统定义的实际主题值。
   */
  if (themeIndex === 0) {
    themeIndex = Constants.config.defaultTheme;

    // 如果默认配置大于实际长度（通常是缓存未更新导致），则退回到使用最近的一个版本
    if (themeIndex >= themeNames.length) {
      themeIndex = themeNames.length - 1;
    }
  }

  // 获取当前用户的主题设置
  setting ??= getMyThemeSetting();

  // 如果没有有效的轮换设置（未登录或者未启用），则不进行后面任何操作
  if (!setting) {
    return themeIndex;
  }

  // 获取当前主题，or 部分为防止缓存未更新而使用最新主题
  const item = themeList[themeIndex];
  if (!item) {
    return themeList.length - 1;
  }

  const groupIndex = themeDayNightGroups.findIndex(
    (i) => i.day === item.name || i.night === item.name
  );

  // 当前选择的主题不支持日夜切换，则不进行任何改动
  if (groupIndex === -1) {
    return themeIndex;
  }

  const group = themeDayNightGroups[groupIndex];
  const dayNightValue = getDayNight(setting);

  let actualThemeName: string = null;

  switch (dayNightValue) {
    case DayNight.Day:
      actualThemeName = group.day;
      break;
    case DayNight.Night:
      actualThemeName = group.night;
      break;
    // 出现错误
    default:
      return themeIndex;
  }

  // 查找真正的主题名字
  const actualIndex = themeList.findIndex((i) => i.name == actualThemeName);
  return actualIndex === -1 ? themeIndex : actualIndex;
}

/**
 * 定义日夜模式。
 */
enum DayNight {
  /**
   * 日间模式。
   */
  Day,
  /**
   * 夜间模式。
   */
  Night,
}

/**
 * 获取一个值，指示当前浏览器是否支持主题颜色切换功能。
 * @returns 当前浏览器是否支持主题颜色切换功能。
 */
export function isBrowserDayNightModeSupported(): boolean {
  return window.matchMedia("(prefers-color-scheme)").matches;
}

/**
 * 根据浏览器信息获得日夜模式值。
 * @returns {DayNight} 浏览器当前提供的日夜模式值。
 */
function getDayNightByBrowser(): DayNight {
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? DayNight.Day
    : DayNight.Night;
}

/**
 * 根据日夜时间设置获得日夜模式值。
 * @param {string} dayStart 日间开始时间。
 * @param {string} nightStart 夜间开始时间。
 * @returns {DayNight} 根据用户设置判定当前的日夜值。
 */
function getDayNightByTimeSetting(
  dayStart: string,
  nightStart: string
): DayNight {
  const now = new Date();

  // 2006-01-02
  const datePart = now.toISOString().substring(0, 10);

  const dayThreshold = new Date(datePart + "T" + dayStart);
  const nightThreshold = new Date(datePart + "T" + nightStart);

  // 8 点到 23 点为日间
  if (dayThreshold < nightThreshold) {
    return now >= dayThreshold && now < nightThreshold
      ? DayNight.Day
      : DayNight.Night;
    // 1 点到 9 点为夜间
  } else {
    return now >= nightThreshold && now < dayThreshold
      ? DayNight.Night
      : DayNight.Day;
  }
}

/**
 * 获取当前用户的主题设置。
 * @returns 当前用户的主题设置。
 */
function getMyThemeSetting(): ThemeSetting {
  try {
    return getLocalStorage<any>("userInfo").themeSetting;
  } catch (e) {
    return null;
  }
}

/**
 * 获取日夜设置值。
 * @returns 如果启用了日夜设置，则返回当前有效的日夜信息。否则，返回 null。
 */
function getDayNight(setting: ThemeSetting): DayNight | null {
  if (!setting.enableDayNightSwitch) {
    return null;
  }

  if (isBrowserDayNightModeSupported() && setting.syncWithBrowserDayNightMode) {
    return getDayNightByBrowser();
  } else {
    return getDayNightByTimeSetting(
      setting.dayStartTime,
      setting.nightStartTime
    );
  }
}
