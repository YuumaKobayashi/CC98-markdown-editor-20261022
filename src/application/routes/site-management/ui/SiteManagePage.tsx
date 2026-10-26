import * as React from "react";

import { SiteAdvertisementEditor } from "../advertisement";
import { SiteAnnouncementEditor } from "../announcement";
import styles from "./SiteManagePage.module.scss";

export function SiteManage() {
  return (
    <div className={styles.root}>
      <div className={styles.title}>
        全站管理
      </div>
      <SiteAnnouncementEditor />
      <SiteAdvertisementEditor />
    </div>
  );
}
