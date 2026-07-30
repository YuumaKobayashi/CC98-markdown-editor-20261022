import * as React from "react";
import { Link } from "react-router";

import { getMyInfo } from "@modules/session";
import { HomeAdvertisementCarousel } from "@pages/home/advertisement";

interface BoardActionsAndAdvertisementProps {
  boardInfo: {
    id: number;
    canVote: boolean;
  };
  adsUrl: unknown;
}

export function BoardActionsAndAdvertisement({
  boardInfo,
}: BoardActionsAndAdvertisementProps) {
  const userInfo = getMyInfo();
  let tip: React.ReactNode = null;

  if (!userInfo) {
    tip = (
      <div style={{ marginLeft: "1rem", color: "red" }}>
        您还未登录，不能发帖，请先登录
      </div>
    );
  } else if (userInfo.lockState !== 0) {
    tip = (
      <div style={{ marginLeft: "1rem", color: "red" }}>您被全站禁言。</div>
    );
  } else if (!userInfo.isVerified) {
    tip = (
      <div style={{ marginLeft: "1rem", color: "red" }}>
        您的帐号未认证，无法发言，请先前往{" "}
        <a target="_blank" href="https://account.cc98.org">
          https://account.cc98.org
        </a>{" "}
        认证激活。
      </div>
    );
  }

  const createTopicUrl = `/editor/postTopic/${boardInfo.id}`;
  let sendInfo = boardInfo.canVote ? (
    <div>
      <Link className="button bgcolor" to={createTopicUrl}>
        发主题
      </Link>
      <Link
        style={{ marginLeft: "2rem" }}
        className="button bgcolor"
        to={`/editor/postVoteTopic/${boardInfo.id}`}
      >
        发投票
      </Link>
    </div>
  ) : (
    <Link className="button bgcolor" to={createTopicUrl}>
      发主题
    </Link>
  );

  if (tip) {
    sendInfo = (
      <div style={{ display: "flex", alignItems: "center" }}>{tip}</div>
    );
  }

  return (
    <div
      className="row"
      style={{
        width: "100%",
        height: "6.25rem",
        alignItems: "flex-end",
        justifyContent: "space-between",
        marginTop: "1rem",
      }}
    >
      {sendInfo}
      <div style={{ height: "6.25rem" }}>
        {" "}
        <HomeAdvertisementCarousel />
      </div>
    </div>
  );
}
