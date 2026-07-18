import * as React from "react";

interface FloorSizeProps {
  isHot: boolean;
  floor: number;
}

//楼层显示的控件
export function FloorSize(props: FloorSizeProps): React.ReactElement {
  if (!props.isHot) {
    if (props.floor > 9999) {
      return <div className="reply-floor-small">{props.floor}</div>;
    } else if (props.floor < 0) {
      return <div className="reply-floor-lz">楼主</div>;
    }
    return <div className="reply-floor">{props.floor}</div>;
  }

  return (
    <div style={{ backgroundColor: "#FF4040" }} className="reply-floor">
      <img
        style={{ width: "20px", height: "30px" }}
        src="/static/images/hot.png"
      />
    </div>
  );
}
