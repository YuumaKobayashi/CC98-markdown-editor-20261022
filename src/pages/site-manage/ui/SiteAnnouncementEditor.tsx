import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { Button, Input } from "antd";

import { getToken, formAuthorizeHeader } from "@modules/session";
import { UbbContainer } from "@legacy/Components/UbbContainer";
import { cc98Fetch } from "@foundation/api/http";

const { TextArea } = Input;

export function SiteAnnouncementEditor() {
  const [announcement, setAnnouncement] = useState("加载中");
  const [info, setInfo] = useState("");
  const infoTimer = useRef<number>();

  useEffect(() => {
    const load = async () => {
      const response = await cc98Fetch("/config/global");
      const data = await response.json();
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
      const token = await getToken();
      const headers = new Headers();
      headers.append("Authorization", token);
      headers.append("Content-Type", "application/json");
      const response = await cc98Fetch("/config/global/announcement", {
        method: "PUT",
        headers,
        body: JSON.stringify({ announcement }),
      });
      if (response.status !== 200) throw new Error(response.status.toString());
      showTemporaryInfo("修改全站公告成功");
    } catch (error) {
      setInfo(`修改失败${error.message}`);
    }
  };

  const clearMainPageCache = async () => {
    try {
      const headers = await formAuthorizeHeader();
      const response = await cc98Fetch("/config/index/update", {
        method: "PUT",
        headers,
      });
      if (response.status !== 200) throw new Error(response.status.toString());
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
        <div className="announcement">
          <div className="mainPageTitle1">
            <div className="mainPageTitleRow" style={{ width: "100%" }}>
              <i className="fa fa-volume-up"></i>
              <div style={{ flexGrow: 1 }} className="mainPageTitleText">全站公告</div>
            </div>
          </div>
          <div className="announcementContent"><UbbContainer code={announcement} /></div>
        </div>
      </div>
    </div>
  );
}
