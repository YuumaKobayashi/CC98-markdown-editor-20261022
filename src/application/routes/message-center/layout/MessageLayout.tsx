import * as React from "react";
import { NavLink, Outlet, useLocation } from "react-router";

import { useAppSelector } from "@application/store";
import { readAll, selectUnreadCount } from "@modules/notification";
import { DocumentTitle } from "@foundation/ui/document-title";
import styles from "./MessageLayout.module.scss";
import { parseReadAllNotificationSection } from "../notifications/model/route";

type MessageSection = "response" | "attme" | "system" | "message" | "setting";

const getActiveSection = (pathname: string): MessageSection => {
  if (pathname === "/message" || pathname.startsWith("/message/response")) {
    return "response";
  }
  if (pathname.startsWith("/message/attme")) return "attme";
  if (pathname.startsWith("/message/system")) return "system";
  if (pathname.startsWith("/message/message")) return "message";
  return "setting";
};

export function MessageLayout() {
  const { pathname } = useLocation();
  const unreadCount = useAppSelector(selectUnreadCount);
  const activeSection = getActiveSection(pathname);

  const getNavClassName = (section: MessageSection) =>
    activeSection === section ? styles.navActive : undefined;
  const handleReadAll = () => {
    void readAll(parseReadAllNotificationSection(pathname));
  };

  return (
    <div className={styles["message-root"]}>
      <DocumentTitle title="CC98论坛-我的消息" />
      <div className={styles.message}>
        <div className={styles.readAllMessage}>
          <button className={styles["message-message-wPostBtn"]} onClick={handleReadAll}>
            全部标为已读
          </button>
        </div>
        <div className={styles["message-title"]}>我的消息</div>
        <div className={styles["message-content"]}>
          <div className={styles["message-nav"]}>
            <NavLink to="/message/response" className={getNavClassName("response")}>
              <div id="response" className={styles["nav-div"]}>
                回复我的
                <div
                  className={styles["message-counterNav"]}
                  id="unreadCount-replyCount1"
                  hidden={!unreadCount.replyCount}
                >
                  {unreadCount.replyCount}
                </div>
              </div>
            </NavLink>
            <hr />
            <NavLink to="/message/attme" className={getNavClassName("attme")}>
              <div id="attme" className={styles["nav-div"]}>
                @ 我的
                <div
                  className={styles["message-counterNav"]}
                  id="unreadCount-atCount1"
                  hidden={!unreadCount.atCount}
                >
                  {unreadCount.atCount}
                </div>
              </div>
            </NavLink>
            <hr />
            <NavLink to="/message/system" className={getNavClassName("system")}>
              <div id="system" className={styles["nav-div"]}>
                系统通知
                <div
                  className={styles["message-counterNav"]}
                  id="unreadCount-systemCount1"
                  hidden={!unreadCount.systemCount}
                >
                  {unreadCount.systemCount}
                </div>
              </div>
            </NavLink>
            <hr />
            <NavLink to="/message/message" className={getNavClassName("message")}>
              <div id="message" className={styles["nav-div"]}>
                我的私信
                <div
                  className={styles["message-counterNav"]}
                  id="unreadCount-messageCount1"
                  hidden={!unreadCount.messageCount}
                >
                  {unreadCount.messageCount}
                </div>
              </div>
            </NavLink>
            <hr />
            <NavLink to="/message/setting" className={getNavClassName("setting")}>
              <div id="setting" className={styles["nav-div"]}>
                消息设置
              </div>
            </NavLink>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
