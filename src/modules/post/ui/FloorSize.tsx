import * as React from "react";

import styles from "./FloorSize.module.scss";

interface FloorSizeProps {
  isHot: boolean;
  floor: number;
}

//楼层显示的控件
export function FloorSize(props: FloorSizeProps): React.ReactElement {
  if (!props.isHot) {
    if (props.floor > 9999) {
      return <div className={styles.replyFloorSmall}>{props.floor}</div>;
    } else if (props.floor < 0) {
      return <div className={styles.replyFloorLz}>楼主</div>;
    }
    return <div className={styles.replyFloor}>{props.floor}</div>;
  }

  return (
    <div style={{ backgroundColor: "#FF4040" }} className={styles.replyFloor}>
      <img
        style={{ width: "20px", height: "30px" }}
        src="/static/images/hot.png"
      />
    </div>
  );
}
