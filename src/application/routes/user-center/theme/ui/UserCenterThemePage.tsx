import * as React from "react";

import { useAppDispatch, useAppSelector } from "@application/store";
import { selectCurrentUser } from "@modules/session/model/selectors";
import { updateCurrentUser } from "@modules/session/model/session-actions";
import type { ThemeSetting } from "@modules/user-preference/model/dto";
import {
  updateTheme,
  updateThemeSetting,
} from "@modules/user-preference/api/service";
import {
  changeTheme,
  getRealThemeNumber,
  themeList,
  type ThemeItem,
} from "@foundation/theme";

import {
  ThemeSettingsForm,
  type ThemeSettingResult,
} from "./ThemeSettingsForm";
import styles from "./UserCenterThemePage.module.scss";

interface ThemePreviewButtonProps {
  disabled?: boolean;
  item: ThemeItem;
  onSelect?: (theme: number) => void;
}

export function ThemePreviewButton({
  disabled = false,
  item,
  onSelect,
}: ThemePreviewButtonProps) {
  return (
    <button
      style={
        {
          "--theme-preview-color": item.style.color,
          "--theme-preview-background-color": item.style.backgroundColor,
          "--theme-preview-background-image": item.style.backgroundImage,
        } as React.CSSProperties
      }
      onClick={() => onSelect?.(item.order)}
      disabled={disabled}
    >
      {item.name}
    </button>
  );
}

export function UserCenterThemePage() {
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector(selectCurrentUser);

  const handleThemeSettingChange = async (
    setting: ThemeSetting
  ): Promise<ThemeSettingResult> => {
    try {
      const response = await updateThemeSetting(setting);
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const theme = getRealThemeNumber(userInfo.theme, setting);
      dispatch(
        updateCurrentUser({
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
      const response = await updateTheme(theme);
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      dispatch(updateCurrentUser({ ...userInfo, theme }));
      changeTheme(theme);
    } catch {
      // 旧页面固定主题切换失败时保持静默。
    }
  };

  const generateButton = (item: ThemeItem) => (
    <ThemePreviewButton
      key={item.order}
      disabled={userInfo.theme === item.order}
      item={item}
      onSelect={handleSubmit}
    />
  );

  const currentTheme =
    themeList[userInfo.theme] || themeList[themeList.length - 1];

  return (
    <div>
      <div>
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
      <div className={styles["user-theme-config"]}>
        {themeList.map(generateButton)}
      </div>
    </div>
  );
}
