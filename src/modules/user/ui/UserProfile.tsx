// A '.tsx' file enables JSX support in the TypeScript compiler,
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import * as React from "react";
import { Tag } from "@foundation/ui/tag";
import { Link } from "react-router";

import { UbbCodeOptions } from "@modules/ubb/engine/Core";
import { UbbContainer } from "@modules/ubb/UbbContainer";
import { UserGender } from "../model/dto";
import type { UserInfo } from "../model/dto";
import { isoTime2LocalTime } from "@foundation/lib/time-zone";
import styles from "./UserProfile.module.scss";

interface UserProfileProps {
  userInfo: UserInfo & { displayTitle?: string };
}

/**
 * 用户中心主页个人资料组件
 */
export function UserProfile({ userInfo }: UserProfileProps) {
  const getPrivilegeClassName = () => {
    switch (userInfo.privilege) {
      case "注册用户":
        return styles.privilegeGrey;
      case "超级版主":
        return styles.privilegePink;
      case "全站贵宾":
        return styles.privilegeBlue;
      case "管理员":
        return styles.privilegeRed;
      default:
        return "";
    }
  };

  let isBirthDay = false;
  if (userInfo.birthday) {
    const match = userInfo.birthday.match(/\d+-(\d+)-(\d+)/);
    const now = new Date();
    if (
      match &&
      Number.parseInt(match[1]) === now.getMonth() + 1 &&
      Number.parseInt(match[2]) === now.getDate()
    ) {
      isBirthDay = true;
    }
  }

  return (
    <div className={styles["user-profile"]}>
      <div className={styles.userId}>
        <p>
          {userInfo.name}
          <span
            className={[styles.privilege, getPrivilegeClassName()]
              .filter(Boolean)
              .join(" ")}
          >
            {userInfo.privilege}
          </span>
        </p>

        <div className={styles.receivedLikes}>
          <Tag
            color="grey"
            className={styles.receivedLikesLabel}
          >
            收到的赞
          </Tag>
          <Tag
            className={[
              styles.boardHeadInformation,
              styles.receivedLikesValue,
            ].join(" ")}
          >
            {userInfo.receivedLikeCount}
          </Tag>
        </div>

        <Link to="/message/message">
          <button type="button">私信</button>
        </Link>
      </div>
      <div className={styles.userIntroducion}>{userInfo.introduction}</div>
      <div className={styles.userGenderAndBirthday}>
        <p>
          <span className={styles["user-profile-info"]}>性别</span>
          {userInfo.gender === UserGender.Male ? "男" : "女"}{" "}
        </p>
        <p>
          <span className={styles["user-profile-info"]}>发帖数</span>
          {userInfo.postCount}
        </p>
        <p>
          <span className={styles["user-profile-info"]}>财富值</span>
          {userInfo.wealth}
        </p>
        <p>
          <span className={styles["user-profile-info"]}>粉丝数</span>
          {userInfo.fanCount}
        </p>
        <p>
          <span className={styles["user-profile-info"]}>威望</span>
          {userInfo.prestige}
        </p>
        <p>
          <span className={styles["user-profile-info"]}>风评</span>
          {userInfo.popularity}
        </p>
        <p>
          <span className={styles["user-profile-info"]}>注册时间</span>
          {isoTime2LocalTime(userInfo.registerTime, 1).replace(/\//g, "-")}
        </p>
        <p>
          <span className={styles["user-profile-info"]}>最后登录</span>
          {isoTime2LocalTime(userInfo.lastLogOnTime, 1).replace(/\//g, "-")}
        </p>
        {userInfo.birthday ? (
          <p>
            <span className={styles["user-profile-info"]}>生日</span>
            {userInfo.birthday.replace("9999-", "")}
            {isBirthDay ? (
              <span
                className={`fa-birthday-cake ${styles.birthdayIcon}`}
                title="生日快乐~"
              ></span>
            ) : null}
          </p>
        ) : null}
        {userInfo.displayTitle ? (
          <p>
            <span className={styles["user-profile-info"]}>用户组</span>
            {userInfo.displayTitle}
          </p>
        ) : null}
        {userInfo.emailAddress ? (
          <p>
            <span className={styles["user-profile-info"]}>邮箱</span>
            {userInfo.emailAddress}
          </p>
        ) : null}
        {userInfo.qq ? (
          <p>
            <span className={styles["user-profile-info"]}>QQ</span>
            {userInfo.qq}
          </p>
        ) : null}
        <p>
          <span className={styles["user-profile-info"]}>被删帖数</span>
          {-userInfo.deleteCount}
        </p>
      </div>
      {userInfo.signatureCode ? (
        <div className={styles["user-description"]}>
          <p>个性签名</p>
          <UbbContainer
            code={userInfo.signatureCode}
            options={{ ...new UbbCodeOptions(), allowExternalImage: false }}
          />
        </div>
      ) : null}
    </div>
  );
}

export default UserProfile;
