import * as React from "react";
import $ from "jquery";
import { Button } from "antd";
import { Link, useParams } from "react-router";

import {
  getBoardInfo,
  getBoardTag,
  isMaster,
} from "@modules/board";
import {
  GetTopTopics,
  getBestTopics,
  getBoardTopicAsync,
  getSaveTopics,
  getTopicByOneTag,
  getTopicByTwoTags,
} from "@modules/topic";
import { mutliDelete, mutliLock } from "@features/moderation/api/service";
import type { TopicTitleAndContentState } from "@legacy/States/AppState";
import { getListTotalPage, getTagLayer } from "@foundation/lib/page";
import { Pager } from "@foundation/ui/pagination";

import { BoardTagPagination } from "../../ui/BoardTagPagination";
import { LegacyBoardTopicItem } from "./LegacyBoardTopicItem";

type BoardRouteParams = {
  boardId?: string;
  boardid?: string;
  page?: string;
  tagId?: string;
  tag1Id?: string;
  tag2Id?: string;
};

interface TopicCollectionLayoutProps {
  boardId: any;
  currentPage: number;
  totalPage: number;
  tags: any[];
  topics: any[];
  url: string;
  showTopTopics?: boolean;
  showRecordLink?: boolean;
  managementLayout?: boolean;
  management?: React.ReactNode;
}

function TopicCollectionLayout({
  boardId,
  currentPage,
  totalPage,
  tags,
  topics,
  url,
  showTopTopics = false,
  showRecordLink = false,
  managementLayout = false,
  management = null,
}: TopicCollectionLayoutProps) {
  const normalTopicsUrl = `/board/${boardId}/`;
  const bestTopicsUrl = `/board/${boardId}/best/`;
  const saveTopicsUrl = `/board/${boardId}/save/`;
  const recordTopicsUrl = `/board/${boardId}/record/`;

  return (
    <div className="listContent ">
      <BoardTagPagination
        page={currentPage}
        totalPage={totalPage}
        boardid={boardId}
        url={url}
        tag={tags}
      />
      <div className="column tagColumn">
        <div className="row board-topBar">
          <div className="row" style={{ alignItems: "center" }}>
            <div className="listContentTag">
              <Link to={normalTopicsUrl}>全部</Link>
            </div>
            <div className="listContentTag">
              <Link to={bestTopicsUrl}>精华</Link>
            </div>
            <div className="listContentTag">
              <Link to={saveTopicsUrl}>保存</Link>
            </div>
          </div>
          <div className="row" style={{ alignItems: "center" }}>
            <div style={{ marginRight: "14rem" }}>
              <span>作者</span>
            </div>
            <div style={{ marginRight: "8rem" }}>
              <span>最后回复</span>
            </div>
          </div>
        </div>
        {showTopTopics ? (
          <div>
            <LegacyBoardTopTopics boardId={boardId} />
          </div>
        ) : null}
        <div>
          {(topics || []).map((item) => (
            <LegacyBoardTopicItem key={item.id} {...item} />
          ))}
        </div>
      </div>
      {managementLayout ? (
        <>
          <div className="row" style={{ marginTop: "0.5rem" }}>
            <div className="listContentBottom" style={{ flexGrow: 1 }}>
              <Pager page={currentPage} totalPage={totalPage} url={url} />
            </div>
            {management}
          </div>
          <LegacyBoardBatchManagement boardId={boardId} />
        </>
      ) : (
        <div className="listContentBottom">
          <Pager page={currentPage} totalPage={totalPage} url={url} />
          {showRecordLink ? (
            <Link to={recordTopicsUrl}>
              <div className="boardRecordBtn">查看版面事件</div>
            </Link>
          ) : null}
        </div>
      )}
    </div>
  );
}

export function LegacyBoardTopTopics({ boardId }: { boardId: any }) {
  const [topics, setTopics] = React.useState<any[]>([]);

  React.useEffect(() => {
    const loadTopics = async () => {
      const data = await GetTopTopics(boardId);
      setTopics(data as any);
    };
    void loadTopics();
  }, []);

  return (
    <div>
      {topics.map((item) => (
        <LegacyBoardTopicItem key={item.id} {...item} />
      ))}
    </div>
  );
}

export function LegacyBoardBestTopicItems({
  boardId,
  curPage,
}: {
  boardId: any;
  curPage: any;
}) {
  const [topics, setTopics] = React.useState<any[]>([]);

  React.useEffect(() => {
    const loadTopics = async () => {
      // 保留旧参数顺序。
      const data = await getBestTopics(boardId, curPage);
      setTopics(data as any);
    };
    void loadTopics();
  }, []);

  return (
    <div>
      {topics.map((item) => (
        <LegacyBoardTopicItem key={item.id} {...item} />
      ))}
    </div>
  );
}

