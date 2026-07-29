import * as React from "react";
import { useNavigate, useParams } from "react-router";

import { Actions, useAppDispatch } from "@application/store";
import { getUserInfo } from "@entities/user/api/get-user-info";
import type { UserInfo } from "@legacy/States/AppState";

import { DeleteRecentUserContent } from "./DeleteRecentUserContent";
import { UserPunishmentForm } from "./UserPunishmentForm";
import { UserRecentPostsManager } from "./UserRecentPostsManager";

const parseUserKey = (
  method: string | undefined,
  id: string | undefined
): number | string | null => {
  if (!id) return null;
  if (method === "name") return id;
  if (method !== "id" || !/^[1-9]\d*$/.test(id)) return null;

  const numericId = Number(id);
  return Number.isSafeInteger(numericId) ? numericId : null;
};

interface LoadedUser {
  requestKey: string;
  canonicalKey: string;
  userInfo: UserInfo;
}
//TODO: 调整组件逻辑
export function UserProfileManagePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { method, id } = useParams<{ method: string; id: string }>();
  const requestKey = `${method ?? ""}/${id ?? ""}`;
  const [loadedUser, setLoadedUser] = React.useState<LoadedUser | null>(null);
  const requestIdRef = React.useRef(0);

  React.useEffect(() => {
    if (
      loadedUser &&
      (loadedUser.requestKey === requestKey ||
        loadedUser.canonicalKey === requestKey)
    ) {
      return;
    }

    const userKey = parseUserKey(method, id);
    const currentRequestId = ++requestIdRef.current;

    if (userKey === null) {
      setLoadedUser(null);
      dispatch(Actions.userNotFound());
      return;
    }

    if (typeof userKey === "number") {
      dispatch(Actions.changeCurrentVisitingUserPage("manage", userKey));
    }

    const loadUser = async () => {
      let fetchedUser: UserInfo;
      if (typeof userKey === "number") {
        fetchedUser = await getUserInfo(userKey);
      } else {
        fetchedUser = await getUserInfo(userKey);
      }
      if (currentRequestId !== requestIdRef.current) return;

      if (!fetchedUser) {
        setLoadedUser(null);
        dispatch(Actions.userNotFound());
        return;
      }

      const canonicalKey = `id/${fetchedUser.id}`;
      dispatch(
        Actions.changeCurrentVisitingUserPage("manage", fetchedUser.id)
      );
      setLoadedUser({
        requestKey,
        canonicalKey,
        userInfo: fetchedUser,
      });

      if (requestKey !== canonicalKey) {
        void navigate(`/user/id/${fetchedUser.id}/manage`, {
          replace: true,
        });
      }
    };

    void loadUser();
  }, [dispatch, id, loadedUser, method, navigate, requestKey]);

  const isCurrentUser =
    loadedUser &&
    (loadedUser.requestKey === requestKey ||
      loadedUser.canonicalKey === requestKey);

  if (!isCurrentUser) {
    return (
      <div className="user-center-loading">
        <p className="fa fa-spinner fa-pulse fa-2x fa-fw" />
      </div>
    );
  }

  const { userInfo } = loadedUser;
  return (
    <div className="user-manage" key={userInfo.id}>
      <div className="user-manage-infos">
        <h2>用户信息</h2>
        <div className="user-manage-info">
          <p>id:{userInfo.id}</p>
          <p>name: {userInfo.name}</p>
        </div>
      </div>
      <UserPunishmentForm id={userInfo.id} />
      <DeleteRecentUserContent id={userInfo.id} />
      <UserRecentPostsManager id={userInfo.id} />
    </div>
  );
}
