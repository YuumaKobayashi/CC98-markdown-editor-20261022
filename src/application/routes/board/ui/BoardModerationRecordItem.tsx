import * as React from "react";
import moment from "moment";

import type { BoardEvent } from "@legacy/States/BoardEvent";

export function BoardModerationRecordItem(props: BoardEvent) {
  const [showIp, setShowIp] = React.useState(false);

  const handleMouseEnter = () => {
    if (props.ip !== "*") {
      setShowIp(true);
    }
  };

  const handleMouseLeave = () => {
    setShowIp(false);
  };

  let targetUserName: React.ReactNode;
  if (props.targetUserName) {
    targetUserName = (
      <a href={`/user/name/${props.targetUserName}`} target="_blank">
        {props.targetUserName}
      </a>
    );
  } else if (props.boardId != 182) {
    targetUserName = "不适用";
  } else {
    targetUserName = "匿名用户";
  }

  return (
    <div className="boardRecord" id="changeColor">
      <div className="boardRecord-1">{targetUserName}</div>
      <div className="boardRecord-2">
        <a href={`/topic/${props.topicId}`} target="_blank">
          {props.content}
        </a>
      </div>
      <div className="boardRecord-3">
        {moment(props.time).format("YY-MM-DD HH:mm")}
      </div>
      <div
        className="boardRecord-4"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <a href={`/user/name/${props.operatorUserName}`} target="_blank">
          {props.operatorUserName}
        </a>
      </div>
      <div
        className={`boardRecord-ip${showIp ? "" : " displaynone"}`}
        id={`ip_${props.id}`}
      >
        {props.ip}
      </div>
    </div>
  );
}
