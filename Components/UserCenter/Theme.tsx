import * as React from "react";
import * as Actions from "../../Actions/UserCenter";
import { ThemeSetting, UserInfo } from "../../States/AppState";
import { connect } from "react-redux";
import { RootState } from "../../Store";
import { string } from "prop-types";
import { cc98Fetch } from "@shared/api/http";
import { formAuthorizeHeader } from "@features/auth/api/session";
import {
  changeTheme,
  getRealThemeNumber,
  isBrowserDayNightModeSupported,
} from "@shared/theme/runtime";

/**
 * 该组件需要使用的属性列表。
 */
interface ThemeProps {
  /**
   * 当前界面关联的用户信息。
   */
  userInfo: UserInfo;
  /**
   * 修改用户界面操作执行的回调。
   */
  changeUserInfo: (userInfo: UserInfo) => void;
}

/**
 * 主题列表
 */
import { themeDayNightGroups, themeList } from "@shared/theme/registry";
import type { ThemeDayNightGroup, ThemeItem } from "@shared/theme/registry";
export { themeDayNightGroups, themeList } from "@shared/theme/registry";
export type { ThemeDayNightGroup, ThemeItem } from "@shared/theme/registry";

let themeButtons = [];
for (let i of themeList) {
  themeButtons.push(i.name);
}

interface ThemeSettingSuccessResult {
  ok: true;
}

interface ThemeSettingFailResult {
  ok: false;
  message: string;
}

type ThemeSettingResult = ThemeSettingSuccessResult | ThemeSettingFailResult;

/**
 * 为 ThemeSettingComponent 控件提供输入。
 */
interface ThemeSettingProps {
  /**
   * 控件关联的主题设置信息。
   */
  setting: ThemeSetting;
  /**
   * 修改用户界面操作执行的回调。
   */
  onSettingChange: (setting: ThemeSetting) => Promise<ThemeSettingResult>;
}

/**
 * 提供主题设置界面。
 */
class ThemeSettingComponent extends React.Component<
  ThemeSettingProps,
  ThemeSetting
> {
  resultRef: React.RefObject<HTMLElement>;
  resultTimeout;
  /**
   * 绑定
   * @param props
   */
  constructor(props: ThemeSettingProps) {
    super(props);
    this.state = props.setting;
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.resultRef = React.createRef();
  }

  /**
   * 统一控件状态控制
   * @param event
   */
  handleInputChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const target = event.target;
    const value =
      target.type === "checkbox" ? target.checked : target.value + ":00";
    const name = target.name;

    this.setState({
      [name]: value,
    } as Pick<ThemeSetting, keyof ThemeSetting>);
  }

  /**
   * 调用父组件方法提交设置更改
   * @param event
   */
  async handleSubmit(event: React.FormEvent): Promise<void> {
    event.preventDefault();
    const themeSettingResult = await this.props.onSettingChange(this.state);
    const resultSpanElement = this.resultRef.current;
    clearTimeout(this.resultTimeout);
    if (themeSettingResult.ok) {
      resultSpanElement.textContent = "保存成功";
    } else {
      resultSpanElement.textContent =
        "保存失败：" + (themeSettingResult as ThemeSettingFailResult).message;
    }
    resultSpanElement.style.display = "unset";
    this.resultTimeout = setTimeout(() => {
      resultSpanElement.style.display = "none";
    }, 3000);
  }

  render() {
    const supportTip: React.ReactNode =
      isBrowserDayNightModeSupported() ? (
        []
      ) : (
        <div title="你当前使用的浏览器不支持切换日夜模式，因此自动切换无法工作。网站将按照你设置的固定时间进行切换。不过，你仍然可以设置这个选项，以便于在支持它的电脑和浏览器上使用这个功能。">
          {" "}
          提示{" "}
        </div>
      );

    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          <input
            className="ant-checkbox"
            name="enableDayNightSwitch"
            type="checkbox"
            checked={this.state.enableDayNightSwitch}
            onChange={this.handleInputChange}
          />{" "}
          启用皮肤昼夜更换功能
        </label>
        <p className="help-text">
          只有同时提供亮色和暗色选项的皮肤才支持昼夜更换功能。如果你选择其它皮肤，这个选项将不会产生任何效果。
        </p>

        <div>
          <label>
            <input
              className="ant-checkbox"
              name="syncWithBrowserDayNightMode"
              type="checkbox"
              checked={this.state.syncWithBrowserDayNightMode}
              onChange={this.handleInputChange}
            />{" "}
            自动同步浏览器的昼夜模式 {supportTip}
          </label>
        </div>
        <p className="help-text">
          你的浏览器必须支持获取昼夜模式的接口，否则这个设置将不会生效。
        </p>

        <div>
          <label htmlFor="day-start-input">白昼开始时刻</label>
          <input
            id="day-start-input"
            name="dayStartTime"
            type="time"
            required={true}
            onChange={this.handleInputChange}
            value={this.state.dayStartTime}
            style={{
              margin: "0px 10px",
            }}
          />

          <label htmlFor="night-start-input">夜间开始时刻</label>
          <input
            id="night-start-input"
            name="nightStartTime"
            type="time"
            required={true}
            onChange={this.handleInputChange}
            value={this.state.nightStartTime}
            style={{
              margin: "0px 10px",
            }}
          />
        </div>
        <p className="help-text">
          当浏览器不支持获取昼夜模式的接口时，将会回退使用此设置所设定的昼夜开始时刻更换皮肤。
        </p>

        <button
          className="ant-btn ant-btn-primary"
          style={{ padding: "0px 10px" }}
          type="submit"
        >
          保存设置
        </button>
        <span
          ref={this.resultRef}
          style={{
            marginLeft: "10px",
            display: "none",
          }}
        ></span>
      </form>
    );
  }
}

