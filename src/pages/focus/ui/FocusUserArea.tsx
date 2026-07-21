import * as React from "react";

import { FocusTopicArea } from "@legacy/Components/Focus/FocusTopicArea";

/**
 * 表示我关注的版面的主题列表
 */
export function FocusUserArea(): React.ReactElement {
  return (
    <div>
      <FocusTopicArea id={-1} name="关注用户" />
    </div>
  );
}
