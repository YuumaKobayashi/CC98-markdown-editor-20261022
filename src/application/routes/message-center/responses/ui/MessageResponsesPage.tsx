import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";

import { MessageResponsebox } from "@modules/notification/ui/MessageResponsebox";
import { type ReplyAtNotificationViewModel } from "@modules/notification/model/view-model";
import { getMessageResponse } from "@modules/notification/api/service";
import { getTotalPage } from "@modules/notification/api/service";
import { DocumentTitle } from "@foundation/ui/document-title";
import styles from "./MessageResponsesPage.module.scss";
import { Pagination } from "@foundation/ui/pagination";

import {
  getMessagePageCount,
  getMessagePageOffset,
  MESSAGE_PAGE_SIZE,
  parseMessagePage,
} from "../../notifications/model/page";

interface MessageResponsesState {
  data: ReplyAtNotificationViewModel[];
  page: number;
  totalPage: number;
}

export function MessageResponsesPage() {
  const { page: routePage } = useParams<{ page?: string }>();
  const page = parseMessagePage(routePage);
  const [state, setState] = useState<MessageResponsesState>({
    data: [],
    page,
    totalPage: 1,
  });
  const requestId = useRef(0);

  useEffect(() => {
    const currentRequest = ++requestId.current;

    const loadResponses = async () => {
      const totalCount = await getTotalPage(1);
      const data =
        (await getMessageResponse(
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

    void loadResponses();
  }, [page]);

  return (
    <div className={styles["message-right"]}>
      <DocumentTitle title="回复我的-CC98论坛" />
      <div className={styles["message-response"]}>
        {state.data.map((item) => (
          <MessageResponsebox
            key={item.id}
            id={item.id}
            type={item.type}
            time={item.time}
            topicId={item.topicId}
            topicTitle={item.topicTitle}
            floor={item.floor}
            userId={item.userId}
            userName={item.userName}
            boardId={item.boardId}
            boardName={item.boardName}
            isRead={item.isRead}
          />
        ))}
      </div>
      <div className={styles["message-pager"]}>
        <Pagination
          mode="legacy-links"
          currentPage={state.page}
          totalPages={state.totalPage}
          getPageHref={(targetPage) => `/message/response/${targetPage}#1`}
        />
      </div>
    </div>
  );
}
