import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import { Card, Tag } from "antd";

import { UbbCodeOptions, UbbContainer } from "@modules/ubb";
import { atUserMdUrl, atUserUbbUrl } from "@foundation/lib/text";
import { getTopicVote } from "../api/service";
import { TopicVote, type voteInfo } from "./TopicVote";
import detailStyles from "./TopicReplyContent.module.scss";

const showdown = require("showdown");
const showdownExtension = require("showdown-xss-filter");

export interface TopicReplyContentProps {
  postId: any;
  content: string;
  contentType: number;
  topicInfo: any;
  floor: number;
}

export function TopicReplyContent({
  postId,
  content,
  contentType,
  topicInfo,
  floor,
}: TopicReplyContentProps) {
  const [vote, setVote] = useState<voteInfo | null>(null);
  const domId = `doc-content${postId}-${floor}`;

  const loadVote = useCallback(async () => {
    try {
      const nextVote = await getTopicVote(topicInfo.id);
      setVote(nextVote);
    } catch (error) {}
  }, [topicInfo.id]);

  useEffect(() => {
    //TODO: 兼容逻辑统一化
    let parseContent = content.replace(/\n>[\s\S]*?\n\n/g, (value) =>
      value.replace(/\n[^\n](?!>)/g, (line) =>
        line.replace(/\n(?!>)/, "\n>")
      )
    );
    if (parseContent[0] === ">") {
      const index = parseContent.indexOf("\n\n");
      if (index === -1) {
        parseContent = parseContent.replace(/\n[^\n](?!>)/g, (line) =>
          line.replace(/\n(?!>)/, "\n>")
        );
      } else {
        const prefix = parseContent.substring(0, index);
        parseContent =
          prefix.replace(/\n[^\n](?!>)/g, (line) =>
            line.replace(/\n(?!>)/, "\n>")
          ) + parseContent.substring(index + 1);
      }
    }
    parseContent = parseContent.replace(/发言：\*\*\n/g, "发言：**\n\n");

    const converter = new showdown.Converter({
      extensions: [showdownExtension],
    });
    converter.setOption("tables", true);
    converter.setOption("strikethrough", true);
    const html = converter.makeHtml(parseContent);
    const target = document.getElementById(domId);
    if (target) {
      target.innerHTML = html;
    }

    if (floor === 1 && topicInfo.isVote && !vote) {
      void loadVote();
    }
  }, [content, domId, floor, loadVote, topicInfo.isVote, vote]);

  const ubbMode = (
    <UbbContainer
      code={atUserUbbUrl(content)}
      options={{ ...new UbbCodeOptions(), allowToolbox: true }}
    />
  );
  void atUserMdUrl(content);
  const mdMode = (
    <div className={detailStyles.markdownContainer}>
      <div id={domId} className={detailStyles.markdownPreviewContent}></div>
    </div>
  );
  const renderedContent = contentType === 1 ? mdMode : ubbMode;
  const lotteryTopicDetail = topicInfo.lotteryTopicDetail;
  const drawingTimeStr = lotteryTopicDetail
    ? lotteryTopicDetail.drawingTime.slice(0, 16).replace("T", " ")
    : "";

  return (
    <div className={detailStyles["reply-content"]}>
      {vote ? (
        <TopicVote
          topicInfo={topicInfo}
          getInfo={loadVote}
          voteInfo={vote}
        />
      ) : null}
      <div
        style={{
          alignSelf: "center",
          marginTop: "1rem",
          marginBottom: "-1rem",
        }}
      >
        {topicInfo.isAnonymous &&
          topicInfo.todayCount > 3 &&
          floor === 1 && (
            <Tag>该用户今日在本版发布了{topicInfo.todayCount}个主题帖</Tag>
          )}
        {topicInfo.notifyAllReplierPostIds.includes(postId) && (
          <Tag>本楼使用了“通知本主题所有回复用户”功能</Tag>
        )}
        {lotteryTopicDetail && floor === 1 && (
          <Card size="small" style={{ width: 400 }}>
            <p
              style={{
                fontWeight: "bold",
                color: "red",
                margin: "3px 0px",
                textAlign: "center",
                fontSize: "16px",
              }}
            >
              该主题帖启用了抽奖功能
            </p>
            <p
              style={{
                color: "red",
                margin: "3px 0px",
                textAlign: "center",
              }}
            >
              在开奖前回复即可参与
            </p>
            <p style={{ margin: "3px 0px", fontSize: "12px" }}>
              抽取数量：{lotteryTopicDetail.drawingCount}
            </p>
            {lotteryTopicDetail.mode === 1 && (
              <p style={{ margin: "3px 0px", fontSize: "12px" }}>
                抽奖模式：同一个CC98账号最多中奖一次
              </p>
            )}
            {lotteryTopicDetail.mode === 2 && (
              <p style={{ margin: "3px 0px", fontSize: "12px" }}>
                抽奖模式：同一个浙大通行证下的CC98账号最多中奖一次
              </p>
            )}
            <p style={{ margin: "3px 0px", fontSize: "12px" }}>
              　　　　（注意：多次回复不会增加中奖概率）
            </p>
            <p style={{ margin: "3px 0px", fontSize: "12px" }}>
              开奖时间：{drawingTimeStr}
            </p>
            {lotteryTopicDetail.status === 1 && (
              <p style={{ margin: "3px 0px", fontSize: "12px" }}>
                当前状态：等待开奖
              </p>
            )}
            {lotteryTopicDetail.status === 2 && (
              <p style={{ margin: "3px 0px", fontSize: "12px" }}>
                当前状态：已开奖，中奖名单见
                {lotteryTopicDetail.resultFloor}楼
              </p>
            )}
            {lotteryTopicDetail.status === 3 && (
              <p style={{ margin: "3px 0px", fontSize: "12px" }}>
                当前状态：异常，已中止本次抽奖
              </p>
            )}
          </Card>
        )}
      </div>
      <div className={detailStyles.substance}>{renderedContent}</div>
    </div>
  );
}
