import * as React from "react";
import { Link } from "react-router";

import styles from "../Home.module.scss";
import statisticsStyles from "./HomeStatistics.module.scss";

export interface MainPageCount {
  todayCount: number;
  todayTopicCount: number;
  topicCount: number;
  postCount: number;
  onlineUserCount: number;
  userCount: number;
  lastUserName: string;
}


/** 论坛统计组件。 */
export function HomeStatistics({ data }: { data: MainPageCount }) {
  return (
    <div className={statisticsStyles.mainPageCount}>
      <div className={styles.mainPageTitle1}>
        <div className={styles.mainPageTitleRow}>
          <i className="fa fa-volume-up"></i>
          <div className={styles.mainPageTitleText}>论坛统计</div>
        </div>
      </div>
      <div className={statisticsStyles.mainPageCountContent}>
        {[
          ["今日帖数", data.todayCount],
          ["今日主题数", data.todayTopicCount],
          ["论坛总主题数", data.topicCount],
          ["论坛总回复数", data.postCount],
          ["在线用户数", data.onlineUserCount],
          ["总用户数", data.userCount],
        ].map(([label, value]) => (
          <div className={statisticsStyles.mainPageCountRow} key={label}>
            <div className={statisticsStyles.mainPageCountTitle}>{label}</div>
            <div className={statisticsStyles.mainPageCountTitle}>{value || 0}</div>
          </div>
        ))}
        <div className={statisticsStyles.mainPageCountRow}>
          <div className={statisticsStyles.mainPageCountTitle}>欢迎新用户</div>
          <div className={statisticsStyles.mainPageCountTitle}>
            <Link to={`/user/name/${encodeURIComponent(data.lastUserName)}`}>
              {data.lastUserName}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
