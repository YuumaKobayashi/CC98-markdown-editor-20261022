// A '.tsx' file enables JSX support in the TypeScript compiler,
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import * as React from "react";
import { Link, Outlet, useLocation } from "react-router";

import DocumentTitle from "@foundation/ui/document-title";

type FocusSection = "board" | "user" | "favorite" | null;

const getFocusSection = (pathname: string): FocusSection => {
  if (pathname === "/focus/user" || pathname.startsWith("/focus/user/")) {
    return "user";
  }
  if (
    pathname === "/focus/favorite" ||
    pathname.startsWith("/focus/favorite/")
  ) {
    return "favorite";
  }
  if (
    pathname === "/focus" ||
    pathname === "/focus/" ||
    pathname === "/focus/board" ||
    pathname.startsWith("/focus/board/")
  ) {
    return "board";
  }
  return null;
};

export function FocusLayout() {
  const { pathname } = useLocation();
  const activeSection = getFocusSection(pathname);

  /**
   * 从上往下分别为：页面标题(关注版面或者关注用户)、关注版面列表区域、主题列表区域，分别用三个组件表示
   */
  return (
    <div className="focus-root">
      <DocumentTitle title="我的关注 - CC98论坛" />
      <div className="focus">
        <div className="focus-nav">
          <Link style={{ textDecoration: "none" }} to="/focus/board">
            <div
              className={`focus-title${
                activeSection === "board" ? " focus-title-hover" : ""
              }`}
              id="myFocusBoard"
            >
              关注版面
            </div>
          </Link>
          <Link style={{ textDecoration: "none" }} to="/focus/user">
            <div
              className={`focus-title${
                activeSection === "user" ? " focus-title-hover" : ""
              }`}
              id="myFocusUser"
            >
              关注用户
            </div>
          </Link>
          <Link style={{ textDecoration: "none" }} to="/focus/favorite">
            <div
              className={`focus-title${
                activeSection === "favorite" ? " focus-title-hover" : ""
              }`}
              id="myFocusFavorite"
            >
              收藏更新
            </div>
          </Link>
        </div>
        <Outlet />
      </div>
    </div>
  );
}

export default FocusLayout;
