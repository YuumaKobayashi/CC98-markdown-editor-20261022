import * as React from "react";
import { Tag } from "antd";
import { Link } from "react-router";

import { followUser, unfollowUser } from "@modules/follow";
import { UbbCodeOptions, UbbContainer } from "@modules/ubb";
import { UserGender, UserState, type UserInfo } from "@modules/user";
import { isoTime2LocalTime } from "@foundation/lib/time-zone";
import styles from "./UserProfileDetails.module.scss";

interface UserProfileDetailsProps {
  /**
   * 用户信息
   */
  userInfo: UserInfo;
}

const getPrivilegeColor = (privilege: string) => {
  switch (privilege) {
    case "注册用户":
      return "grey";
    case "超级版主":
      return "pink";
    case "全站贵宾":
      return "blue";
    case "管理员":
      return "red";
    default:
      return undefined;
  }
};

/**
 * 用户详情页
 * 个人资料组件
 */
export function UserProfileDetails({ userInfo }: UserProfileDetailsProps) {
  const [isFollowing, setIsFollowing] = React.useState(userInfo.isFollowing);
  const [buttonIsDisabled, setButtonIsDisabled] = React.useState(false);
  const [buttonInfo, setButtonInfo] = React.useState(
    userInfo.isFollowing ? "已关注" : "关注"
  );

  const follow = async () => {
    setButtonIsDisabled(true);
    setButtonInfo("关注中");
    const result = await followUser(userInfo.id);

    setButtonIsDisabled(false);
    if (result === true) {
      setButtonInfo("已关注");
      setIsFollowing(true);
    } else if (result === "follow_count_limited") {
      setButtonInfo("已达上限");
      setIsFollowing(false);
    } else {
      setButtonInfo("关注失败");
      setIsFollowing(false);
    }
  };

  const unfollow = async () => {
    setButtonIsDisabled(true);
    setButtonInfo("取关中");
    const result = await unfollowUser(userInfo.id);

    setButtonIsDisabled(false);
    if (result === true) {
      setButtonInfo("重新关注");
      setIsFollowing(false);
    } else {
      setButtonInfo("取关失败");
      setIsFollowing(true);
    }
  };

  const handleMouseOver = () => {
    if (isFollowing && !buttonIsDisabled) {
      setButtonInfo("取消关注");
    }
  };

  const handleMouseLeave = () => {
    if (isFollowing && !buttonIsDisabled) {
      setButtonInfo("已关注");
    }
  };

  //一个彩蛋，若当天为用户生日则显示一个生日蛋糕
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
        <div className={styles.userId}>
          <p>
            {userInfo.name}
            <span
              style={{
                fontSize: "12px",
                color: getPrivilegeColor(userInfo.privilege),
                marginLeft: "2rem",
              }}
            >
              {userInfo.privilege}
            </span>
          </p>

          <div className="cc98-row">
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

          <Link to={`/message/message?id=${userInfo.id}`}>
            <button type="button">私信</button>
          </Link>
          <button
            type="button"
            className={isFollowing ? styles.unfollow : ""}
            onClick={isFollowing ? unfollow : follow}
            disabled={buttonIsDisabled}
            onMouseOver={handleMouseOver}
            onMouseLeave={handleMouseLeave}
          >
            {buttonInfo}
          </button>
        </div>
      </div>
      {userInfo.lockState === UserState.Locked ||
      userInfo.lockState === UserState.Shielded ? (
        <div className={styles.userGenderAndBirthday}>
          <span style={{ fontSize: "12px", color: "red" }}>
            该账号处于锁定状态
          </span>
        </div>
      ) : userInfo.lockState === UserState.StopPost ? (
        <div className={styles.userGenderAndBirthday}>
          <span style={{ fontSize: "12px", color: "red" }}>
            该账号处于全站禁言状态
          </span>
        </div>
      ) : userInfo.stopPostBoardCount > 0 ? (
        <div className={styles.userGenderAndBirthday}>
          <span style={{ fontSize: "12px", color: "red" }}>
            该账号被{userInfo.stopPostBoardCount}个版面禁言中
          </span>
        </div>
      ) : null}
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
          <span className={styles["user-profile-info"]}>威望</span>
          {userInfo.prestige}
        </p>
        <p>
          <span className={styles["user-profile-info"]}>粉丝数</span>
          {userInfo.fanCount}
        </p>
        <p>
          <span className={styles["user-profile-info"]}>风评</span>
          {userInfo.popularity}
        </p>
        <p>
          <span className={styles["user-profile-info"]}>注册时间</span>
          {isoTime2LocalTime(userInfo.registerTime, 0).replace(/\//g, "-")}
        </p>
        <p>
          <span className={styles["user-profile-info"]}>最后登录</span>
          {isoTime2LocalTime(userInfo.lastLogOnTime, 1).replace(/\//g, "-")}
        </p>
        {!userInfo.birthday ? null : (
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
        )}
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
            options={{
              ...new UbbCodeOptions(),
              allowExternalImage: false,
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
