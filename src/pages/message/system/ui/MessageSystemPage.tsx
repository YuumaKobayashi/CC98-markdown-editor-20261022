import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";

import { MessageSystembox, type MessageSystemProps } from "@modules/message";
import { getMessageSystem } from "@modules/message";
import { getTotalPage } from "@features/moderation/api/service";
import { DocumentTitle } from "@foundation/ui/document-title";
import { Pager } from "@foundation/ui/pagination";

import {
  getMessagePageCount,
  getMessagePageOffset,
  MESSAGE_PAGE_SIZE,
  parseMessagePage,
} from "../../notifications/model/page";

interface MessageSystemState {
  data: MessageSystemProps[];
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
    <div className="message-right">
      <DocumentTitle title="系统通知-CC98论坛" />
      <div className="message-system">
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
      <div className="message-pager">
        <Pager
          url="/message/system/"
          page={state.page}
          totalPage={state.totalPage}
        />
      </div>
    </div>
  );
}