function getSelectedTopics() {
  const targets: string[] = [];
  $(".opTitleCheckboxValue").each(function () {
    if ($(this).is(":checked")) {
      const id = ($(this).attr("id") || "").split("_").pop();
      targets.push(`id=${id}`);
    }
  });
  return targets.join("&");
}

function LegacyBoardBatchManagement({ boardId }: { boardId: any }) {
  const lock = async () => {
    const days = $("#opDays").val();
    let reason = $("#opReason").val();
    if (reason == "自定义") reason = $("#hideReason").val();
    const status = await mutliLock(days, reason, getSelectedTopics());
    if (status == 200) document.location.href = `/board/${boardId}`;
  };

  const remove = async () => {
    let reason = $("#opReason").val();
    if (reason == "自定义") reason = $("#hideReason1").val();
    const status = await mutliDelete(reason, getSelectedTopics());
    if (status == 200) document.location.href = `/board/${boardId}`;
  };

  return (
    <div id="manageUI" style={{ display: "none" }}>
      <div
        onClick={() => {
          $("#deleteUI").css("display", "none");
          $("#lockUI").css("display", "");
          $(".opTitleCheckbox").css("display", "flex");
        }}
        className="react-bootstrap-button"
      >
        批量锁沉
      </div>
      <div
        onClick={() => {
          $("#lockUI").css("display", "none");
          $("#deleteUI").css("display", "");
          $(".opTitleCheckbox").css("display", "flex");
        }}
        className="react-bootstrap-button"
      >
        批量删除
      </div>
      <div id="lockUI" style={{ display: "none" }}>
        <div>
          <label className="control-label">处理理由</label>
          <select
            id="opReason"
            onChange={(event) =>
              $("#hideReason").css(
                "display",
                event.target.value === "自定义" ? "" : "none"
              )
            }
            className="react-bootstrap-select"
          >
            {["重复发帖", "管理要求", "已解决", "内容不符", "违反版规", "自定义"].map(
              (reason) => (
                <option
                  key={reason}
                  className="react-bootstrap-option"
                  value={reason}
                >
                  {reason}
                </option>
              )
            )}
          </select>
          <input
            id="hideReason"
            className="react-bootstrap-text"
            style={{ display: "none" }}
          />
        </div>
        <div>
          {" "}
          <label className="control-label">下沉天数</label>
          <select id="opDays" className="react-bootstrap-select">
            <option value="7">7</option>
            <option value="30">30</option>
            <option value="98">98</option>
            <option value="1000">1000</option>
          </select>
        </div>
        <button
          type="button"
          id="mutlilock-btn"
          onClick={() => void lock()}
          className="react-bootstrap-button"
        >
          确认
        </button>
        <div id="mutlioptip" />
      </div>
      <div id="deleteUI" style={{ display: "none" }}>
        <div>
          <label className="control-label">处理理由</label>
          <select
            id="opReason"
            onChange={(event) =>
              $("#hideReason1").css(
                "display",
                event.target.value === "自定义" ? "" : "none"
              )
            }
            className="react-bootstrap-select"
          >
            {["重复发帖", "管理要求", "已解决", "内容不符", "违反版规", "自定义"].map(
              (reason) => (
                <option
                  key={reason}
                  className="react-bootstrap-option"
                  value={reason}
                >
                  {reason}
                </option>
              )
            )}
          </select>
          <input
            id="hideReason1"
            className="react-bootstrap-text"
            style={{ display: "none" }}
          />
        </div>
        <button
          type="button"
          id="mutlidelete-btn"
          onClick={() => void remove()}
          className="react-bootstrap-button"
        >
          确认
        </button>
        <div id="mutliopdtip" />
      </div>
    </div>
  );
}

