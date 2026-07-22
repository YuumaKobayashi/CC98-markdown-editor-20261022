import * as React from "react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";

import { getSearchBoard } from "@entities/board/api/service";
import { FocusBoard } from "@legacy/Props/FocusBoard";
import { DocumentTitle } from "@shared/ui/document-title";

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
    <div className="focus-root">
      <DocumentTitle title="搜索结果 - CC98论坛" />
      <div className="focus">
        <BoardSearchBreadcrumb />
        <div className="focus-board-area">
          {data.map((item) => (
            <a key={item.id} href={`/board/${item.id}`} target="_blank">
              <div className="focus-board">{item.name}</div>
            </a>
          ))}
        </div>
      </div>
      <div id="noResultBoard" className={`noResult${showNoResult ? "" : " displaynone"}`}>
        <img src="/static/images/searchNone.png" className="noResultPic" />
        <div className="noResultText">
          -----------------------抱歉呢前辈，没有找到你想要的版面哦~----------------------
        </div>
      </div>
    </div>
  );
}

export function BoardSearchBreadcrumb() {
  return (
    <div className="row" style={{ alignItems: "baseline", justifyContent: "flex-start", color: "grey", fontSize: "0.75rem", marginBottom: "1rem" }}>
      <Link style={{ color: "grey", fontSize: "1rem", marginRight: "0.5rem" }} to="/">首页</Link>
      <i className="fa fa-chevron-right"></i>
      <Link style={{ color: "grey", fontSize: "1rem", marginLeft: "0.5rem", marginRight: "0.5rem" }} to="/boardList">版面列表</Link>
      <i className="fa fa-chevron-right"></i>
      <div style={{ color: "grey", fontSize: "1rem", marginLeft: "0.5rem", marginRight: "0.5rem" }}>搜索版面</div>
    </div>
  );
}
