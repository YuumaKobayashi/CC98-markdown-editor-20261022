import * as React from "react";

import { useAppDispatch, useAppSelector } from "@application/store";
import { formAuthorizeHeader } from "@features/auth/api/session";
import * as UserCenterActions from "@legacy/Actions/UserCenter";
import type { ThemeSetting } from "@legacy/States/AppState";
import { cc98Fetch } from "@foundation/api/http";
import { themeList, type ThemeItem } from "@foundation/theme/registry";
import { changeTheme, getRealThemeNumber } from "@foundation/theme/runtime";

import {
  ThemeSettingsForm,
  type ThemeSettingResult,
} from "./ThemeSettingsForm";

export function UserCenterThemePage() {
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector((state) => state.userInfo.currentUserInfo);

  const handleThemeSettingChange = async (
    setting: ThemeSetting
  ): Promise<ThemeSettingResult> => {
    try {
      const headers = await formAuthorizeHeader();
      headers.append("Content-Type", "application/json");
      const response = await cc98Fetch("me/theme-setting", {
        headers,
        method: "PUT",
        body: JSON.stringify(setting),
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const theme = getRealThemeNumber(userInfo.theme, setting);
      dispatch(
        UserCenterActions.changeUserInfo({
          ...userInfo,
          theme,
          themeSetting: setting,
        })
      );
      changeTheme(theme);
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        message: (error as Error).message,
      };
    }
  };

  const handleSubmit = async (theme: number) => {
    try {
      const headers = await formAuthorizeHeader();
      const response = await cc98Fetch(`/me/theme?id=${theme}`, {
        headers,
        method: "PUT",
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      dispatch(UserCenterActions.changeUserInfo({ ...userInfo, theme }));
      changeTheme(theme);
    } catch {
      // 旧页面固定主题切换失败时保持静默。
    }
  };

  const generateButton = (item: ThemeItem) => (
    <button
      style={item.style}
      key={item.order}
      onClick={() => handleSubmit(item.order)}
      disabled={userInfo.theme === item.order}
    >
      {item.name}
    </button>
  );

  const currentTheme =
    themeList[userInfo.theme] || themeList[themeList.length - 1];

  return (
    <div className="user-theme">
      <div className="user-theme-info">
        <h2>切换皮肤</h2>
        <p>当前皮肤：{currentTheme.name}</p>
      </div>

      <div>
        <ThemeSettingsForm
          setting={userInfo.themeSetting}
          onSettingChange={handleThemeSettingChange}
        />
      </div>
      <hr />
      <div className="user-theme-config">{themeList.map(generateButton)}</div>
    </div>
  );
}
