import * as React from "react";

import { SiteAdvertisementEditor } from "../advertisement";
import { SiteAnnouncementEditor } from "../announcement";

export function SiteManage() {
  return (
    <div style={{ backgroundColor: "white", width: "100%" }}>
      <div
        style={{ display: "flex", justifyContent: "center", fontSize: "24px" }}
      >
        全站管理
      </div>
      <SiteAnnouncementEditor />
      <SiteAdvertisementEditor />
    </div>
  );
}
