import * as React from "react";
import {
  useEffect,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Link } from "react-router";

import { updateUserInfo } from "@modules/user/api/service";
import { UserGender, type PortraitStyleDto } from "@modules/user/model/dto";
import { getPortraitConfig } from "@modules/user/api/service";
import { getMyInfo } from "@modules/session/api/session";
import { updateFollowedUser } from "@modules/follow/api/service";
import styles from "./TopicReplier.module.scss";

export interface TopicReplierProps {
  userInfo: any;
  isAnonymous: any;
  topicInfo: any;
  traceMode: any;
  isHot: any;
}

//TODO: hard code here

const portraitGroupByDisplayTitle: Record<number, string> = {
  82: "吉祥物",
  18: "版主",
  22: "版主",
  85: "编辑部",
  29: "编辑部",
  37: "技术组",
  23: "技术组",
  28: "贵宾",
  16: "贵宾",
  84: "策划部",
  34: "策划部",
  96: "影音部",
  99: "影音部",
  32: "站务组",
  21: "站务组",
  86: "体育部",
  35: "体育部",
  94: "办公室",
  93: "办公室",
  91: "认证用户",
  104: "年度用户",
};

const noShadowDisplayTitles = new Set([
  82, 18, 22, 32, 21, 28, 16, 37, 23, 29, 85, 84, 34, 94, 93, 35, 86,
  96, 99, 91,
]);

type PortraitFrameCssVariables = CSSProperties & {
  "--topic-replier-photo-frame-width"?: string;
  "--topic-replier-photo-frame-height"?: string;
  "--topic-replier-photo-frame-position"?: string;
  "--topic-replier-photo-frame-left"?: string;
  "--topic-replier-photo-frame-top"?: string;
  "--topic-replier-photo-frame-z-index"?: string;
};

function createPortraitFrameCssVariables(
  style: PortraitStyleDto
): PortraitFrameCssVariables {
  const variables: PortraitFrameCssVariables = {};
  if (style.width !== undefined) {
    variables["--topic-replier-photo-frame-width"] = style.width;
  }
  if (style.height !== undefined) {
    variables["--topic-replier-photo-frame-height"] = style.height;
  }
  if (style.position !== undefined) {
    variables["--topic-replier-photo-frame-position"] = style.position;
  }
  if (style.left !== undefined) {
    variables["--topic-replier-photo-frame-left"] = style.left;
  }
  if (style.top !== undefined) {
    variables["--topic-replier-photo-frame-top"] = style.top;
  }
  if (style.zIndex !== undefined) {
    variables["--topic-replier-photo-frame-z-index"] = style.zIndex;
  }
  return variables;
}

