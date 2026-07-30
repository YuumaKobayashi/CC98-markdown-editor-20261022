import * as React from "react";

import { HotTopicBreadcrumb } from "../ui/HotTopicBreadcrumb";
import { HotTopicPage } from "../ui/HotTopicPage";

export function HistoryHotTopicCategory() {
  return <HotTopicBreadcrumb label="历史上的今天" />;
}

/**
 * 历史上的今天
 */
export function HistoryHotTopic() {
  return (
    <HotTopicPage
      breadcrumb={<HistoryHotTopicCategory />}
      kind="history"
      title="历史上的今天"
    />
  );
}
