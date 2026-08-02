import * as React from "react";
import { useLocation, useNavigate } from "react-router";

import { getTopicInfo } from "@modules/topic";
import { getUserInfo } from "@modules/user";

import styles from "./Search.module.scss";

type SearchType = "主题" | "全站" | "版内" | "用户" | "版面";

export function SearchBeforeConnent() {
  const location = useLocation();
  const navigate = useNavigate();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const topicMatch = location.pathname.match(/^\/topic\/(\d+)/);
  const boardMatch = location.pathname.match(/^\/board\/(\d+)/);
  const searchBoardId = new URLSearchParams(location.search).get("boardId");
  const parsedSearchBoardId =
    searchBoardId && /^\d+$/.test(searchBoardId)
      ? Number.parseInt(searchBoardId, 10)
      : null;
  const isBoardContext = Boolean(
    topicMatch ||
      boardMatch ||
      (location.pathname === "/search" &&
        parsedSearchBoardId !== null &&
        parsedSearchBoardId !== 0)
  );
  const [searchType, setSearchType] = React.useState<SearchType>(
    isBoardContext ? "版内" : "主题"
  );
  const [query, setQuery] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const [hoveredType, setHoveredType] = React.useState<SearchType | null>(null);

  React.useEffect(() => {
    setSearchType(isBoardContext ? "版内" : "主题");
  }, [isBoardContext]);

  React.useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  }, []);

  const handleSearch = async () => {
    if (!query) return;

    if (searchType === "主题" || searchType === "全站") {
      void navigate(
        `/search?boardId=0&keyword=${encodeURI(encodeURI(query))}`
      );
      return;
    }

    if (searchType === "版内") {
      let boardId = 0;
      if (topicMatch) {
        const topic = await getTopicInfo(topicMatch[1]);
        boardId = topic.boardId;
      } else if (boardMatch) {
        boardId = Number.parseInt(boardMatch[1], 10);
      } else if (parsedSearchBoardId !== null) {
        boardId = parsedSearchBoardId;
      }
      void navigate(
        `/search?boardId=${boardId}&keyword=${encodeURI(encodeURI(query))}`
      );
      return;
    }

    if (searchType === "用户") {
      const user = await getUserInfo(query);
      void navigate(user ? `/user/id/${user.id}` : "/search");
      return;
    }

    void navigate(`/searchBoard?keyword=${encodeURI(encodeURI(query))}`);
  };

  const options: SearchType[] = isBoardContext
    ? ["版内", "全站", "用户", "版面"]
    : ["主题", "用户", "版面"];

  return (
    <div id="search" className={styles.search} ref={rootRef}>
      <div className={styles.box}>
        <div
          className={styles.searchBoxSelect}
          onClick={() => setIsOpen((open) => !open)}
        >
          {searchType}
        </div>
        <div
          className={styles.caretDown}
          onClick={() => setIsOpen((open) => !open)}
        >
          <i className="fa fa-caret-down" />
        </div>
        <input
          id="searchText"
          type="text"
          placeholder="请输入搜索内容"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") void handleSearch();
          }}
        />
        <div className={styles.searchIco} onClick={() => void handleSearch()}>
          <i className="fa fa-search" />
        </div>
      </div>
      <ul
        className={styles.searchBoxSub}
        style={{ display: isOpen ? "block" : "none" }}
      >
        {options.map((option) => (
          <li
            className={hoveredType === option ? "hover" : ""}
            key={option}
            onClick={() => {
              setSearchType(option);
              setIsOpen(false);
            }}
            onMouseEnter={() => setHoveredType(option)}
            onMouseLeave={() => setHoveredType(null)}
          >
            {option}
          </li>
        ))}
        {!isBoardContext ? <li style={{ display: "none" }} /> : null}
      </ul>
    </div>
  );
}

export const Search = SearchBeforeConnent;
