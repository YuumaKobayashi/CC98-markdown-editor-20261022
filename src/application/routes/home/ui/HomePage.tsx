import * as React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router";

import { getMyInfo } from "@modules/session";
import {
  getAdvertisements,
  getMainPageData,
} from "@modules/site-content";
import {
  getLocalStorage,
  getStorage,
  setLocalStorage,
  setStorage,
} from "@foundation/storage/web-storage";
import { DocumentTitle } from "@foundation/ui/document-title";

import styles from "../Home.module.scss";
import {
  MainPageColumn,
  MainPageTopicMoreProps,
} from "../model/types";
import { AnnouncementComponent } from "./AnnouncementComponent";
import { MainPageTopicComponent } from "./MainPageTopicComponent";
import { QRCode } from "./QRCode";
import { RecommendedFunctionComponent } from "./RecommendedFunctionComponent";
import { SchoolSuggestionBox } from "./SchoolSuggestionBox";
import { SpecialOfferComponent } from "./SpecialOfferComponent";

//TODO：拆分这个文件里面的多个组件

interface HotTopic {
  title: string;
  id: number;
  boardName: string;
  boardId: number;
}

const hotTopicPlaceholder: HotTopic[] = [
  {
    title: "数据库正在计算新的十大数据，请前辈等会再来~",
    id: 0,
    boardName: "错误提示",
    boardId: 0,
  },
];

interface MainPageCount {
  todayCount: number;
  todayTopicCount: number;
  topicCount: number;
  postCount: number;
  onlineUserCount: number;
  userCount: number;
  lastUserName: string;
}

const emptyMainPageData = {
  academics: [],
  announcement: "",
  emotion: [],
  fleaMarket: [],
  fullTimeJob: [],
  hotTopic: [],
  lastUserName: "",
  partTimeJob: [],
  postCount: 0,
  recommendationFunction: [],
  recommendationReading: [],
  schoolEvent: [],
  schoolNews: [],
  study: [],
  todayCount: 0,
  todayTopicCount: 0,
  topicCount: 0,
  onlineUserCount: 0,
  userCount: 0,
};

/**
 * 推荐阅读组件
 **/
