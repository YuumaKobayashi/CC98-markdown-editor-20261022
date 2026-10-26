import * as React from "react";
import { useEffect, useState } from "react";
import $ from "jquery";

import { TopicAwardInfo } from "@modules/topic/ui/TopicAwardInfo";
import { getThisUserInfobyName } from "@modules/user/api/service";
import { getUsersInfo } from "@modules/user/api/get-users-info";
import styles from "./TopicAwardList.module.scss";

export interface TopicAwardListProps {
  postId: any;
  updateTime: any;
  awardInfo: any[];
}

//TODO: Jquery is used here, but it should be replaced with React state management and conditional rendering for better performance and maintainability.

function renderAward(postId: any, item: any) {
  return (
    <TopicAwardInfo
      key={`${item.id}-${item.operatorName}-${item.reason}`}
      postId={postId}
      topicId={item.id}
      portraitUrl={item.portraitUrl}
      content={item.content}
      reason={item.reason}
      userName={item.operatorName}
    />
  );
}

export function TopicAwardList({
  postId,
  updateTime,
  awardInfo,
}: TopicAwardListProps) {
  const [info, setInfo] = useState<React.ReactNode[]>([]);
  const [shortInfo, setShortInfo] = useState<React.ReactNode[]>([]);
  const [count, setCount] = useState(0);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const loadAwards = async () => {
      const award = awardInfo || [];
      const usersName = award.map((item) => item.operatorName);
      let usersInfo: any[] = [];

      if (award.length > 0) {
        usersInfo = await getUsersInfo(usersName);
      }

      for (const item of award) {
        const userInfo = getThisUserInfobyName(item.operatorName, usersInfo);
        if (userInfo) {
          item.portraitUrl = userInfo.portraitUrl;
        }
      }

      setInfo(award.map((item) => renderAward(postId, item)));
      setShortInfo(
        award.length > 10
          ? award.slice(0, 10).map((item) => renderAward(postId, item))
          : []
      );
      setCount(award.length);
    };

    void loadAwards();
  }, [awardInfo, postId, updateTime]);

  const awardInfoId = `awardInfo${postId}`;
  const displayedInfo = count > 10 ? (showAll ? info : shortInfo) : info;

  useEffect(() => {
    const awardInfoSelector = `#${awardInfoId}`;
    $(awardInfoSelector).css("display", "");
    if (!info || info.length === 0) {
      $(awardInfoSelector).css("display", "none");
    }
  });

  return (
    <div className={styles.awardInfo} id={awardInfoId}>
      <div className={styles.awardHeader}>
        <div className={styles.userTitle}>用户</div>
        <div className={styles.operationTitle}>操作</div>
        <div className={styles.reasonTitle}>理由</div>
      </div>
      {displayedInfo}
      {count > 10 ? (
        <button
          className={styles.expandButton}
          onClick={() => setShowAll((value) => !value)}
        >
          {showAll ? "收起" : "显示全部"}
        </button>
      ) : null}
    </div>
  );
}