export function LegacyBoardTopicList() {
  const params = useParams<BoardRouteParams>();
  const boardId = params.boardId;
  const currentPage = params.page ? parseInt(params.page) : 1;
  const [topics, setTopics] = React.useState<any[]>([]);
  const [totalPage, setTotalPage] = React.useState(0);
  const [boardInfo, setBoardInfo] = React.useState<any>({
    masters: [],
    topicCount: 1,
  });
  const [tags, setTags] = React.useState<any[]>([]);
  const boardInfoIdRef = React.useRef(boardId);

  React.useEffect(() => {
    const loadTopics = async () => {
      const info: any = await getBoardInfo(boardInfoIdRef.current);
      const data = await getBoardTopicAsync(currentPage, boardId, info.topicCount);
      setTopics(data as any);
      setTotalPage(getListTotalPage(info.topicCount));
      setBoardInfo(info);
    };
    void loadTopics();
  }, [boardId, currentPage]);

  React.useEffect(() => {
    const loadTags = async () => {
      setTags(await getBoardTag(boardId));
    };
    void loadTags();
  }, []);

  const url = `/board/${boardId}/`;
  const management = isMaster(boardInfo.boardMasters) ? (
    <Button
      type="primary"
      onClick={() => $("#manageUI").css("display", "")}
    >
      批量管理
    </Button>
  ) : null;

  return (
    <TopicCollectionLayout
      boardId={boardId}
      currentPage={currentPage}
      totalPage={totalPage}
      tags={tags}
      topics={topics}
      url={url}
      showTopTopics={currentPage === 1}
      managementLayout
      management={management}
    />
  );
}

export function LegacyBoardOneTagTopics() {
  const params = useParams<BoardRouteParams>();
  const boardId = params.boardId;
  const currentPage = params.page ? parseInt(params.page) : 1;
  const [state, setState] = React.useState<any>({
    topics: [],
    totalPage: 0,
    tags: [],
    layer: 1,
  });

  React.useEffect(() => {
    const loadTopics = async () => {
      await getBoardInfo(boardId);
      const tags = await getBoardTag(boardId);
      const layer = getTagLayer(params.tagId as any, tags);
      const data = await getTopicByOneTag(
        params.tagId,
        boardId,
        layer,
        currentPage
      );
      setState({
        topics: data.topics,
        totalPage: getListTotalPage(data.count),
        tags,
        layer,
      });
    };
    void loadTopics();
  }, [boardId, currentPage, params.tagId]);

  return (
    <TopicCollectionLayout
      boardId={boardId}
      currentPage={currentPage}
      totalPage={state.totalPage}
      tags={state.tags}
      topics={state.topics}
      url={`/board/${boardId}/tag/tag${state.layer}/${params.tagId}/`}
    />
  );
}

export function LegacyBoardTwoTagTopics() {
  const params = useParams<BoardRouteParams>();
  const boardId = params.boardId || params.boardid;
  const currentPage = params.page ? parseInt(params.page) : 1;
  const [state, setState] = React.useState<any>({
    topics: [],
    totalPage: 0,
    tags: [],
  });

  React.useEffect(() => {
    const loadTopics = async () => {
      await getBoardInfo(boardId);
      const data = await getTopicByTwoTags(
        params.tag1Id,
        params.tag2Id,
        boardId,
        currentPage
      );
      const tags = await getBoardTag(boardId);
      setState({
        topics: data.topics,
        totalPage: getListTotalPage(data.count),
        tags,
      });
    };
    void loadTopics();
  }, [boardId, currentPage, params.tag1Id, params.tag2Id]);

  return (
    <TopicCollectionLayout
      boardId={boardId}
      currentPage={currentPage}
      totalPage={state.totalPage}
      tags={state.tags}
      topics={state.topics}
      url={`/board/${boardId}/tags/tag1/${params.tag1Id}/tag2/${params.tag2Id}/`}
    />
  );
}

function LegacyBoardSpecialTopics({
  kind,
}: {
  kind: "best" | "save";
}) {
  const params = useParams<BoardRouteParams>();
  const boardId = params.boardId;
  const currentPage = params.page ? parseInt(params.page) : 1;
  const [state, setState] = React.useState<any>({
    topics: [],
    totalPage: 0,
    tags: [],
  });
  const [tags, setTags] = React.useState<any[]>([]);

  React.useEffect(() => {
    const loadTopics = async () => {
      const data =
        kind === "best"
          ? await getBestTopics(currentPage, boardId)
          : await getSaveTopics(currentPage, boardId);
      setState({
        topics: data.boardtopics,
        totalPage: data.totalPage,
      });
    };
    void loadTopics();
  }, [boardId, currentPage, kind]);

  React.useEffect(() => {
    const loadTags = async () => {
      setTags(await getBoardTag(boardId));
    };
    void loadTags();
  }, []);

  return (
    <TopicCollectionLayout
      boardId={boardId}
      currentPage={currentPage}
      totalPage={state.totalPage}
      tags={tags}
      topics={state.topics}
      url={`/board/${boardId}/${kind}/`}
      showTopTopics={currentPage === 1}
      showRecordLink
    />
  );
}

export function LegacyBoardFeaturedTopics() {
  return <LegacyBoardSpecialTopics kind="best" />;
}

export function LegacyBoardSavedTopics() {
  return <LegacyBoardSpecialTopics kind="save" />;
}
