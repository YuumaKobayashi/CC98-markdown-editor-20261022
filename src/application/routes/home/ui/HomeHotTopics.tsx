import * as React from "react";

import { getLocalStorage } from "@foundation/storage/web-storage";

import { HomeSectionHeader } from "./HomeSectionHeader";
import topicStyles from "./HomeHotTopics.module.scss";

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
      <div key={item.id} className={topicStyles.mainPageListRow}>
        <div className={topicStyles.mainPageListBoardName}>
          {" "}
          <a href={`/board/${item.boardId}`} target="_blank">
            [{item.boardName}]
          </a>
        </div>
        <div className={topicStyles.mainPageListTitle}>
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
    <div className={topicStyles.mainPageList}>
      <HomeSectionHeader
        tone="main"
        title="热门话题"
        links={[
          { name: "本周", url: "/topic/hot-weekly" },
          { name: "本月", url: "/topic/hot-monthly" },
          { name: "历史上的今天", url: "/topic/hot-history" },
        ]}
      />
      <div className={topicStyles.mainPageListContent1}>
        {topics.map(convertMainPageTopic)}
      </div>
    </div>
  );
}
