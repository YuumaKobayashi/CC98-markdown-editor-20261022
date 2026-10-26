import * as React from "react";
import { useLayoutEffect, useRef, useState } from "react";

import styles from "./TopicVideoPlayer.module.scss";

const DPlayer = require("dplayer");

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
      className={`dplayer ${styles.player} ${
        isLandscape ? styles.landscape : styles.portrait
      }`}
      ref={containerRef}
    />
  );
}
