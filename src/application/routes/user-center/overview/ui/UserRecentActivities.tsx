// A '.tsx' file enables JSX support in the TypeScript compiler,
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import * as React from "react";

import { UserRecentTopicsActivityList } from "./UserRecentTopicsActivityList";
import styles from "../../UserCenter.module.scss";

/**
 * 用户中心主页近期动态组件
 */
export function UserRecentActivities() {
  return (
    <div className={styles["user-activities"]}>
      <p>发表的主题</p>
      <UserRecentTopicsActivityList />
    </div>
  );
}

export default UserRecentActivities;
