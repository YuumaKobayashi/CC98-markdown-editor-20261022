import * as React from "react";
import { HomeSectionHeader } from "./HomeSectionHeader";

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
      <HomeSectionHeader tone="sub" title={props.title} />
      <div style={{ marginTop: "1rem" }}>
        <img style={{ width: "100%" }} src={props.src}></img>
      </div>
    </div>
  );
}
