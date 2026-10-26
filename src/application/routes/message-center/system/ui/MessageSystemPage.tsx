import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";

import { MessageSystembox } from "@modules/notification/ui/MessageSystembox";
import { type SystemNotificationViewModel } from "@modules/notification/model/view-model";
import { getMessageSystem } from "@modules/notification/api/service";
import { getTotalPage } from "@modules/notification/api/service";
import { DocumentTitle } from "@foundation/ui/document-title";
import styles from "./MessageSystemPage.module.scss";
import { Pagination } from "@foundation/ui/pagination";

import {
  getMessagePageCount,
  getMessagePageOffset,
  MESSAGE_PAGE_SIZE,
  parseMessagePage,
} from "../../notifications/model/page";

interface MessageSystemState {
  data: SystemNotificationViewModel[];
  page: number;
  totalPage: number;
}

export function MessageSystemPage() {
  const { page: routePage } = useParams<{ page?: string }>();
  const page = parseMessagePage(routePage);
  const [state, setState] = useState<MessageSystemState>({
    data: [],
    page,
    totalPage: 1,
  });
  const requestId = useRef(0);

  useEffect(() => {
    const currentRequest = ++requestId.current;

    const loadSystemMessages = async () => {
      const totalCount = await getTotalPage(3);
      const data =
        (await getMessageSystem(
          getMessagePageOffset(page),
          MESSAGE_PAGE_SIZE
        )) ?? [];

      // 快速切页时，旧页面的请求结果不能覆盖当前页面。
      if (requestId.current !== currentRequest) return;

      setState({
        data,
        page,
        totalPage: getMessagePageCount(totalCount),
      });
    };

    void loadSystemMessages();
  }, [page]);

  return (
    <div className={styles["message-right"]}>
      <DocumentTitle title="系统通知-CC98论坛" />
      <div className={styles["message-system"]}>
        {state.data.map((item) => (
          <MessageSystembox
            key={item.id}
            id={item.id}
            type={item.type}
            title={item.title}
            content={item.content}
            time={item.time}
            topicId={item.topicId}
            floor={item.floor}
            isRead={item.isRead}
          />
        ))}
      </div>
      <div className={styles["message-pager"]}>
        <Pagination
          mode="legacy-links"
          currentPage={state.page}
          totalPages={state.totalPage}
          getPageHref={(targetPage) => `/message/system/${targetPage}#1`}
        />
      </div>
    </div>
  );
}
