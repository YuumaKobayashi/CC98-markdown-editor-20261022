// A '.tsx' file enables JSX support in the TypeScript compiler,
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
import * as React from "react";
import moment from "moment";
import { UbbContainer } from "@legacy/Components/UbbContainer";
import { UbbCompatiblityMode } from "@legacy/Ubb/UbbCodeExtension";
import { MessageResponseProps } from "../model/types";

export function MessageAttmebox(
  props: MessageResponseProps,
): React.ReactElement {
  let boardName = `[url=/board/${props.boardId}][color=dodgerblue]${props.boardName}[/color][/url]`;
  //有可能出错后返回boardId为0，未知版面
  if (props.boardId === 0) {
    boardName = `[color=dodgerblue]${props.boardName}[/color]`;
  }
  const a: any = props.floor / 10 + 1;
  const b = parseInt(a);
  const c = props.floor + 10 - b * 10;
  let pageNum = `${b}#${c}`;

  if (c === 0) {
    pageNum = `${b - 1}#10`;
  }
  let content;
  if (props.isRead) {
    let userName;
    let title;
    if (props.userId > 0) {
      userName = `[url=/user/id/${props.userId}][color=gray]${props.userName}[/color][/url]`;
    } else {
      userName = `[color=gray]${props.userName}[/color]`;
    }
    if (props.boardId) {
      title = `[url=/topic/${props.topicId}/${pageNum}][color=#0b5394]${props.topicTitle.replace("\n", "")}[/color][/url]`;
    } else {
      title = `[color=#0b5394]${props.topicTitle.replace("\n", "")}[/color]`;
    }
    content = ` ${userName} [color=gray]在《${title}》中@了你。[/color]`;
  } else {
    let userName;
    let title;
    if (props.userId > 0) {
      userName = `[url=/user/id/${props.userId}][color=gray][b]${props.userName}[/b][/color][/url]`;
    } else {
      userName = `[color=gray][b]${props.userName}[/b][/color]`;
    }
    if (props.boardId) {
      title = `[url=/topic/${props.topicId}/${pageNum}][color=#0b5394]${props.topicTitle}[/color][/url]`;
    } else {
      title = `[color=#0b5394]${props.topicTitle}[/color]`;
    }
    content = ` ${userName} [color=gray][b]在《${title}》中@了你。[/b][/color]`;
  }

  return (
    <div className="message-response-box">
      <div className="message-response-box-middle">
        <div className="message-response-box-middle1">
          <div className="message-response-box-middle-title">
            <UbbContainer code={boardName} />
          </div>
          <div className="message-response-box-middle-date">
            {moment(props.time).format("YYYY-MM-DD HH:mm:ss")}
          </div>
        </div>
        <div className="message-response-box-middle-content">
          <UbbContainer
            code={content}
            options={{
              allowExternalImage: false,
              allowAutoPlay: false,
              autoDetectUrl: true,
              allowExternalUrl: true,
              allowImage: false,
              allowMediaContent: false,
              compatibility: UbbCompatiblityMode.Recommended,
              allowEmotion: false,
              allowToolbox: false,
            }}
          />
        </div>
      </div>
    </div>
  );
}
