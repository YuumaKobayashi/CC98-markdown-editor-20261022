import * as React from "react";
import { SiteAnnouncementPreview } from "@modules/site-content";

interface AnnouncementComponentProps {
  data: string;
}

/**
 * 全站公告组件
 **/
export function AnnouncementComponent(
  props: AnnouncementComponentProps,
): React.ReactElement {
  const data = props.data;
  if (data == "") return <div></div>;

  return (
    <>
      {/*<CountDown endDate={new Date('05/26/2018 05:30 PM')} />*/}
      <SiteAnnouncementPreview content={data} />
    </>
  );
}
