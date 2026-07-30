import * as React from "react";
import {
  Navigate,
  createBrowserRouter,
  useRouteError,
  type RouteObject,
} from "react-router";
import { RouterProvider } from "react-router/dom";

import { AppShell } from "@application/layouts/app-shell";
import { withRouter } from "@application/router/legacy-route-props";
import { bindAppNavigate } from "@application/router/navigation";
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
        lazy: lazyNamed(
          () => import("@application/routes/home/main"),
          "HomePage"
        ),
      },
      {
        path: "topic/hot-monthly",
        lazy: lazyNamed(
          () => import("@application/routes/topic/hot/monthly"),
          "MonthlyHotTopic"
        ),
      },
      {
        path: "topic/hot-weekly",
        lazy: lazyNamed(
          () => import("@application/routes/topic/hot/weekly"),
          "WeeklyHotTopic"
        ),
      },
      {
        path: "topic/hot-history",
        lazy: lazyNamed(
          () => import("@application/routes/topic/hot/history"),
          "HistoryHotTopic"
        ),
      },
      {
        path: "topic/:topicid/:page?",
        lazy: lazyNamed(
          () => import("@pages/topic"),
          "TopicPage"
        ),
      },
      {
        path: "topic/:topicId/postid/:postId/:page?",
        lazy: lazyNamed(
          () => import("@pages/topic"),
          "TrackedTopicPage"
        ),
      },
      {
        path: "list/:boardId/:type?/:page?/*",
        lazy: lazyNamed(
          () => import("@application/routes/legacy-board-list"),
          "LegacyBoardPage"
        ),
      },
      {
        path: "boardlist",
        lazy: lazyNamed(
          () => import("@application/routes/board-list"),
          "BoardListPage"
        ),
      },
      {
        path: "usercenter",
        lazy: lazyDefault(() => import("@application/routes/user-center/layout")),
        children: [
          {
            index: true,
            lazy: lazyNamed(
              () => import("@application/routes/user-center/overview"),
              "UserCenterOverview"
            ),
          },
          {
            path: "myfollowings/:page?/*",
            lazy: lazyDefault(() => import("@application/routes/user-center/my-followings")),
          },
          {
            path: "myfans/:page?/*",
            lazy: lazyDefault(() => import("@application/routes/user-center/my-fans")),
          },
          {
            path: "mytopics/:page?/*",
            lazy: lazyDefault(
              () => import("@application/routes/user-center/my-topics")
            ),
          },
          {
            path: "myhistory/:page?/*",
            lazy: lazyDefault(() => import("@application/routes/user-center/history")),
          },
          {
            path: "myposts/ishot/:ishot/:page?/*",
            lazy: lazyDefault(
              () => import("@application/routes/user-center/my-posts")
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
            lazy: lazyDefault(() => import("@application/routes/user-center/favorites")),
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
            lazy: lazyNamed(
              () => import("@application/routes/user-center/settings"),
              "UserCenterSettingsPage"
            ),
          },
          {
            path: "mycustomboards/*",
            lazy: lazyDefault(() => import("@application/routes/user-center/custom-boards")),
          },
          {
            path: "transferwealth/*",
            lazy: lazyNamed(
              () => import("@application/routes/user-center/transfer-wealth"),
              "TransferWealthPage"
            ),
          },
          {
            path: "theme/*",
            lazy: lazyNamed(
              () => import("@application/routes/user-center/theme"),
              "UserCenterThemePage"
            ),
          },
          { path: "*", element: null },
        ],
      },
      {
        path: "message",
        lazy: lazyNamed(
          () => import("@application/routes/message-center/layout"),
          "MessageLayout"
        ),
        children: [
          {
            index: true,
            lazy: lazyNamed(
              () => import("@application/routes/message-center/responses"),
              "MessageResponsesPage"
            ),
          },
          {
            path: "response/:page?",
            lazy: lazyNamed(
              () => import("@application/routes/message-center/responses"),
              "MessageResponsesPage"
            ),
          },
          {
            path: "attme/:page?/*",
            lazy: lazyNamed(
              () => import("@application/routes/message-center/mentions"),
              "MessageMentionsPage"
            ),
          },
          {
            path: "system/:page?/*",
            lazy: lazyNamed(
              () => import("@application/routes/message-center/system"),
              "MessageSystemPage"
            ),
          },
          {
            path: "message/:page?/*",
            lazy: lazyNamed(
              () => import("@application/routes/message-center/private-messages"),
              "PrivateMessagesPage"
            ),
          },
          {
            path: "setting/*",
            lazy: lazyNamed(
              () => import("@modules/notification"),
              "MessageSetting"
            ),
          },
          { path: "*", element: null },
        ],
      },
      {
        path: "focus",
        lazy: lazyDefault(() => import("@application/routes/focus/layout")),
        children: [
          {
            index: true,
            lazy: lazyNamed(
              () => import("@application/routes/focus"),
              "FocusBoardArea"
            ),
          },
          {
            path: "board/*",
            lazy: lazyNamed(
              () => import("@application/routes/focus"),
              "FocusBoardArea"
            ),
          },
          {
            path: "user/*",
            lazy: lazyNamed(
              () => import("@application/routes/focus"),
              "FocusUserArea"
            ),
          },
          {
            path: "favorite/*",
            lazy: lazyNamed(
              () => import("@application/routes/focus"),
              "FocusFavoriteArea"
            ),
          },
          { path: "*", element: null },
        ],
      },
      {
        path: "newtopics/*",
        lazy: lazyDefault(() => import("@application/routes/new-topics")),
      },
      {
        path: "recommendedtopics/*",
        lazy: lazyNamed(
          () => import("@application/routes/recommended-topics"),
          "RecommendedTopicsPage"
        ),
      },
      {
        path: "user/:method/:id",
        lazy: lazyDefault(() => import("@application/routes/user-profile/layout")),
        children: [
          {
            index: true,
            lazy: lazyNamed(
              () => import("@application/routes/user-profile/overview"),
              "UserProfileOverview"
            ),
          },
          {
            path: "manage/*",
            lazy: lazyDefault(() => import("@application/routes/user-profile/manage")),
          },
          { path: "*", element: null },
        ],
      },
      {
        path: "logon",
        lazy: lazyDefault(() => import("@application/routes/login")),
      },
      {
        path: "search/*",
        lazy: lazyNamed(
          () => import("@application/routes/search/topic"),
          "TopicSearchPage"
        ),
      },
      {
        path: "searchBoard/*",
        lazy: lazyNamed(
          () => import("@application/routes/search/board"),
          "BoardSearchPage"
        ),
      },
      {
        path: "signin/*",
        lazy: lazyNamed(
          () => import("@application/routes/daily-signin"),
          "DailySigninPage"
        ),
      },
      {
        path: "sitemanage/*",
        lazy: lazyNamed(
          () => import("@application/routes/site-management"),
          "SiteManage"
        ),
      },
      {
        path: "editor/:mode/:id?/*",
        lazy: lazyNamed(
          () => import("@pages/editor"),
          "EditorPage"
        ),
      },
      {
        path: "board/:id/:page?/*",
        lazy: lazyNamed(() => import("@application/routes/board"), "BoardPage"),
      },
      {
        path: "error/401/*",
        Component: Status.UnauthorizedBoard,
      },
      {
        path: "index/*",
        lazy: lazyNamed(
          () => import("@application/routes/legacy-index"),
          "LegacyIndexPage"
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
