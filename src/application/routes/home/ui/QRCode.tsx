import * as React from "react";
import styles from "../Home.module.scss";

interface QRCodeProps {
  title: string;
  src: string;
}

/**
 * 小程序二维码
 */
export function QRCode(props: QRCodeProps): React.ReactElement {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        marginBottom: "1rem",
      }}
    >
      <div className={styles.mainPageTitle2}>
        <div className={styles.mainPageTitleRow}>
          <i className="fa fa-volume-up"></i>
          <div className={styles.mainPageTitleText}>{props.title}</div>
        </div>
      </div>
      <div style={{ marginTop: "1rem" }}>
        <img style={{ width: "100%" }} src={props.src}></img>
      </div>
    </div>
  );
}
