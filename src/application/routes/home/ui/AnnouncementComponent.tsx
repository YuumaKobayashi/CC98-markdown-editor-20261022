import * as React from "react";
import { UbbContainer } from "@legacy/Components/UbbContainer";

interface AnnouncementComponentProps {
  data: any;
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
    <div className="announcement">
      <div className="mainPageTitle1">
        <div className="mainPageTitleRow" style={{ width: "100%" }}>
          <i className="fa fa-volume-up"></i>
          <div style={{ flexGrow: 1 }} className="mainPageTitleText">
            全站公告
          </div>
          {/*<CountDown endDate={new Date('05/26/2018 05:30 PM')} />*/}
        </div>
      </div>
      <div className="announcementContent">
        <UbbContainer code={data} />
      </div>
    </div>
  );
}
