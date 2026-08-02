import * as React from "react";
import { Outlet, useMatch, useNavigate, useParams } from "react-router";

import {
  UserAreaLoading,
  UserAreaShell,
} from "@application/layouts/user-area";
import { NotFoundUser } from "@application/routes/status";
import { getUserInfo } from "@modules/user";
import type { UserInfo } from "@modules/user";
import { UserProfileProvider } from "./model/user-profile-context";
import { UserProfileNavigation } from "./UserProfileNavigation";
import styles from "./UserProfileLayout.module.scss";

type LoadedUser = {
  requestKey: string;
  canonicalKey: string;
  userInfo: UserInfo;
};

type UserProfileLoadState =
  | { status: "loading"; requestKey: string }
  | { status: "not-found"; requestKey: string }
  | ({ status: "loaded" } & LoadedUser);

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

export function UserProfileLayout() {
  const navigate = useNavigate();
  const { method, id } = useParams<{ method: string; id: string }>();
  const isManagePage = !!useMatch("/user/:method/:id/manage/*");
  const page = isManagePage ? "manage" : "exact";
  const requestKey = `${method ?? ""}/${id ?? ""}`;
  const requestIdRef = React.useRef(0);
  const loadedUserRef = React.useRef<LoadedUser | null>(null);
  const [loadState, setLoadState] = React.useState<UserProfileLoadState>(
    { status: "loading", requestKey }
  );
  const userKey = parseUserKey(method, id);

  React.useEffect(() => {
    const loadedUser = loadedUserRef.current;
    if (
      loadedUser &&
      (loadedUser.requestKey === requestKey ||
        loadedUser.canonicalKey === requestKey)
    ) {
      return;
    }

    const currentRequestId = ++requestIdRef.current;
    if (userKey === null) {
      loadedUserRef.current = null;
      setLoadState({ status: "not-found", requestKey });
      return;
    }

    loadedUserRef.current = null;
    setLoadState({ status: "loading", requestKey });

    const loadUser = async () => {
      const userInfo =
        typeof userKey === "number"
          ? await getUserInfo(userKey)
          : await getUserInfo(userKey);
      if (currentRequestId !== requestIdRef.current) return;
      if (!userInfo) {
        setLoadState({ status: "not-found", requestKey });
        return;
      }

      const canonicalKey = `id/${userInfo.id}`;
      loadedUserRef.current = { requestKey, canonicalKey, userInfo };
      setLoadState({
        status: "loaded",
        requestKey,
        canonicalKey,
        userInfo,
      });

      if (requestKey !== canonicalKey) {
        void navigate(
          `/user/id/${userInfo.id}${page === "manage" ? "/manage" : ""}`,
          { replace: true }
        );
      }
    };

    void loadUser();
  }, [navigate, page, requestKey, userKey]);

  const loadedUserMatchesRequest =
    loadState.status === "loaded" &&
    (loadState.requestKey === requestKey ||
      loadState.canonicalKey === requestKey);
  const userNotFound =
    userKey === null ||
    (loadState.status === "not-found" &&
      loadState.requestKey === requestKey);

  if (userNotFound) {
    return <NotFoundUser />;
  }

  if (!loadedUserMatchesRequest) {
    return (
      <UserAreaShell heading="用户详情">
        <div className={styles["user-center-router"]}>
          <UserAreaLoading />
        </div>
      </UserAreaShell>
    );
  }

  return (
    <UserAreaShell heading="用户详情">
      <UserProfileProvider value={{ page, userInfo: loadState.userInfo }}>
        <UserProfileNavigation />
        <div className={styles["user-center-router"]}>
          <Outlet />
        </div>
      </UserProfileProvider>
    </UserAreaShell>
  );
}
