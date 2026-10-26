import * as React from "react";
import { useEffect, useState } from "react";

import { getMyInfo } from "@modules/session/api/session";
import { getMainPageData } from "@modules/site-content/api/service";
import type { IIndex } from "@modules/site-content/model/dto";
import {
  getLocalStorage,
  setLocalStorage,
} from "@foundation/storage/web-storage";
import { DocumentTitle } from "@foundation/ui/document-title";

import pageStyles from "./HomePage.module.scss";
import type { HomeSectionLink } from "../model/types";
import { AnnouncementComponent } from "./AnnouncementComponent";
import { HomeAdvertisementCarousel } from "./HomeAdvertisementCarousel";
import { HomeHotTopics } from "./HomeHotTopics";
import { HomeStatistics } from "./HomeStatistics";
import type { MainPageCount } from "./HomeStatistics";
import { MainPageTopicComponent } from "./MainPageTopicComponent";
import { QRCode } from "./QRCode";
import { RecommendedFunctionComponent } from "./RecommendedFunctionComponent";
import { RecommendedReading } from "./RecommendedReading";
import { SchoolSuggestionBox } from "./SchoolSuggestionBox";
import { SpecialOfferComponent } from "./SpecialOfferComponent";

export { HomeAdvertisementCarousel } from "./HomeAdvertisementCarousel";
export { HomeHotTopics } from "./HomeHotTopics";
export { HomeStatistics } from "./HomeStatistics";
export { RecommendedReading } from "./RecommendedReading";

//TODO：拆分这个文件里面的多个组件

const emptyMainPageData: IIndex = {
  academics: [],
  announcement: "",
  emotion: [],
  fleaMarket: [],
  fullTimeJob: [],
  hotTopic: [],
  manualHotTopic: [],
  lastUserName: "",
  partTimeJob: [],
  postCount: 0,
  recommendationFunction: [],
  recommendationReading: [],
  schoolEvent: [],
  schoolNews: [],
  specialOffer: [],
  study: [],
  todayCount: 0,
  todayTopicCount: 0,
  topicCount: 0,
  onlineUserCount: 0,
  userCount: 0,
  lastUpdateTime: "",
};

const loadMainPageData = async () => {
  const cached = getLocalStorage<IIndex>("mainPageData");
  if (cached) return cached;

  const data = await getMainPageData();
  if (data.hotTopic?.length) {
    setLocalStorage("mainPageData", data, 60);
    setLocalStorage("mainPageHotTopic", data.hotTopic);
  }
  return data;
};

/** 主页。 */
export function HomePage() {
  const [data, setData] = useState<IIndex>(emptyMainPageData);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const nextData = await loadMainPageData();
      if (active) setData(nextData);
    };
    void load();
    return () => {
      active = false;
    };
  }, []);

  const study: HomeSectionLink[] = [
    { name: "学习", url: "/board/68" }, { name: "外语", url: "/board/304" },
    { name: "考研", url: "/board/263" }, { name: "出国", url: "/board/102" },
  ];
  const emotion: HomeSectionLink[] = [
    { name: "缘分", url: "/board/152" }, { name: "小屋", url: "/board/114" },
    { name: "感性", url: "/board/81" },
  ];
  const fleaMarket: HomeSectionLink[] = [
    { name: "数码", url: "/board/562" }, { name: "日用", url: "/board/80" },
    { name: "服饰", url: "/board/563" },
  ];
  const fullTimeJob: HomeSectionLink[] = [{ name: "更多", url: "/board/235" }];
  const partTimeJob: HomeSectionLink[] = [{ name: "更多", url: "/board/459" }];
  const count: MainPageCount = {
    todayCount: data.todayCount,
    todayTopicCount: data.todayTopicCount,
    topicCount: data.topicCount,
    postCount: data.postCount,
    onlineUserCount: data.onlineUserCount,
    userCount: data.userCount,
    lastUserName: data.lastUserName,
  };

  return (
    <div className={pageStyles.mainPage}>
      <DocumentTitle title="CC98论坛" />
      <div className={pageStyles.leftPart}>
        <AnnouncementComponent data={data.announcement} />
        <RecommendedReading data={data.recommendationReading} />
        <div className={pageStyles.topicRow}>
          <HomeHotTopics data={data.hotTopic} />
          <MainPageTopicComponent data={data.schoolEvent} name="校园活动" fetchUrl="/topic/school-event" style="blue" mores={[]} />
        </div>
        <div className={pageStyles.topicRow}>
          <MainPageTopicComponent data={data.academics} name="学术通知" fetchUrl="/topic/academics" style="black" mores={[]} />
          <MainPageTopicComponent data={data.study} name="学习园地" fetchUrl="/topic/study" style="black" mores={study} />
        </div>
        <div className={pageStyles.topicRow}>
          <MainPageTopicComponent data={data.emotion} name="感性·情感" fetchUrl="/topic/emotion" style="blue" mores={emotion} />
          <MainPageTopicComponent data={data.fleaMarket} name="跳蚤市场" fetchUrl="/topic/flea-market" style="blue" mores={fleaMarket} />
        </div>
        <div className={pageStyles.topicRow}>
          <MainPageTopicComponent data={data.fullTimeJob} name="求职广场" fetchUrl="/topic/full-time-job" style="black" mores={fullTimeJob} />
          <MainPageTopicComponent data={data.partTimeJob} name="实习兼职" fetchUrl="/topic/part-time-job" style="black" mores={partTimeJob} />
        </div>
      </div>
      <div className={pageStyles.rightPart}>
        <RecommendedFunctionComponent data={data.recommendationFunction} />
        <HomeAdvertisementCarousel />
        <SchoolSuggestionBox />
        {getMyInfo() ? <SpecialOfferComponent data={data.specialOffer} /> : null}
        <HomeStatistics data={count} />
        <QRCode title="CC98小程序" src="/static/images/xiaochengxu.png" />
        <QRCode title="98淘书小程序" src="/static/images/taoshu.jpg" />
        <QRCode title="CC98公众号" src="/static/images/gongzhonghao.jpg" />
      </div>
    </div>
  );
}
