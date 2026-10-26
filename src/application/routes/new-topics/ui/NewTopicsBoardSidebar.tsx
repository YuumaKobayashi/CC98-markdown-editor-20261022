import * as React from "react";
import { useEffect, useState } from "react";
import { Accordion, type AccordionItem } from "@foundation/ui/accordion";
import { Link } from "react-router";

import { getBoards } from "@modules/board/api/service";

import styles from "./NewTopicsBoardSidebar.module.scss";

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
    <div className={styles.boardList}>
      {boards.map((board, index) => (
        <div
          key={index}
          className={[
            styles["card-topic-area-left-content-collapse-item"],
            wrapList[index] ? styles.boardItemWide : styles.boardItemHalf,
          ].join(" ")}
        >
          <Link
            target="_blank"
            to={`/board/${board.id}`}
            className={styles.boardLink}
          >
            · {board.name.replace("（", "(").replace("）", ")")}
          </Link>
        </div>
      ))}
    </div>
  );
};

const renderBoardPanel = (data: any): AccordionItem => ({
  id: `${data.order}`,
  heading: <div className={styles.panelHeading}>{data.name}</div>,
  className: styles["card-topic-area-left-content-collapse"],
  contentClassName: styles.sidebarPanelContent,
  content: (
    <div
      className={[
        styles.panelBody,
        data.order <= 7 ? styles.panelBodyIndented : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {renderBoardPanelContent(data.boards)}
    </div>
  ),
});

const registerScrollListener = () => {
  const direction = {
    down: "down",
    up: "up",
  };
  let translateY = 0;
  let beforeScrollTop = 0;
  const side = document.querySelector<HTMLElement>(
    "[data-new-topics-board-sidebar]"
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
      side.style.setProperty("--new-topics-sidebar-transform", "none");
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
      side.style.setProperty(
        "--new-topics-sidebar-transform",
        `translateY(${translateY}px)`
      );
    } else {
      translateY = 0;
      side.style.setProperty("--new-topics-sidebar-transform", "none");
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
    <Accordion
      defaultExpandedIds={["1"]}
      bordered={false}
      items={data.map((item: any) => renderBoardPanel(item))}
    />
  );
}
