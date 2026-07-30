import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";

import { MessageAttmebox, type MessageResponseProps } from "@modules/message";
import { getMessageAttme } from "@modules/message";
import { getTotalPage } from "@features/moderation/api/service";
import { DocumentTitle } from "@foundation/ui/document-title";
import { Pager } from "@foundation/ui/pagination";

import {
  getMessagePageCount,
  getMessagePageOffset,
  MESSAGE_PAGE_SIZE,
  parseMessagePage,
} from "../../notifications/model/page";

interface MessageMentionsState {
  data: MessageResponseProps[];
  page: number;
  totalPage: number;
}

export function MessageMentionsPage() {
  const { page: routePage } = useParams<{ page?: string }>();
  const page = parseMessagePage(routePage);
  const [state, setState] = useState<MessageMentionsState>({
    data: [],
    page,
    totalPage: 1,
  });
  const requestId = useRef(0);

  useEffect(() => {
    const currentRequest = ++requestId.current;

    const loadMentions = async () => {
      // TODO: magic number here, should be replaced with a constant or configuration value
      const totalCount = await getTotalPage(2);
      const data =
        (await getMessageAttme(
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

    void loadMentions();
  }, [page]);

  return (
    <div className="message-right">
      <DocumentTitle title="@我的-CC98论坛" />
      <div className="message-response">
        {state.data.map((item) => (
          <MessageAttmebox
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
      <div className="message-pager">
        <Pager
          url="/message/attme/"
          page={state.page}
          totalPage={state.totalPage}
        />
      </div>
    </div>
  );
}
