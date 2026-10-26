import * as React from "react";
import { Link, useSearchParams } from "react-router";

import {
  BoardBatchManagerFixtureHarness,
  type BoardBatchOperations,
} from "./BoardBatchManagerFixtureHarness";
import { BoardAnnouncementEditorDialog } from "@application/routes/board/ui/BoardAnnouncementEditorDialog";
import { EditorBreadcrumb } from "@application/routes/editor/ui/EditorBreadcrumb";
import editorPageStyles from "@application/routes/editor/ui/EditorPage.module.scss";
import { EditorTitleInput } from "@application/routes/editor/ui/EditorTitleInput";
import { EditorVoteSettings } from "@application/routes/editor/ui/EditorVoteSettings";
import { HousingTemplateDialog } from "@application/routes/editor/ui/HousingTemplateDialog";
import type { HousingValidationState } from "@application/routes/editor/ui/HousingTemplateDialog";
import {
  formatHousingTemplateUbb,
  type HousingTemplateValues,
} from "@application/routes/editor/model/housing-template";
import type {
  EditorTagInfo,
  EditorVoteInfo,
} from "@application/routes/editor/model/types";
import ReSignCalendar, {
  type ReSignCalendarOperations,
} from "@application/routes/daily-signin/ui/ReSignCalendar";
import {
  SiteAdvertisementEditor,
  type SiteAdvertisementEditorOperations,
} from "@application/routes/site-management/ui/SiteAdvertisementEditor";
import { TopicHeader } from "@application/routes/topic/detail/ui/TopicHeader";
import { TopicReplier } from "@application/routes/topic/detail/ui/TopicReplier";
import { TopicVote } from "@application/routes/topic/detail/ui/TopicVote";
import topicPageStyles from "@application/routes/topic/detail/ui/TopicPage.module.scss";
import topicReplySignatureStyles from "@application/routes/topic/detail/ui/TopicReplySignature.module.scss";
import { UserFavoriteBoardsEmptyState } from "@application/routes/user-center/custom-boards/ui/UserFavoriteBoards";
import { FavoriteTopicGroupManager } from "@application/routes/user-center/favorites/ui/FavoriteTopicGroupManager";
import { UserCenterPager } from "@application/routes/user-center/pagination";
import { ThemePreviewButton } from "@application/routes/user-center/theme/ui/UserCenterThemePage";
import themePageStyles from "@application/routes/user-center/theme/ui/UserCenterThemePage.module.scss";
import { MarkdownEditor } from "@foundation/integrations/markdown";
import type { BoardInfo } from "@modules/board/model/types";
import type { BoardCategoryInfo } from "@modules/board/model/dto";
import type { FavoriteTopicGroup } from "@modules/favorite-topic/model/favorite-topic-group";
import type { PostWithIpInfo } from "@modules/moderation/model/dto";
import type { UserSignInDailyInfo } from "@modules/daily-signin/model/dto";
import { UbbContainer } from "@modules/ubb/UbbContainer";
import { UbbEditor } from "@modules/ubb-editor/UbbEditor";
import { Message as UbbEditorMessage } from "@modules/ubb-editor/components/message";
import {
  UbbCodeEngine,
  UbbCodeOptions,
  UbbCompatiblityMode,
} from "@modules/ubb/engine/Core";
import { Image } from "@modules/ubb/tag/ImageTagHandler";
import SandBoxTagHandler from "@modules/ubb/tag/SandboxTagHandler";
import {
  ForumIndexColumnType,
  ForumIndexColumnVisibility,
  type ForumIndexColumn,
  type PostForumIndexColumnInfo,
} from "@modules/site-content/model/dto";
import {
  PostManagementDialog,
  type PostManagementAction,
  type PostManagementOperations,
} from "@modules/moderation/ui/PostManagementDialog";
import {
  TopicManagementDialog,
  type TopicManagementAction,
  type TopicManagementOperations,
} from "@modules/moderation/ui/TopicManagementDialog";
import { TopicIPData } from "@modules/moderation/ui/TopicIPData";
import {
  TopicContentType,
  TopicBestState,
  TopicState,
  TopicTopState,
  type TopicInfo,
  type VoteInfo,
  type VoteRecord,
} from "@modules/topic/model/dto";
import type { FocusTopic, UserRecentTopic } from "@modules/topic/model/view-model";
import { TopicCard } from "@modules/topic/ui/TopicCard";
import { TopicAudioPlayer } from "@modules/topic/ui/TopicAudioPlayer";
import { TopicCollectionItem } from "@modules/topic/ui/TopicCollectionItem";
import { TopicVideoPlayer } from "@modules/topic/ui/TopicVideoPlayer";
import { UserRecentTopicItem } from "@modules/topic/ui/UserRecentTopicItem";
import {
  UserGender,
  type PortraitConfigDto,
  type UserInfo,
  type UserTitleDto,
} from "@modules/user/model/dto";
import { UserProfile } from "@modules/user/ui/UserProfile";
import {
  UserProfileAvatar,
  type UserProfileAvatarOperations,
} from "@modules/user/ui/profile-avatar/UserProfileAvatar";
import {
  formatCalendarDate,
  type CalendarDateRange,
} from "@foundation/lib/calendar-date";
import { Button } from "@foundation/ui/button";
import { Card } from "@foundation/ui/card";
import { Checkbox } from "@foundation/ui/checkbox";
import { ColorPicker } from "@foundation/ui/color-picker";
import { ConfirmDialog, Dialog } from "@foundation/ui/dialog";
import { DateRangePicker } from "@foundation/ui/date-range-picker";
import {
  DataTable,
  type DataTableColumn,
} from "@foundation/ui/data-table";
import { DropdownMenu } from "@foundation/ui/dropdown-menu";
import {
  MessageBar,
  MessageType,
  NoticeMessage,
  message,
  noticeMessageShow,
  notification,
} from "@foundation/ui/feedback";
import {
  CloseCircleOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  QuestionCircleOutlined,
  UnorderedListOutlined,
} from "@foundation/ui/icon";
import { Spinner } from "@foundation/ui/spinner";
import { Accordion } from "@foundation/ui/accordion";
import { List } from "@foundation/ui/list";
import { NumberInput } from "@foundation/ui/number-input";
import { Pagination } from "@foundation/ui/pagination";
import { Popover } from "@foundation/ui/popover";
import { Radio, RadioGroup, RadioInput } from "@foundation/ui/radio";
import { Select } from "@foundation/ui/select";
import { Tabs } from "@foundation/ui/tabs";
import { TagsInput } from "@foundation/ui/tags-input";
import { Tooltip } from "@foundation/ui/tooltip";
import { themeList } from "@foundation/theme";

import styles from "./VisualFixturePage.module.scss";

export const VISUAL_FIXTURE_SENTINEL = "VISUAL_FIXTURE_SENTINEL";

const fixtureCases = [
  "overview",
  "housing-dialog",
  "date-range-controlled",
  "resign-calendar",
  "site-advertisement",
  "topic-ip-data",
  "board-batch-manager",
  "post-management-dialog",
  "topic-management-dialog",
  "favorite-topic-group-manager",
  "topic-header",
  "topic-locked-tip",
  "topic-replier-shadow",
  "topic-vote",
  "user-center-pager",
  "editor-breadcrumb",
  "editor-title-input",
  "editor-vote-settings",
  "editor-submit-actions",
  "editor-length-alert",
  "history-confirm-dialog",
  "async-confirm-dialog",
  "select",
  "number-input",
  "tags-input",
  "overlays",
  "feedback-owned-baseline",
  "board-footer-dialogs",
  "board-announcement-dialog",
  "favorite-topic-item",
  "ubb-image",
  "ubb-sandbox",
  "ubb-editor",
  "topic-list-styles",
  "topic-media-fixed",
  "user-profile-static-styles",
  "foundation-fixed-styles",
  "remaining-owned-surfaces",
] as const;

type FixtureCase = (typeof fixtureCases)[number];

const fakeTopics = [
  { id: 980001, title: "Fixture topic alpha" },
  { id: 980002, title: "Fixture topic beta" },
  { id: 980003, title: "Fixture topic gamma" },
] as TopicInfo[];

const fakeBoard = {
  id: 9800,
  name: "Fixture Board",
  description: "Synthetic visual fixture",
} as BoardInfo;

const fakeIpData: PostWithIpInfo[] = [
  {
    ip: "192.0.2.10",
    posts: [
      {
        floor: 3,
        userId: 980001,
        userName: "fixture-user-a",
        content: "Synthetic post content for visual comparison only.",
      },
      {
        floor: 8,
        userId: 980002,
        userName: "fixture-user-b",
        content: "A second deliberately fabricated fixture post.",
      },
    ],
  },
  {
    ip: "198.51.100.24",
    posts: [
      {
        floor: 12,
        userId: 980003,
        userName: "fixture-user-c",
        content: "No production or account data is used on this page.",
      },
    ],
  },
];

const fakeFavoriteGroups: FavoriteTopicGroup[] = [
  {
    id: 0,
    name: "Fixture default group",
    count: 4,
    createTime: "2000-01-01T00:00:00.000Z",
  },
  {
    id: 9801,
    name: "Fixture group A",
    count: 2,
    createTime: "2000-01-02T00:00:00.000Z",
  },
  {
    id: 9802,
    name: "Fixture group B",
    count: 1,
    createTime: "2000-01-03T00:00:00.000Z",
  },
];

function useReadOnlyFixtureGuard() {
  React.useEffect(() => {
    const preventSubmit = (event: Event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
    };
    const preventConfirmation = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const button = target.closest("[data-owned-dialog-footer] button");
      const label = button?.textContent?.replace(/\s/g, "");
      if (!button || (label !== "确定" && label !== "确认" && label !== "OK")) {
        return;
      }
      event.preventDefault();
      event.stopImmediatePropagation();
    };

    document.addEventListener("submit", preventSubmit, true);
    document.addEventListener("click", preventConfirmation, true);
    return () => {
      document.removeEventListener("submit", preventSubmit, true);
      document.removeEventListener("click", preventConfirmation, true);
    };
  }, []);
}

type EditorBreadcrumbFixtureState =
  | "post-topic"
  | "post-vote"
  | "edit"
  | "loading";

const editorBreadcrumbFixtureProps = {
  "post-topic": { boardName: "Fixture Board", mode: "postTopic" },
  "post-vote": { boardName: "Fixture Board", mode: "postVoteTopic" },
  edit: { boardName: "Fixture Board", mode: "edit" },
  loading: { boardName: "", mode: "postTopic" },
} as const satisfies Record<
  EditorBreadcrumbFixtureState,
  { boardName: string; mode: string }
>;

