// A '.tsx' file enables JSX support in the TypeScript compiler,
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import * as React from "react";

import { UserActivitySection } from "@application/layouts/user-area";
import { UserRecentTopicsActivityList } from "./UserRecentTopicsActivityList";

/**
 * 用户中心主页近期动态组件
 */
export function UserRecentActivities() {
  return (
    <UserActivitySection title="发表的主题">
      <UserRecentTopicsActivityList />
    </UserActivitySection>
  );
}

export default UserRecentActivities;
