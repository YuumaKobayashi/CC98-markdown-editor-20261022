// A '.tsx' file enables JSX support in the TypeScript compiler,
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import * as React from "react";

import styles from "./NoticeMessage.module.scss";

interface NoticeMessageProps {
  text: string;
  id: string;
  top: string;
  left: string;
}

interface SendTopicNoticeMessageProps {
  text: string;
  id: string;
}

/**
 * text:显示的文字
 * id:给这个消息提示框一个id
 * top: 消息提示距顶部的距离
 * left:消息提示距左边的距离
 */
export function NoticeMessage({
  text,
  id,
  top,
  left,
}: NoticeMessageProps) {
  return (
    <div
      className="noticeSuccess displaynone"
      id={id}
      style={{
        position: "fixed",
        top,
        left,
        whiteSpace: "pre-wrap",
        textAlign: "start",
      }}
    >
      {text}
    </div>
  );
}

export function SendTopicNoticeMessage({
  text,
  id,
}: SendTopicNoticeMessageProps) {
  return (
    <div className={`${styles.sendTopicNoticeSuccess} displaynone`} id={id}>
      {"操作失败。" + text}
    </div>
  );
}
