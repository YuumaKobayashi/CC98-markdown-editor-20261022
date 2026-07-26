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
        lazy: lazyNamed(() => import("@pages/home/main"), "HomePage"),
      },
      {
        path: "topic/hot-monthly",
        lazy: lazyNamed(
          () => import("@pages/hot-topics/monthly"),
          "MonthlyHotTopic"
        ),
      },
      {
        path: "topic/hot-weekly",
        lazy: lazyNamed(
          () => import("@pages/hot-topics/weekly"),
          "WeeklyHotTopic"
        ),
      },
      {
        path: "topic/hot-history",
        lazy: lazyNamed(
          () => import("@pages/hot-topics/history"),
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
          () => import("@pages/board-list"),
          "BoardListPage"
        ),
      },
      {
        path: "usercenter",
        lazy: lazyDefault(() => import("@pages/user-center/layout")),
        children: [
          {
            index: true,
            lazy: lazyNamed(
              () => import("@pages/user-center/overview"),
              "UserCenterOverview"
            ),
          },
          {
            path: "myfollowings/:page?/*",
            lazy: lazyDefault(() => import("@pages/user-center/my-followings")),
          },
          {
            path: "myfans/:page?/*",
            lazy: lazyDefault(() => import("@pages/user-center/my-fans")),
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
            lazy: lazyDefault(() => import("@pages/user-center/custom-boards")),
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
          () => import("@pages/message/layout"),
          "MessageLayout"
        ),
        children: [
          {
            index: true,
            lazy: lazyNamed(
              () => import("@pages/message/responses"),
              "MessageResponsesPage"
            ),
          },
          {
            path: "response/:page?",
            lazy: lazyNamed(
              () => import("@pages/message/responses"),
              "MessageResponsesPage"
            ),
          },
          {
            path: "attme/:page?/*",
            lazy: lazyNamed(
              () => import("@pages/message/mentions"),
              "MessageMentionsPage"
            ),
          },
          {
            path: "system/:page?/*",
            lazy: lazyNamed(
              () => import("@pages/message/system"),
              "MessageSystemPage"
            ),
          },
          {
            path: "message/:page?/*",
            lazy: lazyNamed(
              () => import("@pages/message/private-messages"),
              "PrivateMessagesPage"
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
              () => import("@pages/focus"),
              "FocusBoardArea"
            ),
          },
          {
            path: "board/*",
            lazy: lazyNamed(
              () => import("@pages/focus"),
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
        lazy: lazyDefault(() => import("@pages/new-topics")),
      },
      {
        path: "recommendedtopics/*",
        lazy: lazyNamed(
          () => import("@pages/recommended-topics"),
          "RecommendedTopicsPage"
        ),
      },
      {
        path: "user/:method/:id",
        lazy: lazyDefault(() => import("@pages/user-profile/layout")),
        children: [
          {
            index: true,
            lazy: lazyNamed(
              () => import("@pages/user-profile/overview"),
              "UserProfileOverview"
            ),
          },
          {
            path: "manage/*",
            lazy: lazyDefault(() => import("@pages/user-profile/manage")),
          },
          { path: "*", element: null },
        ],
      },
      {
        path: "logon",
        lazy: lazyDefault(() => import("@pages/auth/login")),
      },
      {
        path: "search/*",
        lazy: lazyNamed(
          () => import("@pages/search/topics"),
          "TopicSearchPage"
        ),
      },
      {
        path: "searchBoard/*",
        lazy: lazyNamed(
          () => import("@pages/search/boards"),
          "BoardSearchPage"
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
