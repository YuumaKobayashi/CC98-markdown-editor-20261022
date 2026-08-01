import * as React from "react";
import { Link, useLocation } from "react-router";

import { Search } from "./Search";
import { UserMenu } from "./UserMenu";

export { Search, SearchBeforeConnent } from "./Search";

//TODO: 这个文件需要大规模重写。

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
