import * as React from "react";
import { Link } from "react-router";

import { useAppSelector } from "@application/store";

export function UserProfileNavigation() {
  const currentUserPrivilege = useAppSelector(
    (state) => state.userInfo.currentUserInfo.privilege
  );
  const currentVisitingUserPage = useAppSelector(
    (state) => state.userInfo.currentVisitingUserPage
  );
  const currentVisitingUserId = useAppSelector(
    (state) => state.userInfo.currentVisitingUserId
  );
  const currentUserId = useAppSelector(
    (state) => state.userInfo.currentUserInfo.id
  );

  return (
    <div className="user-center-navigation" id="userCenterNavigation">
      <ul>
        <li>
          <Link
            to={`/user/id/${currentVisitingUserId}`}
            className={
              currentVisitingUserPage === "exact"
                ? "user-center-navigation-active fa-home"
                : "fa-home"
            }
          >
            <span style={{ width: "0.5rem" }} />
            主页
          </Link>
        </li>
        <hr />
        {currentVisitingUserId === currentUserId ? (
          <li>
            <Link to="/usercenter" className="fa-user-circle-o">
              <span style={{ width: "0.5rem" }} />
              个人中心
            </Link>
          </li>
        ) : null}
        <hr />
        {currentUserPrivilege === "管理员" ? (
          <li>
            <Link
              to={`/user/id/${currentVisitingUserId}/manage`}
              className={
                currentVisitingUserPage === "manage"
                  ? "user-center-navigation-active fa-cog"
                  : "fa-cog"
              }
            >
              <span style={{ width: "0.5rem" }} />
              管理
            </Link>
          </li>
        ) : null}
      </ul>
    </div>
  );
}
