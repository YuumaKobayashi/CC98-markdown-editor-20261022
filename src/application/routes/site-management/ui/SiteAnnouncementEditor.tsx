import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { Button, Input } from "antd";

import {
  changeSiteAnnouncement as updateSiteAnnouncement,
  clearMainPageCache as refreshMainPageCache,
  getPublicGlobalConfig,
} from "@modules/site-content";
import { UbbContainer } from "@legacy/Components/UbbContainer";
import homeStyles from "../../home/Home.module.scss";

const { TextArea } = Input;

export function SiteAnnouncementEditor() {
  const [announcement, setAnnouncement] = useState("加载中");
  const [info, setInfo] = useState("");
  const infoTimer = useRef<number>();

  useEffect(() => {
    const load = async () => {
      const data = await getPublicGlobalConfig();
      setAnnouncement(data.announcement);
    };
    void load();
    return () => {
      if (infoTimer.current !== undefined) window.clearTimeout(infoTimer.current);
    };
  }, []);

  const showTemporaryInfo = (message: string) => {
    if (infoTimer.current !== undefined) window.clearTimeout(infoTimer.current);
    setInfo(message);
    infoTimer.current = window.setTimeout(() => {
      setInfo("");
    }, 1000);
  };

  const changeSiteAnnouncement = async () => {
    try {
      await updateSiteAnnouncement(announcement);
      showTemporaryInfo("修改全站公告成功");
    } catch (error) {
      setInfo(`修改失败${error.message}`);
    }
  };

  const clearMainPageCache = async () => {
    try {
      await refreshMainPageCache();
      showTemporaryInfo("清除首页缓存成功");
    } catch (error) {
      setInfo(`清除首页缓存失败 ${error.message}`);
    }
  };

  const handleAnnouncementChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnnouncement(event.target.value);
  };

  return (
    <div style={{ marginLeft: "1rem", marginRight: "1rem" }}>
      <p style={{ height: "2rem" }}>{info}</p>
      <div>
        <div style={{ display: "flex", fontSize: "20px", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
          <div style={{ marginTop: "10px", marginLeft: "15px", marginRight: "15px" }}>全站公告</div>
          <div style={{ marginLeft: "15px" }}>
            <Button type="primary" onClick={changeSiteAnnouncement}>提交修改</Button>
          </div>
          <div style={{ marginLeft: "15px" }}>
            <Button type="primary" onClick={clearMainPageCache}>清除首页缓存</Button>
          </div>
        </div>
        <TextArea spellCheck={false} rows={8} onChange={handleAnnouncementChange} value={announcement} />
        <div className={homeStyles.announcement}>
          <div className={homeStyles.mainPageTitle1}>
            <div className={homeStyles.mainPageTitleRow} style={{ width: "100%" }}>
              <i className="fa fa-volume-up"></i>
              <div style={{ flexGrow: 1 }} className={homeStyles.mainPageTitleText}>全站公告</div>
            </div>
          </div>
          <div className={homeStyles.announcementContent}><UbbContainer code={announcement} /></div>
        </div>
      </div>
    </div>
  );
}