class Theme extends React.Component<ThemeProps> {
  constructor(props: ThemeProps) {
    super(props);
    this.handleThemeSettingChange = this.handleThemeSettingChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.generateButton = this.generateButton.bind(this);
  }

  handleThemeSettingChange = async (setting: ThemeSetting) => {
    try {
      // 向服务器提交信息
      let headers = await formAuthorizeHeader();
      headers.append("Content-Type", "application/json");

      const url = "me/theme-setting";
      let response = await cc98Fetch(url, {
        headers,
        method: "PUT",
        body: JSON.stringify(setting),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      // 获取推断后的主题下标
      const theme = getRealThemeNumber(
        this.props.userInfo.theme,
        setting
      );

      // 更新用户信息
      this.props.changeUserInfo({
        ...this.props.userInfo,
        theme,
        themeSetting: setting,
      });

      // 刷新主题
      changeTheme(theme);

      return {
        ok: true as true,
      } as ThemeSettingSuccessResult;
    } catch (e) {
      return {
        ok: false as false,
        message: (e as Error).message,
      } as ThemeSettingFailResult;
    }
  };

  handleSubmit = async (theme: number) => {
    try {
      // 向服务器提交信息
      let headers = await formAuthorizeHeader();
      const url = `/me/theme?id=${theme}`;
      let res = await cc98Fetch(url, {
        headers,
        method: "PUT",
      });

      if (!res.ok) {
        throw new Error(res.statusText);
      }

      // 更新用户信息
      this.props.changeUserInfo({ ...this.props.userInfo, theme });

      // 刷新主题
      changeTheme(theme);
    } catch (e) { }
  };

  generateButton = (item: ThemeItem) => {
    return (
      <button
        style={item.style}
        key={item.order}
        onClick={() => this.handleSubmit(item.order)}
        disabled={this.props.userInfo.theme === item.order}
      >
        {item.name}
      </button>
    );
  };

  render() {
    // 后端可能返回前端暂不识别的主题编号，未命中时沿用最后一个可用主题。
    const currentTheme =
      themeList[this.props.userInfo.theme] || themeList[themeList.length - 1];

    return (
      <div className="user-theme">
        <div className="user-theme-info">
          <h2>切换皮肤</h2>
          <p>当前皮肤：{currentTheme.name}</p>
        </div>

        <div>
          <ThemeSettingComponent
            setting={this.props.userInfo.themeSetting}
            onSettingChange={this.handleThemeSettingChange}
          />
        </div>
        <hr />
        <div className="user-theme-config">
          {themeList.map(this.generateButton)}
        </div>
      </div>
    );
  }
}

function mapState(state: RootState) {
  return {
    userInfo: state.userInfo.currentUserInfo,
  };
}

function mapDispatch(dispatch) {
  return {
    changeUserInfo: (userInfo: UserInfo) => {
      dispatch(Actions.changeUserInfo(userInfo));
    },
  };
}

export default connect(mapState, mapDispatch)(Theme);
