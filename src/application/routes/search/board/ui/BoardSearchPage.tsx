import * as React from "react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";

import { getSearchBoard } from "@modules/board/api/service";
import type { FocusBoard } from "@modules/board/model/types";
import { CollectionPageShell } from "@application/layouts/collection";

import styles from "./BoardSearchPage.module.scss";

const parseBoardSearch = (search: string) => {
  const match = search.match(/^\?keyword=(.*)$/);
  if (!match) return null;
  try {
    return decodeURI(decodeURI(match[1]));
  } catch {
    return null;
  }
};

/** 表示搜索到的版面列表区域。 */
export function BoardSearchPage() {
  const location = useLocation();
  const [data, setData] = useState<FocusBoard[]>([]);
  const [showNoResult, setShowNoResult] = useState(false);

  useEffect(() => {
    const keyword = parseBoardSearch(location.search);
    setData([]);
    if (keyword === null) {
      setShowNoResult(true);
      return;
    }

    setShowNoResult(false);
    const load = async () => {
      const result = await getSearchBoard(keyword);
      setData(result ?? []);
      setShowNoResult(!result?.length);
    };
    void load();
  }, [location.search]);

  return (
    <CollectionPageShell
      documentTitle="搜索结果 - CC98论坛"
      afterContent={
        <div
          id="noResultBoard"
          className={styles.noResult}
          hidden={!showNoResult}
        >
          <img src="/static/images/searchNone.png" className={styles.noResultPic} />
          <div className={styles.noResultText}>
            -----------------------抱歉呢前辈，没有找到你想要的版面哦~----------------------
          </div>
        </div>
      }
    >
      <BoardSearchBreadcrumb />
      <div className={styles["focus-board-area"]}>
        {data.map((item) => (
          <a key={item.id} href={`/board/${item.id}`} target="_blank">
            <div className={styles["focus-board"]}>{item.name}</div>
          </a>
        ))}
      </div>
    </CollectionPageShell>
  );
}

export function BoardSearchBreadcrumb() {
  return (
    <div className={styles.breadcrumb}>
      <Link
        className={[styles.breadcrumbItem, styles.breadcrumbHome].join(" ")}
        to="/"
      >
        首页
      </Link>
      <i className="fa fa-chevron-right"></i>
      <Link
        className={[styles.breadcrumbItem, styles.breadcrumbSpaced].join(" ")}
        to="/boardList"
      >
        版面列表
      </Link>
      <i className="fa fa-chevron-right"></i>
      <div
        className={[styles.breadcrumbItem, styles.breadcrumbSpaced].join(" ")}
      >
        搜索版面
      </div>
    </div>
  );
}
