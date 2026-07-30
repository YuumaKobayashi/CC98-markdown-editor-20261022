import * as React from "react";
import moment from "moment";

import ResignCalendar from "@legacy/Components/ReSignCalendar";
import { UbbEditor } from "@legacy/Components/UbbEditor";
import {
  getGlobalConfig,
  getSigninInfo,
  signin,
} from "@modules/session";
import { getMyInfo } from "@modules/session";
import {
  removeLocalStorage,
  setLocalStorage,
} from "@foundation/storage/web-storage";

interface SigninInfo {
  hasSignedInToday?: boolean;
  lastReward?: number;
  lastSignInCount: number;
  lastSignInTime: number;
}

function getSigninCacheLifetime(): number {
  return (
    new Date(new Date().setHours(0, 0, 0, 0)).getTime() +
    86400000 -
    new Date().getTime()
  ) / 1000;
}

export function DailySigninPage(): React.ReactElement {
  const [signinInfo, setSigninInfo] = React.useState<SigninInfo>({
    lastSignInCount: 0,
    lastSignInTime: 0,
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
    setLocalStorage(
      `signin_${userInfo.id}`,
      true,
      getSigninCacheLifetime()
    );
    window.location.reload();
  };

  const updateSigninInfo = (lastSignInCount) => {
    setSigninInfo((current) => ({ ...current, lastSignInCount }));
  };

  const bonusRate = 1;
  let info: React.ReactNode;

  if (signinInfo.hasSignedInToday) {
    const userInfo = getMyInfo();
    setLocalStorage(
      `signin_${userInfo.id}`,
      true,
      getSigninCacheLifetime()
    );
    info = (
      <div>
        <div className="row" style={{ justifyContent: "center" }}>
          你已经连续签到了{signinInfo.lastSignInCount}天
        </div>
        <div className="row" style={{ justifyContent: "center" }}>
          上次签到时间是
          {moment(signinInfo.lastSignInTime).format("YYYY-MM-DD HH:mm:ss")}
        </div>
        <div className="row" style={{ justifyContent: "center" }}>
          获得财富值{signinInfo.lastReward}
        </div>
      </div>
    );
  } else {
    const userInfo = getMyInfo();
    removeLocalStorage(`signin_${userInfo.id}`);
    info = (
      <div className="column">
        <div className="row">你今天还未签到</div>
        <div style={{ marginTop: "1.5rem" }}>
          <UbbEditor
            update={setContent}
            value={content}
            option={{ height: 10 }}
          />
          <div
            className="row"
            style={{ justifyContent: "center", marginBottom: "1.25rem " }}
          >
            <div
              id="post-topic-button"
              onClick={handleSignin}
              className="button blue"
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
    <div className="sign-in">
      <div
        className="row"
        style={{ width: "100%", justifyContent: "center" }}
      >
        论坛签到
      </div>
      <div className="row">
        签到功能是 CC98
        论坛提供的一项娱乐功能。每个用户每天可以签到一次，并获得额外的论坛财富值奖励。如果连续多日签到，则奖励会不断增加。目前财富值的奖励情况如下表所示：
      </div>
      <div className="column" style={{ marginLeft: "2rem" }}>
        <div className="row">
          第 1 天： {600 * bonusRate} 到 {1200 * bonusRate} 论坛财富值
        </div>
        <div className="row">
          第 2 天： {700 * bonusRate} 到 {1400 * bonusRate} 论坛财富值
        </div>
        <div className="row">
          第 3 天： {800 * bonusRate} 到 {1600 * bonusRate} 论坛财富值
        </div>
        <div className="row">
          第 4 天： {900 * bonusRate} 到 {1800 * bonusRate} 论坛财富值
        </div>
        <div className="row">
          第 5 天及以后： {1000 * bonusRate} 到 {2000 * bonusRate} 论坛财富值
        </div>
      </div>
      {info}
      <ResignCalendar updateSigninInfo={updateSigninInfo} />
    </div>
  );
}
