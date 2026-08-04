/**
 * 主题设置对象。
 */
export interface ThemeSetting {

  /**
   * 是否开启主题日夜切换功能。
   */
  enableDayNightSwitch: boolean;
  /**
   * 是否跟随浏览器的日夜模式同步切换。
   */
  syncWithBrowserDayNightMode: boolean;
  /**
   * 日间开始时间。
   */
  dayStartTime: string;
  /**
   * 夜间开始时间。
   */
  nightStartTime: string;
}
