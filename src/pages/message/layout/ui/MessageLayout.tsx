import * as React from "react";
import { NavLink, Outlet, useLocation } from "react-router";

import { useAppSelector } from "@app/store";
import { readAll } from "@features/message/api/service";
import { DocumentTitle } from "@shared/ui/document-title";

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
  const unreadCount = useAppSelector((state) => state.message);
  const activeSection = getActiveSection(pathname);

  const getNavClassName = (section: MessageSection) =>
    `nav-div${activeSection === section ? " message-nav-focus" : ""}`;
  const getCounterClassName = (count: number | undefined) =>
    `message-counterNav${count ? "" : " displaynone"}`;
  const handleReadAll = () => {
    void readAll();
  };

  return (
    <div className="message-root">
      <DocumentTitle title="CC98论坛-我的消息" />
      <div className="message">
        <div className="readAllMessage">
          <button className="message-message-wPostBtn" onClick={handleReadAll}>
            全部标为已读
          </button>
        </div>
        <div className="message-title">我的消息</div>
        <div className="message-content">
          <div className="message-nav">
            <NavLink to="/message/response">
              <div id="response" className={getNavClassName("response")}>
                回复我的
                <div
                  className={getCounterClassName(unreadCount.replyCount)}
                  id="unreadCount-replyCount1"
                >
                  {unreadCount.replyCount}
                </div>
              </div>
            </NavLink>
            <hr />
            <NavLink to="/message/attme">
              <div id="attme" className={getNavClassName("attme")}>
                @ 我的
                <div
                  className={getCounterClassName(unreadCount.atCount)}
                  id="unreadCount-atCount1"
                >
                  {unreadCount.atCount}
                </div>
              </div>
            </NavLink>
            <hr />
            <NavLink to="/message/system">
              <div id="system" className={getNavClassName("system")}>
                系统通知
                <div
                  className={getCounterClassName(unreadCount.systemCount)}
                  id="unreadCount-systemCount1"
                >
                  {unreadCount.systemCount}
                </div>
              </div>
            </NavLink>
            <hr />
            <NavLink to="/message/message">
              <div id="message" className={getNavClassName("message")}>
                我的私信
                <div
                  className={getCounterClassName(unreadCount.messageCount)}
                  id="unreadCount-messageCount1"
                >
                  {unreadCount.messageCount}
                </div>
              </div>
            </NavLink>
            <hr />
            <NavLink to="/message/setting">
              <div id="setting" className={getNavClassName("setting")}>
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
