import * as React from "react";
import { useState } from "react";

import { TopicContentType } from "../model/dto";
import type { FocusTopic } from "../model/view-model";

import styles from "./TopicCard.module.scss";
import { TopicAudioPlayer } from "./TopicAudioPlayer";
import { TopicVideoPlayer } from "./TopicVideoPlayer";

export { TopicAudioPlayer } from "./TopicAudioPlayer";
export { TopicVideoPlayer } from "./TopicVideoPlayer";

const getOriginalImageUrl = (thumbnailUrl: string) =>
  thumbnailUrl
    .replace("v2-upload/thumbnail/earlier/", "v2-upload/")
    .replace("v2-upload/thumbnail/", "v2-upload/")
    .replace("v4-upload/t/", "v4-upload/d/");

/**
 * 卡片模式的单个主题。
 */
export function TopicCard(props: FocusTopic) {
  const [originalImageUrl, setOriginalImageUrl] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isOriginalImageVisible, setIsOriginalImageVisible] = useState(false);

  const topicUrl = `/topic/${props.id}/1`;
  const userUrl = `/user/id/${props.userId}`;
  const boardUrl = `/board/${props.boardId}`;
  const page = Number.parseInt(String(props.floorCount / 10 + 1), 10);
  const floor = props.floorCount + 10 - page * 10;
  const pageNum = floor === 0 ? `${page - 1}#10` : `${page}#${floor}`;
  const lastPostUrl = `/topic/${props.id}/${pageNum}`;
  const lastPostUserUrl = `/user/name/${encodeURI(props.lastPostUser)}`;
  const thumbnails = props.mediaContent?.thumbnail ?? [];
  const imageCount = Math.min(thumbnails.length, 6);
  const isAnonymous = !props.userId;

  const showOriginalImage = (thumbnailUrl: string, index = 0) => {
    setOriginalImageUrl(getOriginalImageUrl(thumbnailUrl));
    setSelectedImageIndex(index);
    setIsOriginalImageVisible(true);
  };

  const hideOriginalImage = () => {
    setIsOriginalImageVisible(false);
  };

  const changeMiniImage = (thumbnailUrl: string, index: number) => {
    setOriginalImageUrl(getOriginalImageUrl(thumbnailUrl));
    setSelectedImageIndex(index);
  };

  const renderThumbnailContent = () => {
    if (props.contentType !== TopicContentType.ImageTopic) {
      return null;
    }

    let className = "";
    switch (imageCount) {
      case 1:
        className = styles["card-topic-thumbnail-1"];
        break;
      case 2:
      case 4:
        className = styles["card-topic-thumbnail-2"];
        break;
      case 3:
      case 5:
      case 6:
        className = styles["card-topic-thumbnail-3"];
        break;
      default:
        return null;
    }

    return (
      <div className={className}>
        {thumbnails.map((thumbnail, index) => (
          <img
            key={`thumbnail_${props.id}_${index}`}
            src={thumbnail}
            onClick={() => showOriginalImage(thumbnail, index)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className={styles["card-topic"]}>
      <a
        className={styles["card-topic-left"]}
        href={isAnonymous ? undefined : userUrl}
        target={isAnonymous ? undefined : "_blank"}
        id={`card_portrait_${props.id}`}
      >
        <img
          className={`${styles["card-topic-portraitUrl"]}${
            isAnonymous ? ` ${styles["card-topic-anonymous"]}` : ""
          }`}
          id={`card_portrait_image_${props.id}`}
          src={props.portraitUrl}
        />
      </a>
      <div className={styles["card-topic-middle"]}>
        <a
          className={styles["card-topic-userName"]}
          href={isAnonymous ? undefined : userUrl}
          target={isAnonymous ? undefined : "_blank"}
          id={`card_username_${props.id}`}
        >
          {props.userName}
        </a>
        <a className={styles["card-topic-time"]} href={topicUrl} target="_blank">
          {props.displayTime}
        </a>
        <a className={styles["card-topic-title"]} href={topicUrl} target="_blank">
          {props.title.trim() ? (
            props.title
          ) : (
            <span style={{ display: "inline-block", width: "5rem" }} />
          )}
        </a>
        <div
          className={styles["card-topic-thumbnail-mini"]}
          id={`card_thumbnail_mini_area_${props.id}`}
          style={{
            display:
              isOriginalImageVisible && imageCount > 1 ? "block" : "none",
          }}
        >
          {imageCount > 1
            ? thumbnails.map((thumbnail, index) => (
                <img
                  key={`thumbnail_mini_${props.id}_${index}`}
                  className={
                    selectedImageIndex === index
                      ? styles["card-topic-thumbnail-mini-clicked"]
                      : undefined
                  }
                  id={`card_thumbnail_mini_image_${props.id}_${index}`}
                  src={thumbnail}
                  onClick={() => changeMiniImage(thumbnail, index)}
                />
              ))
            : null}
        </div>
        <div
          className={styles["card-topic-original-image"]}
          id={`card_original_image_area_${props.id}`}
          style={{ display: isOriginalImageVisible ? "block" : "none" }}
        >
          <img
            src={originalImageUrl}
            id={`card_original_image_${props.id}`}
            onClick={hideOriginalImage}
          />
        </div>
        <div
          className={styles["card-topic-thumbnail"]}
          id={`card_thumbnail_area_${props.id}`}
          style={{ display: isOriginalImageVisible ? "none" : "flex" }}
        >
          {renderThumbnailContent()}
        </div>
        {props.contentType === TopicContentType.AudioTopic ? (
          <TopicAudioPlayer
            key={`card_audio_${props.id}`}
            title={props.title}
            src={props.mediaContent.audio}
            userName={props.userName}
            topicId={props.id}
          />
        ) : null}
        {props.contentType === TopicContentType.VideoTopic ? (
          <TopicVideoPlayer
            key={`card_video_${props.id}`}
            src={props.mediaContent.video}
            pic={props.mediaContent.thumbnail[0]}
            isLandscape={
              props.mediaContent.width >= props.mediaContent.height
            }
          />
        ) : null}
        <div className={styles["card-topic-board"]}>
          <div className={styles["card-topic-boardName"]}>
            <a href={boardUrl} target="_blank">
              {props.boardName}
            </a>
          </div>
          {props.tag1Name ? (
            <div className={styles["card-topic-tag"]}>{props.tag1Name}</div>
          ) : null}
          {props.tag2Name ? (
            <div className={styles["card-topic-tag"]}>{props.tag2Name}</div>
          ) : null}
        </div>
        <div className={styles["card-topic-info"]}>
          <div>
            <a href={topicUrl} target="_blank">
              <i className="fa fa-eye fa-lg" />
              {props.displayHitCount}
            </a>
          </div>
          <div>
            <a href={topicUrl} target="_blank">
              <i className="fa fa-commenting-o fa-lg" />
              {props.displayReplyCount}
            </a>
          </div>
          <div>
            最后回复：
            <a
              href={isAnonymous ? undefined : lastPostUserUrl}
              target={isAnonymous ? undefined : "_blank"}
              id={`card_lastpost_${props.id}`}
            >
              {props.lastPostUser}
            </a>
          </div>
          <div>
            <a href={lastPostUrl} target="_blank">
              {props.displayLastPostTime}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
