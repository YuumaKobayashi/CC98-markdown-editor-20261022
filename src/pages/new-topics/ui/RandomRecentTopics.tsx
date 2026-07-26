import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";

import { getRandomTopic } from "@entities/topic/api/service";
import {
  getStorage,
  removeStorage,
  setStorage,
} from "@shared/storage/web-storage";

const cutOffTitle = (title: string) =>
  title.length > 30 ? `${title.slice(0, 28)}...` : title;

const renderTopics = (data: any) =>
  data.map((item: any) => (
    <div className="card-recommendation-topic-container">
      <div className="card-recommendation-topic-container-item">
        <div className="card-recommendation-topic">
          <i className="fa fa-commenting-o" aria-hidden="true" />
          <div className="card-recommendation-topic-title">
            <Link to={`/topic/${item.id}`} target="_blank">
              {cutOffTitle(item.title)}
            </Link>
          </div>
          <div className="card-recommendation-topic-detail">
            <Link target="_blank" to={`/board/${item.boardId}`}>
              {item.boardName}&nbsp;
            </Link>{" "}
            {item.hitCount}浏览 {item.replyCount}回复
          </div>
        </div>
      </div>
    </div>
  ));

/**
 * 新帖卡片模式右侧的随机近期主题。
 */
export function RandomRecentTopics() {
  const [data, setData] = useState<any>([]);
  const [isPreviousVisible, setIsPreviousVisible] = useState(false);
  const isLoadableRef = useRef(true);

  useEffect(() => {
    const loadTopics = async () => {
      let topics = getStorage("CurrentRandomTopics");
      if (
        topics === undefined ||
        topics === null ||
        topics === "undefined"
      ) {
        console.log("data is null");
        isLoadableRef.current = false;
        try {
          console.log("try to get data");
          topics = await getRandomTopic(10);
        } catch {
          isLoadableRef.current = true;
          return;
        }
        setStorage("CurrentRandomTopics", topics);
        setData(topics);
        isLoadableRef.current = true;
      } else {
        setData(topics);
      }
      console.log(topics);
    };

    void loadTopics();
  }, []);

  const getNewRandomTopics = async () => {
    if (!isLoadableRef.current) {
      return;
    }

    isLoadableRef.current = false;
    let newData: any;
    try {
      newData = await getRandomTopic(10);
    } catch {
      isLoadableRef.current = true;
      return;
    }
    setStorage("LastRandomTopics", getStorage("CurrentRandomTopics"));
    setStorage("CurrentRandomTopics", newData);
    setData(newData);
    setIsPreviousVisible(true);
    isLoadableRef.current = true;
  };

  const getLastRandomTopics = async () => {
    const previousData = getStorage("LastRandomTopics");
    // 保留旧实现的 OR 空值判断，后续缺陷批次再处理。
    if (
      previousData != undefined ||
      previousData != null ||
      previousData != "undefined"
    ) {
      setIsPreviousVisible(false);
      setData(previousData);
      setStorage("CurrentRandomTopics", previousData);
      removeStorage("LastRandomTopics");
    }
  };

  return (
    <>
      <div className="card-recommendation-button-area">
        <div className="card-user-may-mising-title">可能错过</div>
        <button
          className="card-recommendation-button"
          id="card-recommendation-last"
          style={{
            height: "fit-content",
            visibility: isPreviousVisible ? "visible" : "hidden",
            paddingRight: "0",
            marginRight: "0",
            marginLeft: "50px",
          }}
          onClick={getLastRandomTopics}
        >
          <i className="fa fa-hand-o-left fa-md" />
          上一批
        </button>
        <button
          className="card-recommendation-button"
          id="card-recommendation-refresh"
          style={{ height: "fit-content", marginRight: "12px" }}
          onClick={getNewRandomTopics}
        >
          <i className="fa fa-refresh fa-md" />
          换一换
        </button>
      </div>
      {data != undefined || data != null ? renderTopics(data) : ""}
    </>
  );
}
