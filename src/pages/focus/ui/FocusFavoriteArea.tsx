import * as React from "react";
import $ from "jquery";
import { FocusTopicArea } from "@legacy/Components/Focus/FocusTopicArea";

/**
 * 表示我收藏的版面的主题列表
 */
export function FocusFavoriteArea(): React.ReactElement {
  React.useLayoutEffect(() => {
    $("#myFocusBoard").removeClass("focus-title-hover");
    $("#myFocusUser").removeClass("focus-title-hover");
    $("#myFocusFavorite").addClass("focus-title-hover");
  }, []);

  return (
    <div>
      <FocusTopicArea id={-2} name="收藏主题" />
    </div>
  );
}
