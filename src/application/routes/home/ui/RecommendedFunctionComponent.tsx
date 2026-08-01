import * as React from "react";
import { MainPageColumn } from "../model/types";
import styles from "../Home.module.scss";
import componentStyles from "./RecommendedFunctionComponent.module.scss";

interface RecommendedFunctionComponentProps {
  data: MainPageColumn[];
}

function convertRecommendedFunction(
  item: MainPageColumn,
  index: number,
): React.ReactElement {
  return (
    <div key={index} className={componentStyles.recommendedFunctionRow}>
      <div className={componentStyles.recommendedFunctionImage}>
        <img src={item.imageUrl}></img>
      </div>
      <div className={componentStyles.recommendedFunctionTitle}>
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
    <div className={componentStyles.recommendedFunction}>
      <div className={styles.mainPageTitle1}>
        <div className={styles.mainPageTitleRow}>
          <i className="fa fa-volume-up"></i>
          <div className={styles.mainPageTitleText}>推荐功能</div>
        </div>
      </div>
      <div className={componentStyles.recommendedFunctionContent}>
        {props.data.map(convertRecommendedFunction)}
      </div>
    </div>
  );
}
