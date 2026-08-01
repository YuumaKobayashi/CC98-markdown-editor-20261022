import * as React from "react";
import moment from "moment";
import * as Showdown from "showdown";
import { Button, Modal } from "antd";
import { useNavigate, useParams } from "react-router";

import { UbbEditor } from "@legacy/Components/UbbEditor";
import { MarkdownEditor } from "@foundation/integrations/markdown-editor";
import { reportApplicationError } from "@application/providers/application-error";
import {
  getBoardName,
  getBoardTagV2,
  isMaster,
} from "@modules/board";
import {
  getTagIdbyName,
  getTagNamebyId,
  getTopicContent,
  getTopicInfo,
} from "@modules/topic";
import { getMyInfo } from "@modules/session";
import { getUserWealth } from "@modules/wealth";
import { getToken } from "@modules/session";
import {
  clearEditorContentCache,
  getEditorContentCache,
  setEditorContentCache,
  uploadEvent,
} from "@modules/posting";
import { atHanderler } from "@foundation/lib/text";
import {
  createEditorTopic,
  getEditorBoard,
  getOriginalEditorPost,
  sendEditorAtNotification,
  updateEditorPost,
} from "../api/service";
import type { EditorTagInfo, EditorVoteInfo } from "../model/types";
import styles from "../EditorLegacyForm.module.scss";
import { EditorBreadcrumb } from "./EditorBreadcrumb";
import { EditorTagNotice } from "./EditorTagNotice";
import { EditorTitleInput } from "./EditorTitleInput";
import {
  EditorVoteSettings,
  validateEditorVoteInfo,
} from "./EditorVoteSettings";
import { HousingTemplateDialog } from "./HousingTemplateDialog";

interface EditorState {
  topicInfo: any;
  boardName: string;
  tagsV2: EditorTagInfo;
  ready: boolean;
  mode: number;
  content: string;
  title: string;
  postInfo: any;
  tag1: string;
  tag2: string;
  fetchState: string;
  boardId: any;
  type: number;
  masters: string[];
  voteInfo: EditorVoteInfo;
  mdeState: string;
  notice: boolean;
  houseTmpVisible: boolean;
  anonymousState: number;
  isAnonymous: boolean;
  wealth: number | string;
  contentTooLongModalVisible: boolean;
}

function createInitialEditorState(): EditorState {
  return {
    masters: [],
    tagsV2: { layers: 0, tags: [] },
    boardName: "",
    ready: false,
    mode: 0,
    content: "",
    title: "",
    postInfo: { floor: 0, title: "", content: "", contentType: 0 },
    tag1: "",
    tag2: "",
    fetchState: "ok",
    boardId: 1,
    type: 0,
    topicInfo: {},
    voteInfo: {
      voteItems: ["", ""],
      expiredDays: 0,
      maxVoteCount: 0,
      needVote: false,
    },
    mdeState: "",
    notice: true,
    houseTmpVisible: false,
    anonymousState: 0,
    isAnonymous: false,
    wealth: "",
    contentTooLongModalVisible: false,
  };
}

//TODO: 需要独立
function handlePostErrorText(text: string): string {
  switch (text) {
    case "board_not_exists":
      return "版面不存在";
    case "board_cannot_vote":
      return "版面无法投票";
    case "vote_topic_cannot_be_anonymous":
      return "投票贴不能匿名发表";
    case "wealth_not_enough_for_anonymous_topic":
      return "可选匿名的版面，匿名发主题所需的财富值不足";
    case "tag_id_error":
      return "版面标签错误";
    case "no_vote_info":
      return "投票信息错误";
    case "vote_item_error":
    case "vote_items_error":
      return "投票项错误";
    case "max_vote_count_error":
      return "最大投票数错误";
    case "vote_expired_days_error":
      return "投票有效期错误";
    case "cannot_entry_board":
      return "没有进入版面的权限";
    case "board_is_locked":
      return "版面已被锁定";
    case "cannot_post_school_event":
      return "没有权限发布校园活动类型的主题帖";
    case "user_state_is_abnormal":
      return "被全站禁言中或被锁定账号";
    case "last_post_in_10_seconds":
      return "距离上一次发言不足10秒";
    case "cannot_post_anonymous":
      return "因匿名发言被处以版面禁言处罚，该处罚未到期，无法在全站匿名发言";
    case "cannot_post_in_this_board":
      return "在该版面被禁言中";
    case "board_minimum_post_count_request":
      return "该版面发主题帖存在最小发帖数的限制";
    case "request_too_fast":
      return "请求过快";
    default:
      return "未知错误";
  }
}

