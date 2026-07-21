import * as React from "react";
import { FocusTopicArea } from "@legacy/Components/Focus/FocusTopicArea";

/**
 * 表示我收藏的版面的主题列表
 */
export function FocusFavoriteArea(): React.ReactElement {
  return (
    <div>
      <FocusTopicArea id={-2} name="收藏主题" />
    </div>
  );
}
