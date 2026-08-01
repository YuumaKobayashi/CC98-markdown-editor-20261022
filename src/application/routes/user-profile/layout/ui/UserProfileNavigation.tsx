import * as React from "react";
import { Link } from "react-router";

import { useAppSelector } from "@application/store";
import { selectCurrentUser } from "@modules/session";
import { useUserProfileContext } from "../model/user-profile-context";
import styles from "../../../../layouts/user-area/UserArea.module.scss";

export function UserProfileNavigation() {
  const currentUser = useAppSelector(selectCurrentUser);
  const { page, userInfo } = useUserProfileContext();
  const visitingUserId = userInfo.id;
  const currentUserId = currentUser.id;

  return (
    <div className={styles["user-center-navigation"]} id="userCenterNavigation">
      <ul>
        <li>
          <Link
            to={`/user/id/${visitingUserId}`}
            className={
              page === "exact"
                ? `${styles["user-center-navigation-active"]} fa-home`
                : "fa-home"
            }
          >
            <span style={{ width: "0.5rem" }} />
            主页
          </Link>
        </li>
        <hr />
        {visitingUserId === currentUserId ? (
          <li>
            <Link to="/usercenter" className="fa-user-circle-o">
              <span style={{ width: "0.5rem" }} />
              个人中心
            </Link>
          </li>
        ) : null}
        <hr />
        {currentUser.privilege === "管理员" ? (
          <li>
            <Link
              to={`/user/id/${visitingUserId}/manage`}
              className={
                page === "manage"
                  ? `${styles["user-center-navigation-active"]} fa-cog`
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