function EditorBreadcrumbFixture() {
  const [searchParams] = useSearchParams();
  const requestedState = searchParams.get("state");
  const fixtureState: EditorBreadcrumbFixtureState = [
    "post-topic",
    "post-vote",
    "edit",
    "loading",
  ].includes(requestedState ?? "")
    ? (requestedState as EditorBreadcrumbFixtureState)
    : "post-topic";
  const { boardName, mode } = editorBreadcrumbFixtureProps[fixtureState];
  const url = "/board/9800";

  return (
    <main
      data-fixture-component="editor-breadcrumb"
      data-fixture-editor-breadcrumb-case="editor-breadcrumb"
      data-fixture-editor-breadcrumb-state={fixtureState}
      data-fixture-editor-breadcrumb-mode={mode}
      data-fixture-editor-breadcrumb-board-name={boardName}
      data-fixture-editor-breadcrumb-url={url}
      onClickCapture={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
      onSubmitCapture={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
    >
      <EditorBreadcrumb
        key={fixtureState}
        url={url}
        boardName={boardName}
        mode={mode}
      />
    </main>
  );
}

type EditorTitleInputFixtureState =
  | "no-tags"
  | "one-layer"
  | "one-layer-empty"
  | "two-layer"
  | "two-layer-empty";

const editorTitleInputFixtureStates: EditorTitleInputFixtureState[] = [
  "no-tags",
  "one-layer",
  "one-layer-empty",
  "two-layer",
  "two-layer-empty",
];

const editorTitleInputOneLayerTags: EditorTagInfo["tags"] = [
  {
    id: 98101,
    name: "Fixture Title Primary Alpha",
    subTags: [],
  },
  {
    id: 98102,
    name: "Fixture Title Primary Beta",
    subTags: [],
  },
];

const editorTitleInputTwoLayerTags: EditorTagInfo["tags"] = [
  {
    id: 98201,
    name: "Fixture Title Primary Alpha",
    subTags: [
      {
        id: 98211,
        name: "Fixture Title Secondary Alpha One",
        subTags: [],
      },
      {
        id: 98212,
        name: "Fixture Title Secondary Alpha Two",
        subTags: [],
      },
    ],
  },
  {
    id: 98202,
    name: "Fixture Title Primary Beta",
    subTags: [
      {
        id: 98221,
        name: "Fixture Title Secondary Beta One",
        subTags: [],
      },
    ],
  },
];

function createEditorTitleInputFixtureTags(
  fixtureState: EditorTitleInputFixtureState,
): EditorTagInfo {
  switch (fixtureState) {
    case "no-tags":
      return { layers: 0, tags: [] };
    case "one-layer":
      return { layers: 1, tags: editorTitleInputOneLayerTags };
    case "one-layer-empty":
      return { layers: 1, tags: [] };
    case "two-layer-empty":
      return { layers: 2, tags: [] };
    case "two-layer":
    default:
      return { layers: 2, tags: editorTitleInputTwoLayerTags };
  }
}

function EditorTitleInputFixtureView({
  fixtureState,
}: {
  fixtureState: EditorTitleInputFixtureState;
}) {
  const [changeCount, setChangeCount] = React.useState(0);
  const [lastTitle, setLastTitle] = React.useState(
    "Fixture editor title input",
  );
  const [lastTag1, setLastTag1] = React.useState("");
  const [lastTag2, setLastTag2] = React.useState("");
  const titleInputChangeRef = React.useRef(false);
  const tagsV2 = React.useMemo(
    () => createEditorTitleInputFixtureTags(fixtureState),
    [fixtureState],
  );

  return (
    <main
      className={editorPageStyles.createTopic}
      data-fixture-component="editor-title-input"
      data-fixture-state={fixtureState}
      data-fixture-editor-title-input-state={fixtureState}
      data-fixture-editor-title-input-layers={tagsV2.layers}
      data-fixture-editor-title-input-tag-count={tagsV2.tags.length}
      onChangeCapture={(event) => {
        titleInputChangeRef.current = event.target instanceof HTMLInputElement;
      }}
    >
      <EditorTitleInput
        boardId={9800}
        tagsV2={tagsV2}
        tag1={0}
        tag2={0}
        title={lastTitle}
        onChange={(title, tag1, tag2) => {
          const isTitleInputChange = titleInputChangeRef.current;
          titleInputChangeRef.current = false;
          setChangeCount((count) => count + 1);
          setLastTitle((currentTitle) =>
            isTitleInputChange ? title : title || currentTitle,
          );
          setLastTag1(tag1);
          setLastTag2(tag2);
        }}
      />
      <output
        data-fixture-editor-title-input-telemetry
        data-fixture-editor-title-input-change-count={changeCount}
        data-fixture-editor-title-input-last-title={lastTitle}
        data-fixture-editor-title-input-last-tag1={lastTag1}
        data-fixture-editor-title-input-last-tag2={lastTag2}
        aria-live="polite"
      >
        changeCount={changeCount}; lastTitle={lastTitle}; lastTag1=
        {lastTag1 || "none"}; lastTag2={lastTag2 || "none"}
      </output>
    </main>
  );
}

function EditorTitleInputFixture() {
  const [searchParams] = useSearchParams();
  const requestedState = searchParams.get("state");
  const fixtureState = editorTitleInputFixtureStates.includes(
    requestedState as EditorTitleInputFixtureState,
  )
    ? (requestedState as EditorTitleInputFixtureState)
    : "two-layer";

  return (
    <EditorTitleInputFixtureView
      key={fixtureState}
      fixtureState={fixtureState}
    />
  );
}

type EditorVoteSettingsFixtureState =
  | "default"
  | "filled"
  | "three-items"
  | "twenty-items";

function createEditorVoteSettingsFixtureInfo(
  fixtureState: EditorVoteSettingsFixtureState,
): EditorVoteInfo {
  switch (fixtureState) {
    case "filled":
      return {
        voteItems: ["Fixture A", "Fixture B"],
        expiredDays: 7,
        maxVoteCount: 2,
        needVote: true,
      };
    case "three-items":
      return {
        voteItems: ["Fixture A", "Fixture B", "Fixture C"],
        expiredDays: 7,
        maxVoteCount: 2,
        needVote: false,
      };
    case "twenty-items":
      return {
        voteItems: Array.from(
          { length: 20 },
          (_, index) => `Fixture option ${index + 1}`,
        ),
        expiredDays: 14,
        maxVoteCount: 5,
        needVote: true,
      };
    case "default":
    default:
      return {
        voteItems: ["", ""],
        expiredDays: 0,
        maxVoteCount: 0,
        needVote: false,
      };
  }
}

function EditorVoteSettingsFixtureView({
  fixtureState,
}: {
  fixtureState: EditorVoteSettingsFixtureState;
}) {
  const [voteInfo, setVoteInfo] = React.useState(() =>
    createEditorVoteSettingsFixtureInfo(fixtureState),
  );
  const [changeCount, setChangeCount] = React.useState(0);

  return (
    <main
      data-fixture-component="editor-vote-settings"
      data-fixture-editor-vote-settings-state={fixtureState}
      data-fixture-editor-vote-settings-item-count={voteInfo.voteItems.length}
      data-fixture-editor-vote-settings-expired-days={voteInfo.expiredDays}
      data-fixture-editor-vote-settings-max-vote-count={voteInfo.maxVoteCount}
      data-fixture-editor-vote-settings-need-vote={String(voteInfo.needVote)}
      data-fixture-editor-vote-settings-change-count={changeCount}
      onClickCapture={(event) => {
        const target = event.target;
        if (target instanceof Element && target.closest("a")) {
          event.preventDefault();
        }
      }}
      onSubmitCapture={(event) => {
        event.preventDefault();
      }}
    >
      <EditorVoteSettings
        voteInfo={voteInfo}
        onVoteInfoChange={(nextVoteInfo) => {
          setVoteInfo(nextVoteInfo);
          setChangeCount((count) => count + 1);
        }}
      />
    </main>
  );
}

function EditorVoteSettingsFixture() {
  const [searchParams] = useSearchParams();
  const requestedState = searchParams.get("state");
  const fixtureState: EditorVoteSettingsFixtureState = [
    "default",
    "filled",
    "three-items",
    "twenty-items",
  ].includes(requestedState ?? "")
    ? (requestedState as EditorVoteSettingsFixtureState)
    : "default";

  return (
    <EditorVoteSettingsFixtureView
      key={fixtureState}
      fixtureState={fixtureState}
    />
  );
}

type EditorSubmitActionsFixtureState =
  | "not-allowed"
  | "force"
  | "allowed"
  | "only-poster-allowed"
  | "post-vote"
  | "edit-ubb"
  | "edit-markdown";

const editorSubmitActionsFixtureStates: EditorSubmitActionsFixtureState[] = [
  "not-allowed",
  "force",
  "allowed",
  "only-poster-allowed",
  "post-vote",
  "edit-ubb",
  "edit-markdown",
];

function EditorSubmitActionsFixtureView({
  fixtureState,
}: {
  fixtureState: EditorSubmitActionsFixtureState;
}) {
  const [clickCount, setClickCount] = React.useState(0);
  const [lastAction, setLastAction] = React.useState("none");

  const recordAction = (action: "post" | "anonymous-post" | "edit") => {
    setClickCount((count) => count + 1);
    setLastAction(action);
  };

  const postButton = (
    <button
      id="post-topic-button"
      type="button"
      data-fixture-editor-submit-action="post"
      onClick={() => recordAction("post")}
      className={`${editorPageStyles.button} ${editorPageStyles.blue} ${editorPageStyles.postTopicButton}`}
    >
      发帖
    </button>
  );
  const anonymousPostButton = (
    <button
      id="post-topic-button-anonymous"
      type="button"
      data-fixture-editor-submit-action="anonymous-post"
      onClick={() => recordAction("anonymous-post")}
      className={`${editorPageStyles.button} ${editorPageStyles.grey} ${editorPageStyles.postTopicButton}`}
    >
      匿名发帖
    </button>
  );
  const editButton = (
    <button
      id="post-topic-button"
      type="button"
      data-fixture-editor-submit-action="edit"
      onClick={() => recordAction("edit")}
      className={`${editorPageStyles.button} ${editorPageStyles.blue} ${editorPageStyles.postTopicButton}`}
    >
      编辑
    </button>
  );

  let layout: React.ReactNode;
  if (
    fixtureState === "allowed" ||
    fixtureState === "only-poster-allowed"
  ) {
    layout = (
      <div
        className={editorPageStyles.anonymousSubmitGroup}
        data-editor-submit-layout="choice"
      >
        <div>
          {postButton}
          {anonymousPostButton}
        </div>
        <p data-fixture-editor-submit-balance>
          在本版面匿名发主题每次需消耗10000财富值。你当前的财富值余额为：98000
        </p>
      </div>
    );
  } else if (fixtureState === "edit-markdown") {
    layout = (
      <div
        className={editorPageStyles.editorColumn}
        data-editor-submit-layout="edit-control"
      >
        <div className={editorPageStyles.submitRow}>{editButton}</div>
      </div>
    );
  } else {
    const singleButton =
      fixtureState === "force"
        ? anonymousPostButton
        : fixtureState === "edit-ubb"
          ? editButton
          : postButton;
    layout = (
      <div
        className={editorPageStyles.submitRow}
        data-editor-submit-layout="single"
      >
        {singleButton}
      </div>
    );
  }

  return (
    <main
      className={editorPageStyles.createTopic}
      data-fixture-component="editor-submit-actions"
      data-fixture-state={fixtureState}
      data-fixture-editor-submit-state={fixtureState}
      data-fixture-editor-submit-click-count={clickCount}
      data-fixture-editor-submit-last-action={lastAction}
    >
      {layout}
      <output data-fixture-editor-submit-telemetry aria-live="polite">
        clickCount={clickCount}; lastAction={lastAction}
      </output>
    </main>
  );
}

function EditorSubmitActionsFixture() {
  const [searchParams] = useSearchParams();
  const requestedState = searchParams.get("state");
  const fixtureState = editorSubmitActionsFixtureStates.includes(
    requestedState as EditorSubmitActionsFixtureState
  )
    ? (requestedState as EditorSubmitActionsFixtureState)
    : "not-allowed";

  return (
    <EditorSubmitActionsFixtureView
      key={fixtureState}
      fixtureState={fixtureState}
    />
  );
}

type UserCenterPagerFixtureState =
  | "short-current"
  | "long-middle"
  | "unknown-total";

const userCenterPagerFixtureProps = {
  "short-current": { currentPage: 4, totalPage: 7, hasTotal: true },
  "long-middle": { currentPage: 6, totalPage: 12, hasTotal: true },
  "unknown-total": { currentPage: 4, totalPage: 5, hasTotal: false },
} as const satisfies Record<
  UserCenterPagerFixtureState,
  { currentPage: number; totalPage: number; hasTotal: boolean }
>;

function UserCenterPagerFixture() {
  const [searchParams] = useSearchParams();
  const requestedState = searchParams.get("state");
  const fixtureState: UserCenterPagerFixtureState = [
    "short-current",
    "long-middle",
    "unknown-total",
  ].includes(requestedState ?? "")
    ? (requestedState as UserCenterPagerFixtureState)
    : "short-current";
  const { currentPage, totalPage, hasTotal } =
    userCenterPagerFixtureProps[fixtureState];

  return (
    <main
      data-fixture-component="user-center-pager"
      data-fixture-user-center-pager-case="user-center-pager"
      data-fixture-user-center-pager-state={fixtureState}
      data-fixture-user-center-pager-current={currentPage}
      data-fixture-user-center-pager-total={totalPage}
      data-fixture-user-center-pager-has-total={String(hasTotal)}
      onClickCapture={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
      onSubmitCapture={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
    >
      <UserCenterPager
        currentPage={currentPage}
        totalPage={totalPage}
        hasTotal={hasTotal}
        href="/__dev/visual-fixtures?case=user-center-pager&page="
      />
    </main>
  );
}

type BoardBatchFixtureAction = "delete" | "lock";
type BoardBatchFixtureState = "ok" | "pending" | "reject" | "http-error";

function BoardBatchManagerFixture() {
  const [searchParams] = useSearchParams();
  const requestedAction = searchParams.get("action");
  const requestedState = searchParams.get("state");
  const action: BoardBatchFixtureAction =
    requestedAction === "lock" ? "lock" : "delete";
  const fixtureState: BoardBatchFixtureState = [
    "ok",
    "pending",
    "reject",
    "http-error",
  ].includes(requestedState ?? "")
    ? (requestedState as BoardBatchFixtureState)
    : "ok";
  const [visible, setVisible] = React.useState(true);
  const [mutationState, setMutationState] = React.useState("idle");
  const [lastOperation, setLastOperation] = React.useState<
    BoardBatchFixtureAction | "none"
  >("none");
  const [lastPayload, setLastPayload] = React.useState("");
  const [operationCount, setOperationCount] = React.useState(0);
  const [outerCloseCount, setOuterCloseCount] = React.useState(0);
  const [mountGeneration, setMountGeneration] = React.useState(0);
  const [topics, setTopics] = React.useState<TopicInfo[]>(() => [...fakeTopics]);

  const runOperation = React.useCallback(
    (
      operation: BoardBatchFixtureAction,
      payload: { ids: number[]; reason: string; value?: number },
    ): Promise<Response> => {
      setLastOperation(operation);
      setLastPayload(JSON.stringify(payload));
      setOperationCount((count) => count + 1);
      setMutationState("pending");

      if (fixtureState === "pending") {
        return new Promise<Response>(() => undefined);
      }

      return new Promise<Response>((resolve, reject) => {
        queueMicrotask(() => {
          setMutationState(fixtureState);
          if (fixtureState === "reject") {
            reject(new Error("Synthetic board batch rejection"));
            return;
          }
          resolve(
            new Response(null, {
              status: fixtureState === "http-error" ? 500 : 200,
            }),
          );
        });
      });
    },
    [fixtureState],
  );

  const operations = React.useMemo<BoardBatchOperations>(
    () => ({
      multiDelete: (ids, reason) =>
        runOperation("delete", { ids, reason }),
      multiLock: (ids, reason, value) =>
        runOperation("lock", { ids, reason, value }),
    }),
    [runOperation],
  );

  const handleClose = () => {
    setOuterCloseCount((count) => count + 1);
    setVisible(false);
  };

  const handleReopen = () => {
    setMountGeneration((generation) => generation + 1);
    setVisible(true);
  };

  return (
    <main
      data-fixture-component="board-batch-manager"
      data-fixture-board-batch-action={action}
      data-fixture-board-batch-state={fixtureState}
      data-fixture-mutation-state={mutationState}
      data-fixture-last-operation={lastOperation}
      data-fixture-last-payload={lastPayload}
      data-fixture-operation-count={operationCount}
      data-fixture-outer-close-count={outerCloseCount}
      data-fixture-mount-generation={mountGeneration}
      data-fixture-board-batch-list-ids={JSON.stringify(
        topics.map((topic) => topic.id),
      )}
      data-fixture-visible={visible ? "true" : "false"}
    >
      <Button
        data-fixture-board-batch-reopen
        onClick={handleReopen}
      >
        Reopen board batch manager
      </Button>
      <Button
        data-fixture-board-batch-drop-first="true"
        onClick={() => setTopics((currentTopics) => currentTopics.slice(1))}
      >
        Drop first synthetic topic
      </Button>
      <Button
        data-fixture-board-batch-reset-list="true"
        onClick={() => setTopics([...fakeTopics])}
      >
        Reset synthetic topics
      </Button>
      <BoardBatchManagerFixtureHarness
        data={fakeBoard}
        list={topics}
        visible={visible}
        revision={mountGeneration}
        onClose={handleClose}
        operations={operations}
        onDropFirst={() =>
          setTopics((currentTopics) => currentTopics.slice(1))
        }
      />
    </main>
  );
}

type FavoriteGroupFixtureState =
  | "normal"
  | "only-default"
  | "limit"
  | "error"
  | "pending"
  | "reject"
  | "success";

type FavoriteGroupMutationKind = "create" | "rename" | "delete" | "update";

function FavoriteGroupFixture() {
  const [searchParams] = useSearchParams();
  const requestedState = searchParams.get("state");
  const fixtureState: FavoriteGroupFixtureState = [
    "normal",
    "only-default",
    "limit",
    "error",
    "pending",
    "reject",
    "success",
  ].includes(requestedState ?? "")
    ? (requestedState as FavoriteGroupFixtureState)
    : "normal";
  const fixtureRootRef = React.useRef<HTMLDivElement>(null);
  const [mutationState, setMutationState] = React.useState("idle");
  const [mutationCount, setMutationCount] = React.useState(0);
  const [lastMutation, setLastMutation] = React.useState<FavoriteGroupMutationKind | "none">("none");
  const [lastPayload, setLastPayload] = React.useState("");

  const groups = React.useMemo(() => {
    if (fixtureState === "only-default") return fakeFavoriteGroups.slice(0, 1);
    if (fixtureState !== "limit") return fakeFavoriteGroups;
    return [
      fakeFavoriteGroups[0],
      ...Array.from({ length: 10 }, (_, index) => ({
        id: 9810 + index,
        name: `Fixture group ${index + 1}`,
        count: index,
        createTime: `2000-02-${String(index + 1).padStart(2, "0")}T00:00:00.000Z`,
      })),
    ];
  }, [fixtureState]);

  const runMutation = async (
    kind: FavoriteGroupMutationKind,
    payload: unknown,
  ): Promise<"ok" | "error"> => {
    setMutationCount((count) => count + 1);
    setLastMutation(kind);
    setLastPayload(JSON.stringify(payload));
    setMutationState("pending");

    if (fixtureState === "pending") {
      await new Promise<never>(() => undefined);
    }
    if (fixtureState === "reject") {
      setMutationState("rejected");
      throw new Error("Synthetic favorite group mutation rejection");
    }
    if (fixtureState === "error") {
      setMutationState("error");
      return "error";
    }

    setMutationState("resolved");
    return "ok";
  };

  React.useEffect(() => {
    fixtureRootRef.current?.querySelector<HTMLButtonElement>("button")?.click();
  }, []);

  return (
    <div
      ref={fixtureRootRef}
      data-fixture-favorite-group-state={fixtureState}
      data-fixture-favorite-group-mutation-state={mutationState}
      data-fixture-favorite-group-mutation-count={mutationCount}
      data-fixture-favorite-group-last-mutation={lastMutation}
      data-fixture-favorite-group-last-payload={lastPayload}
    >
      <FavoriteTopicGroupManager
        favoriteTopicList={groups}
        createFavoriteTopicGroup={(name) => runMutation("create", { name })}
        renameFavoriteTopicGroup={(id, name) =>
          runMutation("rename", { id, name })
        }
        deleteFavoriteTopicGroup={(id) => runMutation("delete", { id })}
        updateFavoriteTopicList={async () => {
          await runMutation("update", null);
        }}
      />
    </div>
  );
}

type TopicHeaderFixtureState =
  | "unfavorited"
  | "favorited"
  | "pending"
  | "reject"
  | "success"
  | "long-title"
  | "tags"
  | "confirm";

type TopicHeaderMutationState =
  | "idle"
  | "pending"
  | "resolved"
  | "rejected";

const topicHeaderFixtureGroups: FavoriteTopicGroup[] = [
  {
    id: 0,
    name: "默认分组",
    count: 10,
    createTime: "2000-01-01T00:00:00.000Z",
  },
  {
    id: 9801,
    name: "Fixture group",
    count: 2,
    createTime: "2000-01-02T00:00:00.000Z",
  },
];

function TopicHeaderFixture() {
  const [searchParams] = useSearchParams();
  const requestedState = searchParams.get("state");
  const fixtureState: TopicHeaderFixtureState = [
    "unfavorited",
    "favorited",
    "pending",
    "reject",
    "success",
    "long-title",
    "tags",
    "confirm",
  ].includes(requestedState ?? "")
    ? (requestedState as TopicHeaderFixtureState)
    : "unfavorited";
  const [mutationState, setMutationState] =
    React.useState<TopicHeaderMutationState>("idle");
  const [putCount, setPutCount] = React.useState(0);
  const [deleteCount, setDeleteCount] = React.useState(0);
  const [copyCount, setCopyCount] = React.useState(0);
  const [lastGroupId, setLastGroupId] = React.useState<number | null>(null);

  const isDialogState = ["pending", "reject", "success", "confirm"].includes(
    fixtureState,
  );
  const hasTags = fixtureState === "tags";
  const title =
    fixtureState === "long-title"
      ? "这是一个用于验证主题标题截断与布局稳定性的合成超长标题，内容不对应任何真实帖子，并且需要超过既有的六十五字符截断边界以覆盖旧版显示行为。"
      : "Synthetic Topic Header";
  const topicInfo = {
    id: 980001,
    title,
    favoriteCount: 12,
    time: "2000-01-01T08:00:00.000Z",
    hitCount: 98,
  };
  const boardInfo = {
    id: 9800,
    name: "Fixture Board",
    todayCount: 9,
    topicCount: 98,
  };

  const syntheticPut = async (_topicId: number, groupId = 0) => {
    setPutCount((count) => count + 1);
    setLastGroupId(groupId);
    setMutationState("pending");

    if (fixtureState === "pending") {
      await new Promise<never>(() => undefined);
    }
    if (fixtureState === "reject") {
      await new Promise<void>((resolve) => window.setTimeout(resolve, 300));
      setMutationState("rejected");
      throw new Error("Synthetic topic favorite rejection");
    }
    if (fixtureState === "success") {
      await new Promise<void>((resolve) => window.setTimeout(resolve, 600));
    }

    setMutationState("resolved");
    return "ok" as const;
  };
  return (
    <main
      className={styles.topicHeaderFixture}
      data-fixture-component="topic-header"
      data-fixture-topic-header-state={fixtureState}
      data-fixture-topic-header-mutation-state={mutationState}
      data-fixture-topic-header-put-count={putCount}
      data-fixture-topic-header-delete-count={deleteCount}
      data-fixture-topic-header-copy-count={copyCount}
      data-fixture-topic-header-last-group={lastGroupId ?? ""}
    >
      <TopicHeader
        key={fixtureState}
        topicInfo={topicInfo}
        boardInfo={boardInfo}
        tag1={hasTags ? 9801 : null}
        tag2={hasTags ? 9802 : null}
        isFav={fixtureState === "favorited"}
        defaultFollowDialogOpen={isDialogState}
        favoriteTopicGroups={topicHeaderFixtureGroups}
        getTagName={async (tagId) => `Fixture tag ${tagId}`}
        setFavorite={syntheticPut}
        deleteFavorite={async () => {
          setDeleteCount((count) => count + 1);
          setMutationState("resolved");
          return "ok";
        }}
        copyText={async () => {
          setCopyCount((count) => count + 1);
        }}
        advertisement={
          <div
            className={styles.topicHeaderAdvertisement}
            aria-label="Synthetic advertisement placeholder"
          />
        }
      />
    </main>
  );
}

function TopicLockedTipFixture() {
  return (
    <main
      className={styles.topicLockedTipFixture}
      data-fixture-component="topic-locked-tip"
    >
      <div
        className={topicPageStyles.paginationSection}
        data-fixture-topic-pagination-section
      >
        <div
          className={topicPageStyles.paginationRow}
          data-fixture-topic-pagination-row
        >
          <div className={styles.topicLockedTipPaginationPlaceholder} />
        </div>
        <div className={topicPageStyles.lockedTip}>该帖已被锁定</div>
      </div>
      <div
        className={styles.topicLockedTipHeaderBoundary}
        data-fixture-topic-header-boundary
      />
    </main>
  );
}

type TopicReplierShadowFixtureState =
  | "no-shadow"
  | "default-shadow"
  | "ordinary-frame"
  | "annual-frame"
  | "no-frame"
  | "anonymous";

function TopicReplierShadowFixture() {
  const [searchParams] = useSearchParams();
  const requestedState = searchParams.get("state");
  let fixtureState: TopicReplierShadowFixtureState = "no-shadow";
  if (
    requestedState === "default-shadow" ||
    requestedState === "ordinary-frame" ||
    requestedState === "annual-frame" ||
    requestedState === "no-frame" ||
    requestedState === "anonymous"
  ) {
    fixtureState = requestedState;
  }
  const displayTitleId =
    fixtureState === "ordinary-frame"
      ? 999
      : fixtureState === "annual-frame"
        ? 104
        : fixtureState === "no-frame" || fixtureState === "default-shadow"
          ? 0
          : 82;
  const isAnonymous = fixtureState === "anonymous";
  const userInfo = {
    id: 98201,
    name: "fixture-replier",
    portraitUrl: "/static/images/default_avatar_boy.png",
    displayTitleId,
    isFollowing: false,
    fanCount: 4,
    postCount: 84,
    prestige: 16,
    lastLogOnTime: "2000-01-01T08:00:00.000Z",
    privilege: "普通用户",
    gender: UserGender.Female,
  };

  return (
    <main
      className={styles.topicReplierShadowFixture}
      data-fixture-component="topic-replier-shadow"
      data-fixture-topic-replier-shadow-state={fixtureState}
      data-fixture-topic-replier-display-title-id={displayTitleId}
      onClickCapture={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
      onSubmitCapture={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
    >
      <div data-fixture-topic-replier>
        <TopicReplier
          key={fixtureState}
          userInfo={userInfo}
          isAnonymous={isAnonymous}
          topicInfo={{ id: 980001 }}
          traceMode={false}
          isHot={false}
        />
      </div>
    </main>
  );
}

type TopicVoteFixtureState =
  | "expired-results"
  | "available"
  | "my-record"
  | "need-vote"
  | "empty";

const topicVoteFixtureItems = [
  { id: 98101, description: "Synthetic option alpha", count: 18 },
  { id: 98102, description: "Synthetic option beta", count: 12 },
  {
    id: 98103,
    description:
      "Synthetic option with a deliberately long description for layout coverage",
    count: 9,
  },
  { id: 98104, description: "Synthetic option delta", count: 6 },
  { id: 98105, description: "Synthetic option epsilon", count: 3 },
];

const topicVoteFixtureRecord: VoteRecord = {
  userId: 98201,
  userName: "fixture-voter",
  items: [98102, 98104],
  ip: "192.0.2.20",
  time: "2000-01-01T09:00:00.000Z",
};

function createTopicVoteFixtureInfo(
  fixtureState: TopicVoteFixtureState,
): VoteInfo {
  const voteInfo: VoteInfo = {
    topicId: 980001,
    voteItems: topicVoteFixtureItems,
    voteRecords: null,
    expiredTime: "2000-01-08T08:00:00.000Z",
    isAvailable: true,
    maxVoteCount: 2,
    canVote: true,
    myRecord: null,
    needVote: false,
    voteUserCount: 42,
  };

  switch (fixtureState) {
    case "expired-results":
      return { ...voteInfo, isAvailable: false, canVote: false };
    case "my-record":
      return { ...voteInfo, canVote: false, myRecord: topicVoteFixtureRecord };
    case "need-vote":
      return { ...voteInfo, needVote: true };
    case "empty":
      return {
        ...voteInfo,
        voteItems: [],
        isAvailable: false,
        canVote: false,
        voteUserCount: 0,
      };
    case "available":
    default:
      return voteInfo;
  }
}

function TopicVoteFixture() {
  const [searchParams] = useSearchParams();
  const requestedState = searchParams.get("state");
  const fixtureState: TopicVoteFixtureState = [
    "expired-results",
    "available",
    "my-record",
    "need-vote",
    "empty",
  ].includes(requestedState ?? "")
    ? (requestedState as TopicVoteFixtureState)
    : "expired-results";
  const [submitCount, setSubmitCount] = React.useState(0);
  const [refreshCount, setRefreshCount] = React.useState(0);
  const [lastItems, setLastItems] = React.useState<number[]>([]);
  const voteInfo = createTopicVoteFixtureInfo(fixtureState);
  const topicInfo = {
    id: voteInfo.topicId,
    userId: -980001,
  } as TopicInfo;

  return (
    <main
      className={styles.topicVoteFixture}
      data-fixture-component="topic-vote"
      data-fixture-topic-vote-state={fixtureState}
      data-fixture-topic-vote-submit-count={submitCount}
      data-fixture-topic-vote-refresh-count={refreshCount}
      data-fixture-topic-vote-last-items={JSON.stringify(lastItems)}
    >
      <div className={styles.topicVoteFixturePanel}>
        <TopicVote
          key={fixtureState}
          topicInfo={topicInfo}
          voteInfo={voteInfo}
          getInfo={() => setRefreshCount((count) => count + 1)}
          submitVote={async (_topicId, items) => {
            setSubmitCount((count) => count + 1);
            setLastItems(items);
            return new Response(null, { status: 204 });
          }}
        />
      </div>
    </main>
  );
}

type PostManagementFixtureAction =
  | "wealth"
  | "prestige"
  | "deduct-wealth"
  | "deduct-prestige"
  | "delete"
  | "tp"
  | "cancel-tp";

type PostManagementFixtureState =
  | "idle"
  | "pending"
  | "ok"
  | "limited"
  | "unauthorized"
  | "reject";

type PostManagementMutationState =
  | "idle"
  | "pending"
  | "ok"
  | "limited"
  | "unauthorized"
  | "rejected";

const postManagementActionMap: Record<
  PostManagementFixtureAction,
  PostManagementAction
> = {
  wealth: "wealth",
  prestige: "prestige",
  "deduct-wealth": "punishwealth",
  "deduct-prestige": "punishprestige",
  delete: "delete",
  tp: "tp",
  "cancel-tp": "canceltp",
};

function PostManagementDialogFixture() {
  const [searchParams] = useSearchParams();
  const requestedAction = searchParams.get("action");
  const fixtureAction: PostManagementFixtureAction = [
    "wealth",
    "prestige",
    "deduct-wealth",
    "deduct-prestige",
    "delete",
    "tp",
    "cancel-tp",
  ].includes(requestedAction ?? "")
    ? (requestedAction as PostManagementFixtureAction)
    : "wealth";
  const requestedState = searchParams.get("state");
  const fixtureState: PostManagementFixtureState = [
    "idle",
    "pending",
    "ok",
    "limited",
    "unauthorized",
    "reject",
  ].includes(requestedState ?? "")
    ? (requestedState as PostManagementFixtureState)
    : "idle";
  const [visible, setVisible] = React.useState(true);
  const [mutationState, setMutationState] =
    React.useState<PostManagementMutationState>("idle");
  const [lastOperation, setLastOperation] = React.useState("none");
  const [lastPayload, setLastPayload] = React.useState("");
  const [operationCount, setOperationCount] = React.useState(0);
  const [updateCount, setUpdateCount] = React.useState(0);
  const [closeCount, setCloseCount] = React.useState(0);

  const runOperation = async (operation: string, payload: unknown) => {
    setLastOperation(operation);
    setLastPayload(JSON.stringify(payload));
    setOperationCount((count) => count + 1);
    setMutationState("pending");

    if (fixtureState === "pending") {
      await new Promise<never>(() => undefined);
    }
    if (fixtureState === "reject") {
      setMutationState("rejected");
      throw new Error("Synthetic post management operation rejection");
    }
    if (fixtureState === "limited") {
      setMutationState("limited");
      return "limited" as const;
    }
    if (fixtureState === "unauthorized") {
      setMutationState("unauthorized");
      return "unauthorized" as const;
    }

    setMutationState("ok");
    return "ok" as const;
  };

  const operations: PostManagementOperations = {
    awardWealth: (reason, value, postId) =>
      runOperation("awardWealth", { reason, value, postId }),
    addPrestige: (postId, value, reason) =>
      runOperation("addPrestige", { postId, value, reason }),
    deductWealth: (reason, value, postId) =>
      runOperation("deductWealth", { reason, value, postId }),
    deductPrestige: (postId, value, reason) =>
      runOperation("deductPrestige", { postId, value, reason }),
    deletePost: (topicId, postId, reason) =>
      runOperation("deletePost", { topicId, postId, reason }),
    stopBoardPost: (postId, reason, days) =>
      runOperation("stopBoardPost", { postId, reason, days }),
    cancelStopBoardPost: (userId, boardId) =>
      runOperation("cancelStopBoardPost", { userId, boardId }),
  };

  return (
    <main
      className={styles.postManagementFixture}
      data-fixture-component="post-management-dialog"
      data-fixture-post-management-action={fixtureAction}
      data-fixture-post-management-state={fixtureState}
      data-fixture-post-management-mutation-state={mutationState}
      data-fixture-post-management-last-operation={lastOperation}
      data-fixture-post-management-last-payload={lastPayload}
      data-fixture-post-management-operation-count={operationCount}
      data-fixture-post-management-update-count={updateCount}
      data-fixture-post-management-close-count={closeCount}
      data-fixture-post-management-visible={visible ? "true" : "false"}
    >
      <Button
        data-fixture-post-management-reopen
        className={visible ? styles.hiddenDialogTrigger : undefined}
        onClick={() => setVisible(true)}
      >
        重新打开发言管理
      </Button>
      <PostManagementDialog
        key={`${fixtureAction}:${fixtureState}`}
        update={() => setUpdateCount((count) => count + 1)}
        privilege="0"
        item={{ id: 980001, topicId: 980002, userId: 980003 }}
        boardId={9800}
        d_wealth={0}
        m_wealth={10}
        boardName="Fixture Board"
        visible={visible}
        onCancel={() => {
          setCloseCount((count) => count + 1);
          setVisible(false);
        }}
        operations={operations}
        initialAction={postManagementActionMap[fixtureAction]}
      />
    </main>
  );
}

type TopicManagementFixtureState =
  | "idle"
  | "ok"
  | "pending"
  | "non-ok"
  | "reject";

type TopicManagementBoardState = "ready" | "loading" | "empty" | "reject";
type TopicManagementEntryState = "manager" | "author" | "none";

const topicManagementActions: TopicManagementAction[] = [
  "lock",
  "hot",
  "delete",
  "move",
  "bump",
  "board-top",
  "global-top",
  "best",
  "highlight",
];

const topicManagementFixtureBoards = [
  {
    id: 9800,
    name: "Fixture category",
    order: 1,
    masters: ["fixture-manager"],
    boards: [
      { id: 9801, name: "Fixture Board Alpha" },
      { id: 182, name: "Excluded Fixture Board" },
      { id: 9802, name: "Fixture Board Beta" },
    ],
  },
  {
    id: 9810,
    name: "Fixture category two",
    order: 2,
    masters: [],
    boards: [{ id: 9811, name: "Fixture Board Gamma" }],
  },
] as BoardCategoryInfo[];

function TopicManagementDialogFixture() {
  const [searchParams] = useSearchParams();
  const requestedAction = searchParams.get("action");
  const fixtureAction = topicManagementActions.includes(
    requestedAction as TopicManagementAction,
  )
    ? (requestedAction as TopicManagementAction)
    : "lock";
  const requestedState = searchParams.get("state");
  const fixtureState: TopicManagementFixtureState = [
    "idle",
    "ok",
    "pending",
    "non-ok",
    "reject",
  ].includes(requestedState ?? "")
    ? (requestedState as TopicManagementFixtureState)
    : "idle";
  const requestedBoards = searchParams.get("boards");
  const fixtureBoardState: TopicManagementBoardState = [
    "ready",
    "loading",
    "empty",
    "reject",
  ].includes(requestedBoards ?? "")
    ? (requestedBoards as TopicManagementBoardState)
    : "ready";
  const requestedEntry = searchParams.get("entry");
  const fixtureEntry: TopicManagementEntryState = [
    "manager",
    "author",
    "none",
  ].includes(requestedEntry ?? "")
    ? (requestedEntry as TopicManagementEntryState)
    : "manager";
  const reverse = searchParams.get("reverse") === "1";
  const entryVisible = fixtureEntry !== "none";
  const isManager = fixtureEntry === "manager";
  const permissions = fixtureEntry === "author" ? ["delete"] : [];
  const [visible, setVisible] = React.useState(entryVisible);
  const [operationCount, setOperationCount] = React.useState(0);
  const [loadCount, setLoadCount] = React.useState(0);
  const [lastOperation, setLastOperation] = React.useState("none");
  const [lastPayload, setLastPayload] = React.useState("none");
  const [mutationState, setMutationState] = React.useState("idle");
  const [failureCount, setFailureCount] = React.useState(0);
  const [lastFailure, setLastFailure] = React.useState("none");
  const [updateCount, setUpdateCount] = React.useState(0);
  const [closeCount, setCloseCount] = React.useState(0);

  const runOperation = React.useCallback(
    async (operation: string, payload: unknown) => {
      setOperationCount((count) => count + 1);
      setLastOperation(operation);
      setLastPayload(JSON.stringify(payload));
      setMutationState("pending");

      if (fixtureState === "pending") {
        await new Promise<never>(() => undefined);
      }
      if (fixtureState === "reject") {
        setMutationState("rejected");
        throw new Error("Synthetic topic management rejection");
      }
      if (fixtureState === "non-ok") {
        setMutationState("non-ok");
        return "unauthorized" as const;
      }

      setMutationState("ok");
      return "ok" as const;
    },
    [fixtureState],
  );

  const loadBoards = React.useCallback(async () => {
    setLoadCount((count) => count + 1);
    if (fixtureBoardState === "loading") {
      await new Promise<never>(() => undefined);
    }
    if (fixtureBoardState === "reject") {
      throw new Error("Synthetic board load rejection");
    }
    if (fixtureBoardState === "empty") return [];
    await new Promise((resolve) => window.setTimeout(resolve, 80));
    return topicManagementFixtureBoards;
  }, [fixtureBoardState]);

  const operations = React.useMemo<TopicManagementOperations>(
    () => ({
      loadBoards,
      lockTopic: (topicId, boardId, reason, days) =>
        runOperation("lockTopic", { topicId, boardId, reason, days }),
      unLockTopic: (topicId, boardId, reason) =>
        runOperation("unLockTopic", { topicId, boardId, reason }),
      setDisableHot: (topicId, reason) =>
        runOperation("setDisableHot", { topicId, reason }),
      cancelDisableHot: (topicId, reason) =>
        runOperation("cancelDisableHot", { topicId, reason }),
      deleteTopic: (topicId, reason) =>
        runOperation("deleteTopic", { topicId, reason }),
      moveTopic: (topicId, boardId, reason) =>
        runOperation("moveTopic", { topicId, boardId, reason }),
      upTopic: (topicId, boardId, reason) =>
        runOperation("upTopic", { topicId, boardId, reason }),
      addBoardTopTopic: (topicId, boardId, topState, days, reason) =>
        runOperation("addBoardTopTopic", {
          topicId,
          boardId,
          topState,
          days,
          reason,
        }),
      removeBoardTopTopic: (topicId, boardId, reason) =>
        runOperation("removeBoardTopTopic", { topicId, boardId, reason }),
      setBestTopic: (topicId, reason) =>
        runOperation("setBestTopic", { topicId, reason }),
      cancelBestTopic: (topicId, reason) =>
        runOperation("cancelBestTopic", { topicId, reason }),
      setHighlight: (
        topicId,
        isBold,
        isItalic,
        color,
        duration,
        reason,
      ) =>
        runOperation("setHighlight", {
          topicId,
          isBold,
          isItalic,
          color,
          duration,
          reason,
        }),
      notifyFailure: (failure) => {
        setFailureCount((count) => count + 1);
        setLastFailure(
          failure instanceof Error ? failure.message : String(failure),
        );
      },
    }),
    [loadBoards, runOperation],
  );

  const topicInfo = {
    id: 980001,
    state:
      reverse && fixtureAction === "lock"
        ? TopicState.Locked
        : TopicState.Normal,
    disableHot: reverse && fixtureAction === "hot",
    topState:
      reverse && fixtureAction === "board-top"
        ? TopicTopState.BoardTop
        : reverse && fixtureAction === "global-top"
          ? TopicTopState.AllTop
          : TopicTopState.None,
    bestState:
      reverse && fixtureAction === "best"
        ? TopicBestState.Best
        : TopicBestState.None,
  };
  const dayOptionSummary =
    fixtureAction === "lock" && !reverse
      ? "0,7,14,30,98,180,365,1000,10000"
      : ((fixtureAction === "board-top" ||
            fixtureAction === "global-top") &&
          !reverse) ||
          fixtureAction === "highlight"
        ? "7,14,30,98,180,365,1000,10000"
        : "none";

  return (
    <main
      className={styles.topicManagementFixture}
      data-fixture-component="topic-management-dialog"
      data-fixture-topic-management-action={fixtureAction}
      data-fixture-topic-management-state={fixtureState}
      data-fixture-topic-management-boards={fixtureBoardState}
      data-fixture-topic-management-entry={fixtureEntry}
      data-fixture-topic-management-entry-visible={entryVisible ? "true" : "false"}
      data-fixture-topic-management-reverse={reverse ? "true" : "false"}
      data-fixture-topic-management-visible={visible ? "true" : "false"}
      data-fixture-topic-management-operation-count={operationCount}
      data-fixture-topic-management-load-count={loadCount}
      data-fixture-topic-management-last-operation={lastOperation}
      data-fixture-topic-management-last-payload={lastPayload}
      data-fixture-topic-management-mutation-state={mutationState}
      data-fixture-topic-management-failure-count={failureCount}
      data-fixture-topic-management-last-failure={lastFailure}
      data-fixture-topic-management-update-count={updateCount}
      data-fixture-topic-management-close-count={closeCount}
      data-fixture-topic-management-initial-days="0"
      data-fixture-topic-management-day-options={dayOptionSummary}
    >
      {entryVisible && (
        <Button
          data-fixture-topic-management-reopen
          className={visible ? styles.hiddenDialogTrigger : undefined}
          onClick={() => setVisible(true)}
        >
          重新打开帖子管理
        </Button>
      )}
      <output
        className={styles.topicManagementTelemetry}
        data-fixture-topic-management-telemetry
        aria-live="polite"
      >
        action={fixtureAction}; state={fixtureState}; boards=
        {fixtureBoardState}; entry={fixtureEntry}; reverse={String(reverse)};
        visible={String(visible)}; operations={operationCount}; loads={loadCount};
        lastOperation={lastOperation}; payload={lastPayload}; mutation=
        {mutationState}; failures={failureCount}; lastFailure={lastFailure};
        updates={updateCount}; closes={closeCount}
        ; initialDays=0; dayOptions={dayOptionSummary}
      </output>
      {entryVisible && (
        <TopicManagementDialog
          key={`${fixtureAction}:${fixtureState}:${fixtureBoardState}:${fixtureEntry}:${reverse}`}
          visible={visible}
          onCancel={() => {
            setCloseCount((count) => count + 1);
            setVisible(false);
          }}
          topicInfo={topicInfo}
          update={() => setUpdateCount((count) => count + 1)}
          boardId={9800}
          isManager={isManager}
          permissions={permissions}
          operations={operations}
          initialAction={fixtureAction}
        />
      )}
    </main>
  );
}

function EditorLengthAlertFixture() {
  const [open, setOpen] = React.useState(true);

  return (
    <>
      <Button
        data-fixture-dialog-trigger
        className={open ? styles.hiddenDialogTrigger : undefined}
        onClick={() => setOpen(true)}
      >
        打开提示
      </Button>
      <Dialog
        title="错误提示"
        open={open}
        onOpenChange={setOpen}
        maskClosable={false}
      >
        内容过长，不应超过8000个字符。
        <br />
        当前字符数：8001。
      </Dialog>
    </>
  );
}

function HistoryConfirmDialogFixture() {
  const [open, setOpen] = React.useState(true);
  const [enabled, setEnabled] = React.useState(true);
  const [confirmCount, setConfirmCount] = React.useState(0);

  return (
    <div
      data-fixture-history-enabled={enabled}
      data-fixture-history-confirm-count={confirmCount}
    >
      <Button
        data-fixture-history-confirm-trigger
        className={open ? styles.hiddenDialogTrigger : undefined}
        onClick={() => setOpen(true)}
      >
        打开浏览历史确认框
      </Button>
      <Dialog
        open={open}
        title={
          enabled ? "确定要关闭浏览历史吗？" : "确定要开启浏览历史吗？"
        }
        confirmText="确 认"
        cancelText="取 消"
        onOpenChange={setOpen}
        onConfirm={() => {
          setOpen(false);
          setConfirmCount((count) => count + 1);
          setEnabled((value) => !value);
        }}
        width="50rem"
      >
        <p>
          {enabled
            ? "该设置将在网页版和小程序中同步。关闭期间不记录主题帖浏览历史。"
            : "该设置将在网页版和小程序中同步。开启后，将保存最近30天的主题帖浏览历史。"}
        </p>
      </Dialog>
    </div>
  );
}

function AsyncConfirmDialogFixture() {
  const [open, setOpen] = React.useState(true);
  const [status, setStatus] = React.useState<"idle" | "pending" | "resolved">(
    "idle",
  );

  return (
    <div data-fixture-async-confirm-status={status}>
      <Button
        data-fixture-async-confirm-trigger
        className={open ? styles.hiddenDialogTrigger : undefined}
        onClick={() => {
          setStatus("idle");
          setOpen(true);
        }}
      >
        打开异步确认框
      </Button>
      <Dialog
        open={open}
        title="异步确认"
        cancelText="取 消"
        onOpenChange={setOpen}
        confirmDisabled={status === "pending"}
        confirmLoading={status === "pending"}
        onConfirm={async () => {
          setStatus("pending");
          await new Promise<void>((resolve) => {
            window.setTimeout(resolve, 500);
          });
          setStatus("resolved");
          setOpen(false);
        }}
      >
        <p>本地异步操作完成后关闭。</p>
      </Dialog>
    </div>
  );
}

type AnnouncementSaveState = "idle" | "pending" | "resolved" | "rejected";

function BoardAnnouncementDialogFixture() {
  const [open, setOpen] = React.useState(true);
  const [editorMounted, setEditorMounted] = React.useState(true);
  const [openChangeCount, setOpenChangeCount] = React.useState(0);
  const [saveState, setSaveState] = React.useState<AnnouncementSaveState>("idle");
  const [saveCount, setSaveCount] = React.useState(0);
  const [lastPayload, setLastPayload] = React.useState<string | null>(null);

  const save = async (content: string) => {
    setSaveCount((count) => count + 1);
    setLastPayload(content);
    setSaveState("pending");

    if (content.startsWith("unmount-")) {
      window.setTimeout(() => setEditorMounted(false), 25);
    }

    await new Promise<void>((resolve) => {
      window.setTimeout(
        resolve,
        content === "stale" || content.startsWith("unmount-") ? 800 : 250,
      );
    });

    if (content === "reject" || content === "unmount-reject") {
      setSaveState("rejected");
      throw new Error("Synthetic announcement save rejection");
    }

    setSaveState("resolved");
  };

  return (
    <div
      data-fixture-announcement-open={open}
      data-fixture-announcement-mounted={editorMounted}
      data-fixture-announcement-open-change-count={openChangeCount}
      data-fixture-announcement-save-state={saveState}
      data-fixture-announcement-save-count={saveCount}
      data-fixture-announcement-last-payload={lastPayload ?? ""}
      data-fixture-announcement-payload-type={
        lastPayload === null ? "none" : typeof lastPayload
      }
    >
      <Button
        data-fixture-announcement-trigger
        className={open && editorMounted ? styles.hiddenDialogTrigger : undefined}
        onClick={() => {
          setSaveState("idle");
          setEditorMounted(true);
          setOpen(true);
        }}
      >
        打开大字报编辑框
      </Button>
      {editorMounted && (
        <BoardAnnouncementEditorDialog
          open={open}
          initialContent={null}
          onOpenChange={(nextOpen) => {
            setOpenChangeCount((count) => count + 1);
            setOpen(nextOpen);
          }}
          save={save}
        />
      )}
    </div>
  );
}

const selectFixtureOptions = [
  { value: -1, label: "全部" },
  { value: 101, label: "数字选项" },
  { value: 202, label: "这是一个用于检查省略效果的很长选项标签" },
  { value: 303, label: "禁用选项", disabled: true },
] as const;

function SelectFixture() {
  const [controlledValue, setControlledValue] = React.useState<number>(101);
  const openSelectRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    openSelectRef.current?.querySelector<HTMLButtonElement>("button")?.click();
  }, []);

  return (
    <main className={styles.selectFixture} data-fixture-component="select">
      <div data-fixture-select-state="controlled">
        <Select
          className={styles.selectControl}
          ariaLabel="受控选择器"
          name="fixture-controlled-select"
          options={selectFixtureOptions}
          value={controlledValue}
          onValueChange={(value) => {
            if (value !== null) setControlledValue(value);
          }}
        />
      </div>
      <div ref={openSelectRef} data-fixture-select-state="uncontrolled-open">
        <Select
          className={styles.selectControl}
          ariaLabel="非受控选择器"
          options={selectFixtureOptions}
          defaultValue={202}
        />
      </div>
      <div data-fixture-select-state="disabled">
        <Select
          className={styles.selectControl}
          ariaLabel="禁用选择器"
          options={selectFixtureOptions}
          defaultValue={101}
          disabled
        />
      </div>
    </main>
  );
}

type NumberInputFixtureState =
  | "default"
  | "focus"
  | "disabled"
  | "readonly"
  | "invalid"
  | "value"
  | "minmax"
  | "decimal"
  | "large"
  | "min-boundary";

function NumberInputFixture() {
  const [searchParams] = useSearchParams();
  const requestedState = searchParams.get("state");
  const fixtureState: NumberInputFixtureState = [
    "default",
    "focus",
    "disabled",
    "readonly",
    "invalid",
    "value",
    "minmax",
    "decimal",
    "large",
    "min-boundary",
  ].includes(requestedState ?? "")
    ? (requestedState as NumberInputFixtureState)
    : "default";
  const initialValue =
    fixtureState === "value"
      ? 42
      : fixtureState === "minmax"
        ? 10
        : fixtureState === "decimal"
          ? 1.23456789
          : fixtureState === "large"
            ? 123456789
            : fixtureState === "min-boundary"
              ? 0
              : 12;
  const [controlledValue, setControlledValue] = React.useState<number | null>(
    initialValue,
  );
  const [observedValue, setObservedValue] = React.useState<number | null>(
    initialValue,
  );
  const [changeCount, setChangeCount] = React.useState(0);
  const isControlled = fixtureState === "value";

  return (
    <main
      className={styles.inputPrimitiveFixture}
      data-fixture-component="number-input"
      data-fixture-number-input-state={fixtureState}
      data-fixture-number-input-value={observedValue ?? ""}
      data-fixture-number-input-change-count={changeCount}
    >
      <form data-fixture-native-form onSubmit={(event) => event.preventDefault()}>
        <NumberInput
          key={fixtureState}
          className={styles.numberInputFixtureControl}
          value={isControlled ? controlledValue : undefined}
          defaultValue={isControlled ? undefined : initialValue}
          onValueChange={(nextValue) => {
            if (isControlled) setControlledValue(nextValue);
            setObservedValue(nextValue);
            setChangeCount((count) => count + 1);
          }}
          min={
            fixtureState === "minmax" || fixtureState === "min-boundary"
              ? 0
              : undefined
          }
          max={
            fixtureState === "minmax" || fixtureState === "min-boundary"
              ? 10
              : undefined
          }
          step={fixtureState === "minmax" ? 2 : 1}
          disabled={fixtureState === "disabled"}
          readOnly={fixtureState === "readonly"}
          status={fixtureState === "invalid" ? "error" : undefined}
          ariaInvalid={fixtureState === "invalid"}
          ariaLabel="Fixture number input"
          ariaDescribedBy={
            fixtureState === "invalid" ? "fixture-number-input-error" : undefined
          }
          autoFocus={fixtureState === "focus"}
          name="fixture-number"
        />
        {fixtureState === "invalid" && (
          <span id="fixture-number-input-error" className={styles.fixtureError}>
            Synthetic invalid number
          </span>
        )}
      </form>
    </main>
  );
}

type TagsInputFixtureState =
  | "default"
  | "focus"
  | "disabled"
  | "readonly"
  | "invalid"
  | "value"
  | "open"
  | "selected"
  | "custom"
  | "wrap"
  | "duplicate"
  | "blank"
  | "backspace"
  | "remove"
  | "hidden";

const tagsInputFixtureOptions = ["好文章", "有用资源", "热心回复"];

function TagsInputFixture() {
  const [searchParams] = useSearchParams();
  const requestedState = searchParams.get("state");
  const fixtureState: TagsInputFixtureState = [
    "default",
    "focus",
    "disabled",
    "readonly",
    "invalid",
    "value",
    "open",
    "selected",
    "custom",
    "wrap",
    "duplicate",
    "blank",
    "backspace",
    "remove",
    "hidden",
  ].includes(requestedState ?? "")
    ? (requestedState as TagsInputFixtureState)
    : "default";
  const initialValue =
    fixtureState === "custom"
      ? ["Fixture custom"]
      : fixtureState === "wrap"
        ? ["好文章", "有用资源", "热心回复", "Fixture custom", "Long fixture tag"]
        : fixtureState === "backspace" || fixtureState === "hidden"
          ? ["好文章", "有用资源"]
          : ["好文章"];
  const startsEmpty = ["default", "focus", "open", "invalid", "blank"].includes(
    fixtureState,
  );
  const [controlledValue, setControlledValue] = React.useState<string[]>(
    startsEmpty ? [] : initialValue,
  );
  const [observedValue, setObservedValue] = React.useState<string[]>(
    startsEmpty ? [] : initialValue,
  );
  const [changeCount, setChangeCount] = React.useState(0);
  const isControlled = fixtureState === "value";

  return (
    <main
      className={styles.inputPrimitiveFixture}
      data-fixture-component="tags-input"
      data-fixture-tags-input-state={fixtureState}
      data-fixture-tags-input-value={JSON.stringify(observedValue)}
      data-fixture-tags-input-change-count={changeCount}
    >
      <form data-fixture-native-form onSubmit={(event) => event.preventDefault()}>
        <TagsInput
          key={fixtureState}
          className={styles.tagsInputFixtureControl}
          value={isControlled ? controlledValue : undefined}
          defaultValue={
            isControlled ? undefined : startsEmpty ? [] : initialValue
          }
          onValueChange={(nextValue) => {
            if (isControlled) setControlledValue(nextValue);
            setObservedValue(nextValue);
            setChangeCount((count) => count + 1);
          }}
          options={tagsInputFixtureOptions}
          disabled={fixtureState === "disabled"}
          readOnly={fixtureState === "readonly"}
          status={fixtureState === "invalid" ? "error" : undefined}
          ariaInvalid={fixtureState === "invalid"}
          ariaLabel="Fixture tags input"
          ariaDescribedBy={
            fixtureState === "invalid" ? "fixture-tags-input-error" : undefined
          }
          autoFocus={[
            "focus",
            "duplicate",
            "blank",
            "backspace",
          ].includes(fixtureState)}
          defaultOpen={fixtureState === "open" || fixtureState === "selected"}
          placeholder="请选择或输入"
          name="fixture-tags"
        />
        {fixtureState === "invalid" && (
          <span id="fixture-tags-input-error" className={styles.fixtureError}>
            Synthetic invalid tags
          </span>
        )}
      </form>
    </main>
  );
}

type FavoriteTopicFixtureStatus =
  | "idle"
  | "pending"
  | "resolved"
  | "rejected";

const favoriteTopicFixtureGroups = [
  { value: 0, label: "Fixture default group (4)" },
  { value: 9801, label: "Fixture group A (2)" },
] as const;

function FavoriteTopicItemFixture() {
  const [searchParams] = useSearchParams();
  const initialState = searchParams.get("state");
  const [menuOpen, setMenuOpen] = React.useState(initialState === "menu");
  const [confirmOpen, setConfirmOpen] = React.useState(
    initialState !== "menu",
  );
  const [selectedGroupId, setSelectedGroupId] = React.useState(0);
  const [status, setStatus] = React.useState<FavoriteTopicFixtureStatus>(
    initialState === "pending"
      ? "pending"
      : initialState === "reject"
        ? "rejected"
        : "idle",
  );
  const [rejectNext, setRejectNext] = React.useState(
    initialState === "reject",
  );
  const [mutationCount, setMutationCount] = React.useState(0);

  const openConfirm = (reject: boolean) => {
    setSelectedGroupId(0);
    setRejectNext(reject);
    setStatus("idle");
    setConfirmOpen(true);
  };

  const confirmMove = async () => {
    setStatus("pending");
    setMutationCount((count) => count + 1);

    try {
      await new Promise<void>((resolve, reject) => {
        window.setTimeout(() => {
          if (rejectNext) {
            reject(new Error("Synthetic favorite move rejection"));
          } else {
            resolve();
          }
        }, 1200);
      });
      setStatus("resolved");
    } catch (_error) {
      setStatus("rejected");
      console.log("Oops errors!");
    } finally {
      setConfirmOpen(false);
    }
  };

  return (
    <main
      className={styles.favoriteTopicFixture}
      data-fixture-component="favorite-topic-item"
      data-fixture-favorite-status={status}
      data-fixture-favorite-selected-group={selectedGroupId}
      data-fixture-favorite-mutation-count={mutationCount}
    >
      <div className={styles.favoriteTopicFixtureControls}>
        <Button
          onClick={() => {
            setConfirmOpen(false);
            setMenuOpen(true);
          }}
        >
          Open operation menu
        </Button>
        <Button onClick={() => openConfirm(false)}>
          Open resolving confirm
        </Button>
        <Button onClick={() => openConfirm(true)}>
          Open rejecting confirm
        </Button>
      </div>
      <div className={styles.favoriteTopicFixtureTrigger}>
        <DropdownMenu
          ariaLabel="Fixture favorite topic operations"
          open={menuOpen}
          onOpenChange={setMenuOpen}
          items={[
            {
              key: "remove",
              label: "取消收藏",
              onSelect: () => {
                setMutationCount((count) => count + 1);
                setStatus("resolved");
              },
            },
            {
              key: "move",
              label: "移动分组",
              onSelect: () => openConfirm(false),
            },
          ]}
        >
          <UnorderedListOutlined />
          &nbsp;操作
        </DropdownMenu>
      </div>
      <ConfirmDialog
        open={confirmOpen}
        title="选择收藏分组"
        onOpenChange={setConfirmOpen}
        onConfirm={confirmMove}
        confirmLoading={status === "pending"}
      >
        <Select
          ariaLabel="Fixture favorite group"
          className={styles.favoriteTopicFixtureSelect}
          value={selectedGroupId}
          options={favoriteTopicFixtureGroups}
          onValueChange={(value) => {
            if (value !== null) setSelectedGroupId(value);
          }}
        />
      </ConfirmDialog>
    </main>
  );
}

function LazyOverlayContent({ onMount }: { onMount: () => void }) {
  React.useEffect(() => {
    onMount();
  }, [onMount]);

  return <div data-fixture-overlay-lazy-content>Mounted on first open</div>;
}

function OverlaysFixture() {
  const [controlledOpen, setControlledOpen] = React.useState(true);
  const [lazyMountCount, setLazyMountCount] = React.useState(0);
  const [rejectedMountCount, setRejectedMountCount] = React.useState(0);
  const noteLazyMount = React.useCallback(() => {
    setLazyMountCount((count) => count + 1);
  }, []);
  const noteRejectedMount = React.useCallback(() => {
    setRejectedMountCount((count) => count + 1);
  }, []);

  return (
    <main
      className={styles.overlaysFixture}
      data-fixture-component="overlays"
      data-fixture-controlled-open={controlledOpen}
      data-fixture-lazy-mount-count={lazyMountCount}
      data-fixture-rejected-mount-count={rejectedMountCount}
    >
      <section className={styles.overlayControls} aria-label="Controlled overlay commands">
        <Button
          data-fixture-overlay-control="close"
          onClick={() => setControlledOpen(false)}
        >
          Close controlled preview
        </Button>
        <Button
          data-fixture-overlay-control="open"
          onClick={() => setControlledOpen(true)}
        >
          Open controlled preview
        </Button>
      </section>
      <section className={styles.overlaySection}>
        <h1>Owned overlays</h1>
        <Popover
          open={controlledOpen}
          onOpenChange={setControlledOpen}
          title="Controlled preview title"
          content={
            <div className={styles.fixturePreviewContent}>
              <p>Static preview content with enough height to verify scrolling.</p>
              <a href="#fixture-preview-target">Interactive popup link</a>
              <div id="fixture-preview-target" className={styles.fixturePreviewSpacer} />
            </div>
          }
        >
          <div
            className={styles.overlayRow}
            data-fixture-overlay="controlled-popover"
          >
            Controlled preview trigger
          </div>
        </Popover>
      </section>

      <section className={styles.overlaySection}>
        <div>
          <Popover
            title="补签规则"
            openDelay={100}
            closeDelay={100}
            openOnFocus
            collisionPadding={0}
            content={
              <div>
                ①补签功能上线后，每位用户获得3张补签卡（包括此后新注册用户）
                <br />
                ②使用补签卡后，自动在最近的未签到日补签，并重新计算连续签到天数
                <br />
                ③补签不获得额外的财富值奖励
                <br />
                ④后续会增加补签卡的获取方式
                <br />
                ⑤签到功能使用和显示的时间为北京时间
              </div>
            }
          >
            <QuestionCircleOutlined
              className={styles.signinRuleTrigger}
              data-fixture-overlay="signin-rules-popover"
              label="查看补签规则"
              tabIndex={0}
            />
          </Popover>
        </div>
      </section>

      <section className={styles.overlaySection}>
        <Popover
          title="Nested preview"
          content={<div>Static nested preview body</div>}
          openDelay={1500}
          closeDelay={100}
        >
          <div className={styles.overlayRow} data-fixture-overlay="nested">
            <Tooltip content="Nested tooltip" openDelay={100} closeDelay={100}>
              <button type="button" data-fixture-overlay="nested-tooltip">
                i
              </button>
            </Tooltip>
            <Link
              data-fixture-overlay-link
              to="/__dev/visual-fixtures?case=overlays&link=followed"
            >
              Fixture link keeps native Link behavior
            </Link>
          </div>
        </Popover>
      </section>

      <section className={styles.overlaySection}>
        <Popover
          title="Lazy preview"
          content={<LazyOverlayContent onMount={noteLazyMount} />}
        >
          <div className={styles.overlayRow} data-fixture-overlay="lazy-popover">
            Lazy preview trigger
          </div>
        </Popover>
        <Popover disabled title="Disabled" content={<div>Must stay unmounted</div>}>
          <div className={styles.overlayRow} data-fixture-overlay="disabled-popover">
            Disabled preview trigger
          </div>
        </Popover>
        <Popover
          open={false}
          onOpenChange={() => undefined}
          title="Rejected controlled preview"
          content={<LazyOverlayContent onMount={noteRejectedMount} />}
        >
          <div className={styles.overlayRow} data-fixture-overlay="rejected-popover">
            Controlled owner rejects open
          </div>
        </Popover>
        <Tooltip content="Disabled tooltip" disabled>
          <button type="button" disabled data-fixture-overlay="disabled-tooltip">
            Disabled tooltip trigger
          </button>
        </Tooltip>
      </section>

      <section className={`${styles.overlaySection} ${styles.collisionSection}`}>
        <Popover
          defaultOpen
          align="end"
          title="Collision edge"
          content={<div className={styles.collisionContent}>Edge-aligned content</div>}
        >
          <div className={styles.overlayRow} data-fixture-overlay="collision-edge">
            Edge trigger
          </div>
        </Popover>
        <span id="fixture-existing-description" className={styles.visuallyHidden}>
          Existing synthetic description
        </span>
        <Tooltip content="Focus and Escape tooltip">
          <button
            type="button"
            data-fixture-overlay="focus-tooltip"
            aria-describedby="fixture-existing-description"
          >
            Focus tooltip
          </button>
        </Tooltip>
      </section>
    </main>
  );
}

function TopicIPDataFixture() {
  const [shown, setShown] = React.useState(true);

  return (
    <>
      <Button
        data-fixture-topic-ip-trigger
        className={shown ? styles.hiddenDialogTrigger : undefined}
        onClick={() => setShown(true)}
      >
        打开IP信息
      </Button>
      {shown && (
        <TopicIPData IPData={fakeIpData} changeStatus={() => setShown(false)} />
      )}
    </>
  );
}

function Overview() {
  const [nativeRadioValue, setNativeRadioValue] = React.useState("checked");
  const [styledRadioValue, setStyledRadioValue] = React.useState("checked");

  return (
    <main className={styles.page} data-visual-fixture={VISUAL_FIXTURE_SENTINEL}>
      <header className={styles.header}>
        <h1>Visual fixtures</h1>
        <p>Static, synthetic states used for local style comparison.</p>
      </header>
      <section className={styles.matrix} aria-label="Foundation UI fixture matrix">
        <article className={styles.panel}>
          <h2>Typography</h2>
          <p>Body copy with a <a href="#fixture-link">fixture link</a>.</p>
          <small>Secondary synthetic text</small>
        </article>
        <article className={`${styles.panel} ${styles.nativeControls}`}>
          <h2>Native controls</h2>
          <label>
            Fixture input
            <input defaultValue="Static value" readOnly />
          </label>
          <button type="button" disabled>Disabled action</button>
        </article>
        <article className={styles.panel}>
          <h2>Safe states</h2>
          <p role="status">Loading placeholder</p>
          <p>No fixture results</p>
          <p role="alert">Synthetic error state</p>
        </article>
        <article className={`${styles.panel} ${styles.primitives}`} data-fixture-component="foundation-primitives">
          <h2>Owned primitives</h2>
          <div className={styles.fixtureRow} data-fixture-component="checkbox">
            <Checkbox data-fixture-state="unchecked">Unchecked</Checkbox>
            <Checkbox data-fixture-state="checked" defaultChecked>Checked</Checkbox>
            <Checkbox data-fixture-state="indeterminate" indeterminate>Mixed</Checkbox>
            <Checkbox data-fixture-state="disabled" disabled>Disabled</Checkbox>
          </div>
          <div className={styles.fixtureRow} data-fixture-component="radio-native">
            <RadioGroup
              name="foundation-native-radio-fixture"
              value={nativeRadioValue}
              onValueChange={setNativeRadioValue}
              aria-label="Native radio states"
            >
              <label>
                <RadioInput value="unchecked" data-fixture-state="unchecked" />
                Native unchecked
              </label>
              <label>
                <RadioInput value="checked" data-fixture-state="checked" />
                Native checked
              </label>
              <label>
                <RadioInput value="disabled" data-fixture-state="disabled" disabled />
                Native disabled
              </label>
            </RadioGroup>
          </div>
          <div className={styles.fixtureRow} data-fixture-component="radio-styled">
            <RadioGroup
              name="foundation-styled-radio-fixture"
              value={styledRadioValue}
              onValueChange={setStyledRadioValue}
              aria-label="Styled radio states"
            >
              <Radio value="unchecked" label="Styled unchecked" data-fixture-state="unchecked" />
              <Radio value="checked" label="Styled checked" data-fixture-state="checked" />
              <Radio value="disabled" label="Styled disabled" data-fixture-state="disabled" disabled />
            </RadioGroup>
          </div>
          <div className={styles.fixtureRow}>
            <Button data-fixture-component="button" data-fixture-state="loading" type="primary" loading>Loading</Button>
            <span data-fixture-component="spinner" data-fixture-state="default"><Spinner /></span>
            <span data-fixture-component="spinner" data-fixture-state="large"><Spinner size="large" /></span>
          </div>
          <div className={styles.fixtureRow} data-fixture-component="icon">
            <CloseCircleOutlined data-fixture-state="circle-x" />
            <EyeOutlined data-fixture-state="eye" />
            <EyeInvisibleOutlined data-fixture-state="eye-off" />
          </div>
          <Card
            className={styles.cardFixture}
            data-fixture-component="card"
            data-fixture-state="small"
            size="small"
          >
            Small card body
          </Card>
        </article>
        <article className={`${styles.panel} ${styles.collections}`} data-fixture-component="foundation-collections">
          <h2>Owned collections</h2>
          <div className={styles.collectionBlock} data-fixture-component="list" data-fixture-state="default">
            <List
              header="Fixture list header"
              dataSource={[
                { title: "Fixture list title", description: "Fixture list description" },
                { title: "Second fixture item", description: "Keyboard-neutral row" },
              ]}
              renderItem={(item) => (
                <List.Item
                  actions={[<a key="view" href="#fixture-list-action">View</a>]}
                  extra={<span>Trailing detail</span>}
                >
                  <List.Item.Meta title={item.title} description={item.description} />
                </List.Item>
              )}
            />
          </div>
          <div className={styles.collectionBlock} data-fixture-component="list" data-fixture-state="empty">
            <List dataSource={[]} locale={{ emptyText: "No fixture items" }} />
          </div>
          <div className={styles.collectionBlock} data-fixture-component="pagination" data-fixture-state="current-keyboard-ready">
            <Pagination currentPage={4} totalPages={12} quickJump getPageHref={(page) => `/__dev/visual-fixtures?page=${page}`} />
          </div>
          <div className={styles.collectionBlock} data-fixture-component="pagination" data-fixture-state="disabled">
            <Pagination currentPage={1} totalPages={5} disabled />
          </div>
          <div className={styles.collectionBlock} data-fixture-component="pagination" data-fixture-state="last-current-next-disabled">
            <Pagination currentPage={12} totalPages={12} />
          </div>
          <div className={styles.collectionBlock} data-fixture-component="accordion" data-fixture-state="expanded-keyboard-ready">
            <Accordion defaultExpandedIds={["expanded"]} items={[{ id: "expanded", heading: "Expanded fixture section", content: "Expanded fixture content" }, { id: "disabled", heading: "Disabled fixture section", content: "Unavailable content", disabled: true }]} />
          </div>
          <div className={styles.collectionBlock} data-fixture-component="accordion" data-fixture-state="collapsed">
            <Accordion items={[{ id: "collapsed", heading: "Collapsed fixture section", content: "Collapsed fixture content" }]} />
          </div>
          <div className={styles.collectionBlock} data-fixture-component="tabs" data-fixture-state="current-disabled-keyboard-ready">
            <Tabs defaultActiveId="current" items={[{ id: "current", label: "Current", content: "Current fixture panel" }, { id: "second", label: "Second", content: "Second fixture panel" }, { id: "disabled", label: "Disabled", content: "Disabled fixture panel", disabled: true }]} />
          </div>
        </article>
      </section>
    </main>
  );
}

const keyedMessage = "fixture-feedback-message-key";
const keyedNotification = "fixture-feedback-notification-key";

function FeedbackOwnedBaselineFixture() {
  const [lastAction, setLastAction] = React.useState("No synthetic feedback is open.");

  React.useEffect(
    () => () => {
      message.destroy();
      notification.destroy();
    },
    [],
  );

  const control = (label: string, action: () => void) => (
    <button
      type="button"
      data-fixture-feedback-control={label}
      onClick={() => {
        action();
        setLastAction(label);
      }}
    >
      {label}
    </button>
  );

  return (
    <main className={styles.feedbackFixture}>
      <header className={styles.feedbackHeader}>
        <h1>Owned feedback baseline</h1>
        <p data-fixture-feedback-state>{lastAction}</p>
      </header>

      <section className={styles.feedbackPanel}>
        <h2>Global controls</h2>
        <div className={styles.feedbackControls}>
          {control("Clear all feedback", () => {
            message.destroy();
            notification.destroy();
          })}
        </div>
      </section>

      <section className={styles.feedbackPanel}>
        <h2>Message</h2>
        <div className={styles.feedbackControls}>
          {control("Persistent success message", () => {
            message.success({
              content: "Synthetic success message",
              duration: 0,
            });
          })}
          {control("Persistent error message", () => {
            message.error({
              content: "Synthetic error message",
              duration: 0,
            });
          })}
          {control("Stack success and error messages", () => {
            message.destroy();
            message.success({
              content: "Synthetic stacked success",
              duration: 0,
            });
            message.error({
              content: "Synthetic stacked error",
              duration: 0,
            });
          })}
          {control("Open keyed message", () => {
            message.info({
              key: keyedMessage,
              content: "Synthetic keyed message before replacement",
              duration: 0,
            });
          })}
          {control("Replace keyed message", () => {
            message.success({
              key: keyedMessage,
              content: "Synthetic keyed message after replacement",
              duration: 0,
            });
          })}
          {control("Automatic three second message", () => {
            message.success("Synthetic timed message");
          })}
        </div>
      </section>

      <section className={styles.feedbackPanel}>
        <h2>Notification</h2>
        <div className={styles.feedbackControls}>
          {control("Persistent notification", () => {
            notification.open({
              message: "Synthetic operation notice",
              description: "Select at least one synthetic item.",
              duration: 0,
              icon: (
                <CloseCircleOutlined label="error" />
              ),
            });
          })}
          {control("Automatic four and a half second notification", () => {
            notification.open({
              message: "Synthetic timed notification",
              description: "This notification uses the default duration.",
            });
          })}
          {control("Long notification", () => {
            notification.open({
              key: "fixture-feedback-long-notification",
              message: "Synthetic notification with a deliberately long heading",
              description:
                "This fabricated description is intentionally long enough to wrap across multiple lines while remaining independent of accounts and production data.",
              duration: 0,
            });
          })}
          {control("Stack two notifications", () => {
            notification.destroy();
            notification.open({
              key: "fixture-feedback-stack-one",
              message: "Synthetic stacked notification one",
              description: "First stable notification in insertion order.",
              duration: 0,
            });
            notification.open({
              key: "fixture-feedback-stack-two",
              message: "Synthetic stacked notification two",
              description: "Second stable notification in insertion order.",
              duration: 0,
            });
          })}
          {control("Open keyed notification", () => {
            notification.open({
              key: keyedNotification,
              message: "Synthetic keyed notification before replacement",
              description: "Initial keyed notification content.",
              duration: 0,
            });
          })}
          {control("Replace keyed notification", () => {
            notification.success({
              key: keyedNotification,
              message: "Synthetic keyed notification after replacement",
              description: "Replacement content using the same stable key.",
              duration: 0,
            });
          })}
          {control("Close all notifications", () => notification.destroy())}
        </div>
      </section>
    </main>
  );
}

type BoardFooterDialogFixtureMode = "list" | "empty" | "loading";

function BoardFooterDialogsFixture() {
  const [mode, setMode] = React.useState<BoardFooterDialogFixtureMode>("list");
  const [open, setOpen] = React.useState(true);

  const show = (nextMode: BoardFooterDialogFixtureMode) => {
    setMode(nextMode);
    setOpen(true);
  };

  return (
    <main
      className={styles.boardFooterDialogFixture}
      data-fixture-board-footer-mode={mode}
    >
      <div className={styles.boardFooterDialogControls}>
        <Button
          data-fixture-board-footer-dialog="list"
          onClick={() => show("list")}
        >
          Open 60rem list dialog
        </Button>
        <Button
          data-fixture-board-footer-dialog="empty"
          onClick={() => show("empty")}
        >
          Open 45rem empty dialog
        </Button>
        <Button
          data-fixture-board-footer-dialog="loading"
          onClick={() => show("loading")}
        >
          Open 45rem loading dialog
        </Button>
      </div>
      <Dialog
        open={open}
        title={mode === "list" ? "版面事件" : "小黑屋"}
        onOpenChange={setOpen}
        onConfirm={() => setOpen(false)}
        cancelText="取 消"
        preserveOnClose
        width={mode === "list" ? "60rem" : "45rem"}
      >
        {mode === "list" ? (
          <List
            dataSource={[
              {
                title: "Synthetic moderation record",
                description: "对象: fixture user    时间: 2000-01-01 00:00:00",
              },
              {
                title: "Second synthetic moderation record",
                description: "对象: 匿名    时间: 2000-01-02 00:00:00",
              },
            ]}
            renderItem={(item) => (
              <List.Item extra={<div>操作人:fixture operator</div>}>
                <List.Item.Meta title={item.title} description={item.description} />
              </List.Item>
            )}
          />
        ) : (
          <List
            dataSource={[]}
            loading={mode === "loading"}
          />
        )}
      </Dialog>
    </main>
  );
}

function HousingDialogFixture() {
  const [open, setOpen] = React.useState(true);
  const [openChangeCount, setOpenChangeCount] = React.useState(0);
  const [validationState, setValidationState] =
    React.useState<HousingValidationState>("idle");
  const [validationErrorCount, setValidationErrorCount] = React.useState(0);
  const [submitCount, setSubmitCount] = React.useState(0);
  const [lastPayload, setLastPayload] = React.useState("");
  const [lastUbb, setLastUbb] = React.useState("");

  const handleOpenChange = React.useCallback((nextOpen: boolean) => {
    setOpen(nextOpen);
    setOpenChangeCount((count) => count + 1);
  }, []);

  const handleValidationChange = React.useCallback(
    (nextState: HousingValidationState, errorCount: number) => {
      setValidationState(nextState);
      setValidationErrorCount(errorCount);
    },
    []
  );

  const handleSubmit = React.useCallback((values: HousingTemplateValues) => {
    setSubmitCount((count) => count + 1);
    setLastPayload(JSON.stringify(values));
    setLastUbb(formatHousingTemplateUbb(values));
  }, []);

  return (
    <main
      className={styles.housingFixture}
      data-fixture-housing-open={open}
      data-fixture-housing-open-change-count={openChangeCount}
      data-fixture-housing-validation={validationState}
      data-fixture-housing-error-count={validationErrorCount}
      data-fixture-housing-submit-count={submitCount}
      data-fixture-housing-payload={lastPayload}
      data-fixture-housing-ubb={lastUbb}
    >
      <Button data-fixture-housing-reopen onClick={() => handleOpenChange(true)}>
        Open housing dialog
      </Button>
      <output className={styles.housingTelemetry} aria-live="polite">
        open={String(open)}; validation={validationState}; errors={validationErrorCount}; submits={submitCount}
      </output>
      <HousingTemplateDialog
        open={open}
        onOpenChange={handleOpenChange}
        onSubmit={handleSubmit}
        onValidationChange={handleValidationChange}
      />
    </main>
  );
}

const INITIAL_CONTROLLED_RANGE: CalendarDateRange = [
  { year: 2026, month: 8, day: 5 },
  { year: 2026, month: 8, day: 12 },
];

const EXTERNAL_CONTROLLED_RANGE: CalendarDateRange = [
  { year: 2027, month: 9, day: 9 },
  { year: 2027, month: 9, day: 18 },
];

function getFixtureRangeText(value: CalendarDateRange | null) {
  return value
    ? `${formatCalendarDate(value[0])}/${formatCalendarDate(value[1])}`
    : "empty";
}

function ControlledDateRangeFixture() {
  const [value, setValue] = React.useState<CalendarDateRange | null>(
    INITIAL_CONTROLLED_RANGE
  );
  const [open, setOpen] = React.useState(true);
  const [rejectClose, setRejectClose] = React.useState(false);
  const [openRequestCount, setOpenRequestCount] = React.useState(0);
  const [valueChangeCount, setValueChangeCount] = React.useState(0);
  const [lastEvent, setLastEvent] = React.useState("initial");
  const rangeText = getFixtureRangeText(value);

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      setOpenRequestCount((count) => count + 1);
      if (!nextOpen && rejectClose) {
        setLastEvent("close-rejected");
        return;
      }
      setOpen(nextOpen);
      setLastEvent(nextOpen ? "open-accepted" : "close-accepted");
    },
    [rejectClose]
  );

  const handleValueChange = React.useCallback(
    (nextValue: CalendarDateRange | null) => {
      setValue(nextValue);
      setValueChangeCount((count) => count + 1);
      setLastEvent(`picker-value:${getFixtureRangeText(nextValue)}`);
    },
    []
  );

  return (
    <main
      className={styles.dateRangeControlledFixture}
      data-fixture-date-range-open={open}
      data-fixture-date-range-reject-close={rejectClose}
      data-fixture-date-range-value={rangeText}
      data-fixture-date-range-open-request-count={openRequestCount}
      data-fixture-date-range-value-change-count={valueChangeCount}
      data-fixture-date-range-last-event={lastEvent}
    >
      <div className={styles.dateRangeControlledControls}>
        <Button
          data-fixture-date-range-open-button
          onClick={() => {
            setOpen(true);
            setLastEvent("external-open");
          }}
        >
          Open picker
        </Button>
      </div>
      <DateRangePicker
        className={styles.dateRangeControlledPicker}
        value={value}
        open={open}
        onValueChange={handleValueChange}
        onOpenChange={handleOpenChange}
        ariaLabel="Controlled date range"
        footer={
          <div className={styles.dateRangeControlledFooter}>
            <Button
              data-fixture-date-range-set
              onClick={() => {
                setValue(EXTERNAL_CONTROLLED_RANGE);
                setLastEvent("external-set-range");
              }}
            >
              Set range
            </Button>
            <Button
              data-fixture-date-range-clear
              onClick={() => {
                setValue(null);
                setLastEvent("external-clear");
              }}
            >
              Clear range
            </Button>
            <label className={styles.dateRangeControlledToggle}>
              <input
                data-fixture-date-range-reject-toggle
                type="checkbox"
                checked={rejectClose}
                onChange={(event) => {
                  setRejectClose(event.target.checked);
                  setLastEvent(
                    event.target.checked ? "reject-close-on" : "reject-close-off"
                  );
                }}
              />
              Reject close
            </label>
          </div>
        }
      />
      <output
        className={styles.dateRangeControlledTelemetry}
        data-fixture-date-range-telemetry
        aria-live="polite"
      >
        open={String(open)}; rejectClose={String(rejectClose)}; value={rangeText};
        openRequests={openRequestCount}; valueChanges={valueChangeCount}; last={lastEvent}
      </output>
    </main>
  );
}

type ReSignFixtureScenario =
  | "ready"
  | "loading"
  | "error"
  | "no-card"
  | "makeup-success"
  | "makeup-failure"
  | "race";

const RE_SIGN_FIXTURE_SCENARIOS: ReadonlyArray<{
  readonly value: ReSignFixtureScenario;
  readonly label: string;
}> = [
  { value: "ready", label: "Ready" },
  { value: "loading", label: "Loading" },
  { value: "error", label: "Error" },
  { value: "no-card", label: "No card" },
  { value: "makeup-success", label: "Makeup success" },
  { value: "makeup-failure", label: "Makeup failure" },
  { value: "race", label: "Month race" },
];

function getReSignFixtureRecords(year: number, month: number) {
  const rewards = [1, 2, 3, 5, 6, 8, 9];
  return rewards.map(
    (day): UserSignInDailyInfo => ({
      year,
      month,
      day,
      useCard: day === 5,
      reward: month,
    })
  );
}

function ReSignCalendarFixture() {
  const [scenario, setScenario] =
    React.useState<ReSignFixtureScenario>("ready");
  const [runId, setRunId] = React.useState(0);
  const [events, setEvents] = React.useState<string[]>([]);
  const [refreshCount, setRefreshCount] = React.useState(0);
  const [continuousDays, setContinuousDays] = React.useState(26);
  const cardsRef = React.useRef(91);

  const logEvent = React.useCallback((event: string) => {
    setEvents((current) => [...current.slice(-11), event]);
  }, []);

  const operations = React.useMemo<ReSignCalendarOperations>(() => {
    const wait = (delay: number) =>
      new Promise<void>((resolve) => window.setTimeout(resolve, delay));
    return {
      getServerNow: async () => {
        logEvent("server-now");
        return {
          errorCode: 0,
          data: "2026-08-09 12:00:00",
          extra: null,
        };
      },
      getSigninInMonth: async (year, month) => {
        logEvent(`month-request:${year}-${String(month).padStart(2, "0")}`);
        if (scenario === "loading") {
          return new Promise<UserSignInDailyInfo[] | null>(() => undefined);
        }
        if (scenario === "error") {
          await wait(80);
          logEvent(`month-error:${year}-${String(month).padStart(2, "0")}`);
          return null;
        }
        const delay =
          scenario === "race" && month === 7
            ? 600
            : scenario === "race" && month === 6
              ? 80
              : 20;
        await wait(delay);
        logEvent(`month-resolve:${year}-${String(month).padStart(2, "0")}`);
        return getReSignFixtureRecords(year, month);
      },
      makeUpMissedSignin: async () => {
        logEvent("makeup-request");
        await wait(700);
        if (scenario === "makeup-failure") {
          logEvent("makeup-failure");
          return { ok: false, errorMessage: "Fixture makeup failure" };
        }
        cardsRef.current = Math.max(0, cardsRef.current - 1);
        logEvent("makeup-success");
        return { ok: true, lastSignInCount: 27 };
      },
      refreshMyInfo: async () => {
        setRefreshCount((count) => count + 1);
        logEvent("refresh-my-info");
        return { signInCardCount: cardsRef.current };
      },
      getMyInfo: () => ({ signInCardCount: cardsRef.current }),
    };
  }, [logEvent, scenario]);

  const selectScenario = (nextScenario: ReSignFixtureScenario) => {
    cardsRef.current = nextScenario === "no-card" ? 0 : 91;
    setEvents([]);
    setRefreshCount(0);
    setContinuousDays(26);
    setScenario(nextScenario);
    setRunId((current) => current + 1);
  };

  return (
    <main
      className={styles.resignCalendarFixture}
      data-fixture-resign-scenario={scenario}
      data-fixture-resign-refresh-count={refreshCount}
      data-fixture-resign-continuous-days={continuousDays}
      data-fixture-resign-events={events.join("|")}
    >
      <div className={styles.resignCalendarControls}>
        {RE_SIGN_FIXTURE_SCENARIOS.map((option) => (
          <Button
            key={option.value}
            type={scenario === option.value ? "primary" : "default"}
            data-fixture-resign-scenario-button={option.value}
            onClick={() => selectScenario(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>
      <output
        className={styles.resignCalendarTelemetry}
        data-fixture-resign-telemetry
        aria-live="polite"
      >
        scenario={scenario}; refreshes={refreshCount}; continuous={continuousDays};
        events={events.join(",") || "none"}
      </output>
      <ReSignCalendar
        key={`${scenario}-${runId}`}
        operations={operations}
        updateSigninInfo={(days) => {
          setContinuousDays(days);
          logEvent(`continuous:${days}`);
        }}
      />
    </main>
  );
}

type SiteAdvertisementFixtureScenario =
  | "initial"
  | "ready-11"
  | "loading"
  | "empty"
  | "error"
  | "load-race"
  | "save-success"
  | "save-empty-weight"
  | "save-error";

const SITE_ADVERTISEMENT_FIXTURE_SCENARIOS: ReadonlyArray<{
  readonly value: SiteAdvertisementFixtureScenario;
  readonly label: string;
}> = [
  { value: "initial", label: "Initial" },
  { value: "ready-11", label: "Ready 11" },
  { value: "loading", label: "Loading" },
  { value: "empty", label: "Empty" },
  { value: "error", label: "Error" },
  { value: "load-race", label: "Load race" },
  { value: "save-success", label: "Save success" },
  { value: "save-empty-weight", label: "Save empty weight" },
  { value: "save-error", label: "Save error" },
];

const SITE_ADVERTISEMENT_FIXTURE_TYPES: Readonly<Record<string, ForumIndexColumnType>> = {
  "/index/column/recommandationreading": ForumIndexColumnType.RecommendationReading,
  "/index/column/recommandationfunction": ForumIndexColumnType.RecommendationFunction,
  "/config/global/advertisement": ForumIndexColumnType.Advertisement,
  "/config/global/special-offer": ForumIndexColumnType.SpecialOffer,
};

function getSiteAdvertisementTypeName(type: ForumIndexColumnType) {
  switch (type) {
    case ForumIndexColumnType.RecommendationReading:
      return "reading";
    case ForumIndexColumnType.RecommendationFunction:
      return "function";
    case ForumIndexColumnType.Advertisement:
      return "banner";
    case ForumIndexColumnType.SpecialOffer:
      return "offer";
    default:
      return `type-${type}`;
  }
}

function getSiteAdvertisementFixtureRows(
  type: ForumIndexColumnType
): ForumIndexColumn[] {
  const typeName = getSiteAdvertisementTypeName(type);
  return Array.from({ length: 11 }, (_, index) => ({
    id: 990001 + index,
    type,
    title: `Fixture ${typeName} ${String(index + 1).padStart(2, "0")}`,
    content:
      type === ForumIndexColumnType.RecommendationReading
        ? `Synthetic fixture content ${index + 1}`
        : null,
    url: `https://example.invalid/${typeName}/${index + 1}`,
    imageUrl:
      type === ForumIndexColumnType.SpecialOffer
        ? null
        : `https://example.invalid/assets/${typeName}-${index + 1}.png`,
    enable: index % 4 !== 3,
    time: "2026-08-01T09:00:00+08:00",
    orderWeight: 100 - index,
    expiredTime:
      type === ForumIndexColumnType.Advertisement ||
      type === ForumIndexColumnType.SpecialOffer
        ? "2026-09-30T23:59:59+08:00"
        : null,
    visibility:
      type === ForumIndexColumnType.Advertisement
        ? ForumIndexColumnVisibility.OnlyLogOn
        : ForumIndexColumnVisibility.Always,
  }));
}

function summarizeSiteAdvertisementPayload(body: PostForumIndexColumnInfo) {
  return JSON.stringify({
    type: body.type,
    title: body.title,
    content: body.content,
    url: body.url,
    imageUrl: body.imageUrl,
    orderWeight: body.orderWeight,
    enable: body.enable,
    days: body.days ?? null,
    visibility: body.visibility,
  });
}

function createSiteAdvertisementFixtureRow(
  id: number,
  body: PostForumIndexColumnInfo
): ForumIndexColumn {
  return {
    id,
    type: body.type,
    title: body.title ?? "Created fixture row",
    content: body.content ?? null,
    url: body.url ?? null,
    imageUrl: body.imageUrl ?? null,
    enable: body.enable,
    time: "2026-08-09T12:00:00+08:00",
    orderWeight: Number(body.orderWeight ?? 0),
    expiredTime:
      body.type === ForumIndexColumnType.Advertisement ||
      body.type === ForumIndexColumnType.SpecialOffer
        ? "2026-10-31T23:59:59+08:00"
        : null,
    visibility: body.visibility,
  };
}

function setSiteAdvertisementFixtureInputValue(
  editor: HTMLElement | null | undefined,
  rowKey: string,
  field: string,
  value: string
) {
  const input = editor?.querySelector<HTMLInputElement>(
    `[data-site-advertisement-field="${field}"][data-site-advertisement-row-key="${rowKey}"]`
  );
  const valueSetter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    "value"
  )?.set;
  if (!input || !valueSetter) return false;

  valueSetter.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
  return true;
}

function SiteAdvertisementFixture() {
  const [scenario, setScenario] =
    React.useState<SiteAdvertisementFixtureScenario>("initial");
  const [runId, setRunId] = React.useState(0);
  const [events, setEvents] = React.useState<string[]>([]);
  const [loadPendingCount, setLoadPendingCount] = React.useState(0);
  const [savePendingCount, setSavePendingCount] = React.useState(0);
  const [saveCount, setSaveCount] = React.useState(0);
  const [saveId, setSaveId] = React.useState("none");
  const [saveIds, setSaveIds] = React.useState<string[]>([]);
  const [savePayload, setSavePayload] = React.useState("none");
  const [savePayloads, setSavePayloads] = React.useState<string[]>([]);
  const [result, setResult] = React.useState("initial");
  const [tableSnapshot, setTableSnapshot] = React.useState({
    type: "0",
    page: "1",
    rows: "0",
    visibleRows: "0",
    loading: "false",
    pendingRows: "0",
    unresolvedRows: "0",
    addDisabled: "absent",
    firstSaveKey: "none",
    dirtyBefore: "missing",
    dirtyDuring: "missing",
    newDraft: "missing",
  });
  const editorRef = React.useRef<HTMLDivElement>(null);
  const generationRef = React.useRef(0);
  const loadSequenceRef = React.useRef(0);
  const latestLoadRef = React.useRef(0);
  const nextCreatedIdRef = React.useRef(999001);
  const createdRowsRef = React.useRef(
    new Map<ForumIndexColumnType, ForumIndexColumn[]>()
  );

  const logEvent = React.useCallback((event: string) => {
    setEvents((current) => [...current.slice(-15), event]);
  }, []);

  const operations = React.useMemo<SiteAdvertisementEditorOperations>(() => {
    const generation = runId;
    const isCurrentGeneration = () => generationRef.current === generation;
    const wait = (delay: number) =>
      new Promise<void>((resolve) => window.setTimeout(resolve, delay));
    const record = (event: string) => {
      if (isCurrentGeneration()) logEvent(event);
    };

    return {
      load: async (url) => {
        const type = SITE_ADVERTISEMENT_FIXTURE_TYPES[url];
        if (type === undefined) {
          throw new Error(`Unknown fixture URL: ${url}`);
        }

        const requestNumber = loadSequenceRef.current + 1;
        loadSequenceRef.current = requestNumber;
        latestLoadRef.current = requestNumber;
        const typeName = getSiteAdvertisementTypeName(type);
        if (isCurrentGeneration()) {
          setLoadPendingCount((count) => count + 1);
          setResult("loading");
        }
        record(`load-request:${requestNumber}:${typeName}`);

        if (scenario === "loading") {
          return new Promise<ForumIndexColumn[]>(() => undefined);
        }

        try {
          const delay =
            scenario === "load-race" &&
            type === ForumIndexColumnType.RecommendationReading
              ? 600
              : scenario === "load-race"
                ? 80
                : 100;
          await wait(delay);
          if (scenario === "error") {
            throw new Error("Fixture load failure");
          }

          const rows =
            scenario === "empty"
              ? []
              : [
                  ...(createdRowsRef.current.get(type) ?? []),
                  ...getSiteAdvertisementFixtureRows(type),
                ];
          const stale = requestNumber !== latestLoadRef.current;
          if (isCurrentGeneration()) {
            setLoadPendingCount((count) => Math.max(0, count - 1));
            if (!stale) {
              setResult(rows.length === 0 ? "empty" : `ready-${rows.length}`);
            }
          }
          record(
            `load-resolve:${requestNumber}:${typeName}:${rows.length}${
              stale ? ":stale" : ""
            }`
          );
          return rows;
        } catch (error) {
          const stale = requestNumber !== latestLoadRef.current;
          if (isCurrentGeneration()) {
            setLoadPendingCount((count) => Math.max(0, count - 1));
            if (!stale) setResult("load-error");
          }
          record(
            `load-reject:${requestNumber}:${typeName}${stale ? ":stale" : ""}`
          );
          throw error;
        }
      },
      save: async (id, body) => {
        const idSummary = id === null ? "new" : String(id);
        const payloadSummary = summarizeSiteAdvertisementPayload(body);
        if (isCurrentGeneration()) {
          setSavePendingCount((count) => count + 1);
          setSaveCount((count) => count + 1);
          setSaveId(idSummary);
          setSaveIds((current) => [...current, idSummary]);
          setSavePayload(payloadSummary);
          setSavePayloads((current) => [...current, payloadSummary]);
          setResult("save-pending");
        }
        record(`save-request:${idSummary}`);
        await wait(120);

        if (scenario === "save-error") {
          if (isCurrentGeneration()) {
            setSavePendingCount((count) => Math.max(0, count - 1));
            setResult("save-error");
          }
          record(`save-reject:${idSummary}`);
          throw new Error("Fixture save failure");
        }

        if (id === null) {
          const createdId = nextCreatedIdRef.current;
          nextCreatedIdRef.current += 1;
          const createdRows = createdRowsRef.current.get(body.type) ?? [];
          createdRowsRef.current.set(body.type, [
            createSiteAdvertisementFixtureRow(createdId, body),
            ...createdRows,
          ]);
          record(`create-persist:new->${createdId}`);
        }

        if (isCurrentGeneration()) {
          setSavePendingCount((count) => Math.max(0, count - 1));
          setResult("save-success");
        }
        record(`save-resolve:${idSummary}`);
      },
    };
  }, [logEvent, runId, scenario]);

  React.useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const readTableSnapshot = () => {
      const table = editor.querySelector<HTMLElement>(
        "[data-data-table-current-page]"
      );
      const editorRoot = editor.querySelector<HTMLElement>(
        "[data-site-advertisement-pending-save-count]"
      );
      const addButton = editor.querySelector<HTMLButtonElement>(
        "[data-site-advertisement-add]"
      );
      const firstSaveButton = editor.querySelector<HTMLButtonElement>(
        '[data-site-advertisement-save-index="0"]'
      );
      const dirtyBeforeInput = editor.querySelector<HTMLInputElement>(
        '[data-site-advertisement-field="title"][data-site-advertisement-row-key="server-1-990001"]'
      );
      const dirtyDuringInput = editor.querySelector<HTMLInputElement>(
        '[data-site-advertisement-field="title"][data-site-advertisement-row-key="server-1-990002"]'
      );
      const newDraftInput = editor.querySelector<HTMLInputElement>(
        '[data-site-advertisement-field="title"][data-site-advertisement-row-key="server-1-999001"], [data-site-advertisement-field="title"][data-site-advertisement-row-key="new-1-1"]'
      );
      const nextSnapshot = {
        type:
          editorRoot?.getAttribute("data-site-advertisement-type") ?? "0",
        page: table?.getAttribute("data-data-table-current-page") ?? "1",
        rows: table?.getAttribute("data-data-table-row-count") ?? "0",
        visibleRows:
          table?.getAttribute("data-data-table-visible-row-count") ?? "0",
        loading: table?.getAttribute("data-data-table-loading") ?? "false",
        pendingRows:
          editorRoot?.getAttribute(
            "data-site-advertisement-pending-save-count"
          ) ?? "0",
        unresolvedRows:
          editorRoot?.getAttribute(
            "data-site-advertisement-unresolved-create-count"
          ) ?? "0",
        addDisabled:
          addButton === null ? "absent" : addButton.disabled ? "true" : "false",
        firstSaveKey:
          firstSaveButton?.getAttribute("data-site-advertisement-save-key") ??
          "none",
        dirtyBefore: dirtyBeforeInput?.value ?? "missing",
        dirtyDuring: dirtyDuringInput?.value ?? "missing",
        newDraft: newDraftInput?.value ?? "missing",
      };
      setTableSnapshot((current) =>
        current.type === nextSnapshot.type &&
        current.page === nextSnapshot.page &&
        current.rows === nextSnapshot.rows &&
        current.visibleRows === nextSnapshot.visibleRows &&
        current.loading === nextSnapshot.loading &&
        current.pendingRows === nextSnapshot.pendingRows &&
        current.unresolvedRows === nextSnapshot.unresolvedRows &&
        current.addDisabled === nextSnapshot.addDisabled &&
        current.firstSaveKey === nextSnapshot.firstSaveKey &&
        current.dirtyBefore === nextSnapshot.dirtyBefore &&
        current.dirtyDuring === nextSnapshot.dirtyDuring &&
        current.newDraft === nextSnapshot.newDraft
          ? current
          : nextSnapshot
      );
    };

    readTableSnapshot();
    const observer = new MutationObserver(readTableSnapshot);
    observer.observe(editor, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: [
        "data-data-table-current-page",
        "data-data-table-row-count",
        "data-data-table-visible-row-count",
        "data-data-table-loading",
        "data-site-advertisement-type",
        "data-site-advertisement-pending-save-count",
        "data-site-advertisement-unresolved-create-count",
        "data-site-advertisement-save-key",
        "data-site-advertisement-value",
        "disabled",
      ],
    });
    return () => observer.disconnect();
  }, [runId]);

  React.useEffect(() => {
    if (scenario === "initial") return;
    const editor = editorRef.current;
    const loadButton = editor?.querySelector<HTMLButtonElement>(
      `[data-site-advertisement-load-type="${ForumIndexColumnType.RecommendationReading}"]`
    );
    loadButton?.click();

    const timers: number[] = [];
    if (scenario === "load-race") {
      timers.push(
        window.setTimeout(() => {
          editor
            ?.querySelector<HTMLButtonElement>(
              `[data-site-advertisement-load-type="${ForumIndexColumnType.RecommendationFunction}"]`
            )
            ?.click();
        }, 20)
      );
    }
    if (scenario === "loading") {
      timers.push(
        window.setTimeout(() => {
          const addButton = editor?.querySelector<HTMLButtonElement>(
            "[data-site-advertisement-add]"
          );
          logEvent(
            `add-attempt:${
              addButton === null || addButton === undefined
                ? "missing"
                : addButton.disabled
                  ? "disabled"
                  : "enabled"
            }`
          );
          addButton?.click();
        }, 60)
      );
    }
    if (scenario === "save-success") {
      timers.push(
        window.setTimeout(() => {
          const changed = setSiteAdvertisementFixtureInputValue(
            editor,
            "server-1-990001",
            "title",
            "Dirty before create"
          );
          logEvent(`dirty-before:${changed ? "changed" : "missing"}`);
        }, 150),
        window.setTimeout(() => {
          const addButton = editor?.querySelector<HTMLButtonElement>(
            "[data-site-advertisement-add]"
          );
          logEvent(`add-attempt:${addButton?.disabled ? "disabled" : "enabled"}`);
          addButton?.click();
        }, 180),
        window.setTimeout(() => {
          const changed = setSiteAdvertisementFixtureInputValue(
            editor,
            "new-1-1",
            "title",
            "New click snapshot"
          );
          logEvent(`new-before:${changed ? "changed" : "missing"}`);
        }, 200),
        window.setTimeout(() => {
          const changed = setSiteAdvertisementFixtureInputValue(
            editor,
            "new-1-1",
            "orderWeight",
            "10"
          );
          logEvent(`new-weight:${changed ? "changed" : "missing"}`);
        }, 205),
        window.setTimeout(() => {
          const saveButton = editor?.querySelector<HTMLButtonElement>(
            '[data-site-advertisement-save-index="0"]'
          );
          logEvent(`save-attempt:new:${saveButton === null ? "missing" : "ready"}`);
          saveButton?.click();
          saveButton?.click();
        }, 220),
        window.setTimeout(() => {
          const changed = setSiteAdvertisementFixtureInputValue(
            editor,
            "server-1-990002",
            "title",
            "Dirty during create"
          );
          logEvent(`dirty-during:${changed ? "changed" : "missing"}`);
          const newChanged = setSiteAdvertisementFixtureInputValue(
            editor,
            "new-1-1",
            "title",
            "Dirty new during create"
          );
          logEvent(`new-during:${newChanged ? "changed" : "missing"}`);
        }, 260),
        window.setTimeout(() => {
          const saveButton = editor?.querySelector<HTMLButtonElement>(
            '[data-site-advertisement-save-index="0"]'
          );
          logEvent(
            `save-attempt:server:${
              saveButton?.getAttribute("data-site-advertisement-save-key") ??
              "missing"
            }`
          );
          saveButton?.click();
          saveButton?.click();
        }, 520)
      );
    }
    if (scenario === "save-empty-weight") {
      timers.push(
        window.setTimeout(() => {
          editor
            ?.querySelector<HTMLButtonElement>(
              "[data-site-advertisement-add]"
            )
            ?.click();
        }, 180),
        window.setTimeout(() => {
          const changed = setSiteAdvertisementFixtureInputValue(
            editor,
            "new-1-1",
            "title",
            "Empty weight create"
          );
          logEvent(`empty-weight-title:${changed ? "changed" : "missing"}`);
        }, 200),
        window.setTimeout(() => {
          const weightInput = editor?.querySelector<HTMLInputElement>(
            '[data-site-advertisement-field="orderWeight"][data-site-advertisement-row-key="new-1-1"]'
          );
          logEvent(
            `empty-weight:${
              weightInput === null || weightInput === undefined
                ? "missing"
                : weightInput.value === ""
                  ? "empty"
                  : weightInput.value
            }`
          );
        }, 205),
        window.setTimeout(() => {
          const saveButton = editor?.querySelector<HTMLButtonElement>(
            '[data-site-advertisement-save-index="0"]'
          );
          saveButton?.click();
          saveButton?.click();
        }, 220),
        window.setTimeout(() => {
          const saveButton = editor?.querySelector<HTMLButtonElement>(
            '[data-site-advertisement-save-index="0"]'
          );
          logEvent(
            `empty-weight-server:${
              saveButton?.getAttribute("data-site-advertisement-save-key") ??
              "missing"
            }`
          );
          saveButton?.click();
          saveButton?.click();
        }, 520)
      );
    }
    if (scenario === "save-error") {
      timers.push(
        window.setTimeout(() => {
          const saveButton = editor?.querySelector<HTMLButtonElement>(
            '[data-site-advertisement-save-index="0"]'
          );
          saveButton?.click();
          saveButton?.click();
        }, 220)
      );
    }
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [runId, scenario]);

  const selectScenario = (nextScenario: SiteAdvertisementFixtureScenario) => {
    generationRef.current += 1;
    loadSequenceRef.current = 0;
    latestLoadRef.current = 0;
    setEvents([]);
    setLoadPendingCount(0);
    setSavePendingCount(0);
    setSaveCount(0);
    setSaveId("none");
    setSaveIds([]);
    setSavePayload("none");
    setSavePayloads([]);
    nextCreatedIdRef.current = 999001;
    createdRowsRef.current.clear();
    setResult(nextScenario === "initial" ? "initial" : "loading");
    setTableSnapshot({
      type: "0",
      page: "1",
      rows: "0",
      visibleRows: "0",
      loading: "false",
      pendingRows: "0",
      unresolvedRows: "0",
      addDisabled: "absent",
      firstSaveKey: "none",
      dirtyBefore: "missing",
      dirtyDuring: "missing",
      newDraft: "missing",
    });
    setScenario(nextScenario);
    setRunId(generationRef.current);
  };

  const pending =
    savePendingCount > 0
      ? `save:${savePendingCount}`
      : loadPendingCount > 0
        ? `load:${loadPendingCount}`
        : "none";

  return (
    <main
      className={styles.siteAdvertisementFixture}
      data-fixture-site-advertisement-scenario={scenario}
      data-fixture-site-advertisement-events={events.join("|")}
      data-fixture-site-advertisement-save-count={saveCount}
      data-fixture-site-advertisement-save-id={saveId}
      data-fixture-site-advertisement-save-ids={saveIds.join(",") || "none"}
      data-fixture-site-advertisement-save-payload={savePayload}
      data-fixture-site-advertisement-save-payloads={JSON.stringify(
        savePayloads
      )}
      data-fixture-site-advertisement-load-count={loadSequenceRef.current}
      data-fixture-site-advertisement-pending={pending}
      data-fixture-site-advertisement-result={result}
      data-fixture-site-advertisement-table-type={tableSnapshot.type}
      data-fixture-site-advertisement-table-page={tableSnapshot.page}
      data-fixture-site-advertisement-table-rows={tableSnapshot.rows}
      data-fixture-site-advertisement-visible-rows={tableSnapshot.visibleRows}
      data-fixture-site-advertisement-table-loading={tableSnapshot.loading}
      data-fixture-site-advertisement-pending-rows={tableSnapshot.pendingRows}
      data-fixture-site-advertisement-unresolved-rows={
        tableSnapshot.unresolvedRows
      }
      data-fixture-site-advertisement-add-disabled={tableSnapshot.addDisabled}
      data-fixture-site-advertisement-first-save-key={tableSnapshot.firstSaveKey}
      data-fixture-site-advertisement-dirty-before={tableSnapshot.dirtyBefore}
      data-fixture-site-advertisement-dirty-during={tableSnapshot.dirtyDuring}
      data-fixture-site-advertisement-new-draft={tableSnapshot.newDraft}
    >
      <div className={styles.siteAdvertisementControls}>
        {SITE_ADVERTISEMENT_FIXTURE_SCENARIOS.map((option) => (
          <Button
            key={option.value}
            type={scenario === option.value ? "primary" : "default"}
            data-fixture-site-advertisement-scenario-button={option.value}
            onClick={() => selectScenario(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>
      <output
        className={styles.siteAdvertisementTelemetry}
        data-fixture-site-advertisement-telemetry
        aria-live="polite"
      >
        scenario={scenario}; pending={pending}; result={result}; loads=
        {loadSequenceRef.current}; saves={saveCount}; ids=
        {saveIds.join(",") || "none"}; id={saveId}; payload={savePayload};
        table=type:{tableSnapshot.type},page:{tableSnapshot.page},rows:
        {tableSnapshot.rows},visible:{tableSnapshot.visibleRows},loading:
        {tableSnapshot.loading},pendingRows:{tableSnapshot.pendingRows},addDisabled:
        {tableSnapshot.addDisabled},unresolvedRows:{tableSnapshot.unresolvedRows},
        firstSaveKey:{tableSnapshot.firstSaveKey},dirtyBefore:
        {tableSnapshot.dirtyBefore},dirtyDuring:{tableSnapshot.dirtyDuring},newDraft:
        {tableSnapshot.newDraft},payloads:{JSON.stringify(savePayloads)}; events=
        {events.join(",") || "none"}
      </output>
      <div ref={editorRef}>
        <SiteAdvertisementEditor key={runId} operations={operations} />
      </div>
    </main>
  );
}

const ubbImageFixtureUri = "/static/images/_CC98.png";
const ubbImageFixtureOptions = Object.assign(new UbbCodeOptions(), {
  allowToolbox: true,
});

function UbbImageFixture() {
  return (
    <main data-fixture-component="ubb-image">
      <section data-fixture-ubb-image="direct-toolbox-visible">
        <Image
          imageUri={ubbImageFixtureUri}
          title="Direct toolbox visible"
          isShowed={true}
          allowToolbox={true}
        />
      </section>
      <section data-fixture-ubb-image="direct-toolbox-hidden">
        <Image
          imageUri={ubbImageFixtureUri}
          title="Direct toolbox hidden"
          isShowed={false}
          allowToolbox={true}
        />
      </section>
      <section data-fixture-ubb-image="direct-no-toolbox">
        <Image
          imageUri={ubbImageFixtureUri}
          title="Direct no toolbox"
          isShowed={true}
          allowToolbox={false}
        />
      </section>
      <section
        className={topicReplySignatureStyles.signature}
        data-fixture-ubb-image="signature-specificity"
      >
        <Image
          imageUri={ubbImageFixtureUri}
          title="Signature specificity"
          isShowed={true}
          allowToolbox={false}
        />
      </section>
      <section data-fixture-ubb-image="upload-jpg-0-1">
        <UbbContainer
          options={ubbImageFixtureOptions}
          code={`[upload=jpg,0]${ubbImageFixtureUri}[/upload]\n[upload=jpg,1]${ubbImageFixtureUri}[/upload]`}
        />
      </section>
    </main>
  );
}

const sandboxFixtureEngine = new UbbCodeEngine();
sandboxFixtureEngine.handlers.register(SandBoxTagHandler);
const sandboxFixtureOptions = new UbbCodeOptions();

function renderSandboxFixture(code: string): React.ReactNode {
  return React.Children.toArray(
    sandboxFixtureEngine.exec(code, sandboxFixtureOptions)
  );
}

function UbbSandboxFixture() {
  return (
    <main data-fixture-component="ubb-sandbox">
      <section data-fixture-ubb-sandbox="safe-explicit">
        {renderSandboxFixture(
          "[sandbox,url=about:blank,width=320px,height=120px]Safe explicit fallback[/sandbox]"
        )}
      </section>
      <section data-fixture-ubb-sandbox="safe-default">
        {renderSandboxFixture(
          "[sandbox,url=about:blank]Safe default fallback[/sandbox]"
        )}
      </section>
      <section data-fixture-ubb-sandbox="data-blocked">
        {renderSandboxFixture(
          "[sandbox,url=data:text/html]Data blocked fallback[/sandbox]"
        )}
      </section>
      <section data-fixture-ubb-sandbox="javascript-blocked">
        {renderSandboxFixture(
          "[sandbox,url=javascript:void(0)]JavaScript blocked fallback[/sandbox]"
        )}
      </section>
      <section data-fixture-ubb-sandbox="invalid-dimension">
        {renderSandboxFixture(
          "[sandbox,url=about:blank,width=not-a-width,height=???]Invalid dimension fallback[/sandbox]"
        )}
      </section>
      <section data-fixture-ubb-sandbox="css-wide">
        {renderSandboxFixture(
          "[sandbox,url=about:blank,width=initial,height=inherit]CSS-wide fallback[/sandbox]"
        )}
      </section>
    </main>
  );
}

type UbbEditorFixtureState =
  | "editor-20"
  | "editor-10"
  | "extend"
  | "emoji-20"
  | "emoji-tb-20"
  | "emoji-10"
  | "message";

function UbbEditorFixture() {
  const [searchParams] = useSearchParams();
  const requestedState = searchParams.get("state");
  const fixtureState: UbbEditorFixtureState = [
    "editor-20",
    "editor-10",
    "extend",
    "emoji-20",
    "emoji-tb-20",
    "emoji-10",
    "message",
  ].includes(requestedState ?? "")
    ? (requestedState as UbbEditorFixtureState)
    : "editor-20";
  const height =
    fixtureState === "editor-10" || fixtureState === "emoji-10" ? 10 : 20;
  const rootRef = React.useRef<HTMLElement>(null);
  const [value, setValue] = React.useState("Fixture editor surface");
  const [messageRun, setMessageRun] = React.useState(0);

  React.useEffect(() => {
    setValue("Fixture editor preview");
    const timer = window.setTimeout(() => {
      const root = rootRef.current;
      if (!root) return;

      const clickToolbarButton = (title: string) => {
        root.querySelector<HTMLButtonElement>(`button[title="${title}"]`)?.click();
      };
      if (fixtureState === "extend") {
        clickToolbarButton("插入图片");
      } else if (
        fixtureState === "emoji-20" ||
        fixtureState === "emoji-tb-20" ||
        fixtureState === "emoji-10"
      ) {
        clickToolbarButton("插入表情");
        const category = fixtureState === "emoji-tb-20" ? "贴吧" : "CC98";
        Array.from(root.querySelectorAll<HTMLButtonElement>("button"))
          .find((button) => button.textContent === category)
          ?.click();
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, [fixtureState]);

  return (
    <main
      ref={rootRef}
      data-fixture-component="ubb-editor"
      data-fixture-ubb-editor-state={fixtureState}
      data-fixture-ubb-editor-height={height}
    >
      {fixtureState === "message" ? (
        <div data-fixture-ubb-editor-message>
          <button
            type="button"
            data-fixture-ubb-editor-message-trigger
            onClick={() => setMessageRun((run) => run + 1)}
          >
            Show message
          </button>
          <UbbEditorMessage
            message={messageRun ? `Fixture editor message ${messageRun}` : ""}
          />
        </div>
      ) : null}
      <div data-fixture-ubb-editor-surface>
        <UbbEditor
          key={fixtureState}
          value={value}
          update={setValue}
          option={{ height }}
        />
      </div>
    </main>
  );
}

type TopicListStylesFixtureState =
  | "collapsed"
  | "expanded-1"
  | "expanded-2"
  | "expanded-6"
  | "mini-switched-2"
  | "mini-switched-6"
  | "collapsed-after-expand-2";

const topicListFixtureImage = "/static/images/_CC98.png";
const topicListFixtureIds = {
  1: 990101,
  2: 990102,
  6: 990106,
} as const;

function createTopicListFixtureCard(imageCount: 1 | 2 | 6): FocusTopic {
  return {
    isAnonymous: false,
    title: imageCount === 1 ? "" : `Fixture ${imageCount} image topic`,
    hitCount: 98,
    displayHitCount: 98,
    id: topicListFixtureIds[imageCount],
    boardId: 98,
    boardName: "Fixture Board",
    replyCount: 12,
    displayReplyCount: 12,
    floorCount: 12,
    userId: 990001,
    userName: "fixture-topic-user",
    portraitUrl: "/static/images/default_avatar_boy.png",
    time: "2000-01-01T08:00:00.000Z",
    displayTime: "2000-01-01 08:00",
    lastPostUser: "fixture-replier",
    lastPostTime: "2000-01-01T09:00:00.000Z",
    displayLastPostTime: "2000-01-01 09:00",
    tag1Name: "Fixture",
    tag2Name: null,
    mediaContent: {
      thumbnail: Array.from({ length: imageCount }, () => topicListFixtureImage),
      duration: 0,
      height: 0,
      width: 0,
      audio: "",
      video: "",
    },
    contentType: TopicContentType.ImageTopic,
  };
}

const topicListFixtureRecentTopic: UserRecentTopic = {
  boardName: "Fixture Board",
  time: "2000-01-01T08:00:00.000Z",
  title: "",
  userName: "fixture-topic-user",
  isAnonymous: false,
  id: 990201,
  boardId: 98,
};

function TopicListStylesFixture() {
  const [searchParams] = useSearchParams();
  const requestedState = searchParams.get("state");
  const fixtureState: TopicListStylesFixtureState = [
    "collapsed",
    "expanded-1",
    "expanded-2",
    "expanded-6",
    "mini-switched-2",
    "mini-switched-6",
    "collapsed-after-expand-2",
  ].includes(requestedState ?? "")
    ? (requestedState as TopicListStylesFixtureState)
    : "collapsed";
  const rootRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      if (fixtureState === "collapsed") return;

      const match = fixtureState.match(/(1|2|6)$/);
      const imageCount = Number(match?.[1] ?? 2) as 1 | 2 | 6;
      const topicId = topicListFixtureIds[imageCount];
      const card = rootRef.current?.querySelector<HTMLElement>(
        `[data-fixture-topic-card-images="${imageCount}"]`
      );
      card
        ?.querySelector<HTMLImageElement>(`#card_thumbnail_area_${topicId} img`)
        ?.click();

      if (fixtureState.startsWith("mini-switched")) {
        const miniIndex = imageCount === 6 ? 5 : 1;
        card
          ?.querySelector<HTMLImageElement>(
            `#card_thumbnail_mini_image_${topicId}_${miniIndex}`
          )
          ?.click();
      } else if (fixtureState === "collapsed-after-expand-2") {
        card
          ?.querySelector<HTMLImageElement>(`#card_original_image_${topicId}`)
          ?.click();
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, [fixtureState]);

  return (
    <main
      ref={rootRef}
      data-fixture-component="topic-list-styles"
      data-fixture-topic-list-state={fixtureState}
    >
      <section data-fixture-topic-list-owner="user-recent-empty-title">
        <UserRecentTopicItem userRecentTopic={topicListFixtureRecentTopic} />
      </section>
      <section data-fixture-topic-list-owner="collection-empty-title">
        <TopicCollectionItem
          topic={{
            id: 990202,
            boardId: 98,
            boardName: "Fixture Board",
            userId: 990001,
            userName: "fixture-topic-user",
            portraitUrl: "/static/images/default_avatar_boy.png",
            title: "",
          }}
          topicUrl="/topic/990202/1"
        >
          <div>Fixture topic metadata</div>
        </TopicCollectionItem>
      </section>
      {([1, 2, 6] as const).map((imageCount) => (
        <section
          key={`${fixtureState}-${imageCount}`}
          data-fixture-topic-card-images={imageCount}
        >
          <TopicCard {...createTopicListFixtureCard(imageCount)} />
        </section>
      ))}
    </main>
  );
}

const topicMediaFixtureAudio =
  "data:audio/wav;base64,UklGRnQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YVAAAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgA==";
const topicMediaFixtureVideo =
  "data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAMUbW9vdgAAAGxtdmhkAAAAAAAAAAAAAAAAAAAD6AAAA+gAAQAAAQAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAj90cmFrAAAAXHRraGQAAAADAAAAAAAAAAAAAAABAAAAAAAAA+gAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAABAAAAAQAAAAAAAkZWR0cwAAABxlbHN0AAAAAAAAAAEAAAPoAAAAAAABAAAAAAG3bWRpYQAAACBtZGhkAAAAAAAAAAAAAAAAAABAAAAAQABVxAAAAAAALWhkbHIAAAAAAAAAAHZpZGUAAAAAAAAAAAAAAABWaWRlb0hhbmRsZXIAAAABYm1pbmYAAAAUdm1oZAAAAAEAAAAAAAAAAAAAACRkaW5mAAAAHGRyZWYAAAAAAAAAAQAAAAx1cmwgAAAAAQAAASJzdGJsAAAAvnN0c2QAAAAAAAAAAQAAAK5hdmMxAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAABAAEABIAAAASAAAAAAAAAABFUxhdmM2Mi4yMy4xMDIgbGlieDI2NAAAAAAAAAAAAAAAGP//AAAANGF2Y0MBZAAK/+EAF2dkAAqs2V7ARAAAAwAEAAADAAg8SJZYAQAGaOvjyyLA/fj4AAAAABBwYXNwAAAAAQAAAAEAAAAUYnJ0cgAAAAAAABYoAAAAAAAAABhzdHRzAAAAAAAAAAEAAAABAABAAAAAABxzdHNjAAAAAAAAAAEAAAABAAAAAQAAAAEAAAAUc3RzegAAAAAAAALFAAAAAQAAABRzdGNvAAAAAAAAAAEAAANEAAAAYXVkdGEAAABZbWV0YQAAAAAAAAAhaGRscgAAAAAAAAAAbWRpcmFwcGwAAAAAAAAAAAAAAAAsaWxzdAAAACSpdG9vAAAAHGRhdGEAAAABAAAAAExhdmY2Mi44LjEwMgAAAAhmcmVlAAACzW1kYXQAAAKtBgX//6ncRem95tlIt5Ys2CDZI+7veDI2NCAtIGNvcmUgMTY1IHIzMjIzIDA0ODBjYjAgLSBILjI2NC9NUEVHLTQgQVZDIGNvZGVjIC0gQ29weWxlZnQgMjAwMy0yMDI1IC0gaHR0cDovL3d3dy52aWRlb2xhbi5vcmcveDI2NC5odG1sIC0gb3B0aW9uczogY2FiYWM9MSByZWY9MyBkZWJsb2NrPTE6MDowIGFuYWx5c2U9MHgzOjB4MTEzIG1lPWhleCBzdWJtZT03IHBzeT0xIHBzeV9yZD0xLjAwOjAuMDAgbWl4ZWRfcmVmPTEgbWVfcmFuZ2U9MTYgY2hyb21hX21lPTEgdHJlbGxpcz0xIDh4OGRjdD0xIGNxbT0wIGRlYWR6b25lPTIxLDExIGZhc3RfcHNraXA9MSBjaHJvbWFfcXBfb2Zmc2V0PS0yIHRocmVhZHM9MSBsb29rYWhlYWRfdGhyZWFkcz0xIHNsaWNlZF90aHJlYWRzPTAgbnI9MCBkZWNpbWF0ZT0xIGludGVybGFjZWQ9MCBibHVyYXlfY29tcGF0PTAgY29uc3RyYWluZWRfaW50cmE9MCBiZnJhbWVzPTMgYl9weXJhbWlkPTIgYl9hZGFwdD0xIGJfYmlhcz0wIGRpcmVjdD0xIHdlaWdodGI9MSBvcGVuX2dvcD0wIHdlaWdodHA9MiBrZXlpbnQ9MjUwIGtleWludF9taW49MSBzY2VuZWN1dD00MCBpbnRyYV9yZWZyZXNoPTAgcmNfbG9va2FoZWFkPTQwIHJjPWNyZiBtYnRyZWU9MSBjcmY9MjMuMCBxY29tcD0wLjYwIHFwbWluPTAgcXBtYXg9NjkgcXBzdGVwPTQgaXBfcmF0aW89MS40MCBhcT0xOjEuMDAAgAAAABBliIQAFf/+98nvwKbr29+B";
const topicMediaFixtureTransitionalOptions = Object.assign(
  new UbbCodeOptions(),
  { compatibility: UbbCompatiblityMode.Transitional }
);

function TopicMediaFixedFixture() {
  const [mountKey, setMountKey] = React.useState(0);

  return (
    <main data-fixture-component="topic-media-fixed">
      <button
        type="button"
        data-fixture-topic-media-remount
        onClick={() => setMountKey((key) => key + 1)}
      >
        Remount media
      </button>
      <section data-fixture-topic-media="ubb-recommended">
        <UbbContainer code={"Recommended line one\nRecommended   spaced line"} />
      </section>
      <section data-fixture-topic-media="ubb-transitional">
        <UbbContainer
          code={"Transitional line one\nTransitional   spaced line"}
          options={topicMediaFixtureTransitionalOptions}
        />
      </section>
      <section key={`media-${mountKey}`} data-fixture-topic-media="players">
        <div data-fixture-topic-media-player="audio">
          <TopicAudioPlayer
            src={topicMediaFixtureAudio}
            title="Fixture silent audio"
            userName="fixture-user"
            topicId={990301}
          />
        </div>
        <div data-fixture-topic-media-player="video-landscape">
          <TopicVideoPlayer
            src={topicMediaFixtureVideo}
            pic="/static/images/_CC98.png"
            isLandscape={true}
          />
        </div>
        <div data-fixture-topic-media-player="video-portrait">
          <TopicVideoPlayer
            src={topicMediaFixtureVideo}
            pic="/static/images/_CC98.png"
            isLandscape={false}
          />
        </div>
      </section>
    </main>
  );
}

const userProfileFixtureToday = new Date();
const userProfileFixtureBirthday = `9999-${String(
  userProfileFixtureToday.getMonth() + 1
).padStart(2, "0")}-${String(userProfileFixtureToday.getDate()).padStart(
  2,
  "0"
)}`;
const userProfileFixtureBase = {
  name: "Fixture profile user",
  gender: UserGender.Female,
  birthday: userProfileFixtureBirthday,
  introduction: "Fixture profile introduction",
  signatureCode: null,
  id: 991001,
  isFollowing: false,
  emailAddress: null,
  qq: null,
  postCount: 98,
  prestige: 9,
  groupName: null,
  privilege: "注册用户",
  registerTime: "2000-01-01T08:00:00.000Z",
  lastLogOnTime: "2000-01-02T08:00:00.000Z",
  popularity: 8,
  userTitleIds: [],
  displayTitleId: null,
  fanCount: 7,
  wealth: 6,
  portraitUrl: "/static/images/default_avatar_boy.png",
  customBoards: [],
  followCount: 5,
  boardMasterTitles: [],
  deleteCount: -4,
  receivedLikeCount: 3,
} as UserInfo;
const userProfileFixturePrivileges = [
  ["registered", "注册用户"],
  ["super-moderator", "超级版主"],
  ["guest", "全站贵宾"],
  ["administrator", "管理员"],
  ["unknown", "Fixture unknown privilege"],
] as const;
const userProfileAvatarFixtureTitles: UserTitleDto[] = [
  { id: 82, name: "吉祥物", type: 0, sortOrder: 0, iconUri: "" },
  { id: 18, name: "版主", type: 0, sortOrder: 0, iconUri: "" },
  { id: 32, name: "站务组", type: 0, sortOrder: 0, iconUri: "" },
  { id: 37, name: "技术组", type: 0, sortOrder: 0, iconUri: "" },
  { id: 104, name: "年度用户", type: 0, sortOrder: 0, iconUri: "" },
];
const userProfileAvatarFixturePortraits: PortraitConfigDto = {
  吉祥物: {
    style: {},
    imageUrl: "/static/images/相框/守护天使.png",
    portraitShadow: false,
  },
  版主: {
    style: {},
    imageUrl: "/static/images/相框/版主.png",
    portraitShadow: false,
  },
  站务组: {
    style: {},
    imageUrl: "/static/images/相框/站务组.png",
    portraitShadow: false,
  },
  技术组: {
    style: {},
    imageUrl: "/static/images/相框/技术组.png",
    portraitShadow: false,
  },
  年度用户: {
    style: {},
    imageUrl: "/static/images/相框/年度用户.png",
    portraitShadow: false,
  },
};
const userProfileAvatarFixtureOperations: UserProfileAvatarOperations = {
  getAllUserTitles: async () => userProfileAvatarFixtureTitles,
  getPortraitConfig: async () => userProfileAvatarFixturePortraits,
};
const userProfileAvatarNoFrameTelemetry = {
  titleCalls: 0,
  portraitConfigCalls: 0,
};
const userProfileAvatarNoFrameOperations: UserProfileAvatarOperations = {
  getAllUserTitles: async () => {
    userProfileAvatarNoFrameTelemetry.titleCalls += 1;
    return userProfileAvatarFixtureTitles;
  },
  getPortraitConfig: async () => {
    userProfileAvatarNoFrameTelemetry.portraitConfigCalls += 1;
    return userProfileAvatarFixturePortraits;
  },
};
const userProfileAvatarFixtureVariants = [
  ["mascot", 82],
  ["standard", 18],
  ["staff", 32],
  ["technical", 37],
  ["annual", 104],
] as const;

function UserProfileAvatarNoFrameFixture() {
  const [telemetry, setTelemetry] = React.useState(
    userProfileAvatarNoFrameTelemetry
  );

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      setTelemetry({ ...userProfileAvatarNoFrameTelemetry });
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div data-fixture-user-profile-avatar="no-frame">
      <UserProfileAvatar
        operations={userProfileAvatarNoFrameOperations}
        userInfo={{
          ...userProfileFixtureBase,
          id: 991100,
          displayTitleId: 0,
          userTitleIds: [82],
          boardMasterTitles: [
            {
              userId: 991100,
              userName: "fixture-user",
              boardId: 991101,
              boardName: "Fixture supervisor board",
              title: "Fixture supervisor",
              boardMasterLevel: 10,
            },
            {
              userId: 991100,
              userName: "fixture-user",
              boardId: 991102,
              boardName: "Fixture board",
              title: "Fixture moderator",
              boardMasterLevel: 1,
            },
          ],
        }}
      />
      <output
        data-fixture-user-profile-avatar-no-frame-telemetry
        data-title-calls={telemetry.titleCalls}
        data-portrait-config-calls={telemetry.portraitConfigCalls}
      >
        titles={telemetry.titleCalls}; portraitConfig=
        {telemetry.portraitConfigCalls}
      </output>
    </div>
  );
}

function UserProfileStaticStylesFixture() {
  return (
    <main data-fixture-component="user-profile-static-styles">
      <section data-fixture-user-profile="privileges">
        {userProfileFixturePrivileges.map(([variant, privilege], index) => (
          <div key={variant} data-fixture-user-profile-privilege={variant}>
            <UserProfile
              userInfo={{
                ...userProfileFixtureBase,
                id: userProfileFixtureBase.id + index,
                privilege,
              }}
            />
          </div>
        ))}
      </section>
      <section data-fixture-user-profile="avatar-frames">
        {userProfileAvatarFixtureVariants.map(([variant, displayTitleId]) => (
          <div key={variant} data-fixture-user-profile-avatar={variant}>
            <UserProfileAvatar
              operations={userProfileAvatarFixtureOperations}
              userInfo={{
                ...userProfileFixtureBase,
                id: userProfileFixtureBase.id + displayTitleId,
                displayTitleId,
                userTitleIds: [displayTitleId],
              }}
            />
          </div>
        ))}
        <UserProfileAvatarNoFrameFixture />
      </section>
      <section data-fixture-user-profile="favorite-boards-empty">
        <UserFavoriteBoardsEmptyState />
      </section>
    </main>
  );
}

const foundationMessageBarStates = [
  ["success", MessageType.Success],
  ["info", MessageType.Info],
  ["warning", MessageType.Warning],
  ["error", MessageType.Error],
  ["undefined", undefined],
] as const;

const uploadFoundationMarkdownImage = async () =>
  "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";

function FoundationMarkdownFixture() {
  const [defaultValue, setDefaultValue] = React.useState(
    Array.from(
      { length: 30 },
      (_, i) => `## 第 ${i + 1} 段标题\n\n这是第 ${i + 1} 段的正文内容。\n`
    ).join("\n")
  );
  const [customValue, setCustomValue] = React.useState(
    "Fixture markdown preview"
  );

  return (
    <div data-fixture-foundation="markdown">
      <div data-fixture-foundation-markdown="default-editor">
        <MarkdownEditor
          onChange={setDefaultValue}
          uploadImage={uploadFoundationMarkdownImage}
          value={defaultValue}
        />
      </div>
      <div data-fixture-foundation-markdown="custom-preview">
        <MarkdownEditor
          editorHeight={410}
          onChange={setCustomValue}
          uploadImage={uploadFoundationMarkdownImage}
          value={customValue}
        />
      </div>
    </div>
  );
}

interface FoundationDataTableRow {
  id: number;
  name: string;
  state: string;
  count: number;
}

const foundationDataTableColumns: DataTableColumn<FoundationDataTableRow>[] = [
  {
    key: "name",
    header: "Name",
    width: 120,
    minWidth: 96,
    align: "left",
    render: (row) => row.name,
  },
  {
    key: "state",
    header: "State",
    width: "14rem",
    minWidth: "10rem",
    align: "center",
    render: (row) => row.state,
  },
  {
    key: "count",
    header: "Count",
    minWidth: "90px",
    align: "right",
    render: (row) => row.count,
  },
];
const foundationDataTableRows: FoundationDataTableRow[] = [
  { id: 992001, name: "Alpha", state: "Ready", count: 11 },
  { id: 992002, name: "Beta", state: "Pending", count: 22 },
  { id: 992003, name: "Gamma", state: "Done", count: 33 },
];

function FoundationDataTableFixture() {
  const [currentPage, setCurrentPage] = React.useState(1);

  return (
    <div data-fixture-foundation="data-table">
      <section data-fixture-foundation-data-table="populated-bordered">
        <DataTable
          ariaLabel="Fixture populated table"
          bordered
          columns={foundationDataTableColumns}
          currentPage={currentPage}
          getRowKey={(row) => row.id}
          onPageChange={setCurrentPage}
          pageSize={2}
          rows={foundationDataTableRows}
        />
      </section>
      <section data-fixture-foundation-data-table="empty">
        <DataTable
          ariaLabel="Fixture empty table"
          columns={foundationDataTableColumns}
          currentPage={1}
          getRowKey={(row) => row.id}
          rows={[]}
        />
      </section>
      <section data-fixture-foundation-data-table="loading">
        <DataTable
          ariaLabel="Fixture loading table"
          columns={foundationDataTableColumns}
          currentPage={1}
          getRowKey={(row) => row.id}
          loading
          loadingText="Fixture loading"
          rows={[]}
        />
      </section>
      <section data-fixture-foundation-data-table="site-advertisement">
        <SiteAdvertisementFixture />
      </section>
    </div>
  );
}

function FoundationFixedStylesFixture() {
  return (
    <div data-fixture-component="foundation-fixed-styles">
      <section data-fixture-foundation="message-bars">
        {foundationMessageBarStates.map(([state, messageType]) => (
          <div key={state} data-fixture-foundation-message-bar={state}>
            <MessageBar
              message={`Fixture ${state} message`}
              messageType={messageType}
            />
          </div>
        ))}
      </section>
      <section data-fixture-foundation="notices">
        <NoticeMessage
          id="foundation-notice-initial"
          left="24%"
          text="Fixture initial notice"
          top="21%"
        />
        <NoticeMessage
          id="foundation-notice-triggered"
          left="36%"
          text={"Fixture triggered notice\nsecond line"}
          top="32%"
        />
        <button
          type="button"
          data-fixture-foundation-notice-trigger
          onClick={() => noticeMessageShow("foundation-notice-triggered")}
        >
          Trigger notice
        </button>
      </section>
      <FoundationMarkdownFixture />
      <FoundationDataTableFixture />
    </div>
  );
}

function RemainingOwnedSurfacesFixture() {
  const initialColor = "#4a90e2";
  const [color, setColor] = React.useState(initialColor);
  const [pickerRevision, setPickerRevision] = React.useState(0);

  const resetPicker = () => {
    setColor(initialColor);
    setPickerRevision((revision) => revision + 1);
  };

  return (
    <div className={styles.page} data-fixture-component="remaining-owned-surfaces">
      <section className={styles.panel} data-fixture-owned-surface="theme-preview">
        <div className={themePageStyles["user-theme-config"]}>
          <span data-fixture-theme-preview="default">
            <ThemePreviewButton item={themeList[0]} />
          </span>
          <span data-fixture-theme-preview="image">
            <ThemePreviewButton item={themeList[1]} />
          </span>
          <span data-fixture-theme-preview="disabled">
            <ThemePreviewButton disabled item={themeList[2]} />
          </span>
        </div>
      </section>

      <section className={styles.panel} data-fixture-owned-surface="color-picker">
        <div className={styles.fixtureRow}>
          <button type="button" onClick={resetPicker} data-fixture-color-reset>
            Reset picker
          </button>
          <output data-fixture-color-value>{color}</output>
        </div>
        <div className={styles.fixtureRow}>
          <div data-fixture-color-picker="interactive">
            <ColorPicker
              key={pickerRevision}
              ariaLabel="Deterministic color picker"
              onChange={setColor}
              value={color}
            />
          </div>
          <div data-fixture-color-picker="disabled">
            <ColorPicker
              ariaLabel="Disabled deterministic color picker"
              disabled
              onChange={() => undefined}
              value="#d0021b"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function renderFixture(fixtureCase: FixtureCase): React.ReactNode {
  switch (fixtureCase) {
    case "housing-dialog":
      return <HousingDialogFixture />;
    case "date-range-controlled":
      return <ControlledDateRangeFixture />;
    case "resign-calendar":
      return <ReSignCalendarFixture />;
    case "site-advertisement":
      return <SiteAdvertisementFixture />;
    case "topic-ip-data":
      return <TopicIPDataFixture />;
    case "board-batch-manager":
      return <BoardBatchManagerFixture />;
    case "post-management-dialog":
      return <PostManagementDialogFixture />;
    case "topic-management-dialog":
      return <TopicManagementDialogFixture />;
    case "favorite-topic-group-manager":
      return <FavoriteGroupFixture />;
    case "topic-header":
      return <TopicHeaderFixture />;
    case "topic-locked-tip":
      return <TopicLockedTipFixture />;
    case "topic-replier-shadow":
      return <TopicReplierShadowFixture />;
    case "topic-vote":
      return <TopicVoteFixture />;
    case "user-center-pager":
      return <UserCenterPagerFixture />;
    case "editor-breadcrumb":
      return <EditorBreadcrumbFixture />;
    case "editor-title-input":
      return <EditorTitleInputFixture />;
    case "editor-vote-settings":
      return <EditorVoteSettingsFixture />;
    case "editor-submit-actions":
      return <EditorSubmitActionsFixture />;
    case "editor-length-alert":
      return <EditorLengthAlertFixture />;
    case "history-confirm-dialog":
      return <HistoryConfirmDialogFixture />;
    case "async-confirm-dialog":
      return <AsyncConfirmDialogFixture />;
    case "select":
      return <SelectFixture />;
    case "number-input":
      return <NumberInputFixture />;
    case "tags-input":
      return <TagsInputFixture />;
    case "overlays":
      return <OverlaysFixture />;
    case "feedback-owned-baseline":
      return <FeedbackOwnedBaselineFixture />;
    case "board-footer-dialogs":
      return <BoardFooterDialogsFixture />;
    case "board-announcement-dialog":
      return <BoardAnnouncementDialogFixture />;
    case "favorite-topic-item":
      return <FavoriteTopicItemFixture />;
    case "ubb-image":
      return <UbbImageFixture />;
    case "ubb-sandbox":
      return <UbbSandboxFixture />;
    case "ubb-editor":
      return <UbbEditorFixture />;
    case "topic-list-styles":
      return <TopicListStylesFixture />;
    case "topic-media-fixed":
      return <TopicMediaFixedFixture />;
    case "user-profile-static-styles":
      return <UserProfileStaticStylesFixture />;
    case "foundation-fixed-styles":
      return <FoundationFixedStylesFixture />;
    case "remaining-owned-surfaces":
      return <RemainingOwnedSurfacesFixture />;
    case "overview":
    default:
      return <Overview />;
  }
}

export function VisualFixturePage() {
  const [searchParams] = useSearchParams();
  const requestedCase = searchParams.get("case");
  const fixtureCase = fixtureCases.includes(requestedCase as FixtureCase)
    ? (requestedCase as FixtureCase)
    : "overview";
  useReadOnlyFixtureGuard();

  return (
    <div className={styles.fixtureRoot} data-fixture-case={fixtureCase}>
      {renderFixture(fixtureCase)}
    </div>
  );
}
