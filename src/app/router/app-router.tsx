import * as React from "react";
import {
  Navigate,
  createBrowserRouter,
  useRouteError,
  type RouteObject,
} from "react-router";
import { RouterProvider } from "react-router/dom";

import { AppShell } from "@app/layouts/app-shell";
import { withRouter } from "@app/router/legacy-route-props";
import { bindAppNavigate } from "@app/router/navigation";
import * as Status from "@legacy/Components/Status";

type RouteModule = Record<string, unknown>;
type ModuleLoader = () => Promise<RouteModule>;

const lazyNamed = (load: ModuleLoader, exportName: string) => async () => {
  const module = await load();
  return { Component: module[exportName] as React.ComponentType<any> };
};

const lazyDefault = (load: ModuleLoader) =>
  lazyNamed(load, "default");

const lazyNamedWithRouteProps = (
  load: ModuleLoader,
  exportName: string
) => async () => {
  const module = await load();
  return {
    Component: withRouter(module[exportName] as React.ComponentType<any>),
  };
};

const lazyDefaultWithRouteProps = (load: ModuleLoader) =>
  lazyNamedWithRouteProps(load, "default");

function RethrowRouteError(): never {
  throw useRouteError();
}

const routes: RouteObject[] = [
  {
    Component: AppShell,
    errorElement: <RethrowRouteError />,
    children: [
      {
        index: true,
        lazy: lazyNamed(() => import("@legacy/Components/MainPage"), "MainPage"),
      },
      {
        path: "topic/hot-monthly",
        lazy: lazyNamed(
          () => import("@legacy/Components/Topic/Topic-Hot-Monthly"),
          "MonthlyHotTopic"
        ),
      },
      {
        path: "topic/hot-weekly",
        lazy: lazyNamed(
          () => import("@legacy/Components/Topic/Topic-Hot-Weekly"),
          "WeeklyHotTopic"
        ),
      },
      {
        path: "topic/hot-history",
        lazy: lazyNamed(
          () => import("@legacy/Components/Topic/Topic-Hot-History"),
          "HistoryHotTopic"
        ),
      },
      {
        path: "topic/:topicid/:page?",
        lazy: lazyNamed(
          () => import("@legacy/Components/Topic/Topic"),
          "ShowTopic"
        ),
      },
      {
        path: "topic/:topicId/postid/:postId/:page?",
        lazy: lazyNamedWithRouteProps(
          () => import("@legacy/Components/Topic/Topic-Trace"),
          "CurUserPost"
        ),
      },
      {
        path: "list/:boardId/:type?/:page?/*",
        lazy: lazyNamedWithRouteProps(
          () => import("@legacy/Components/Board/Board"),
          "BList"
        ),
      },
      {
        path: "boardlist",
        lazy: lazyNamed(
          () => import("@legacy/Components/Board/BoardList"),
          "BoardList"
        ),
      },
      {
        path: "usercenter",
        lazy: lazyDefault(
          () => import("@legacy/Components/UserCenter/UserCenter")
        ),
        children: [
          {
            index: true,
            lazy: lazyDefault(
              () => import("@legacy/Components/UserCenter/Exact")
            ),
          },
          {
            path: "myfollowings/:page?/*",
            lazy: lazyDefault(
              () => import("@legacy/Components/UserCenter/MyFollowings")
            ),
          },
          {
            path: "myfans/:page?/*",
            lazy: lazyDefault(
              () => import("@legacy/Components/UserCenter/MyFans")
            ),
          },
          {
            path: "mytopics/:page?/*",
            lazy: lazyDefault(
              () => import("@pages/user-center/my-topics")
            ),
          },
          {
            path: "myhistory/:page?/*",
            lazy: lazyDefault(
              () => import("@legacy/Components/UserCenter/MyHistory")
            ),
          },
          {
            path: "myposts/ishot/:ishot/:page?/*",
            lazy: lazyDefault(
              () => import("@pages/user-center/my-posts")
            ),
          },
          {
            path: "myposts/*",
            element: (
              <Navigate replace to="/usercenter/myposts/ishot/0" />
            ),
          },
          {
            path: "myfavorites/order/:order/group/:group/:page?",
            lazy: lazyDefault(
              () => import("@legacy/Components/UserCenter/MyFavoritesPosts")
            ),
          },
          {
            path: "myfavorites/*",
            element: (
              <Navigate
                replace
                to="/usercenter/myfavorites/order/0/group/0"
              />
            ),
          },
          {
            path: "config/*",
            lazy: lazyDefault(
              () => import("@legacy/Components/UserCenter/Config")
            ),
          },
          {
            path: "mycustomboards/*",
            lazy: lazyDefault(
              () => import("@legacy/Components/UserCenter/MyFavoritesBoards")
            ),
          },
          {
            path: "transferwealth/*",
            lazy: lazyDefault(
              () => import("@legacy/Components/UserCenter/TransferWealth")
            ),
          },
          {
            path: "theme/*",
            lazy: lazyDefault(
              () => import("@legacy/Components/UserCenter/Theme")
            ),
          },
          { path: "*", element: null },
        ],
      },
      {
        path: "message",
        lazy: lazyNamed(
          () => import("@legacy/Components/Message/Message"),
          "Message"
        ),
        children: [
          {
            index: true,
            lazy: lazyNamedWithRouteProps(
              () => import("@legacy/Components/Message/MessageResponse"),
              "MessageResponse"
            ),
          },
          {
            path: "response/:page?",
            lazy: lazyNamedWithRouteProps(
              () => import("@legacy/Components/Message/MessageResponse"),
              "MessageResponse"
            ),
          },
          {
            path: "attme/:page?/*",
            lazy: lazyNamedWithRouteProps(
              () => import("@legacy/Components/Message/MessageAttme"),
              "MessageAttme"
            ),
          },
          {
            path: "system/:page?/*",
            lazy: lazyNamedWithRouteProps(
              () => import("@legacy/Components/Message/MessageSystem"),
              "MessageSystem"
            ),
          },
          {
            path: "message/:page?/*",
            lazy: lazyNamed(
              () => import("@legacy/Components/Message/MessageMessage"),
              "MessageMessage"
            ),
          },
          {
            path: "setting/*",
            lazy: lazyNamed(
              () => import("@features/message"),
              "MessageSetting"
            ),
          },
          { path: "*", element: null },
        ],
      },
      {
        path: "focus",
        lazy: lazyDefault(() => import("@pages/focus/layout")),
        children: [
          {
            index: true,
            lazy: lazyNamed(
              () => import("@legacy/Components/Focus/FocusBoardArea"),
              "FocusBoardArea"
            ),
          },
          {
            path: "board/*",
            lazy: lazyNamed(
              () => import("@legacy/Components/Focus/FocusBoardArea"),
              "FocusBoardArea"
            ),
          },
          {
            path: "user/*",
            lazy: lazyNamed(
              () => import("@pages/focus"),
              "FocusUserArea"
            ),
          },
          {
            path: "favorite/*",
            lazy: lazyNamed(
              () => import("@pages/focus"),
              "FocusFavoriteArea"
            ),
          },
          { path: "*", element: null },
        ],
      },
      {
        path: "newtopics/*",
        lazy: lazyDefault(
          () => import("@legacy/Components/Topic/Topic-New")
        ),
      },
      {
        path: "recommendedtopics/*",
        lazy: lazyNamed(
          () => import("@legacy/Components/Topic/Topic-Recommended"),
          "AllRecommendedTopic"
        ),
      },
      {
        path: "user/:method/:id",
        lazy: lazyDefault(
          () => import("@legacy/Components/UserCenter/User/User")
        ),
        children: [
          {
            index: true,
            lazy: lazyNamed(
              () => import("@legacy/Components/UserCenter/User/Router"),
              "UserExactWithRouter"
            ),
          },
          {
            path: "manage/*",
            lazy: lazyDefault(
              () => import("@legacy/Components/UserCenter/User/Manage")
            ),
          },
          { path: "*", element: null },
        ],
      },
      {
        path: "logon",
        lazy: lazyDefaultWithRouteProps(
          () => import("@legacy/Components/LogOn")
        ),
      },
      {
        path: "search/*",
        lazy: lazyNamed(
          () => import("@legacy/Components/Search/Search"),
          "Search"
        ),
      },
      {
        path: "searchBoard/*",
        lazy: lazyNamed(
          () => import("@legacy/Components/Search/SearchBoard"),
          "SearchBoard"
        ),
      },
      {
        path: "signin/*",
        lazy: lazyNamed(
          () => import("@legacy/Components/Signin"),
          "Signin"
        ),
      },
      {
        path: "sitemanage/*",
        lazy: lazyNamed(
          () => import("@pages/site-manage"),
          "SiteManage"
        ),
      },
      {
        path: "editor/:mode/:id?/*",
        lazy: lazyNamed(
          () => import("@legacy/Components/Edit"),
          "ShowEdit"
        ),
      },
      {
        path: "board/:id/:page?/*",
        lazy: lazyDefault(() => import("@legacy/Pages/Board")),
      },
      {
        path: "error/401/*",
        Component: Status.UnauthorizedBoard,
      },
      {
        path: "index/*",
        lazy: lazyNamed(
          () => import("@legacy/Pages/Index/Index"),
          "Index"
        ),
      },
      {
        path: "*",
        Component: Status.PageNotFound,
      },
    ],
  },
];

export const appRouter = createBrowserRouter(routes);
bindAppNavigate(appRouter.navigate.bind(appRouter));

export function AppRouter() {
  return <RouterProvider router={appRouter} />;
}
