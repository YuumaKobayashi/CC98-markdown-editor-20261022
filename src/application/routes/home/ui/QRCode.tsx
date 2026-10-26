import * as React from "react";
import { HomeSectionHeader } from "./HomeSectionHeader";
import styles from "./QRCode.module.scss";

interface QRCodeProps {
  title: string;
  src: string;
}

/**
 * 小程序二维码
 */
export function QRCode(props: QRCodeProps): React.ReactElement {
  return (
    <div className={styles.qrCode}>
      <HomeSectionHeader tone="sub" title={props.title} />
      <div className={styles.imageContainer}>
        <img className={styles.image} src={props.src}></img>
      </div>
    </div>
  );
}