export function RecommendedReading({ data }: { data: MainPageColumn[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(data.length ? Math.floor(Math.random() * data.length) : 0);
  }, [data]);

  const handleMouseEnter = (nextIndex: number) => {
    setIndex(nextIndex);
  };

  const selectedIndex = index < data.length ? index : 0;
  const selected = data[selectedIndex];

  return (
    <div className={styles.recommendedReading}>
      <div className={styles.mainPageTitle2}>
        <div className={styles.mainPageTitleRow}>
          <i className="fa fa-volume-up"></i>
          <div className={styles.mainPageTitleText}>推荐阅读</div>
        </div>
      </div>
      <div className={styles.recommendedReadingContent}>
        <div className={styles.recommendedReadingImage}>
          <img src={selected?.imageUrl ?? ""} />
        </div>
        <div className="column" style={{ flexGrow: 1 }}>
          <div className={styles.recommendedReadingTitle}>
            <a href={selected?.url ?? ""} target="_blank">
              {selected?.title ?? ""}
            </a>
          </div>
          <div className={styles.recommendedReadingAbstract}>
            {selected?.content ?? ""}
          </div>
          <div className={styles.recommendedReadingButtons}>
            {data.map((_, buttonIndex) => (
              <div
                key={buttonIndex}
                className={
                  buttonIndex === selectedIndex
                    ? styles.recommendedReadingButtonSelected
                    : styles.recommendedReadingButton
                }
                onMouseEnter={() => handleMouseEnter(buttonIndex)}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 热门话题组件
 **/
export function HomeHotTopics({ data }: { data: HotTopic[] }) {

  //TODO: 后端已升级，不会再返回空数组了，暂时保留这个逻辑，等前端升级完成后可以删除。
  const resolveHotTopics = (cachedTopics: HotTopic[] | undefined) => {
    // 接口暂时返回空数组时，优先展示上一次成功获取的十大。
    if (data.length > 0) return data;
    if (cachedTopics) return cachedTopics;
    // 首次访问且没有缓存时，给用户一个明确的等待提示。
    return hotTopicPlaceholder;
  };

  const convertMainPageTopic = (item: HotTopic) => {
    if (!item.id) return <div key="hot-topic-placeholder">{item.title}</div>;
    return (
      <div key={item.id} className={styles.mainPageListRow}>
        <div className={styles.mainPageListBoardName}>
          {" "}
          <a href={`/board/${item.boardId}`} target="_blank">
            [{item.boardName}]
          </a>
        </div>
        <div className={styles.mainPageListTitle}>
          <a href={`/topic/${item.id}/1`} target="_blank">
            {item.title.trim() ? (
              item.title
            ) : (
              <span style={{ display: "inline-block", width: "5rem" }}></span>
            )}
          </a>
        </div>
      </div>
    );
  };

  const cachedTopics = getLocalStorage<HotTopic[]>("mainPageHotTopic");
  const topics = resolveHotTopics(cachedTopics);

  return (
    <div className={styles.mainPageList}>
      <div className={styles.mainPageTitle1}>
        <div className={styles.mainPageTitleRow}>
          <i className="fa fa-volume-up"></i>
          <div className={styles.mainPageTitleText}>热门话题</div>
        </div>
        <div className={styles.mainPageTitleRow}>
          <div className={styles.mainPageTitleText}>
            <a href="/topic/hot-weekly" target="_blank">本周</a>
          </div>
          <div className={styles.mainPageTitleText}>
            <a href="/topic/hot-monthly" target="_blank">本月</a>
          </div>
          <div className={styles.mainPageTitleText}>
            <a href="/topic/hot-history" target="_blank">历史上的今天</a>
          </div>
        </div>
      </div>
      <div className={styles.mainPageListContent1}>
        {topics.map(convertMainPageTopic)}
      </div>
    </div>
  );
}
//TODO：函数位置考虑迁移？
const loadAdvertisements = async () => {
  const cached = getStorage("mainAds-v2") as MainPageColumn[] | undefined;
  if (cached) return cached;

  const data = await getAdvertisements();
  const ads = data.map(
    (item) =>
      new MainPageColumn(item.imageUrl, item.title, item.url, item.content)
  );
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
    <div style={{ position: "relative", width: "18.75rem", height: "6.25rem", marginBottom: "1rem" }}>
      <div>
        <a href={selected?.url ?? ""} target="_blank">
          <img src={selected?.imageUrl ?? ""} style={{ width: "18.75rem", height: "6.25rem" }} />
        </a>
      </div>
      <div className={styles.adButtons} style={{ position: "absolute", left: "50%", marginLeft: "-8rem", bottom: "0.25rem" }}>
        {ads.map((_, buttonIndex) => (
          <div
            key={buttonIndex}
            className={buttonIndex === selectedIndex ? styles.adButtonSelected : styles.adButton}
            onMouseEnter={() => setIndex(buttonIndex)}
          ></div>
        ))}
      </div>
    </div>
  );
}

/** 论坛统计组件。 */
export function HomeStatistics({ data }: { data: MainPageCount }) {
  return (
    <div className={styles.mainPageCount}>
      <div className={styles.mainPageTitle1}>
        <div className={styles.mainPageTitleRow}>
          <i className="fa fa-volume-up"></i>
          <div className={styles.mainPageTitleText}>论坛统计</div>
        </div>
      </div>
      <div className={styles.mainPageCountContent}>
        {[
          ["今日帖数", data.todayCount],
          ["今日主题数", data.todayTopicCount],
          ["论坛总主题数", data.topicCount],
          ["论坛总回复数", data.postCount],
          ["在线用户数", data.onlineUserCount],
          ["总用户数", data.userCount],
        ].map(([label, value]) => (
          <div className={styles.mainPageCountRow} key={label}>
            <div className={styles.mainPageCountTitle}>{label}</div>
            <div className={styles.mainPageCountTitle}>{value || 0}</div>
          </div>
        ))}
        <div className={styles.mainPageCountRow}>
          <div className={styles.mainPageCountTitle}>欢迎新用户</div>
          <div className={styles.mainPageCountTitle}>
            <Link to={`/user/name/${encodeURIComponent(data.lastUserName)}`}>
              {data.lastUserName}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const loadMainPageData = async () => {
  const cached = getLocalStorage<any>("mainPageData");
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
  const [data, setData] = useState<any>(emptyMainPageData);

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

  const study: MainPageTopicMoreProps[] = [
    { name: "学习", url: "/board/68" }, { name: "外语", url: "/board/304" },
    { name: "考研", url: "/board/263" }, { name: "出国", url: "/board/102" },
  ];
  const emotion: MainPageTopicMoreProps[] = [
    { name: "缘分", url: "/board/152" }, { name: "小屋", url: "/board/114" },
    { name: "感性", url: "/board/81" },
  ];
  const fleaMarket: MainPageTopicMoreProps[] = [
    { name: "数码", url: "/board/562" }, { name: "日用", url: "/board/80" },
    { name: "服饰", url: "/board/563" },
  ];
  const fullTimeJob: MainPageTopicMoreProps[] = [{ name: "更多", url: "/board/235" }];
  const partTimeJob: MainPageTopicMoreProps[] = [{ name: "更多", url: "/board/459" }];
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
    <div className={styles.mainPage}>
      <DocumentTitle title="CC98论坛" />
      <div className={styles.leftPart}>
        <AnnouncementComponent data={data.announcement} />
        <RecommendedReading data={data.recommendationReading} />
        <div className="row" style={{ justifyContent: "space-between" }}>
          <HomeHotTopics data={data.hotTopic} />
          <MainPageTopicComponent data={data.schoolEvent} name="校园活动" fetchUrl="/topic/school-event" style="blue" mores={[]} />
        </div>
        <div className="row" style={{ justifyContent: "space-between" }}>
          <MainPageTopicComponent data={data.academics} name="学术通知" fetchUrl="/topic/academics" style="black" mores={[]} />
          <MainPageTopicComponent data={data.study} name="学习园地" fetchUrl="/topic/study" style="black" mores={study} />
        </div>
        <div className="row" style={{ justifyContent: "space-between" }}>
          <MainPageTopicComponent data={data.emotion} name="感性·情感" fetchUrl="/topic/emotion" style="blue" mores={emotion} />
          <MainPageTopicComponent data={data.fleaMarket} name="跳蚤市场" fetchUrl="/topic/flea-market" style="blue" mores={fleaMarket} />
        </div>
        <div className="row" style={{ justifyContent: "space-between" }}>
          <MainPageTopicComponent data={data.fullTimeJob} name="求职广场" fetchUrl="/topic/full-time-job" style="black" mores={fullTimeJob} />
          <MainPageTopicComponent data={data.partTimeJob} name="实习兼职" fetchUrl="/topic/part-time-job" style="black" mores={partTimeJob} />
        </div>
      </div>
      <div className={styles.rightPart}>
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
