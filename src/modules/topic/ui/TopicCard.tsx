import * as React from "react";
import { useLayoutEffect, useRef, useState } from "react";

import type { FocusTopic } from "@legacy/Props/FocusTopic";

import styles from "./TopicCard.module.scss";

const APlayer = require("aplayer");
const DPlayer = require("dplayer");

let audioPlayerCount = 0;
let videoPlayerCount = 0;

interface TopicVideoPlayerProps {
  src: string;
  pic: string;
  isLandscape: boolean;
}

//TODO：这个页面的组件逻辑需要优化，优先级中

export function TopicVideoPlayer({
  src,
  pic,
  isLandscape,
}: TopicVideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [, setHeight] = useState<string>();

  useLayoutEffect(() => {
    const container = containerRef.current;
    let player: any;

    try {
      videoPlayerCount += 1;
      player = new DPlayer({
        lang: "zh-cn",
        element: container,
        autoplay: false,
        preload: "metadata",
        loop: false,
        video: {
          url: src,
          pic,
          type: "auto",
        },
      });
    } catch {}

    player.on("abort", () => null);
    player.on("fullscreen", () => setHeight("auto"));
    player.on("fullscreen_cancel", () => setHeight("28.8984375rem"));
    player.on("webfullscreen", () => setHeight("100%"));
    player.on("webfullscreen_cancel", () => setHeight("28.8984375rem"));

    container.getElementsByClassName("dplayer-menu")[0].innerHTML =
      '<div class="dplayer-menu-item"><a target="_blank" href="https://github.com/MoePlayer/DPlayer">关于 DPlayer 播放器</a></div>';

    const fullIn = container.getElementsByClassName(
      "dplayer-full-in-icon"
    )[0];
    if (fullIn) {
      fullIn.remove();
    }

    if (!isLandscape) {
      const setting = container.getElementsByClassName("dplayer-setting")[0];
      if (setting) {
        setting.remove();
      }
      const full = container.getElementsByClassName("dplayer-full")[0];
      if (full) {
        full.remove();
      }
    }

    return () => {
      player && player.destroy();
    };
  }, [isLandscape, pic, src]);

  return (
    <div
      className="dplayer"
      style={{
        whiteSpace: "normal",
        width: isLandscape ? "380px" : "210px",
        margin: "0 0 15px 0",
      }}
      ref={containerRef}
    />
  );
}

interface TopicAudioPlayerProps {
  src: string;
  title: string;
  userName: string;
  topicId: number;
}

export function TopicAudioPlayer({
  src,
  title,
  userName,
}: TopicAudioPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    let player: any;

    try {
      audioPlayerCount += 1;
      player = new APlayer({
        element: containerRef.current,
        autoplay: false,
        preload: "metadata",
        loop: "none",
        music: {
          url: encodeURI(src),
          title,
          author: userName,
          pic: "/static/images/audio_cover.png",
        },
      });
    } catch {
      // IE 11 下会抛出 InvalidStateError，沿用旧行为忽略。
    }

    return () => {
      player && player.destroy();
    };
  }, [src, title, userName]);

  return (
    <div
      className="aplayer"
      style={{ whiteSpace: "normal", margin: "0 0 15px 0" }}
      ref={containerRef}
    />
  );
}

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
    if (props.contentType !== 4) {
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
          {props.time}
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
        {props.contentType === 3 ? (
          <TopicAudioPlayer
            key={`card_audio_${props.id}`}
            title={props.title}
            src={props.mediaContent.audio}
            userName={props.userName}
            topicId={props.id}
          />
        ) : null}
        {props.contentType === 2 ? (
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
          {props.tag1 ? (
            <div className={styles["card-topic-tag"]}>{props.tag1}</div>
          ) : null}
          {props.tag2 ? (
            <div className={styles["card-topic-tag"]}>{props.tag2}</div>
          ) : null}
        </div>
        <div className={styles["card-topic-info"]}>
          <div>
            <a href={topicUrl} target="_blank">
              <i className="fa fa-eye fa-lg" />
              {props.hitCount}
            </a>
          </div>
          <div>
            <a href={topicUrl} target="_blank">
              <i className="fa fa-commenting-o fa-lg" />
              {props.replyCount}
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
              {props.lastPostTime}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
