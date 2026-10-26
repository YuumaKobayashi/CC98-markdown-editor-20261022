import * as React from "react";
import { useEffect, useState } from "react";

import { getAdvertisements } from "@modules/site-content/api/service";
import {
  getStorage,
  setStorage,
} from "@foundation/storage/web-storage";

import advertisementStyles from "./HomeAdvertisementCarousel.module.scss";
import type { MainPageColumn } from "../model/types";

//TODO：函数位置考虑迁移？
const loadAdvertisements = async () => {
  const cached = getStorage("mainAds-v2") as MainPageColumn[] | undefined;
  if (cached) return cached;

  const data = await getAdvertisements();
  const ads = data.map((item) => ({
    imageUrl: item.imageUrl,
    title: item.title,
    url: item.url,
    content: item.content,
  }));
  setStorage("mainAds-v2", ads);
  return ads;
};

/**
 * 首页广告组件
 * 每20s切换一条
 */
export function HomeAdvertisementCarousel() {
  const [ads, setAds] = useState<MainPageColumn[]>(
    () => (getStorage("mainAds-v2") as MainPageColumn[] | undefined) ?? []
  );
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // 仅用于在组件卸载后忽略异步结果，不会阻止请求重复发出。
    let active = true;
    const load = async () => {
      const nextAds = await loadAdvertisements();
      if (!active) return;
      setAds(nextAds);
      setIndex(nextAds.length ? Math.floor(Math.random() * nextAds.length) : 0);
    };
    void load();
    return () => {
      active = false;
    };
  }, []);

  // 设定定时器，每20s切换一条。
  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (ads.length ? (current + 1) % ads.length : 0));
    }, 20000);
    return () => window.clearInterval(timer);
  }, [ads.length]);

  const selectedIndex = index < ads.length ? index : 0;
  const selected = ads[selectedIndex];

  return (
    <div className={advertisementStyles.advertisement}>
      <div>
        <a href={selected?.url ?? ""} target="_blank">
          <img
            className={advertisementStyles.advertisementImage}
            src={selected?.imageUrl ?? ""}
          />
        </a>
      </div>
      <div className={advertisementStyles.adButtons}>
        {ads.map((_, buttonIndex) => (
          <div
            key={buttonIndex}
            className={buttonIndex === selectedIndex ? advertisementStyles.adButtonSelected : advertisementStyles.adButton}
            onMouseEnter={() => setIndex(buttonIndex)}
          ></div>
        ))}
      </div>
    </div>
  );
}
