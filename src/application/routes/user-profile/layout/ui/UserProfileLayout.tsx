import * as React from "react";
import { Outlet, useParams } from "react-router";

import { Actions, useAppDispatch, useAppSelector } from "@application/store";
import { NotFoundUser } from "@legacy/Components/Status";
import { UserProfileNavigation } from "./UserProfileNavigation";

export function UserProfileLayout() {
  const dispatch = useAppDispatch();
  const { method, id } = useParams<{ method: string; id: string }>();
  const userExists = useAppSelector(
    (state) => state.userInfo.currentVisitingUserIsExisted
  );

  React.useEffect(() => {
    dispatch(Actions.userLookupStarted());
  }, [dispatch, id, method]);

  const hasValidRoute =
    !!id &&
    (method === "name" ||
      (method === "id" &&
        /^[1-9]\d*$/.test(id) &&
        Number.isSafeInteger(Number(id))));

  if (!hasValidRoute) {
    return <NotFoundUser />;
  }

  if (!userExists) {
    return <NotFoundUser />;
  }

  return (
    <div className="user-center">
      <div className="user-center-content">
        <div className="user-center-head">
          <p>用户详情</p>
        </div>
        <div className="user-center-body">
          <UserProfileNavigation />
          <div className="user-center-router">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
