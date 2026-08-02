// A '.tsx' file enables JSX support in the TypeScript compiler,
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import * as React from "react";
import { Tag } from "antd";
import { Link } from "react-router";

import { UbbCodeOptions, UbbContainer } from "@modules/ubb";
import type { UserInfo } from "../model/types";
import { isoTime2LocalTime } from "@foundation/lib/time-zone";
import styles from "./UserProfile.module.scss";

interface UserProfileProps {
  userInfo: UserInfo;
}

/**
 * 用户中心主页个人资料组件
 */
export function UserProfile({ userInfo }: UserProfileProps) {
  const getPrivilegeColor = () => {
    switch (userInfo.privilege) {
      case "注册用户":
        return "grey";
      case "超级版主":
        return "pink";
      case "全站贵宾":
        return "blue";
      case "管理员":
        return "red";
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
            style={{
              fontSize: "12px",
              color: getPrivilegeColor(),
              marginLeft: "2rem",
            }}
          >
            {userInfo.privilege}
          </span>
        </p>

        <div className="cc98-row" style={{ marginRight: "2rem" }}>
          <Tag
            color="grey"
            style={{
              width: "5rem",
              textAlign: "center",
              marginRight: 0,
              height: "2rem",
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              fontSize: 16,
              lineHeight: "2rem",
            }}
          >
            收到的赞
          </Tag>
          <Tag
            className={styles.boardHeadInformation}
            style={{
              width: "5rem",
              height: "2rem",
              textAlign: "center",
              marginRight: 0,
              borderLeft: 0,
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              fontSize: 16,
              lineHeight: "2rem",
            }}
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
          {userInfo.gender === 1 ? "男" : "女"}{" "}
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
                style={{ fontFamily: "FontAwesome", marginLeft: "1rem" }}
                className="fa-birthday-cake"
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
