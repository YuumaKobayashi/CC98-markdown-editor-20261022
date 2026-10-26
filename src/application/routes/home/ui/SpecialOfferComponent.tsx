import * as React from "react";
import type { IMainpageEditableContent } from "@modules/site-content/model/dto";
import { HomeSectionHeader } from "./HomeSectionHeader";
import componentStyles from "./SpecialOfferComponent.module.scss";

interface SpecialOfferComponentProps {
  data: IMainpageEditableContent[];
}

function convertSpecialOffer(item: IMainpageEditableContent): React.ReactElement {
  return (
    <div key={item.id} className={componentStyles.specialOfferRow}>
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
      <HomeSectionHeader tone="sub" title="福利优惠" />
      <div className={componentStyles.specialOfferContent}>
        {props.data.map(convertSpecialOffer)}
      </div>
    </div>
  ) : null;
}
