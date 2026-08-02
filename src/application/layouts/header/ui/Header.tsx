import * as React from "react";
import { Link, useLocation } from "react-router";

import { Search } from "./Search";
import { UserMenu } from "./UserMenu";
import styles from "./Header.module.scss";

export { Search, SearchBeforeConnent } from "./Search";

//TODO: 这个文件需要大规模重写。

export function Header() {
  const { pathname } = useLocation();
  const isMainPage = pathname === "/";

  return (
    <div
      className={`${styles.headerShell} ${
        isMainPage ? styles.headerShellMainPage : styles.headerShellNormal
      }`}
    >
      <div className={isMainPage ? styles.header : styles.headerWithoutImage} />
      <div className={isMainPage ? styles.topBarMainPage : styles.topBar}>
        <div className={styles.topBarRow}>
          <div
            className="cc98-row"
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <div className={styles.topBarLogo}>
              <Link to="/">
                <img src="/static/images/98LOGO.ico" />
              </Link>
            </div>
            <div className={styles.topBarCC98}>
              <Link to="/">CC98论坛</Link>
            </div>
            <div className={styles.topBarText}>|</div>
            <div className={styles.topBarText}>
              <Link to="/boardList">版面列表</Link>
            </div>
            <div className={styles.topBarText}>
              <Link to="/newTopics">新帖</Link>
            </div>
            <div className={styles.topBarText}>
              <Link to="/focus">关注</Link>
            </div>
            <div className={styles.topBarText}>
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
