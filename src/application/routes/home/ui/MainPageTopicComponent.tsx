import * as React from "react";
import type {
  MainPageTopicMoreProps,
  MainPageTopicState,
} from "../model/types";
import { HomeSectionHeader } from "./HomeSectionHeader";
import topicStyles from "./MainPageTopicComponent.module.scss";

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
  if (props.style === "black") {
    return (
      <div className={topicStyles.mainPageList}>
        <HomeSectionHeader
          tone="sub"
          title={props.name}
          links={props.mores}
        />
        <div className={topicStyles.mainPageListContent2}>
          {props.data.map(convertMainPageTopic)}
        </div>
      </div>
    );
  } else if (props.style === "blue") {
    return (
      <div className={topicStyles.mainPageList}>
        <HomeSectionHeader
          tone="main"
          title={props.name}
          links={props.mores}
        />
        <div className={topicStyles.mainPageListContent1}>
          {props.data.map(convertMainPageTopic)}
        </div>
      </div>
    );
  }
}
