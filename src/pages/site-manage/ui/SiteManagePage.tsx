import * as React from "react";

import Ad from "@legacy/Components/SiteManage/Advertisement";
import Announcement from "@legacy/Components/SiteManage/Announcement";

export function SiteManage() {
  return (
    <div style={{ backgroundColor: "white", width: "100%" }}>
      <div
        style={{ display: "flex", justifyContent: "center", fontSize: "24px" }}
      >
        全站管理
      </div>
      <Announcement />
      <Ad />
    </div>
  );
}
