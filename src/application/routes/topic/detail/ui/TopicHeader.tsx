import * as React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import moment from "moment";

import { getTagNamebyId } from "@modules/topic/api/metadata";
import {
  deleteFavoriteTopic,
  setFavoriteTopic,
} from "@modules/favorite-topic/api/service";
import { FavoriteTopicGroupSelect } from "@modules/favorite-topic/ui/FavoriteTopicGroupSelect";
import type { FavoriteTopicGroup } from "@modules/favorite-topic/model/favorite-topic-group";
import { HomeAdvertisementCarousel } from "@application/routes/home/advertisement";
import { copyToClipboard } from "@foundation/lib/dom";
import { NoticeMessage, noticeMessageShow } from "@foundation/ui/feedback";
import { ConfirmDialog } from "@foundation/ui/dialog";
import { setAllUbbImagesVisible } from "@modules/ubb/tag/imageVisibility";
import actionStyles from "./TopicHeader.module.scss";

export interface TopicHeaderProps {
  topicInfo: any;
  boardInfo: any;
  tag1: any;
  tag2: any;
  isFav: any;
  getTagName?: typeof getTagNamebyId;
  setFavorite?: typeof setFavoriteTopic;
  deleteFavorite?: typeof deleteFavoriteTopic;
  copyText?: typeof copyToClipboard;
  favoriteTopicGroups?: readonly FavoriteTopicGroup[];
  advertisement?: React.ReactNode;
  defaultFollowDialogOpen?: boolean;
}

//TODO: 收藏按钮看下能不能独立

