import * as React from "react";
import { Link } from "react-router";

import { Pager } from "@foundation/ui/pagination";

import styles from "./BoardTagPagination.module.scss";

interface BoardTag {
  id: number;
  name: string;
}

interface BoardTagGroup {
  tags: BoardTag[];
}

interface BoardTagPaginationProps {
  url: string;
  boardid: number;
  page: number;
  totalPage: number;
  tag: BoardTagGroup[];
}

/**
 * 提供显示连续页码的交互效果。
 */
export function BoardTagPagination({
  url,
  boardid,
  page,
  totalPage,
  tag,
}: BoardTagPaginationProps) {
  const renderTagButton = (item: BoardTag, level: 1 | 2) => (
    <div key={item.id}>
      <Link to={`/board/${boardid}/tag/tag${level}/${item.id}`}>
        <button className={styles.chooseTag}>
          {item.name}
          <span className={styles.tagNumber} />
        </button>
      </Link>
    </div>
  );

  const renderTagGroup = (group: BoardTagGroup, level: 1 | 2) => (
    <div
      style={{
        maxWidth: "35rem",
        lineHeight: "3rem",
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        width: "100%",
        marginLeft: "0.3125rem",
        marginRight: "0.3125rem",
        borderTop: "dashed #EAEAEA thin",
        marginBottom: "0.5rem",
      }}
    >
      <div
        className="row"
        style={{ display: "flex", flexWrap: "wrap", maxWidth: "35rem" }}
      >
        <div>
          <button className={styles.chooseTag}>
            <Link to={`/board/${boardid}`}>全部</Link>
          </button>
        </div>
        {group.tags.map((item) => renderTagButton(item, level))}
      </div>
    </div>
  );

  const tag1Buttons =
    tag && tag.length >= 1 ? renderTagGroup(tag[0], 1) : null;
  const tag2Buttons =
    tag && tag.length === 2 ? renderTagGroup(tag[1], 2) : null;

  return (
    <div
      className="row"
      style={{
        width: "100%",
        marginLeft: "0.3125rem",
        marginRight: "0.3125rem",
        marginTop: "0.9375rem",
        marginBottom: "1rem",
        justifyContent: "space-between",
        alignItems: "flex-end",
      }}
    >
      <div>
        {tag1Buttons}
        {tag2Buttons}
      </div>
      <Pager page={page} url={url} totalPage={totalPage} />
    </div>
  );
}
