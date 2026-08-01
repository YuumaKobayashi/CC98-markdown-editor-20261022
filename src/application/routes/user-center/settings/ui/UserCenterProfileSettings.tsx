import * as React from "react";

import { cc98Fetch } from "@foundation/api/http";

import type { EditableUserInfo } from "../model/editable-user-info";
import styles from "../../UserCenter.module.scss";

interface DisplayTitle {
  id: number;
  name: string;
}

interface UserCenterProfileSettingsProps {
  userinfo: EditableUserInfo;
  handleChange: (key: string, value: string | number) => void;
}

const buildNumberOptions = (start: number, count: number) =>
  Array.from({ length: count }, (_, index) => start + index).map((item) => (
    <option key={item} value={item}>
      {item}
    </option>
  ));

export function UserCenterProfileSettings({
  userinfo,
  handleChange,
}: UserCenterProfileSettingsProps) {
  const [displayTitles, setDisplayTitles] = React.useState<DisplayTitle[]>([]);

  React.useEffect(() => {
    const loadDisplayTitles = async () => {
      try {
        const response = await cc98Fetch("/config/global/all-user-title");
        setDisplayTitles(await response.json());
      } catch {
        // 旧页面在头衔列表请求失败时保持静默。
      }
    };

    void loadDisplayTitles();
  }, []);

  const yearsOption = [
    <option key={0} value={0}>
      未选择
    </option>,
    <option key={9999} value={9999}>
      保密
    </option>,
    ...buildNumberOptions(1920, 100),
  ];
  const monthsOption = [
    <option key={0} value={0}>
      未选择
    </option>,
    ...buildNumberOptions(1, 12),
  ];
  const daysOption = [
    <option key={0} value={0}>
      未选择
    </option>,
    ...buildNumberOptions(1, 31),
  ];

  const handleNumberChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    handleChange(event.target.name, Number.parseInt(event.target.value));
  };

  const handleTextChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    handleChange(event.target.name, event.target.value);
  };

  return (
    <div className={styles["user-center-config-others"]}>
      <h2>其他设置</h2>
      <div className={styles["config-gender"]}>
        <p>性别：</p>
        <select
          id="genderSelect"
          name="Gender"
          value={userinfo.Gender}
          onChange={handleNumberChange}
        >
          <option value={1}>男</option>
          <option value={0}>女</option>
        </select>
      </div>
      <div className={styles["config-birthday"]}>
        <p>生日：</p>
        <select
          id="birthdayYear"
          name="birthdayYear"
          value={userinfo.birthdayYear}
          onChange={handleNumberChange}
        >
          {yearsOption}
        </select>
        <p>年</p>
        <select
          id="birthdayMonth"
          name="birthdayMonth"
          value={userinfo.birthdayMonth}
          disabled={userinfo.birthdayYear === 0}
          onChange={handleNumberChange}
        >
          {monthsOption}
        </select>
        <p>月</p>
        <select
          id="birthdayDay"
          name="birthdayDay"
          value={userinfo.birthdayDay}
          disabled={userinfo.birthdayYear === 0}
          onChange={handleNumberChange}
        >
          {daysOption}
        </select>
        <p>日</p>
      </div>
      {displayTitles.length > 0 ? (
        <div className={styles["config-gender"]}>
          <p>头衔：</p>
          <select
            style={{ width: "auto", padding: "0 1rem" }}
            name="DisplayTitleId"
            value={userinfo.DisplayTitleId}
            onChange={handleNumberChange}
          >
            <option value={0}>不显示</option>
            {userinfo.userTitleIds.map((item) => {
              const title = displayTitles.filter(
                (displayTitle) => displayTitle.id === item
              );
              if (title.length > 0) {
                return (
                  <option key={item} value={item}>
                    {title[0].name}
                  </option>
                );
              }
              return undefined;
            })}
          </select>
        </div>
      ) : null}
      <div className={styles["config-text"]}>
        <p>QQ：</p>
        <input
          type="text"
          name="QQ"
          value={userinfo.QQ}
          maxLength={20}
          onChange={handleTextChange}
        />
      </div>
      <div className={styles["config-text"]}>
        <p>邮箱：</p>
        <input
          type="email"
          name="EmailAddress"
          value={userinfo.EmailAddress}
          maxLength={150}
          onChange={handleTextChange}
        />
      </div>
      <div className={styles["config-introduction"]}>
        <p>个人简介：</p>
        <div>
          <textarea
            name="Introduction"
            value={userinfo.Introduction}
            maxLength={100}
            onChange={handleTextChange}
          />
          <p>*不超过100字</p>
        </div>
      </div>
    </div>
  );
}
