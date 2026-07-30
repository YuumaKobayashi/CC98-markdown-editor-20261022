import * as React from "react";
import { MainPageColumn } from "../model/types";

interface RecommendedFunctionComponentProps {
  data: MainPageColumn[];
}

function convertRecommendedFunction(
  item: MainPageColumn,
  index: number,
): React.ReactElement {
  return (
    <div key={index} className="recommendedFunctionRow">
      <div className="recommendedFunctionImage">
        <img src={item.imageUrl}></img>
      </div>
      <div className="recommendedFunctionTitle">
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
    <div className="recommendedFunction">
      <div className="mainPageTitle1">
        <div className="mainPageTitleRow">
          <i className="fa fa-volume-up"></i>
          <div className="mainPageTitleText">推荐功能</div>
        </div>
      </div>
      <div className="recommendedFunctionContent">
        {props.data.map(convertRecommendedFunction)}
      </div>
    </div>
  );
}
