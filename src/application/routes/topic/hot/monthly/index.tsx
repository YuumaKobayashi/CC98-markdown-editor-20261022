import * as React from "react";

import { HotTopicBreadcrumb } from "../ui/HotTopicBreadcrumb";
import { HotTopicPage } from "../ui/HotTopicPage";

export function MonthlyHotTopicCategory() {
  return <HotTopicBreadcrumb label="30日热门话题" />;
}

/**
 * 30日热门话题
 */
export function MonthlyHotTopic() {
  return (
    <HotTopicPage
      breadcrumb={<MonthlyHotTopicCategory />}
      kind="monthly"
      title="30日热门话题"
    />
  );
}
