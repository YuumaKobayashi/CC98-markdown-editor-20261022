import * as React from "react";
import type { IBoard, ITagGroup, ITopic } from "@cc98/api";
import { Pagination, Spin } from "antd";
import { useNavigate } from "react-router";

import {
  getBestTopics,
  getNormalTopics,
  getSaveTopics,
  getTagTopics,
  getTags,
  getTopTopics,
} from "../api/service";
import { BoardFooterActions } from "./BoardFooterActions";
import { BoardTopicList } from "./BoardTopicList";
import { BoardTopicToolbar } from "./BoardTopicToolbar";

interface BoardContentProps {
  data: IBoard;
  page: string;
}

export function BoardContent({ data, page }: BoardContentProps) {
  const navigate = useNavigate();
  const [list, setList] = React.useState<any>([]);
  const [topList, setTopList] = React.useState<any>([]);
  const [type, setType] = React.useState(0);
  const [topicCount, setTopicCount] = React.useState(0);
  const [tags, setTags] = React.useState<ITagGroup[]>([]);
  const [tag1, setTag1] = React.useState(-1);
  const [tag2, setTag2] = React.useState(-1);

  const getBoardTags = async () => {
    const nextTags = await getTags(data.id);
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
      if (nextType === 0) {
        nextList = await getNormalTopics(data.id, nextPage.toString());
        setList(nextList);
      } else if (nextType === 1) {
        response = await getBestTopics(data.id, nextPage.toString());
        nextList = response.topics;
        setList(nextList);
        setTopicCount(response.count);
      } else {
        response = await getSaveTopics(data.id, nextPage.toString());
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
    void getTopics(page, 0, -1, -1);
    void getBoardTags();
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

  const changeType = (nextType: number) => {
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
  const boardList: ITopic[] =
    currentPage === 1
      ? ([] as ITopic[]).concat(topList).concat(list)
      : ([] as ITopic[]).concat(list);

  return boardList.length === 0 ? (
    <Spin size="large" />
  ) : (
    <>
      <div className="board-list-bar">
        <Pagination
          className="board-pagination"
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
      <div className="board-list-bar">
        <Pagination
          className="board-pagination"
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
