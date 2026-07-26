import * as React from "react";
import { useEffect, useState } from "react";
import { Collapse } from "antd";
import { Link } from "react-router";

import { getBoards } from "@entities/board/api/service";

const { Panel } = Collapse;

//TODO: hard code here
const blankData = [
  {
    id: 763,
    name: "置顶",
    order: 1,
    masters: [],
    boards: [
      { id: 758, name: "似水流年·暑假" },
      { id: 182, name: "心灵之约" },
      { id: 198, name: "新生宝典·军训" },
      { id: 184, name: "论坛指南" },
    ],
  },
];

const isStringShort = (value: string) => {
  let normalizedValue = value;
  if (normalizedValue.includes("（")) {
    normalizedValue = normalizedValue.replace("（", "(").replace("）", ")");
    return normalizedValue.length > 8;
  }
  return normalizedValue.length > 7;
};

const renderBoardPanelContent = (boards: any[]) => {
  const wrapList = boards.map((board) => isStringShort(board.name));

  return (
    <div style={{ display: "flex", flexWrap: "wrap", width: "100%" }}>
      {boards.map((board, index) => (
        <div
          key={index}
          style={{
            width: wrapList[index] ? "100%" : "50%",
            paddingBottom: "4px",
            whiteSpace: "nowrap",
          }}
          className="card-topic-area-left-content-collapse-item"
        >
          <Link
            target="_blank"
            to={`/board/${board.id}`}
            style={{ fontSize: "14px" }}
          >
            · {board.name.replace("（", "(").replace("）", ")")}
          </Link>
        </div>
      ))}
    </div>
  );
};

const renderBoardPanel = (data: any) => (
  <Panel
    header={<div style={{ color: "black" }}>{data.name}</div>}
    key={data.order}
    className="card-topic-area-left-content-collapse"
  >
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingLeft: data.order <= 7 ? "25px" : "0px",
      }}
    >
      {renderBoardPanelContent(data.boards)}
    </div>
  </Panel>
);

const registerScrollListener = () => {
  const direction = {
    down: "down",
    up: "up",
  };
  let translateY = 0;
  let beforeScrollTop = 0;
  const side = document.querySelector<HTMLElement>(
    ".card-topic-area-left-content"
  );

  const handleScroll = () => {
    const scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;
    const clientHeight =
      document.documentElement.clientHeight || document.body.clientHeight;
    const currentDirection =
      beforeScrollTop > scrollTop ? direction.up : direction.down;

    if (!side) {
      return;
    }
    if (side.offsetHeight < clientHeight) {
      side.style.transform = "none";
      return;
    }

    const isSticky = side.classList.toggle("sticky", scrollTop > 161.2);
    if (isSticky) {
      switch (currentDirection) {
        case direction.down:
          translateY -= scrollTop - beforeScrollTop;
          if (translateY < -(side.offsetHeight - clientHeight + 40)) {
            translateY = -(side.offsetHeight - clientHeight + 40);
          }
          break;
        case direction.up:
          translateY += beforeScrollTop - scrollTop;
          if (translateY > 0) {
            translateY = 0;
          }
          break;
        default:
          break;
      }
      side.style.transform = `translateY(${translateY}px)`;
    } else {
      translateY = 0;
      side.style.transform = "none";
    }
    beforeScrollTop = scrollTop;
  };

  // 旧实现没有移除此监听；本批只记录，不改变该行为。
  window.addEventListener("scroll", handleScroll);
};

/**
 * 新帖卡片模式左侧的版面列表。
 */
export function NewTopicsBoardSidebar() {
  const [data, setData] = useState<any>(blankData);

  useEffect(() => {
    const loadBoards = async () => {
      const boards = await getBoards();
      // 保留旧实现的 OR 空值判断，后续缺陷批次再处理。
      if (boards != undefined || boards != null) {
        setData(boards);
      }
      registerScrollListener();
    };

    void loadBoards();
  }, []);

  return (
    <div className="">
      <Collapse defaultActiveKey={["1"]} bordered={false}>
        {data.map((item: any) => renderBoardPanel(item))}
      </Collapse>
    </div>
  );
}
