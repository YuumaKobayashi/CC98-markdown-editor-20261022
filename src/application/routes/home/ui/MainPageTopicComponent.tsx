import * as React from "react";
import {
  MainPageTopicMoreProps,
  MainPageTopicState,
} from "../model/types";
import styles from "../Home.module.scss";
import topicStyles from "./MainPageTopic.module.scss";

interface MainPageTopicComponentProps {
  data: MainPageTopicState[];
  name: string;
  fetchUrl: string;
  style: string;
  mores: MainPageTopicMoreProps[];
}

function convertMainPageTopic(item: MainPageTopicState): React.ReactElement {
  const topicUrl = `/topic/${item.id}/1`;
  return (
    <div key={item.id} className={topicStyles.mainPageListRow}>
      <div className={topicStyles.mainPageListTitle}>
        <a href={topicUrl} target="_blank">
          {item.title.trim() ? (
            item.title
          ) : (
            <span style={{ display: "inline-block", width: "5rem" }}></span>
          )}
        </a>
      </div>
    </div>
  );
}

/**
 * 首页话题组件
 * 需要列表名，fetchUrl和样式三个参数
 **/
export function MainPageTopicComponent(
  props: MainPageTopicComponentProps,
): React.ReactElement {
  const moresHTML = props.mores.map((item, index) => {
    return (
      <div key={index} className={styles.mainPageTitleText}>
        <a href={item.url} target="_blank">
          {item.name}
        </a>
      </div>
    );
  });

  if (props.style === "black") {
    return (
      <div className={topicStyles.mainPageList}>
        <div className={styles.mainPageTitle2}>
          <div className={styles.mainPageTitleRow}>
            <i className="fa fa-volume-up"></i>
            <div className={styles.mainPageTitleText}>{props.name}</div>
          </div>
          <div className={styles.mainPageTitleRow}>{moresHTML}</div>
        </div>
        <div className={topicStyles.mainPageListContent2}>
          {props.data.map(convertMainPageTopic)}
        </div>
      </div>
    );
  } else if (props.style === "blue") {
    return (
      <div className={topicStyles.mainPageList}>
        <div className={styles.mainPageTitle1}>
          <div className={styles.mainPageTitleRow}>
            <i className="fa fa-volume-up"></i>
            <div className={styles.mainPageTitleText}>{props.name}</div>
          </div>
          <div className={styles.mainPageTitleRow}>{moresHTML}</div>
        </div>
        <div className={topicStyles.mainPageListContent1}>
          {props.data.map(convertMainPageTopic)}
        </div>
      </div>
    );
  }
}
