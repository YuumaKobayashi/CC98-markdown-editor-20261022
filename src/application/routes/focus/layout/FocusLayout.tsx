// A '.tsx' file enables JSX support in the TypeScript compiler,
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import * as React from "react";
import { Link, Outlet, useLocation } from "react-router";

import { CollectionPageShell } from "@application/layouts/collection";

import focusStyles from "./FocusLayout.module.scss";

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
    <CollectionPageShell documentTitle="我的关注 - CC98论坛">
      <div className={focusStyles["focus-nav"]}>
        <Link style={{ textDecoration: "none" }} to="/focus/board">
          <div
            className={`${focusStyles["focus-title"]}${
              activeSection === "board" ? ` ${focusStyles["focus-title-hover"]}` : ""
            }`}
            id="myFocusBoard"
          >
            关注版面
          </div>
        </Link>
        <Link style={{ textDecoration: "none" }} to="/focus/user">
          <div
            className={`${focusStyles["focus-title"]}${
              activeSection === "user" ? ` ${focusStyles["focus-title-hover"]}` : ""
            }`}
            id="myFocusUser"
          >
            关注用户
          </div>
        </Link>
        <Link style={{ textDecoration: "none" }} to="/focus/favorite">
          <div
            className={`${focusStyles["focus-title"]}${
              activeSection === "favorite" ? ` ${focusStyles["focus-title-hover"]}` : ""
            }`}
            id="myFocusFavorite"
          >
            收藏更新
          </div>
        </Link>
      </div>
      <Outlet />
    </CollectionPageShell>
  );
}

export default FocusLayout;