export function TopicHeader(props: TopicHeaderProps) {
  const {
    topicInfo,
    boardInfo,
    tag1,
    tag2,
    getTagName = getTagNamebyId,
    setFavorite = setFavoriteTopic,
    deleteFavorite = deleteFavoriteTopic,
    copyText = copyToClipboard,
    favoriteTopicGroups,
    advertisement = <HomeAdvertisementCarousel />,
    defaultFollowDialogOpen = false,
  } = props;
  const [tag1Name, setTag1Name] = useState("");
  const [tag2Name, setTag2Name] = useState("");
  const [isFollow, setIsFollow] = useState(props.isFav);
  const [showImageState, setShowImageState] = useState(true);
  const [followCount, setFollowCount] = useState(topicInfo.favoriteCount);
  const [followDialogOpen, setFollowDialogOpen] = useState(
    defaultFollowDialogOpen
  );
  const [followPending, setFollowPending] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(0);

  useEffect(() => {
    const loadTagNames = async () => {
      let nextTag1Name = "";
      let nextTag2Name = "";
      if (tag1) nextTag1Name = (await getTagName(tag1)) as string;
      if (tag2) nextTag2Name = (await getTagName(tag2)) as string;
      setTag1Name(nextTag1Name);
      setTag2Name(nextTag2Name);
    };

    void loadTagNames();
  }, [getTagName, tag1, tag2]);

  const showAllImg = () => {
    setAllUbbImagesVisible(true);
    setShowImageState(true);
  };

  const hideAllImg = () => {
    setAllUbbImagesVisible(false);
    setShowImageState(false);
  };

  const copyTopicUrl = () => {
    const content = `【${boardInfo.name}】${topicInfo.title} https://www.cc98.org/topic/${topicInfo.id} 复制本链接到浏览器或者打开【CC98】微信小程序查看~`;
    copyText(content)
      .then(() => {
        noticeMessageShow("copySuccess");
      })
      .catch((error) => {
        noticeMessageShow("copyError");
        console.error(`Unable to copy text: ${content}`, error);
      });
  };

  const follow = () => {
    setSelectedGroupId(0);
    setFollowDialogOpen(true);
  };

  const confirmFollow = async () => {
    setFollowPending(true);
    console.log(selectedGroupId);
    try {
      await setFavorite(topicInfo.id, selectedGroupId);
      setIsFollow(true);
      setFollowCount((value) => value + 1);
    } catch (error) {
      console.log("Oops errors!");
    } finally {
      setFollowPending(false);
      setFollowDialogOpen(false);
    }
  };

  const unFollow = async () => {
    await deleteFavorite(topicInfo.id);
    setIsFollow(false);
    setFollowCount((value) => value - 1);
  };

  const title = topicInfo.title || "";
  const overflowLen = 65;
  const boardUrl = `/board/${boardInfo.id}`;
  const tags =
    tag1 || tag2 ? (
      <div id="tags" className={actionStyles.tags}>
        <div className={actionStyles.tagSize}>
          标签： {tag1Name} {tag2Name}
        </div>
        <div></div>
      </div>
    ) : null;

  return (
    <div className={actionStyles["topicInfo-info"]}>
      <div className={actionStyles["topicInfo-title"]}>
        <div
          className={actionStyles.topicTitleProp}
          id="topicTitleProp"
        >
          <div
            id="essay1"
            className={actionStyles.essay}
            title={title.length > overflowLen ? title : undefined}
          >
            {title.length <= overflowLen
              ? title
              : title.slice(0, overflowLen) + " ..."}
          </div>
          <div className={actionStyles.essayProp} id="essayProp">
            {tags}
            <div id="time" className={actionStyles.time}>
              <div>
                <i className="fa fa-clock-o fa-lg fa-fw"></i>
              </div>{" "}
              <div className={`${actionStyles.timeProp} ${actionStyles.tagSize}`}>
                {moment(topicInfo.time).format("YYYY-MM-DD HH:mm:ss")}
              </div>
            </div>
            <div id="viewtimes" className={actionStyles.viewtimes}>
              <div>
                <i className="fa fa-eye fa-lg fa-fw"></i>{" "}
              </div>{" "}
              <div className={`${actionStyles.timeProp} ${actionStyles.tagSize}`}>
                {topicInfo.hitCount}
              </div>
            </div>
            <div id="followCount" className={actionStyles.followCount}>
              <div>
                {isFollow ? (
                  <i className="fa fa-star fa-lg fa-fw"></i>
                ) : (
                  <i className="fa fa-star-o fa-lg fa-fw"></i>
                )}{" "}
              </div>{" "}
              <div className={`${actionStyles.timeProp} ${actionStyles.tagSize}`}>
                {followCount}
              </div>
            </div>
            <div
              className={actionStyles.followTopic}
              onClick={isFollow ? unFollow : follow}
            >
              {isFollow ? "已收藏" : "收藏"}
            </div>
            <div
              className={`${actionStyles.followTopic} ${actionStyles.wideAction}`}
              onClick={showImageState ? hideAllImg : showAllImg}
            >
              {showImageState ? "收起所有图片" : "显示所有图片"}
            </div>
            <div
              className={`${actionStyles.followTopic} ${actionStyles.wideAction}`}
              onClick={copyTopicUrl}
            >
              分享帖子链接
            </div>
          </div>
        </div>

        <div className={actionStyles["topicInfo-boardMessage"]}>
          <Link className={actionStyles.boardLink} to={boardUrl}>
            <div className={actionStyles.boardName}>{boardInfo.name}</div>
          </Link>
          <div className={actionStyles.boardStats}>
            {boardInfo.todayCount} /{" "}{boardInfo.topicCount}
          </div>
        </div>
      </div>
      <div className={actionStyles["topicInfo-ads"]}>
        {advertisement}
      </div>
      <ConfirmDialog
        open={followDialogOpen}
        title="选择收藏分组"
        onOpenChange={setFollowDialogOpen}
        onConfirm={confirmFollow}
        confirmLoading={followPending}
      >
        <FavoriteTopicGroupSelect
          option={setSelectedGroupId}
          value={selectedGroupId}
          favoriteTopicGroups={favoriteTopicGroups}
        />
      </ConfirmDialog>
      <NoticeMessage
        text="已将分享内容复制到剪贴板"
        id="copySuccess"
        top="13.7%"
        left="45%"
      />
      <NoticeMessage
        text="将分享内容复制到剪贴板时出现错误"
        id="copyError"
        top="13.7%"
        left="45%"
      />
    </div>
  );
}
