import * as React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Modal } from "antd";
import moment from "moment";

import { getTagNamebyId } from "@modules/topic";
import {
  deleteFavoriteTopic,
  setFavoriteTopic,
} from "@modules/favorite-topic/api/service";
import { FavoriteTopicGroupSelect } from "@modules/favorite-topic/ui/FavoriteTopicGroupSelect";
import { noticeMessageShow } from "@modules/notification";
import { HomeAdvertisementCarousel } from "@application/routes/home/advertisement";
import { copyToClipboard } from "@foundation/lib/dom";
import { NoticeMessage } from "@foundation/ui/feedback";
import actionStyles from "./TopicHeader.module.scss";

export interface TopicHeaderProps {
  topicInfo: any;
  boardInfo: any;
  tag1: any;
  tag2: any;
  isFav: any;
}

//TODO: 收藏按钮看下能不能独立

const { confirm } = Modal;

export function TopicHeader(props: TopicHeaderProps) {
  const { topicInfo, boardInfo, tag1, tag2 } = props;
  const [tag1Name, setTag1Name] = useState("");
  const [tag2Name, setTag2Name] = useState("");
  const [isFollow, setIsFollow] = useState(props.isFav);
  const [showImageState, setShowImageState] = useState(true);
  const [followCount, setFollowCount] = useState(topicInfo.favoriteCount);

  useEffect(() => {
    const loadTagNames = async () => {
      let nextTag1Name = "";
      let nextTag2Name = "";
      if (tag1) nextTag1Name = (await getTagNamebyId(tag1)) as string;
      if (tag2) nextTag2Name = (await getTagNamebyId(tag2)) as string;
      setTag1Name(nextTag1Name);
      setTag2Name(nextTag2Name);
    };

    void loadTagNames();
  }, [tag1, tag2]);

  const toggleImageState = () => {
    setShowImageState((value) => !value);
  };

  const showAllImg = () => {
    //TODO: 修复这个问题
    const buttons = document.getElementsByClassName("hiddenImage");
    for (const buttonId in buttons) {
      if (Object.prototype.hasOwnProperty.call(buttons, buttonId)) {
        (buttons[buttonId] as HTMLElement).click();
      }
    }
    toggleImageState();
  };

  //TODO: 修复这个问题
  const hideAllImg = () => {
    const buttons = document.getElementsByClassName("visibleImage");
    for (const buttonId in buttons) {
      if (Object.prototype.hasOwnProperty.call(buttons, buttonId)) {
        (buttons[buttonId] as HTMLElement).click();
      }
    }
    toggleImageState();
  };

  const copyTopicUrl = () => {
    const content = `【${boardInfo.name}】${topicInfo.title} https://www.cc98.org/topic/${topicInfo.id} 复制本链接到浏览器或者打开【CC98】微信小程序查看~`;
    copyToClipboard(content)
      .then(() => {
        noticeMessageShow("copySuccess");
      })
      .catch((error) => {
        noticeMessageShow("copyError");
        console.error(`Unable to copy text: ${content}`, error);
      });
  };

  const follow = () => {
    let select = 0;
    confirm({
      title: "选择收藏分组",
      content: (
        <FavoriteTopicGroupSelect
          option={(value) => {
            select = value;
          }}
        />
      ),
      onOk: async () => {
        console.log(select);
        try {
          await setFavoriteTopic(topicInfo.id, select);
          setIsFollow(true);
          setFollowCount((value) => value + 1);
        } catch (error) {
          console.log("Oops errors!");
        }
      },
      onCancel() {},
    });
  };

  const unFollow = async () => {
    await deleteFavoriteTopic(topicInfo.id);
    setIsFollow(false);
    setFollowCount((value) => value - 1);
  };

  const title = topicInfo.title || "";
  const overflowLen = 65;
  const boardUrl = `/board/${boardInfo.id}`;
  const tags =
    tag1 || tag2 ? (
      <div id="tags" className={actionStyles.tags}>
        <div className={`tagProp ${actionStyles.tagSize}`}>
          标签： {tag1Name} {tag2Name}
        </div>
        <div className="tagProp"></div>
      </div>
    ) : null;

  return (
    <div className={actionStyles["topicInfo-info"]}>
      <div className={actionStyles["topicInfo-title"]}>
        <div
          className={`cc98-column ${actionStyles.topicTitleProp}`}
          id="topicTitleProp"
        >
          <div
            id="essay1"
            className={`cc98-row ${actionStyles.essay}`}
            title={title.length > overflowLen ? title : undefined}
          >
            {title.length <= overflowLen
              ? title
              : title.slice(0, overflowLen) + " ..."}
          </div>
          <div className={`cc98-row ${actionStyles.essayProp}`} id="essayProp">
            {tags}
            <div id="time" className={actionStyles.time}>
              <div className="viewProp">
                <i className="fa fa-clock-o fa-lg fa-fw"></i>
              </div>{" "}
              <div className={`${actionStyles.timeProp} ${actionStyles.tagSize}`}>
                {moment(topicInfo.time).format("YYYY-MM-DD HH:mm:ss")}
              </div>
            </div>
            <div id="viewtimes" className={actionStyles.viewtimes}>
              <div className="viewProp">
                <i className="fa fa-eye fa-lg fa-fw"></i>{" "}
              </div>{" "}
              <div className={`${actionStyles.timeProp} ${actionStyles.tagSize}`}>
                {topicInfo.hitCount}
              </div>
            </div>
            <div id="followCount" className={actionStyles.followCount}>
              <div className="viewProp">
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
              className={actionStyles.followTopic}
              style={{ width: "5.5rem" }}
              onClick={showImageState ? hideAllImg : showAllImg}
            >
              {showImageState ? "收起所有图片" : "显示所有图片"}
            </div>
            <div
              className={actionStyles.followTopic}
              style={{ width: "5.5rem" }}
              onClick={copyTopicUrl}
            >
              分享帖子链接
            </div>
          </div>
        </div>

        <div className={actionStyles["topicInfo-boardMessage"]}>
          <Link to={boardUrl}>
            <div style={{ color: "#6b7178" }}>{boardInfo.name}</div>
          </Link>
          <div style={{ marginTop: "0.5rem", fontSize: "0.75rem" }}>
            {boardInfo.todayCount} / {boardInfo.topicCount}
          </div>
        </div>
      </div>
      <div className={actionStyles["topicInfo-ads"]}>
        <HomeAdvertisementCarousel />
      </div>
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
