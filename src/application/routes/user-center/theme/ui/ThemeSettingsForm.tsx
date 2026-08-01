import * as React from "react";

import type { ThemeSetting } from "@legacy/States/AppState";
import { isBrowserDayNightModeSupported } from "@foundation/theme";
import styles from "../../UserCenter.module.scss";

export interface ThemeSettingSuccessResult {
  ok: true;
}

export interface ThemeSettingFailResult {
  ok: false;
  message: string;
}

export type ThemeSettingResult =
  | ThemeSettingSuccessResult
  | ThemeSettingFailResult;

interface ThemeSettingsFormProps {
  setting: ThemeSetting;
  onSettingChange: (setting: ThemeSetting) => Promise<ThemeSettingResult>;
}

export function ThemeSettingsForm({
  setting: initialSetting,
  onSettingChange,
}: ThemeSettingsFormProps) {
  const [setting, setSetting] = React.useState(initialSetting);
  const [result, setResult] = React.useState("");
  const [isResultVisible, setIsResultVisible] = React.useState(false);
  const resultTimeoutRef = React.useRef<ReturnType<typeof setTimeout>>();

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const target = event.target;
    const value =
      target.type === "checkbox" ? target.checked : `${target.value}:00`;
    setSetting((current) => ({
      ...current,
      [target.name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const changeResult = await onSettingChange(setting);
    clearTimeout(resultTimeoutRef.current);
    if (changeResult.ok) {
      setResult("保存成功");
    } else {
      setResult(
        `保存失败：${(changeResult as ThemeSettingFailResult).message}`
      );
    }
    setIsResultVisible(true);
    resultTimeoutRef.current = setTimeout(() => {
      setIsResultVisible(false);
    }, 3000);
  };

  const supportTip: React.ReactNode = isBrowserDayNightModeSupported() ? (
    []
  ) : (
    <div title="你当前使用的浏览器不支持切换日夜模式，因此自动切换无法工作。网站将按照你设置的固定时间进行切换。不过，你仍然可以设置这个选项，以便于在支持它的电脑和浏览器上使用这个功能。">
      {" "}
      提示{" "}
    </div>
  );

  return (
    <form onSubmit={handleSubmit}>
      <label>
        <input
          className="ant-checkbox"
          name="enableDayNightSwitch"
          type="checkbox"
          checked={setting.enableDayNightSwitch}
          onChange={handleInputChange}
        />{" "}
        启用皮肤昼夜更换功能
      </label>
          <p className={styles["help-text"]}>
        只有同时提供亮色和暗色选项的皮肤才支持昼夜更换功能。如果你选择其它皮肤，这个选项将不会产生任何效果。
      </p>

      <div>
        <label>
          <input
            className="ant-checkbox"
            name="syncWithBrowserDayNightMode"
            type="checkbox"
            checked={setting.syncWithBrowserDayNightMode}
            onChange={handleInputChange}
          />{" "}
          自动同步浏览器的昼夜模式 {supportTip}
        </label>
      </div>
          <p className={styles["help-text"]}>
        你的浏览器必须支持获取昼夜模式的接口，否则这个设置将不会生效。
      </p>

      <div>
        <label htmlFor="day-start-input">白昼开始时刻</label>
        <input
          id="day-start-input"
          name="dayStartTime"
          type="time"
          required={true}
          onChange={handleInputChange}
          value={setting.dayStartTime}
          style={{ margin: "0px 10px" }}
        />

        <label htmlFor="night-start-input">夜间开始时刻</label>
        <input
          id="night-start-input"
          name="nightStartTime"
          type="time"
          required={true}
          onChange={handleInputChange}
          value={setting.nightStartTime}
          style={{ margin: "0px 10px" }}
        />
      </div>
      <p className={styles["help-text"]}>
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
        style={{
          marginLeft: "10px",
          display: isResultVisible ? "unset" : "none",
        }}
      >
        {result}
      </span>
    </form>
  );
}
