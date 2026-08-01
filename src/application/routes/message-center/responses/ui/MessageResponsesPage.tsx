import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";

import {
  MessageResponsebox,
  type MessageResponseProps,
} from "@modules/notification";
import { getMessageResponse } from "@modules/notification";
import { getTotalPage } from "@modules/notification";
import { DocumentTitle } from "@foundation/ui/document-title";
import styles from "../../MessageCenter.module.scss";
import { Pager } from "@foundation/ui/pagination";

import {
  getMessagePageCount,
  getMessagePageOffset,
  MESSAGE_PAGE_SIZE,
  parseMessagePage,
} from "../../notifications/model/page";

interface MessageResponsesState {
  data: MessageResponseProps[];
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
        <Pager
          url="/message/response/"
          page={state.page}
          totalPage={state.totalPage}
        />
      </div>
    </div>
  );
}
