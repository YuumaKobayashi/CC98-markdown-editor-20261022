import * as React from "react";
import { useLayoutEffect, useRef } from "react";

import styles from "./TopicAudioPlayer.module.scss";

const APlayer = require("aplayer");

let audioPlayerCount = 0;

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
      className={`aplayer ${styles.player}`}
      ref={containerRef}
    />
  );
}
