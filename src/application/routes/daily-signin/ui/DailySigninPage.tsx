import * as React from "react";
import moment from "moment";

import ResignCalendar from "./ReSignCalendar";
import { UbbEditor } from "@modules/ubb-editor/UbbEditor";
import {
  clearSignedInToday,
  markSignedInToday,
} from "@modules/daily-signin/cache/signin-cache";
import {
  getSigninInfo,
  signin,
} from "@modules/daily-signin/api/service";
import { type UserSignInStateInfo } from "@modules/daily-signin/model/dto";
import { getGlobalConfig } from "@modules/site-content/api/service";
import { getMyInfo } from "@modules/session/api/session";
import styles from "./DailySigninPage.module.scss";

export function DailySigninPage(): React.ReactElement {
  const [signinInfo, setSigninInfo] = React.useState<UserSignInStateInfo>({
    hasSignedInToday: false,
    lastReward: 0,
    lastSignInCount: 0,
    // 后端在没有签到记录时返回 1970-01-01 哨兵时间。
    lastSignInTime: "1970-01-01T00:00:00",
  });
  const [content, setContent] = React.useState("");

  React.useEffect(() => {
    const loadSigninInfo = async () => {
      const nextSigninInfo = await getSigninInfo();
      setSigninInfo(nextSigninInfo);
    };

    void loadSigninInfo();
  }, []);

  const handleSignin = async () => {
    // 旧实现不等待签到 POST；继续保留其请求与后续全局配置请求的顺序。
    void signin(content);
    await getGlobalConfig();
    setContent("");

    const userInfo = getMyInfo();
    markSignedInToday(userInfo.id);
    window.location.reload();
  };

  const updateSigninInfo = (lastSignInCount) => {
    setSigninInfo((current) => ({ ...current, lastSignInCount }));
  };

  const bonusRate = 1;
  let info: React.ReactNode;

  if (signinInfo.hasSignedInToday) {
    const userInfo = getMyInfo();
    markSignedInToday(userInfo.id);
    info = (
      <div>
        <div className="cc98-row" style={{ justifyContent: "center" }}>
          你已经连续签到了{signinInfo.lastSignInCount}天
        </div>
        <div className="cc98-row" style={{ justifyContent: "center" }}>
          上次签到时间是
          {moment(signinInfo.lastSignInTime).format("YYYY-MM-DD HH:mm:ss")}
        </div>
        <div className="cc98-row" style={{ justifyContent: "center" }}>
          获得财富值{signinInfo.lastReward}
        </div>
      </div>
    );
  } else {
    const userInfo = getMyInfo();
    clearSignedInToday(userInfo.id);
    info = (
      <div className="cc98-column">
        <div className="cc98-row">你今天还未签到</div>
        <div style={{ marginTop: "1.5rem" }}>
          <UbbEditor
            update={setContent}
            value={content}
            option={{ height: 10 }}
          />
          <div
            className="cc98-row"
            style={{ justifyContent: "center", marginBottom: "1.25rem " }}
          >
            <div
              id="post-topic-button"
              onClick={handleSignin}
              className={`${styles.button} ${styles.blue} ${styles.postTopicButton}`}
              style={{
                marginTop: "1.25rem",
                width: "6rem",
                height: "2rem",
                lineHeight: "2rem",
                letterSpacing: "0.3125rem",
              }}
            >
              签到
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles["sign-in"]}>
      <div
        className="cc98-row"
        style={{ width: "100%", justifyContent: "center" }}
      >
        论坛签到
      </div>
      <div className="cc98-row">
        签到功能是 CC98
        论坛提供的一项娱乐功能。每个用户每天可以签到一次，并获得额外的论坛财富值奖励。如果连续多日签到，则奖励会不断增加。目前财富值的奖励情况如下表所示：
      </div>
      <div className="cc98-column" style={{ marginLeft: "2rem" }}>
        <div className="cc98-row">
          第 1 天： {600 * bonusRate} 到 {1200 * bonusRate} 论坛财富值
        </div>
        <div className="cc98-row">
          第 2 天： {700 * bonusRate} 到 {1400 * bonusRate} 论坛财富值
        </div>
        <div className="cc98-row">
          第 3 天： {800 * bonusRate} 到 {1600 * bonusRate} 论坛财富值
        </div>
        <div className="cc98-row">
          第 4 天： {900 * bonusRate} 到 {1800 * bonusRate} 论坛财富值
        </div>
        <div className="cc98-row">
          第 5 天及以后： {1000 * bonusRate} 到 {2000 * bonusRate} 论坛财富值
        </div>
      </div>
      {info}
      <ResignCalendar updateSigninInfo={updateSigninInfo} />
    </div>
  );
}
