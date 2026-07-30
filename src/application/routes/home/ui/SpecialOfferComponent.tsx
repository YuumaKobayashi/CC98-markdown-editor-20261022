import * as React from "react";
import { MainPageColumn } from "../model/types";

interface SpecialOfferComponentProps {
  data: MainPageColumn[];
}

function convertSpecialOffer(item: MainPageColumn): React.ReactElement {
  return (
    <div className="specialOfferRow">
      <div className="specialOfferTitle">
        <a href={item.url} target="_blank">
          • {item.title}
        </a>
      </div>
    </div>
  );
}

/**
 * 福利优惠组件
 */
export function SpecialOfferComponent(
  props: SpecialOfferComponentProps,
): React.ReactElement | null {
  return props.data && props.data.length > 0 ? (
    <div className="specialOffer">
      <div className="mainPageTitle2">
        <div className="mainPageTitleRow">
          <i className="fa fa-volume-up"></i>
          <div className="mainPageTitleText">福利优惠</div>
        </div>
      </div>
      <div className="specialOfferContent">
        {props.data.map(convertSpecialOffer)}
      </div>
    </div>
  ) : null;
}
