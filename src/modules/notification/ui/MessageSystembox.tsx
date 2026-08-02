// A '.tsx' file enables JSX support in the TypeScript compiler,
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
import * as React from "react";
import moment from "moment";
import { UbbContainer } from "@legacy/Components/UbbContainer";
import { UbbCompatiblityMode } from "@legacy/Ubb/UbbCodeExtension";
import type { MessageSystemProps } from "../model/types";
import styles from "./MessageSystembox.module.scss";

export function MessageSystembox(
  props: MessageSystemProps,
): React.ReactElement {
  let content;
  if (props.topicId) {
    if (props.floor) {
      //console.log("楼层", props.floor);
      const a: any = props.floor / 10 + 1;
      const b = parseInt(a);
      const c = props.floor + 10 - b * 10;
      let pageNum = `${b}#${c}`;
      if (c === 0) {
        pageNum = `${b - 1}#10`;
      }
      if (props.isRead) {
        content = `[url=/topic/${props.topicId}/${pageNum}][color=gray]${props.content}[/color][/url]`;
      } else {
        content = `[url=/topic/${props.topicId}/${pageNum}][b][color=black]${props.content}[/color][/b][/url]`;
      }
    } else if (props.isRead) {
      content = `[url=/topic/${props.topicId}][color=gray]${props.content}[/color][/url]`;
    } else {
      content = `[url=/topic/${props.topicId}][b][color=black]${props.content}[/color][/b][/url]`;
    }
  } else if (props.isRead) {
    content = `[color=gray]${props.content}[/color]`;
  } else {
    content = `[color=black][b]${props.content}[/b][/color]`;
  }

  return (
    <div className={styles["message-system-box"]}>
      <div className={styles["message-system-box-bar"]}>
        <div className={styles["message-system-box-title"]}>{props.title}</div>
        <div className={styles["message-system-box-date"]}>
          {moment(props.time).format("YYYY-MM-DD HH:mm:ss")}
        </div>
      </div>
      <div className={styles["message-system-box-content"]}>
        <UbbContainer
          code={content}
          options={{
            allowExternalImage: false,
            allowAutoPlay: false,
            autoDetectUrl: true,
            allowExternalUrl: true,
            allowImage: true,
            allowMediaContent: false,
            compatibility: UbbCompatiblityMode.Recommended,
            allowEmotion: false,
            allowToolbox: false,
          }}
        />
      </div>
    </div>
  );
}
