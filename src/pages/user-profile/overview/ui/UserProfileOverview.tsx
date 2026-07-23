import * as React from "react";
import { useNavigate, useParams } from "react-router";

import { Actions, useAppDispatch } from "@app/store";
import { getUserInfo } from "@entities/user/api/get-user-info";
import type { UserInfo } from "@legacy/States/AppState";
import { UserProfileAvatar } from "@entities/user/profile-avatar";
import DocumentTitle from "@shared/ui/document-title";
import { UserProfileDetails } from "./UserProfileDetails";
import { UserRecentTopics } from "./UserRecentTopics";

type LoadedUser = {
  requestKey: string;
  canonicalKey: string;
  userInfo: UserInfo;
};

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

export function UserProfileOverview() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { method, id } = useParams<{ method: string; id: string }>();
  const requestKey = `${method ?? ""}/${id ?? ""}`;
  const requestIdRef = React.useRef(0);
  const [loadedUser, setLoadedUser] = React.useState<LoadedUser | null>(null);

  React.useEffect(() => {
    if (
      loadedUser &&
      (loadedUser.requestKey === requestKey ||
        loadedUser.canonicalKey === requestKey)
    ) {
      return;
    }

    const currentRequestId = ++requestIdRef.current;
    const userKey = parseUserKey(method, id);

    if (userKey === null) {
      setLoadedUser(null);
      dispatch(Actions.userNotFound());
      return;
    }

    const loadUser = async () => {
      const userInfo =
        typeof userKey === "number"
          ? await getUserInfo(userKey)
          : await getUserInfo(userKey);
      if (currentRequestId !== requestIdRef.current) return;
      if (!userInfo) {
        setLoadedUser(null);
        dispatch(Actions.userNotFound());
        return;
      }

      const canonicalKey = `id/${userInfo.id}`;
      setLoadedUser({ requestKey, canonicalKey, userInfo });
      dispatch(Actions.changeCurrentVisitingUserPage("exact", userInfo.id));

      if (requestKey !== canonicalKey) {
        void navigate(`/user/id/${userInfo.id}`, { replace: true });
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
    <div className="user-center-exact" key={userInfo.id}>
      <DocumentTitle title={`${userInfo.name} - 用户详情 - CC98论坛`} />
      <UserProfileAvatar userInfo={userInfo} />
      <UserProfileDetails userInfo={userInfo} />
      <UserRecentTopics id={userInfo.id} />
    </div>
  );
}
