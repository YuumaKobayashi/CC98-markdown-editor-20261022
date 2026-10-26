import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import { Card } from "@foundation/ui/card";
import { Tag } from "@foundation/ui/tag";

import { UbbCodeOptions } from "@modules/ubb/engine/Core";
import { UbbContainer } from "@modules/ubb/UbbContainer";
import { PostContentType } from "@modules/post/model/dto";
import { getTopicVote } from "@modules/topic/api/detail";
import {
  LotteryMode,
  LotteryTopicStatus,
} from "@modules/topic/model/dto";
import {
  type TopicInfo,
  type VoteInfo,
} from "@modules/topic/model/dto";
import { atUserMdUrl, atUserUbbUrl } from "@foundation/lib/text";
import { MarkdownView } from "@foundation/integrations/markdown";
import { TopicVote } from "./TopicVote";
import detailStyles from "./TopicReplyContent.module.scss";

export interface TopicReplyContentProps {
  postId: number | string;
  content: string;
  contentType: PostContentType;
  topicInfo: TopicInfo;
  floor: number;
}

export function TopicReplyContent({
  postId,
  content,
  contentType,
  topicInfo,
  floor,
}: TopicReplyContentProps) {
  const [vote, setVote] = useState<VoteInfo | null>(null);

  const loadVote = useCallback(async () => {
    try {
      const nextVote = await getTopicVote(topicInfo.id);
      setVote(nextVote);
    } catch (error) {}
  }, [topicInfo.id]);

  useEffect(() => {
    if (floor === 1 && topicInfo.isVote && !vote) {
      void loadVote();
    }
  }, [floor, topicInfo.isVote, vote, loadVote]);

  const ubbMode = (
    <UbbContainer
      code={atUserUbbUrl(content)}
      options={{ ...new UbbCodeOptions(), allowToolbox: true }}
    />
  );
  // Markdown 帖与 UBB 帖一致：@用户名 统一转换为指向个人中心的链接。
  const mdMode = (
    <div className={detailStyles.markdownContainer}>
      <MarkdownView content={atUserMdUrl(content)} />
    </div>
  );
  const renderedContent =
    contentType === PostContentType.Markdown ? mdMode : ubbMode;
  const lotteryTopicDetail = topicInfo.lotteryTopicDetail;
  const drawingTimeStr = lotteryTopicDetail
    ? lotteryTopicDetail.drawingTime.slice(0, 16).replace("T", " ")
    : "";

  return (
    <div
      className={`${detailStyles["reply-content"]}${
        contentType === PostContentType.Markdown
          ? ` ${detailStyles.markdownReply}`
          : ""
      }`}
    >
      {vote ? (
        <TopicVote
          topicInfo={topicInfo}
          getInfo={loadVote}
          voteInfo={vote}
        />
      ) : null}
      <div className={detailStyles.noticeArea}>
        {topicInfo.isAnonymous &&
          topicInfo.todayCount > 3 &&
          floor === 1 && (
            <Tag>该用户今日在本版发布了{topicInfo.todayCount}个主题帖</Tag>
          )}
        {topicInfo.notifyAllReplierPostIds.includes(postId as number) && (
          <Tag>本楼使用了“通知本主题所有回复用户”功能</Tag>
        )}
        {lotteryTopicDetail && floor === 1 && (
          <Card size="small" className={detailStyles.lotteryCard}>
            <p className={`${detailStyles.lotteryMessage} ${detailStyles.lotteryTitle}`}>
              该主题帖启用了抽奖功能
            </p>
            <p className={detailStyles.lotteryMessage}>
              在开奖前回复即可参与
            </p>
            <p className={detailStyles.lotteryDetail}>
              抽取数量：{lotteryTopicDetail.drawingCount}
            </p>
            {lotteryTopicDetail.mode === LotteryMode.SingleCC98Account && (
              <p className={detailStyles.lotteryDetail}>
                抽奖模式：同一个CC98账号最多中奖一次
              </p>
            )}
            {lotteryTopicDetail.mode === LotteryMode.SingleZJUInfoId && (
              <p className={detailStyles.lotteryDetail}>
                抽奖模式：同一个浙大通行证下的CC98账号最多中奖一次
              </p>
            )}
            <p className={detailStyles.lotteryDetail}>
              　　　　（注意：多次回复不会增加中奖概率）
            </p>
            <p className={detailStyles.lotteryDetail}>
              开奖时间：{drawingTimeStr}
            </p>
            {lotteryTopicDetail.status === LotteryTopicStatus.Waiting && (
              <p className={detailStyles.lotteryDetail}>
                当前状态：等待开奖
              </p>
            )}
            {lotteryTopicDetail.status === LotteryTopicStatus.Finished && (
              <p className={detailStyles.lotteryDetail}>
                当前状态：已开奖，中奖名单见
                {lotteryTopicDetail.resultFloor}楼
              </p>
            )}
            {lotteryTopicDetail.status ===
              LotteryTopicStatus.FinishedWithoutDrawing && (
              <p className={detailStyles.lotteryDetail}>
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
