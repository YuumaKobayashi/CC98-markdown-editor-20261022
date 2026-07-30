import * as React from "react";

import { HotTopicBreadcrumb } from "../ui/HotTopicBreadcrumb";
import { HotTopicPage } from "../ui/HotTopicPage";

export function WeeklyHotTopicCategory() {
  return <HotTopicBreadcrumb label="7日热门话题" />;
}

/**
 * 7日热门话题
 */
export function WeeklyHotTopic() {
  return (
    <HotTopicPage
      breadcrumb={<WeeklyHotTopicCategory />}
      kind="weekly"
      title="7日热门话题"
    />
  );
}
