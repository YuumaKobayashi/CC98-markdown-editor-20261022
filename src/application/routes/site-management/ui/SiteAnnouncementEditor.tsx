import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@foundation/ui/button";
import { TextArea } from "@foundation/ui/input";

import {
  changeSiteAnnouncement as updateSiteAnnouncement,
  clearMainPageCache as refreshMainPageCache,
  getPublicGlobalConfig,
} from "@modules/site-content/api/service";
import { SiteAnnouncementPreview } from "@modules/site-content/ui/SiteAnnouncementPreview";
import styles from "./SiteAnnouncementEditor.module.scss";

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
    <div className={styles.root}>
      <p className={styles.info}>{info}</p>
      <div>
        <div className={styles.toolbar}>
          <div className={styles.title}>全站公告</div>
          <div className={styles.action}>
            <Button type="primary" onClick={changeSiteAnnouncement}>提交修改</Button>
          </div>
          <div className={styles.action}>
            <Button type="primary" onClick={clearMainPageCache}>清除首页缓存</Button>
          </div>
        </div>
        <TextArea spellCheck={false} rows={8} onChange={handleAnnouncementChange} value={announcement} />
        <SiteAnnouncementPreview content={announcement} />
      </div>
    </div>
  );
}
