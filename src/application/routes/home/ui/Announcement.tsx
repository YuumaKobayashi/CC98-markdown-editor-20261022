import * as React from "react";
import { SiteAnnouncementPreview } from "@modules/site-content/ui/SiteAnnouncementPreview";

interface AnnouncementProps {
  data: string;
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
    <>
      {/*<CountDown endDate={new Date('05/26/2018 05:30 PM')} />*/}
      <SiteAnnouncementPreview content={data} />
    </>
  );
}