export function EditorPage(): React.ReactElement {
  const { mode = "", id } = useParams<"mode" | "id">();
  const navigate = useNavigate();
  const converterRef = React.useRef(
    new Showdown.Converter({
      tables: true,
      simplifiedAutoLink: true,
    })
  );
  const [state, setState] = React.useState<EditorState>(
    createInitialEditorState
  );

  const updateState = (patch: Partial<EditorState>) => {
    setState((current) => ({ ...current, ...patch }));
  };

  React.useEffect(() => {
    const initializeEditor = async () => {
      setState(createInitialEditorState());
      const token = await getToken();

      switch (mode) {
        case "postTopic":
        case "postVoteTopic": {
          const response = await getEditorBoard(id, token);
          const data = await response.json();
          const tagsV2 = await getBoardTagV2(id);
          updateState({
            boardName: data.name,
            tagsV2,
            boardId: id,
            masters: data.boardMasters,
            anonymousState: data.anonymousState,
          });
          break;
        }
        case "edit": {
          let response = await getOriginalEditorPost(id, token);
          if (response.status === 403) {
            updateState({ fetchState: "not allowed" });
          }
          const data = await response.json();
          const topicInfo = await getTopicInfo(data.topicId);
          data.title = topicInfo.title;

          let tag1Name = await getTagNamebyId(topicInfo.tag1);
          if (!tag1Name) tag1Name = "";
          let tag2Name = await getTagNamebyId(topicInfo.tag2);
          if (!tag2Name) tag2Name = "";
          let type = topicInfo.type;
          const tagsV2 = await getBoardTagV2(data.boardId);
          // TODO： cache?
          setEditorContentCache(data.content);
          const cache = getEditorContentCache();
          console.log("cache after saving = " + cache);

          response = await getEditorBoard(data.boardId, token);
          const masters = (await response.json()).boardMasters;
          const myInfo = getMyInfo();
          if (
            myInfo &&
            !(isMaster(masters) || (myInfo.userTitleIds || []).indexOf(91) !== -1) &&
            type === 1
          ) {
            type = 0;
          }
          const boardName = await getBoardName(data.boardId);
          updateState({
            masters,
            postInfo: data,
            content: data.content,
            title: data.title,
            boardName,
            boardId: data.boardId,
            type,
            tagsV2,
            topicInfo,
            tag1: tag1Name,
            tag2: tag2Name,
            mode: data.contentType === 0 ? 0 : 1,
            mdeState: data.contentType === 0 ? "" : data.content,
            notice: topicInfo.notifyPoster,
            isAnonymous: data.isAnonymous,
          });
          break;
        }
      }

      let wealth: number | string;
      try {
        wealth = await getUserWealth();
      } catch (_error) {
        wealth = "查询财富值余额失败，请前往个人中心查看";
      }
      updateState({ wealth });
    };

    void initializeEditor();
  }, [mode, id]);

  const changeEditor = () => {
    if (!confirm("切换编辑器会丢失您之前的编辑内容，确定要切换吗？")) {
      return;
    }
    if (state.mode === 0) {
      console.log("change mode to 1");
      updateState({ mode: 1 });
    } else {
      console.log("change mode to 2");
      updateState({ mode: 0 });
    }
  };

  const resolveTopicContent = async (
    content: string,
    contentType: number,
    isAnonymous: boolean
  ) => {
    const tag1Id = await getTagIdbyName(state.tag1);
    const tag2Id = await getTagIdbyName(state.tag2);
    let result: any;
    if (tag1Id && !tag2Id) {
      result = {
        content,
        contentType,
        title: state.title,
        tag1: tag1Id,
        type: state.type,
        notifyPoster: state.notice,
        isAnonymous,
        clientType: 1,
      };
    } else if (tag2Id) {
      result = {
        content,
        contentType,
        title: state.title,
        tag1: tag1Id,
        tag2: tag2Id,
        type: state.type,
        notifyPoster: state.notice,
        isAnonymous,
        clientType: 1,
      };
    } else {
      result = {
        content,
        contentType,
        title: state.title,
        type: state.type,
        notifyPoster: state.notice,
        isAnonymous,
        clientType: 1,
      };
    }
    if (mode === "postVoteTopic") {
      result = { ...result, isVote: true, voteInfo: state.voteInfo };
    }
    return result;
  };

  const sendAtNotification = async (
    topicId: string,
    content: string,
    token: string
  ) => {
    const atUsers = atHanderler(content);
    if (!atUsers) return;
    const tempData = await getTopicContent(Number(topicId), 1);
    const postId = tempData[0].id;
    await sendEditorAtNotification(topicId, postId, atUsers, token);
  };

  const validateTopic = (isMarkdown: boolean): boolean => {
    if (
      (state.tagsV2.layers === 1 && !state.tag1) ||
      (state.tagsV2.layers === 2 && (!state.tag1 || !state.tag2))
    ) {
      alert("请选择标签");
      return false;
    }
    if (mode === "postVoteTopic") {
      const info = validateEditorVoteInfo(state.voteInfo);
      if (info) {
        alert(info);
        return false;
      }
    }
    const content = isMarkdown ? state.mdeState : state.content;
    if (content.length > 8000) {
      updateState({ contentTooLongModalVisible: true });
      return false;
    }
    if (state.title === "") {
      alert(isMarkdown ? "请输入标题!" : "请输入标题！");
      return false;
    }
    return true;
  };

  const sendMarkdownTopic = async (isAnonymous: boolean) => {
    let finalAnonymous = isAnonymous;
    if (mode === "postVoteTopic") finalAnonymous = false;
    if (!validateTopic(true)) return;

    try {
      const content = await resolveTopicContent(
        state.mdeState,
        1,
        finalAnonymous
      );
      const token = await getToken();
      const response = await createEditorTopic(id, content, token);
      if (response.status === 402) alert("请输入内容");
      if (response.status === 400) {
        const text = await response.text();
        alert(`发帖失败，原因：${handlePostErrorText(text)}`);
      }
      if (response.status === 403) {
        const text = await response.text();
        alert(`发帖失败，原因：${handlePostErrorText(text)}`);
        return;
      }
      const topicId = await response.text();
      await sendAtNotification(topicId, state.mdeState, token);
      clearEditorContentCache();
      navigate(`/topic/${topicId}`);
    } catch (error) {
      console.log(error);
    }
  };

  const sendUbbTopic = async (isAnonymous: boolean) => {
    let finalAnonymous = isAnonymous;
    console.log("------");
    console.log(state);
    if (mode === "postVoteTopic") finalAnonymous = false;
    if (!validateTopic(false)) return;

    const content = await resolveTopicContent(
      state.content,
      0,
      finalAnonymous
    );
    const token = await getToken();
    const response = await createEditorTopic(id, content, token);
    if (response.status === 402) alert("请输入内容");
    if (response.status === 400) {
      const text = await response.text();
      alert(`发帖失败，原因：${handlePostErrorText(text)}`);
    }
    if (response.status === 403) {
      const text = await response.text();
      alert(`发帖失败，原因：${handlePostErrorText(text)}`);
      return;
    }
    const topicId = await response.text();
    console.log("topicid=" + topicId);
    if (topicId === "cannot_post_in_this_board") {
      reportApplicationError("CannotPost");
    } else {
      await sendAtNotification(topicId, state.content, token);
      clearEditorContentCache();
      navigate(`/topic/${topicId}`);
    }
  };

  const resolveEditContent = async (
    content: string,
    contentType: number
  ) => {
    let tag1Id = await getTagIdbyName(state.tag1);
    const tag2Id = await getTagIdbyName(state.tag2);
    if (tag1Id && !tag2Id) {
      if (contentType === 1) {
        tag1Id = await getTagIdbyName(state.tag1);
      }
      return {
        content,
        contentType,
        title: state.title,
        tag1: tag1Id,
        type: state.type,
        notifyPoster: state.notice,
      };
    }
    if (tag2Id) {
      return {
        content,
        contentType,
        title: state.title,
        tag1: tag1Id,
        tag2: tag2Id,
        type: state.type,
        notifyPoster: state.notice,
      };
    }
    return {
      content,
      contentType,
      title: state.title,
      type: state.type,
      notifyPoster: state.notice,
    };
  };

  const navigateAfterEdit = () => {
    const floor = state.postInfo.floor;
    const pageFloor = floor % 10 === 0 ? 10 : floor % 10;
    const page =
      floor % 10 === 0 ? floor / 10 : (floor - (floor % 10)) / 10 + 1;
    clearEditorContentCache();
    navigate(`/topic/${state.postInfo.topicId}/${page}#${pageFloor}`);
  };

  const editUbb = async () => {
    if (state.content.length > 8000) {
      updateState({ contentTooLongModalVisible: true });
      return;
    }
    const content = await resolveEditContent(state.content, 0);
    await getToken();
    await updateEditorPost(id, content);
    navigateAfterEdit();
  };

  const editMarkdown = async () => {
    if (state.mdeState.length > 8000) {
      updateState({ contentTooLongModalVisible: true });
      return;
    }
    const content = await resolveEditContent(state.mdeState, 1);
    await getToken();
    await updateEditorPost(id, content);
    navigateAfterEdit();
  };

  const handleTitleChange = (title: string, tag1: string, tag2: string) => {
    if (title !== "") updateState({ title, tag1, tag2 });
    else updateState({ tag1, tag2 });
  };

  //TODO ： 逻辑拆分
  const handleHousingTemplate = (values) => {
    console.log("====");
    console.log(values);
    console.log(values.validDate[0]);
    console.log();
    const content = `[table]
    [tr][th]序号[/th][th]信息项[/th][th]描述[/th][/tr]
    [tr][td]01[/td][td]有效日期[/td][td]${moment(values.validDate[0]).format("YYYY-MM-DD")}-${moment(values.validDate[1]).format("YYYY-MM-DD")}[/td][/tr]
    [tr][td]02[/td][td]类型[/td][td]${values.type || ""}[/td][/tr]
    [tr][td]03[/td][td]地区[/td][td]${values.district || ""}[/td][/tr]
    [tr][td]04[/td][td]小区名称[/td][td]${values.neighborhood || ""}[/td][/tr]
    [tr][td]05[/td][td]详细地址[/td][td]${values.address || ""}[/td][/tr]
    [tr][td]06[/td][td]联系方式[/td][td]${values.contact || ""}[/td][/tr]
    [tr][td]07[/td][td]价格[/td][td]${values.price || ""}[/td][/tr]
    [tr][td]08[/td][td]租期[/td][td]${values.rentDays || ""}[/td][/tr]
    [tr][td]09[/td][td]房户类型[/td][td]${values.houseType || ""}[/td][/tr]
    [tr][td]10[/td][td]出租户型[/td][td]${values.rentType || ""}[/td][/tr]
    [tr][td]11[/td][td]出租面积[/td][td]${values.area || ""}[/td][/tr]
    [tr][td]12[/td][td]可租期限[/td][td]${values.range || ""}[/td][/tr]
    [tr][td]13[/td][td]付款方式[/td][td]${values.paymentType || ""}[/td][/tr]
    [tr][td]14[/td][td]是否为隔间[/td][td]${values.isSingleRoom || ""}[/td][/tr]
    [tr][td]15[/td][td]独立电表[/td][td]${values.isElectricIsolated || ""}[/td][/tr]
    [tr][td]16[/td][td]水电缴费[/td][td]${values.waterElecValue || ""}[/td][/tr]
    [tr][td]17[/td][td]日常卫生[/td][td]${values.cleaning || ""}[/td][/tr]
    [tr][td]18[/td][td]维修物业[/td][td]${values.repairing || ""}[/td][/tr]
    [tr][td]19[/td][td]网络带宽[/td][td]${values.networking || ""}[/td][/tr]
    [tr][td]20[/td][td]退租方式[/td][td]${values.checkout || ""}[/td][/tr]
    [tr][td]21[/td][td]其他描述[/td][td]${values.otherDescriptions || ""}[/td][/tr]
    [tr][td]22[/td][td]其他要求[/td][td]${values.otherDemands || ""}[/td][/tr]
    [/table]`;
    updateState({
      content: content + "\n\n" + state.content,
      houseTmpVisible: false,
    });
  };

  // 旧 render 会读取缓存，即使结果没有参与 JSX。
  getEditorContentCache();
  const boardUrl = `/board/${state.boardId}`;
  let editor: React.ReactNode;
  let titleInput: React.ReactNode = null;

  if (mode === "postTopic" || mode === "postVoteTopic") {
    titleInput = (
      <EditorTitleInput
        boardId={id}
        tagsV2={state.tagsV2}
        onChange={handleTitleChange}
        title={state.postInfo.title}
        tag1={0}
        tag2={0}
      />
    );

    let ubbButtons: React.ReactNode;
    let markdownButtons: React.ReactNode;
    if (state.anonymousState === 0 || mode === "postVoteTopic") {
      ubbButtons = (
        <div className="row" style={{ justifyContent: "center" }}>
          <button
            id="post-topic-button"
            onClick={() => void sendUbbTopic(false)}
            className="button blue"
          >
            发帖
          </button>
        </div>
      );
      markdownButtons = (
        <div className="row" style={{ justifyContent: "center" }}>
          <button
            id="post-topic-button"
            onClick={() => void sendMarkdownTopic(false)}
            className="button blue"
          >
            发帖
          </button>
        </div>
      );
    } else if (state.anonymousState === 1) {
      ubbButtons = (
        <div className="row" style={{ justifyContent: "center" }}>
          <button
            id="post-topic-button-anonymous"
            onClick={() => void sendUbbTopic(true)}
            className="button grey"
          >
            匿名发帖
          </button>
        </div>
      );
      markdownButtons = (
        <div className="row" style={{ justifyContent: "center" }}>
          <button
            id="post-topic-button-anonymous"
            onClick={() => void sendMarkdownTopic(true)}
            className="button grey"
          >
            匿名发帖
          </button>
        </div>
      );
    } else if (
      state.anonymousState === 2 ||
      state.anonymousState === 3
    ) {
      const balance = (
        <p>
          在本版面匿名发主题每次需消耗10000财富值。你当前的财富值余额为：
          {state.wealth}
        </p>
      );
      ubbButtons = (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div>
            <button
              id="post-topic-button"
              onClick={() => void sendUbbTopic(false)}
              className="button blue"
            >
              发帖
            </button>
            <button
              id="post-topic-button-anonymous"
              onClick={() => void sendUbbTopic(true)}
              className="button grey"
            >
              匿名发帖
            </button>
          </div>
          {balance}
        </div>
      );
      markdownButtons = (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div>
            <button
              id="post-topic-button"
              onClick={() => void sendMarkdownTopic(false)}
              className="button blue"
            >
              发帖
            </button>
            <button
              id="post-topic-button-anonymous"
              onClick={() => void sendMarkdownTopic(true)}
              className="button grey"
            >
              匿名发帖
            </button>
          </div>
          {balance}
        </div>
      );
    }

    editor =
      state.mode === 0 ? (
        <div>
          <EditorContentHeader
            target="Markdown"
            changeEditor={changeEditor}
          />
          <UbbEditor
            update={(content) => updateState({ content })}
            value={state.content}
            option={{
              height: 20,
              submit: () => void sendUbbTopic(false),
            }}
          />
          {ubbButtons}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <EditorContentHeader target="UBB" changeEditor={changeEditor} />
          <MarkdownEditor
            value={state.mdeState}
            onChange={(mdeState) => updateState({ mdeState })}
            renderPreview={(markdown) =>
              Promise.resolve(converterRef.current.makeHtml(markdown))
            }
            uploadImage={uploadEvent}
            minEditorHeight={330}
            maxEditorHeight={500}
          />
          {markdownButtons}
        </div>
      );
  } else if (mode === "edit") {
    editor =
      state.mode === 0 ? (
        <div>
          <EditorContentHeader
            target="Markdown"
            changeEditor={changeEditor}
          />
          <UbbEditor
            update={(content) => updateState({ content })}
            value={state.content}
            option={{ submit: () => void editUbb() }}
          />
          <div className="row" style={{ justifyContent: "center" }}>
            <button
              id="post-topic-button"
              onClick={() => void editUbb()}
              className="button blue"
            >
              编辑
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <EditorContentHeader target="UBB" changeEditor={changeEditor} />
          <MarkdownEditor
            value={state.mdeState}
            onChange={(mdeState) => updateState({ mdeState })}
            renderPreview={(markdown) =>
              Promise.resolve(converterRef.current.makeHtml(markdown))
            }
            uploadImage={uploadEvent}
            minEditorHeight={330}
            maxEditorHeight={500}
          />
          <button
            id="post-topic-button"
            onClick={() => void editMarkdown()}
            className="button blue"
          >
            编辑
          </button>
        </div>
      );

    if (state.postInfo.floor === 1) {
      titleInput = (
        <EditorTitleInput
          boardId={id}
          tagsV2={state.tagsV2}
          onChange={handleTitleChange}
          title={state.postInfo.title}
          tag1={state.topicInfo.tag1}
          tag2={state.topicInfo.tag2}
        />
      );
    }
  }

  console.log("默认type:" + state.type);
  let topicType: React.ReactNode = (
    <div className={styles.createTopicType}>
      <div className={styles.createTopicListName}>发帖类型</div>
      <EditorTypeRadio
        value={0}
        currentType={state.type}
        label="普通"
        onClick={() => updateState({ type: 0 })}
      />
      <EditorTypeRadio
        value={2}
        currentType={state.type}
        label="学术通知"
        onClick={() => updateState({ type: 2 })}
      />
      <div style={{ color: "rgb(255,0,0)" }}>
        （活动帖和学术帖请选择正确的发帖类型）
      </div>
    </div>
  );

  const myInfo = getMyInfo();
  if (
    myInfo &&
    (isMaster(state.masters) ||
      (myInfo.userTitleIds || []).indexOf(91) !== -1)
  ) {
    topicType = (
      <div className={styles.createTopicType}>
        <div className={styles.createTopicListName}>发帖类型</div>
        <EditorTypeRadio
          value={0}
          currentType={state.type}
          label="普通"
          onClick={() => updateState({ type: 0 })}
        />
        <EditorTypeRadio
          value={2}
          currentType={state.type}
          label="学术通知"
          onClick={() => updateState({ type: 2 })}
        />
        <EditorTypeRadio
          value={1}
          currentType={state.type}
          label="校园活动"
          onClick={() => updateState({ type: 1 })}
        />
        <div style={{ color: "rgb(255,0,0)" }}>
          （活动帖和学术帖请选择正确的发帖类型）
        </div>
      </div>
    );
  }

  let noticeOption: React.ReactNode = (
    <div className={styles.createTopicType}>
      <div className={styles.createTopicListName}>高级选项</div>
      <input
        style={{ marginLeft: "5px" }}
        type="checkbox"
        name="option"
        value="notNotice"
        onClick={() => updateState({ notice: !state.notice })}
        checked={state.notice}
      />{" "}
      接收消息提醒
    </div>
  );
  if (state.postInfo.floor !== 1 && mode === "edit") {
    topicType = null;
    noticeOption = null;
  }

  const houseTemplate =
    Number(state.boardId) === 515 ? (
      <>
        <div style={{ marginBottom: "15px" }}>
          <Button
            style={{ width: "150px" }}
            type="primary"
            size="middle"
            onClick={() => updateState({ houseTmpVisible: true })}
          >
            住房信息模板
          </Button>
          <span style={{ color: "red", marginLeft: "10px" }}>
            (出租、合租、转租、出售等已有房源必填)
          </span>
        </div>
        <HousingTemplateDialog
          visible={state.houseTmpVisible}
          submit={handleHousingTemplate}
        />
      </>
    ) : null;

  return (
    <div className={styles.createTopic}>
      <Modal
        title="错误提示"
        open={state.contentTooLongModalVisible}
        onCancel={() => updateState({ contentTooLongModalVisible: false })}
        onOk={() => updateState({ contentTooLongModalVisible: false })}
        cancelButtonProps={{ style: { display: "none" } }}
        maskClosable={false}
      >
        内容过长，不应超过8000个字符。
        <br />
        当前字符数：
        {state.mode === 0 ? state.content.length : state.mdeState.length}。
      </Modal>
      <EditorBreadcrumb
        url={boardUrl}
        boardName={state.boardName}
        mode={mode}
      />
      <EditorTagNotice tagsV2={state.tagsV2} postInfo={state.postInfo} />
      {titleInput}
      {topicType}
      {noticeOption}
      {houseTemplate}
      {mode === "postVoteTopic" ? (
        <EditorVoteSettings
          voteInfo={state.voteInfo}
          onVoteInfoChange={(voteInfo) => updateState({ voteInfo })}
        />
      ) : null}
      {editor}
    </div>
  );
}

interface EditorContentHeaderProps {
  target: "Markdown" | "UBB";
  changeEditor: () => void;
}

function EditorContentHeader({
  target,
  changeEditor,
}: EditorContentHeaderProps): React.ReactElement {
  return (
    <div className={styles.createTopicContent}>
      <div className={styles.createTopicListName}>主题内容</div>
      <div style={{ color: "darkgray" }}>
        提示：CC98微信小程序现已支持上传时长不超过6分钟的视频。
      </div>
      <div
        id="post-topic-changeMode"
        onClick={changeEditor}
        className="hiddenImage"
        style={{ width: "12rem", marginTop: "0rem" }}
      >
        切换到{target}编辑器
      </div>
    </div>
  );
}

interface EditorTypeRadioProps {
  value: number;
  currentType: number;
  label: string;
  onClick: () => void;
}

function EditorTypeRadio({
  value,
  currentType,
  label,
  onClick,
}: EditorTypeRadioProps): React.ReactElement {
  return (
    <>
      <input
        type="radio"
        name="type"
        value={label}
        onClick={onClick}
        checked={currentType === value}
      />{" "}
      {label}
    </>
  );
}
