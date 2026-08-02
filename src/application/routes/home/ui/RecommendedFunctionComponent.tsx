import * as React from "react";
import type { MainPageColumn } from "../model/types";
import { HomeSectionHeader } from "./HomeSectionHeader";
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
      <HomeSectionHeader tone="main" title="推荐功能" />
      <div className={componentStyles.recommendedFunctionContent}>
        {props.data.map(convertRecommendedFunction)}
      </div>
    </div>
  );
}
