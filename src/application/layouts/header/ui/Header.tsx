import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import * as React from "react";
import { Link, useLocation, useNavigate } from "react-router";

import { useAppDispatch, useAppSelector } from "@application/store";
import {
  refreshUnreadCount,
  selectUnreadCount,
} from "@modules/notification";
import { getTopicInfo } from "@modules/topic";
import { getUserInfo } from "@modules/user";
import {
  setShowCardUser,
  useShowCardUser,
} from "@modules/user-preference";
import {
  logOut,
  selectCurrentUser,
  selectIsLogOn,
} from "@modules/session";
import { refreshCurrentUserInfo } from "@legacy/AsyncActions/UserCenter";
import {
  getLocalStorage,
  setLocalStorage,
} from "@foundation/storage/web-storage";

type SearchType = "主题" | "全站" | "版内" | "用户" | "版面";

//TODO: 这个文件需要大规模重写。

function UserMenu() {
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
  const isLoggedOn = useAppSelector(selectIsLogOn);
  const userInfo = useAppSelector(selectCurrentUser);
  const messageCount = useAppSelector(selectUnreadCount);
  const showCardUser = useShowCardUser();
  const [hoverElement, setHoverElement] = React.useState<string | null>(null);

  const logOff = React.useCallback(() => {
    setHoverElement(null);
    dispatch(logOut());
    window.location.href = "/";
  }, [dispatch]);

  React.useEffect(() => {
    if (isLoggedOn) {
      void dispatch(refreshUnreadCount());
    }

    if (isLoggedOn && !getLocalStorage("shouldNotRefreshUserInfo")) {
      void dispatch(refreshCurrentUserInfo() as any);
      setLocalStorage("shouldNotRefreshUserInfo", true, 86400);
    }
  }, [dispatch]);

  if (!isLoggedOn) {
    return (
      <div className="topBarUserInfo">
        <div className="topBarText">
          {" "}
          <Link
            onClick={() => {
              localStorage.setItem("logOnRedirectUrl", window.location.href);
            }}
            to="/logOn"
          >
            登录
          </Link>
        </div>
        <div className="topBarText">
          <a href="https://account.cc98.org/">注册</a>
        </div>
      </div>
    );
  }

  const totalCount =
    messageCount.atCount +
    messageCount.messageCount +
    messageCount.replyCount +
    messageCount.systemCount;
  const dropdownStyle = {
    display: "block",
    transitionDuration: ".2s",
    height: "0px",
  };
  const userCenterClassName =
    pathname === "/" ? "topBarUserCenter-mainPage" : "topBarUserCenter";
  const messageClassName =
    pathname === "/" ? "topBarMessageDetails-mainPage" : "topBarMessageDetails";
  const signinInfo =
    userInfo &&
    getLocalStorage(`signin_${userInfo.id}`)
      ? "已签到"
      : "签到";

  const handleMouseEvent = (type: string, target: string) => {
    setHoverElement(type === "mouseover" ? target : null);
  };

  const handleVisibilityChange = (visible: boolean) => {
    setShowCardUser(visible);
  };

  return (
    <div className="topBarRight">
      <div className="topBarUserInfo">
        <div
          className="topBarMessage"
          id="userMessage"
          onMouseOut={(event) => handleMouseEvent(event.type, "message")}
          onMouseOver={(event) => handleMouseEvent(event.type, "message")}
        >
          <Link to="/message/response" className="messageTopBar">
            <div className="topBarBell">
              {" "}
              <i className="fa fa-bell-o" />
            </div>
            {totalCount ? (
              <div className="message-counter" id="unreadCount-totalCount">
                {totalCount}
              </div>
            ) : null}
          </Link>
        </div>
        <div
          className="topBarUserImg"
          onMouseOut={(event) => handleMouseEvent(event.type, "userName")}
          onMouseOver={(event) => handleMouseEvent(event.type, "userName")}
        >
          <img
            className={showCardUser ? "" : "topBarUserImgHide"}
            src={
              showCardUser
                ? userInfo.portraitUrl
                : "/static/images/_心灵之约.png"
            }
          />
          {showCardUser ? (
            <EyeInvisibleOutlined
              className="topBarUserHideIcon"
              onClick={() => handleVisibilityChange(false)}
            />
          ) : (
            <EyeOutlined
              className="topBarUserHideIcon"
              onClick={() => handleVisibilityChange(true)}
            />
          )}
        </div>
        <div
          className="topBarUserName"
          onMouseOut={(event) => handleMouseEvent(event.type, "userName")}
          onMouseOver={(event) => handleMouseEvent(event.type, "userName")}
        >
          {showCardUser ? userInfo.name : "隐私模式"}
        </div>
      </div>
      <div
        className={userCenterClassName}
        onMouseOut={(event) => handleMouseEvent(event.type, "userName")}
        onMouseOver={(event) => handleMouseEvent(event.type, "userName")}
        style={{
          ...dropdownStyle,
          overflow: "hidden",
          height: hoverElement === "userName" ? "8rem" : "0",
        }}
      >
        <ul style={{ display: "inherit" }}>
          <Link to="/usercenter">
            {" "}
            <li>个人中心</li>
          </Link>
          {userInfo.privilege === "管理员" ? (
            <Link to="/sitemanage" style={{ color: "#fff" }}>
              <li>全站管理</li>
            </Link>
          ) : null}
          <Link to="/signin">
            <li>{signinInfo}</li>
          </Link>
          <li onClick={logOff}>退出登录</li>
        </ul>
      </div>
      <div
        className={messageClassName}
        onMouseOut={(event) => handleMouseEvent(event.type, "message")}
        onMouseOver={(event) => handleMouseEvent(event.type, "message")}
        style={{
          ...dropdownStyle,
          overflow: "hidden",
          height: hoverElement === "message" ? "8rem" : "0",
        }}
      >
        <ul style={{ display: "inherit" }}>
          <Link to="/message/response">
            <li>
              回复我的
              {messageCount.replyCount ? (
                <div className="message-counterLi">
                  {messageCount.replyCount}
                </div>
              ) : null}
            </li>
          </Link>
          <Link to="/message/attme">
            <li>
              @ 我的
              {messageCount.atCount ? (
                <div className="message-counterLi">{messageCount.atCount}</div>
              ) : null}
            </li>
          </Link>
          <Link to="/message/system">
            <li>
              系统通知
              {messageCount.systemCount ? (
                <div className="message-counterLi">
                  {messageCount.systemCount}
                </div>
              ) : null}
            </li>
          </Link>
          <Link to="/message/message">
            <li>
              我的私信
              {messageCount.messageCount ? (
                <div className="message-counterLi">
                  {messageCount.messageCount}
                </div>
              ) : null}
            </li>
          </Link>
        </ul>
      </div>
    </div>
  );
}

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
    <div id="search" ref={rootRef}>
      <div className="box">
        <div
          className="searchBoxSelect"
          onClick={() => setIsOpen((open) => !open)}
        >
          {searchType}
        </div>
        <div
          className="caret-down"
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
        <div className="searchIco" onClick={() => void handleSearch()}>
          <i className="fa fa-search" />
        </div>
      </div>
      <ul
        className="searchBoxSub"
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

export function Header() {
  const { pathname } = useLocation();
  const isMainPage = pathname === "/";

  return (
    <div
      className={`headerShell ${
        isMainPage ? "headerShell-mainPage" : "headerShell-normal"
      }`}
    >
      <div className={isMainPage ? "header" : "headerWithoutImage"} />
      <div className={isMainPage ? "topBar-mainPage" : "topBar"}>
        <div className="topBarRow">
          <div
            className="row"
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <div className="topBarLogo">
              <Link to="/">
                <img src="/static/images/98LOGO.ico" />
              </Link>
            </div>
            <div className="topBarCC98">
              <Link to="/">CC98论坛</Link>
            </div>
            <div className="topBarText">|</div>
            <div className="topBarText">
              <Link to="/boardList">版面列表</Link>
            </div>
            <div className="topBarText">
              <Link to="/newTopics">新帖</Link>
            </div>
            <div className="topBarText">
              <Link to="/focus">关注</Link>
            </div>
            <div className="topBarText">
              <Link to="/recommendedTopics">精选</Link>
            </div>
            <Search />
          </div>
          <UserMenu />
        </div>
      </div>
    </div>
  );
}
