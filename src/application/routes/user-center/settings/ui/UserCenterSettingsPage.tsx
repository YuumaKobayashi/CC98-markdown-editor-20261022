import * as React from "react";

import { useAppDispatch, useAppSelector } from "@application/store";
import { ConfigSignature, invalidateUserInfoCache } from "@modules/user";
import {
  refreshCurrentUserInfo,
  selectCurrentUser,
} from "@modules/session";
import type { ChangeUserInfo } from "@legacy/States/AppState";
import { getToken } from "@modules/session";
import { cc98Fetch } from "@foundation/api/http";

import {
  createEditableUserInfo,
  type EditableUserInfo,
} from "../model/editable-user-info";
import { UserCenterAvatarSettings } from "./UserCenterAvatarSettings";
import { UserCenterProfileSettings } from "./UserCenterProfileSettings";
import styles from "../../UserCenter.module.scss";

/**
 * 用户中心的个人资料设置页。
 *
 * `currentUserInfo` 是 store 中的已保存资料，`userInfo` 是本页正在编辑的副本。
 * 子组件只负责展示和回传字段修改，提交与重置统一由本组件处理。
 */
export function UserCenterSettingsPage() {
  const dispatch = useAppDispatch();
  const currentUserInfo = useAppSelector(selectCurrentUser);

  // 获取用户信息与修改用户信息的 API 字段名不完全一致，
  // 因此先转换成修改 API 所需、并便于表单编辑的数据结构。
  const [userInfo, setUserInfo] = React.useState<EditableUserInfo>(() =>
    createEditableUserInfo(currentUserInfo, true)
  );
  // 提交过程或结果的提示信息。
  const [info, setInfo] = React.useState("");
  // 提交期间禁用按钮，防止重复提交。
  const [isLoading, setIsLoading] = React.useState(false);

  /** 放弃当前表单修改，重新使用 store 中已保存的用户资料。 */
  const handleReset = () => {
    setUserInfo(createEditableUserInfo(currentUserInfo, false));
  };

  /**
   * 合并头像、签名和个人资料子组件回传的单个字段。
   *
   * @param key 要修改的字段名
   * @param value 修改后的值
   */
  const handleChange = (key: string, value: string | number) => {
    setUserInfo((current) => ({
      ...current,
      [key]: value,
    }));
  };

  /** 校验当前表单并提交个人资料修改。 */
  const handleSubmit = async () => {
    // 进入提交状态后立即禁用按钮，避免用户连续发起多个请求。
    setIsLoading(true);
    setInfo("修改中");

    try {
      const newInfo: ChangeUserInfo = userInfo;

      // 表单分别编辑生日的年月日，修改 API 只接收合并后的 Birthday。
      newInfo.Birthday =
        userInfo.birthdayYear !== 0
          ? `${userInfo.birthdayYear}-${userInfo.birthdayMonth}-${userInfo.birthdayDay}`
          : "";

      // 请求发出前先检查需要特殊格式的邮箱、QQ 和生日字段。
      if (
        newInfo.EmailAddress &&
        !newInfo.EmailAddress.match(/[\S]+@[\S]+\.[\S]+/)
      ) {
        throw new Error("请检查邮箱地址");
      }
      if (
        newInfo.QQ &&
        (Number.parseInt(newInfo.QQ) <= 0 ||
          Number.parseInt(newInfo.QQ).toString() !== newInfo.QQ)
      ) {
        throw new Error("请检查QQ是否正确");
      }

      const birthday = new Date(
        userInfo.birthdayYear,
        userInfo.birthdayMonth - 1,
        userInfo.birthdayDay
      );
      if (
        userInfo.birthdayYear !== 0 &&
        userInfo.birthdayYear !== 9999 &&
        birthday.getTime() > Date.now()
      ) {
        throw new Error("请检查生日是否正确");
      }

      const token = await getToken();
      const headers = new Headers();
      headers.append("Authorization", token);
      headers.append("Content-Type", "application/json");
      const response = await cc98Fetch("/me", {
        method: "PUT",
        headers,
        body: JSON.stringify(newInfo),
      });

      if (response.status !== 200) {
        throw new Error(response.status.toString());
      }

      // 先失效公共资料缓存，再重新拉取当前用户信息并写回最新结果。
      void invalidateUserInfoCache(
        currentUserInfo.id,
        currentUserInfo.name
      ).then(
        () => dispatch(refreshCurrentUserInfo()),
        () => dispatch(refreshCurrentUserInfo())
      );
      setInfo("修改成功");
      setIsLoading(false);
      setTimeout(() => {
        setInfo("");
      }, 1000);
    } catch (error) {
      setInfo((error as Error).message);
      setIsLoading(false);
    }
  };

  return (
    <div className={styles["user-center-config"]}>
      <UserCenterAvatarSettings />
      <hr />
      <ConfigSignature
        signature={userInfo.SignatureCode}
        onchange={handleChange}
      />
      <hr />
      <UserCenterProfileSettings
        userinfo={userInfo}
        handleChange={handleChange}
      />
      <hr />
      <div className={styles["config-submit"]}>
        <h2>提交修改</h2>
        <div className="config-buttons">
          <button
            className={styles["config-submit-button"]}
            type="button"
            disabled={isLoading}
            onClick={handleSubmit}
          >
            提交
          </button>
          <button type="button" onClick={handleReset}>
            重置
          </button>
        </div>
        <p style={{ height: info === "" ? "0" : "1rem", color: "red" }}>
          {info}
        </p>
      </div>
    </div>
  );
}
