import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import * as React from "react";
import { Link, useLocation } from "react-router";

import { useAppDispatch, useAppSelector } from "@application/store";
import {
  refreshUnreadCount,
  selectUnreadCount,
} from "@modules/notification";
import { hasSignedInToday } from "@modules/daily-signin";
import {
  setShowCardUser,
  useShowCardUser,
} from "@modules/user-preference";
import {
  logOut,
  refreshCurrentUserInfo,
  selectCurrentUser,
  selectIsLogOn,
} from "@modules/session";
import {
  getLocalStorage,
  setLocalStorage,
} from "@foundation/storage/web-storage";

export function UserMenu() {
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
      void dispatch(refreshCurrentUserInfo());
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
    hasSignedInToday(userInfo.id)
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
