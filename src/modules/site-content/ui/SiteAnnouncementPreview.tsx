import * as React from "react";

import { UbbContainer } from "@modules/ubb";
import styles from "./SiteAnnouncementPreview.module.scss";

export interface SiteAnnouncementPreviewProps {
  content: string;
}

/** 全站公告的统一展示与 UBB 预览。 */
export function SiteAnnouncementPreview({
  content,
}: SiteAnnouncementPreviewProps): React.ReactElement {
  return (
    <div className={styles.announcement}>
      <div className={styles.title}>
        <div className={styles.titleRow} style={{ width: "100%" }}>
          <i className="fa fa-volume-up"></i>
          <div style={{ flexGrow: 1 }} className={styles.titleText}>
            全站公告
          </div>
        </div>
      </div>
      <div className={styles.announcementContent}>
        <UbbContainer code={content} />
      </div>
    </div>
  );
}
