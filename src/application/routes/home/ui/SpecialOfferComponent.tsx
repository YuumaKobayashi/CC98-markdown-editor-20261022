import * as React from "react";
import { MainPageColumn } from "../model/types";
import styles from "../Home.module.scss";
import componentStyles from "./SpecialOfferComponent.module.scss";

interface SpecialOfferComponentProps {
  data: MainPageColumn[];
}

function convertSpecialOffer(item: MainPageColumn): React.ReactElement {
  return (
    <div className={componentStyles.specialOfferRow}>
      <div className={componentStyles.specialOfferTitle}>
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
    <div className={componentStyles.specialOffer}>
      <div className={styles.mainPageTitle2}>
        <div className={styles.mainPageTitleRow}>
          <i className="fa fa-volume-up"></i>
          <div className={styles.mainPageTitleText}>福利优惠</div>
        </div>
      </div>
      <div className={componentStyles.specialOfferContent}>
        {props.data.map(convertSpecialOffer)}
      </div>
    </div>
  ) : null;
}
