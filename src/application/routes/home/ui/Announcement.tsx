import * as React from "react";
import { UbbContainer } from "@legacy/Components/UbbContainer";
import styles from "../Home.module.scss";

interface AnnouncementProps {
  data: any;
}

/**
 * 全站公告组件
 * TODO:IndexTitle
 **/
export function Announcement(
  props: AnnouncementProps,
): React.ReactElement | null {
  const data = props.data;
  if (data == "") return null;

  return (
    <div className={styles.announcement}>
      <div className={styles.mainPageTitle1}>
        <div className={styles.mainPageTitleRow} style={{ width: "100%" }}>
          <i className="fa fa-volume-up"></i>
          <div style={{ flexGrow: 1 }} className={styles.mainPageTitleText}>
            全站公告
          </div>
          {/*<CountDown endDate={new Date('05/26/2018 05:30 PM')} />*/}
        </div>
      </div>
      <div className={styles.announcementContent}>
        <UbbContainer code={data} />
      </div>
    </div>
  );
}