export function TopicReplier({
  userInfo,
  isAnonymous,
}: TopicReplierProps) {
  const [buttonIsDisabled, setButtonIsDisabled] = useState(false);
  const [buttonInfo, setButtonInfo] = useState(
    userInfo.isFollowing ? "取关" : "关注"
  );
  const [isFollowing, setIsFollowing] = useState(userInfo.isFollowing);
  const [fanCount, setFanCount] = useState(userInfo.fanCount);
  const [photoFrame, setPhotoFrame] = useState<ReactNode>(null);

  const handleImageErrored = (
    event: React.SyntheticEvent<HTMLImageElement>
  ) => {
    event.preventDefault();
    event.currentTarget.src = "/static/images/default_avatar_boy.png";
  };

  useEffect(() => {
    const loadPhotoFrame = async () => {
      const displayTitleId = userInfo.displayTitleId;
      const profileUrl = encodeURI(`/user/id/${userInfo.id}`);

      if (isAnonymous == true) {
        setPhotoFrame(
          <div className={styles.portraitFrame}>
            <div className={styles.portraitLayer}>
              <img
                className={styles.userPortrait}
                src={userInfo.portraitUrl}
              ></img>
            </div>
          </div>
        );
        return;
      }

      if (displayTitleId) {
        const data = await getPortraitConfig();
        const groupName =
          portraitGroupByDisplayTitle[displayTitleId] || "普通";
        const group = data[groupName] || data.普通;
        const frameCssVariables = createPortraitFrameCssVariables(group.style);

        setPhotoFrame(
          <div className={styles.portraitFrame}>
            <div className={styles.portraitLayer}>
              <a href={profileUrl} className={styles.framedPortraitLink}>
                <img
                  className={
                    noShadowDisplayTitles.has(displayTitleId)
                      ? `${styles.userPortrait} ${styles.portraitWithoutShadow}`
                      : styles.userPortrait
                  }
                  src={userInfo.portraitUrl}
                  onError={handleImageErrored}
                />
              </a>
            </div>
            {/* <>TODO:修复这里的问题</> */}
            <div className={styles.photoFrame}>
              <img
                className={styles.photoFrameImage}
                src={group.imageUrl}
                style={frameCssVariables}
              />
            </div>
          </div>
        );
        return;
      }

      setPhotoFrame(
        <div className={styles.portraitFrame}>
          <div className={styles.portraitLayer}>
            <a href={profileUrl} className={styles.portraitLink}>
              <img
                className={styles.userPortrait}
                src={userInfo.portraitUrl}
                onError={handleImageErrored}
              />
            </a>
          </div>
        </div>
      );
    };

    void loadPhotoFrame();
  }, [isAnonymous, userInfo.displayTitleId, userInfo.id, userInfo.portraitUrl]);

  const unfollow = async () => {
    try {
      setButtonIsDisabled(true);
      setButtonInfo("...");
      const response = await updateFollowedUser(userInfo.id, "DELETE");
      if (response.status === 200) {
        await updateUserInfo(userInfo.id, userInfo.name);
        setButtonIsDisabled(false);
        setButtonInfo("关注");
        setIsFollowing(false);
        setFanCount(userInfo.fanCount);
      } else {
        throw {};
      }
    } catch (error) {
      alert("网络错误");
    }
  };

  const follow = async () => {
    try {
      setButtonIsDisabled(true);
      setButtonInfo("...");
      const response = await updateFollowedUser(userInfo.id, "PUT");
      if (response.status === 200) {
        await updateUserInfo(userInfo.id, userInfo.name);
        setButtonIsDisabled(false);
        setButtonInfo("取关");
        setIsFollowing(true);
        setFanCount(userInfo.fanCount + 1);
      } else {
        throw {};
      }
    } catch (error) {
      alert("网络错误");
    }
  };

  let userName: ReactNode = (
    <div className={styles["userMessage-userName"]}>
      {userInfo.name}
    </div>
  );
  if (!isAnonymous) {
    userName = (
      <Link
        className={styles["userMessage-userName"]}
        to={encodeURI(`/user/id/${userInfo.id}`)}
      >
        {userInfo.name}
      </Link>
    );
  }
  if (
    userInfo.privilege == "匿名" ||
    userInfo.privilege === "匿名用户"
  ) {
    userName = (
      <div className={styles.anonymousIdentity}>
        <div className={styles.anonymousName}>
          {userInfo.name}
        </div>
        <div className={styles.userMessageAnonymous}>别问我是谁</div>
      </div>
    );
  }

  let buttons: ReactNode = null;
  const myInfo = getMyInfo();
  if (myInfo && myInfo.name !== userInfo.name && !isAnonymous) {
    buttons = (
      <div className={styles.userMessageBtn}>
        <div className={styles.followButtonWrapper}>
          <button
            className={styles.replierBtn}
            id={isFollowing ? "" : "follow"}
            onClick={isFollowing ? unfollow : follow}
            disabled={buttonIsDisabled}
          >
            {buttonInfo}
          </button>
        </div>
        <div className={styles.messageButtonWrapper}>
          {" "}
          <Link to={`/message/message?id=${userInfo.id}`}>
            <button className={styles.replierBtn}>私信</button>
          </Link>
        </div>
      </div>
    );
  }

  const now = new Date();
  const timeOffset = now.getTimezoneOffset();
  const currentTime = now.getTime();
  const lastTime = new Date(userInfo.lastLogOnTime).getTime();
  const hoursFloat =
    Math.abs(lastTime - currentTime) / 1000 / 60 / 60 -
    (timeOffset + 480) / 60;
  const hours = Math.floor(hoursFloat);
  const days = Math.floor(hoursFloat / 24);
  const months = Math.floor(hoursFloat / 24 / 30);
  const years = Math.floor(hoursFloat / 24 / 365);
  let lastLogOn: string;
  //TODO: 时间string函数独立+统一
  if (years > 1) lastLogOn = `${years}年前`;
  else if (months > 1) lastLogOn = `${months}个月前`;
  else if (days > 1) lastLogOn = `${days}天前`;
  else if (hours > 1) lastLogOn = `${hours}小时前`;
  else lastLogOn = "1小时内";

  const userDetailMessage = !isAnonymous ? (
    <div className={styles.userDetailMessage}>
      <div className={styles.userMessageOpt}>帖数 {userInfo.postCount}</div>
      <div className={styles.userMessageOpt}>粉丝 {fanCount}</div>
      <div className={styles.userMessageOpt}>威望 {userInfo.prestige}</div>
      <div className={styles.userMessageOpt}>最后登录 {lastLogOn}</div>
    </div>
  ) : null;

  const gender =
    isAnonymous == true ? null : (
      <div className={styles.userGender}>
        {userInfo.gender === UserGender.Female ? (
          <i className={`fa fa-venus ${styles.genderIcon}`}></i>
        ) : (
          <i className={`fa fa-mars ${styles.genderIcon}`}></i>
        )}
      </div>
    );

  return (
    <div className={styles.userMessage}>
      <div className={styles["userMessage-left"]}>
        {userName}
        {userDetailMessage}
      </div>
      <div className={styles["userMessage-right"]}>
        {gender}
        {photoFrame}
        {buttons}
      </div>
    </div>
  );
}
