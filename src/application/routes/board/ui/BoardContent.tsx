import * as React from "react";
import { getBoardTags } from "@modules/board/api/service";
import { type BoardInfo } from "@modules/board/model/types";
import {
  getBestTopics,
  getNormalTopics,
  getSaveTopics,
  getTagTopics,
  getTopTopics,
} from "@modules/topic/api/list-search";
import { TopicBestState } from "@modules/topic/model/enums";
import {
  type ITagGroup,
  type TopicInfo,
} from "@modules/topic/model/dto";
import { Pagination, Spin } from "antd";
import { useNavigate } from "react-router";

import styles from "./BoardContent.module.scss";
import { BoardFooterActions } from "./BoardFooterActions";
import { BoardTopicList } from "./BoardTopicList";
import { BoardTopicToolbar } from "./BoardTopicToolbar";

interface BoardContentProps {
  data: BoardInfo;
  page: string;
}

export function BoardContent({ data, page }: BoardContentProps) {
  const navigate = useNavigate();
  const [list, setList] = React.useState<any>([]);
  const [topList, setTopList] = React.useState<any>([]);
  const [type, setType] = React.useState(TopicBestState.None);
  const [topicCount, setTopicCount] = React.useState(0);
  const [tags, setTags] = React.useState<ITagGroup[]>([]);
  const [tag1, setTag1] = React.useState(-1);
  const [tag2, setTag2] = React.useState(-1);

  const loadBoardTags = async () => {
    const nextTags = await getBoardTags(data.id);
    setTags(nextTags);
  };

  const getTopics = async (
    nextPage: string | number,
    nextType = type,
    nextTag1 = tag1,
    nextTag2 = tag2,
  ) => {
    let nextList: any = [];
    let response: any = null;
    // 没有标签
    if (nextTag1 === -1 && nextTag2 === -1) {
      if (nextType === TopicBestState.None) {
        nextList = await getNormalTopics(data.id, nextPage.toString());
        setList(nextList);
      } else if (nextType === TopicBestState.Best) {
        response = await getBestTopics(data.id, nextPage.toString());
        if (typeof response === "string") {
          setList(response);
          return;
        }
        nextList = response.topics;
        setList(nextList);
        setTopicCount(response.count);
      } else {
        response = await getSaveTopics(data.id, nextPage.toString());
        if (typeof response === "string") {
          setList(response);
          return;
        }
        nextList = response.topics;
        setList(nextList);
        setTopicCount(response.count);
      }
    } else {
      response = await getTagTopics(
        data.id,
        nextPage.toString(),
        nextTag1,
        nextTag2,
      );
      if (typeof response === "string") {
        setList(response);
        return;
      }
      nextList = response.topics;
      setList(nextList);
      setTopicCount(response.count);
    }

    // TODO 错误跳转
  };

  const loadTopTopics = async () => {
    const nextTopList = await getTopTopics(data.id);
    // TODO 错误跳转
    setTopList(nextTopList);
  };

  React.useEffect(() => {
    setTopicCount(data.topicCount);
    void loadTopTopics();
    void getTopics(page, TopicBestState.None, -1, -1);
    void loadBoardTags();
  }, []);

  const handlePageChange = (nextPage: number) => {
    void getTopics(nextPage);
    const pathname = window.location.pathname;
    // 首先判断是不是第一页
    if (page === "1") {
      // 判断url有没有/1
      if (pathname.substr(pathname.lastIndexOf("/") + 1) === "1") {
        navigate(
          `${pathname.substr(0, pathname.lastIndexOf("/"))}/${nextPage}`,
        );
      } else {
        navigate(`${pathname}/${nextPage}`);
      }
    } else {
      navigate(`${pathname.substr(0, pathname.lastIndexOf("/"))}/${nextPage}`);
    }
  };

  const changeType = (nextType: TopicBestState) => {
    setType(nextType);
    void getTopics(page, nextType);
  };

  const handleTag1Change = (nextTag1: number) => {
    setTag1(nextTag1);
    void getTopics(page, type, nextTag1, tag2);
  };

  const handleTag2Change = (nextTag2: number) => {
    setTag2(nextTag2);
    void getTopics(page, type, tag1, nextTag2);
  };

  const currentPage = parseInt(page);
  const boardList: TopicInfo[] =
    currentPage === 1
      ? ([] as TopicInfo[]).concat(topList).concat(list)
      : ([] as TopicInfo[]).concat(list);

  return boardList.length === 0 ? (
    <Spin size="large" />
  ) : (
    <>
      <div className={styles["board-list-bar"]}>
        <Pagination
          className={`${styles["board-pagination"]} cc98-vendor-antd-board-pagination`}
          showQuickJumper
          current={currentPage}
          total={topicCount}
          pageSize={20}
          onChange={handlePageChange}
        />
      </div>
      <BoardTopicToolbar
        onChange={changeType}
        tags={tags}
        handleTag1Change={handleTag1Change}
        handleTag2Change={handleTag2Change}
      />
      <BoardTopicList list={boardList} />
      <div className={styles["board-list-bar"]}>
        <Pagination
          className={`${styles["board-pagination"]} cc98-vendor-antd-board-pagination`}
          showQuickJumper
          current={currentPage}
          pageSize={20}
          total={topicCount}
          onChange={handlePageChange}
        />
      </div>
      <BoardFooterActions data={data} list={list} />
    </>
  );
}
