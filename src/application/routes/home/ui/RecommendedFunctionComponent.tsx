import * as React from "react";
import { MainPageColumn } from "../model/types";
import styles from "../Home.module.scss";

interface RecommendedFunctionComponentProps {
  data: MainPageColumn[];
}

function convertRecommendedFunction(
  item: MainPageColumn,
  index: number,
): React.ReactElement {
  return (
    <div key={index} className={styles.recommendedFunctionRow}>
      <div className={styles.recommendedFunctionImage}>
        <img src={item.imageUrl}></img>
      </div>
      <div className={styles.recommendedFunctionTitle}>
        <a href={item.url} target="_blank">
          {item.title}
        </a>
      </div>
    </div>
  );
}

/**
 * 推荐功能组件
 */
export function RecommendedFunctionComponent(
  props: RecommendedFunctionComponentProps,
): React.ReactElement {
  return (
    <div className={styles.recommendedFunction}>
      <div className={styles.mainPageTitle1}>
        <div className={styles.mainPageTitleRow}>
          <i className="fa fa-volume-up"></i>
          <div className={styles.mainPageTitleText}>推荐功能</div>
        </div>
      </div>
      <div className={styles.recommendedFunctionContent}>
        {props.data.map(convertRecommendedFunction)}
      </div>
    </div>
  );
}
