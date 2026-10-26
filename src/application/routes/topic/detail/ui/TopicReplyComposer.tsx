import * as React from "react";
import $ from "jquery";
import { UbbEditor } from "@modules/ubb-editor/UbbEditor";
import { RightTagHandler } from "@modules/ubb/tag/RightTagHandler";
import { UbbContainer } from "@modules/ubb/UbbContainer";
import { Constants } from "@foundation/config/runtime-config";
import {
  NoticeMessage,
  SendTopicNoticeMessage,
  noticeMessageShow,
} from "@foundation/ui/feedback";
import { NavigationPrompt } from "@application/router/navigation-prompt";
import { Button } from "@foundation/ui/button";
import { Dialog } from "@foundation/ui/dialog";
import moment from "moment";
import { MarkdownEditor } from "@foundation/integrations/markdown";
import styles from "./TopicReplyComposer.module.scss";
import { AnonymousState } from "@modules/board/model/dto";
import { isMaster } from "@modules/board/api/service";
import { PostContentType } from "@modules/post/model/dto";
import { getMyInfo } from "@modules/session/api/session";
import { getUserWealth } from "@modules/wealth/api/service";
import { getToken } from "@modules/session/api/session";
import { sendAtNotification } from "@modules/notification/api/service";
import {
  clearFailedReplyCache,
  clearLegacyTemporaryContent,
  clearReplyDraft,
  getFailedReplyCache,
  setFailedReplyCache,
} from "@modules/posting/drafts/draft-storage";
import { submitTopicReply } from "@modules/posting/api/service";
import { uploadImageFile } from "@modules/posting/drafts/editor-image-upload";
import { findIP } from "@modules/moderation/api/service";
import { atHanderler, quoteJudger } from "@foundation/lib/text";
import { getAccessToken } from "@foundation/storage/web-storage";
import { TopicIPData } from "@modules/moderation/ui/TopicIPData";
import { TopicManagementDialog } from "@modules/moderation/ui/TopicManagementDialog";
import { TopicManagementHistoryDialog } from "@modules/moderation/ui/TopicManagementHistoryDialog";

interface Props {
  boardInfo;
  onChange;
  content;
  topicInfo;
}

interface State {
  content: string;
  notifyAllReplier: boolean;
  mode: number;
  masters: string[];
  buttonInfo;
  buttonDisabled;
  manageVisible;
  mdeState;
  IPData;
  postCache: string;
  anonymouslyPostButtonInfo;
  manageHistoryVisible;
  wealth: number | string;
  contentTooLongModalVisible: boolean;
}

interface ErrorMessage {
  /**错误代码 */
  statusCode: number;
  /**错误说明文本 */
  errorMessageText: string;
  /**错误说明描述 */
  errorMessageDescription: string;
}

//TODO: 错误类型应该单列文件
//TODO： 逻辑太复杂了，后面看看能不能拆组件吧


/**
 * POST失败返回的错误说明集合
 */
const errorMessageSet: ErrorMessage[] = [
  {
    statusCode: 400,
    errorMessageText: "content_too_long",
    errorMessageDescription:
      "内容过长，不应超过8000个字符。",
  },
  {
    statusCode: 400,
    errorMessageText: "wealth_not_enough_for_anonymous_post",
    errorMessageDescription:
      "你在当前可选匿名版面进行匿名回复所需的财富值不足。",
  },
  {
    statusCode: 402,
    errorMessageText: "content_is_empty",
    errorMessageDescription: "你的回复内容为空。",
  },
  {
    statusCode: 403,
    errorMessageText: "cannot_post_in_this_board",
    errorMessageDescription:
      "你已被当前版面TP，或根据当前版面的特殊规定你无法回帖。",
  },
  {
    statusCode: 403,
    errorMessageText: "cannot_post_anonymous",
    errorMessageDescription:
      "你的某个匿名主题或者回复已被TP，在其到期或被解除TP前，你无法在全站发布任何匿名帖子。",
  },
  {
    statusCode: 403,
    errorMessageText: "topic_is_locked",
    errorMessageDescription: "当前主题已被锁定。",
  },
  {
    statusCode: 403,
    errorMessageText: "board_is_locked",
    errorMessageDescription: "当前版面已被锁定。",
  },
  {
    statusCode: 403,
    errorMessageText: "user_state_is_abnormal",
    errorMessageDescription: "你已被全站TP，或你的账号已被锁定。",
  },
  {
    statusCode: 403,
    errorMessageText: "cannot_entry_board",
    errorMessageDescription: "你不能进入当前版面。",
  },
  {
    statusCode: 403,
    errorMessageText: "last_post_in_10_seconds",
    errorMessageDescription: "你在10秒内只能发言一次。",
  },
];
export interface TopicReplyComposerHandle {
  isContentEmpty: () => boolean;
}

export const TopicReplyComposer = React.forwardRef(function TopicReplyComposer(
  props: Props,
  ref: React.ForwardedRef<TopicReplyComposerHandle>
) {
  // 按需求：每次打开回帖编辑框都是全空，不恢复上次编辑的草稿残留
  // （原实现会从 localStorage 草稿 getReplyDraft 恢复）。
  const initialContent = "";
  const [state, setState] = React.useState<State>({
    content: initialContent,
    notifyAllReplier: false,
    mode: 0,
    masters: [],
    buttonDisabled: false,
    buttonInfo: "回复",
    manageVisible: false,
    mdeState: initialContent,
    IPData: [],
    postCache: "",
    anonymouslyPostButtonInfo: "匿名回复",
    manageHistoryVisible: false,
    wealth: "",
    contentTooLongModalVisible: false,
  });
  const stateRef = React.useRef(state);
  stateRef.current = state;
  const propsRef = React.useRef(props);
  propsRef.current = props;
  const setLegacyState = (
    patch:
      | Partial<State>
      | ((currentState: State) => Partial<State>),
    callback?: () => void
  ) => {
    const nextPatch =
      typeof patch === "function" ? patch(stateRef.current) : patch;
    const nextState = { ...stateRef.current, ...nextPatch };
    stateRef.current = nextState;
    setState(nextState);
    if (callback) {
      queueMicrotask(callback);
    }
  };

  const handleValueChange = (value) => {
    setLegacyState({ mdeState: value });
  };

  const showManageUI = (v) => {
    setLegacyState({ manageVisible: v });
  };

  const handleCancel = () => {
    setLegacyState({ manageVisible: false });
  };

  const update = (value) => {
    setLegacyState({ content: value });
  };

  const openContentTooLongModal = () => {
    setLegacyState({ contentTooLongModalVisible: true });
  };

  const closeContentTooLongModal = () => {
    setLegacyState({ contentTooLongModalVisible: false });
  };

  const onChange = () => {
    props.onChange();
  };

  const showManagement = () => {
    setLegacyState({ manageVisible: true });
  };

  const showManageHistory = () => {
    setLegacyState({ manageHistoryVisible: true });
  };

  const close = () => {
    const UIId = `#manage${props.topicInfo.id}`;
    $(UIId).css("display", "none");
  };

  const cacheForPost = (type: "ubb" | "markdown") => {
    /**缓存的内容 */
    let content;
    if (type === "ubb") {
      content = stateRef.current.content;
    } else if (type === "markdown") {
      content = stateRef.current.mdeState;
    }
    setFailedReplyCache(props.topicInfo.id, content);
    setLegacyState({
      postCache: content,
    });
  };

  const getCache = () => {
    setLegacyState({
      postCache: getFailedReplyCache(props.topicInfo.id),
    });
  };

  const cleancache = () => {
    clearFailedReplyCache(props.topicInfo.id);
    setLegacyState({
      postCache: "",
    });
  };

  const resetNotifyAllReplier = () => {
    $("#notifyAllReplierCheckBox").prop("checked", false);
    setLegacyState({ notifyAllReplier: false });
  };

  const generateErrorNoticeMessage = (errorMessage: ErrorMessage, index: number) => {
    return (
      <SendTopicNoticeMessage
        key={`${errorMessage.errorMessageText}-${index}`}
        text={errorMessage.errorMessageDescription}
        id={errorMessage.errorMessageText}
      />
    );
  };

  const sendUbbTopic = async (isAnonymous: boolean) => {
    setLegacyState({
      buttonDisabled: true,
      buttonInfo: "...",
      anonymouslyPostButtonInfo: "...",
    });
    let bodyInfo;

    if (stateRef.current.content.length > 8000) {
      openContentTooLongModal();
      setLegacyState({
        buttonDisabled: false,
        buttonInfo: "回复",
        anonymouslyPostButtonInfo: "匿名回复",
      });
      return;
    }

    try {
      if (quoteJudger(stateRef.current.content)) {
        bodyInfo = {
          content: stateRef.current.content,
          contentType: PostContentType.Ubb,
          title: "",
          parentId: props.content.postId,
          isAnonymous: isAnonymous,
          notifyAllReplier: stateRef.current.notifyAllReplier,
          clientType: 1,
        };
      } else {
        bodyInfo = {
          content: stateRef.current.content,
          contentType: PostContentType.Ubb,
          title: "",
          isAnonymous: isAnonymous,
          notifyAllReplier: stateRef.current.notifyAllReplier,
          clientType: 1,
        };
      }
      const token = await getToken();
      const mes = await submitTopicReply(
        props.topicInfo.id,
        token,
        bodyInfo
      );
      //处理post失败的情况
      if (mes.status === 400 || mes.status === 402 || mes.status === 403) {
        /**post失败返回的错误说明 */
        let errorMessageText = await mes.text();
        /**所有错误说明文本的集合 */
        const errorMessageTextSet: string[] = [];
        for (let errorMessage of errorMessageSet) {
          errorMessageTextSet.push(errorMessage.errorMessageText);
        }
        //console.log(errorMessageTextSet)
        if (errorMessageTextSet.indexOf(errorMessageText) === -1) {
          errorMessageText = "unknown_error";
        }
        //console.log(errorMessageText);

        noticeMessageShow(errorMessageText);
        //改变发帖按钮状态为不可点击
        setLegacyState({
          buttonDisabled: false,
          buttonInfo: "回复",
          anonymouslyPostButtonInfo: "匿名回复",
        });
        cacheForPost("ubb");
      }
      //post成功
      else if (mes.status === 200) {
        const atUsers = atHanderler(stateRef.current.content);
        //如果存在合法的@，则发送@信息，否则不发送，直接跳转至所发帖子
        if (atUsers) {
          const postId = await mes.text();
          const topicId = props.topicInfo.id;
          await sendAtNotification(
            topicId,
            postId,
            atUsers as string[],
            token,
          );
        }

        clearReplyDraft(props.topicInfo.id);
        setLegacyState({
          buttonDisabled: false,
          buttonInfo: "回复",
          anonymouslyPostButtonInfo: "匿名回复",
        });
        resetNotifyAllReplier();
        props.onChange();
      }
      //status既不是400/402/403，也不是200（存在这种情况吗……）
      else {
        cacheForPost("ubb");
        noticeMessageShow("other");
        setLegacyState({
          buttonDisabled: false,
          buttonInfo: "请刷新",
          anonymouslyPostButtonInfo: "请刷新",
        });
      }
    } catch (e) {
      cacheForPost("ubb");
      noticeMessageShow("other");
      setLegacyState({
        buttonDisabled: false,
        buttonInfo: "请刷新",
        anonymouslyPostButtonInfo: "请刷新",
      });
    }
  };

  const sendMdTopic = async (isAnonymous: boolean) => {
    setLegacyState({
      buttonDisabled: true,
      buttonInfo: "...",
      anonymouslyPostButtonInfo: "...",
    });
    if (stateRef.current.mdeState.length > 8000) {
      openContentTooLongModal();
      setLegacyState({
        buttonDisabled: false,
        buttonInfo: "回复",
        anonymouslyPostButtonInfo: "匿名回复",
      });
      return;
    }

    try {
      let c = stateRef.current.mdeState;
      //console.log(c);
      const content = {
        content: c,
        contentType: PostContentType.Markdown,
        title: "",
        isAnonymous: isAnonymous,
        notifyAllReplier: stateRef.current.notifyAllReplier,
        clientType: 1,
      };
      const token = getAccessToken();
      const mes = await submitTopicReply(
        props.topicInfo.id,
        token,
        content
      );
      //处理post失败的情况
      if (mes.status === 400 || mes.status === 402 || mes.status === 403) {
        /**post失败返回的错误说明 */
        let errorMessageText = await mes.text();
        /**所有错误说明文本的集合 */
        const errorMessageTextSet: string[] = [];
        for (let errorMessage of errorMessageSet) {
          errorMessageTextSet.push(errorMessage.errorMessageText);
        }
        //console.log(errorMessageTextSet)
        if (errorMessageTextSet.indexOf(errorMessageText) === -1) {
          errorMessageText = "unknown_error";
        }
        //console.log(errorMessageText);

        noticeMessageShow(errorMessageText);
        //改变发帖按钮状态为不可点击
        setLegacyState({
          buttonDisabled: false,
          buttonInfo: "回复",
          anonymouslyPostButtonInfo: "匿名回复",
        });
        cacheForPost("markdown");
      }
      //post成功
      else if (mes.status === 200) {
        const atUsers = atHanderler(c);
        //如果存在合法的@，则发送@信息，否则不发送，直接跳转至所发帖子
        if (atUsers) {
          const postId = await mes.text();
          const topicId = props.topicInfo.id;
          await sendAtNotification(
            topicId,
            postId,
            atUsers as string[],
            token,
          );
        }
        clearLegacyTemporaryContent();
        resetNotifyAllReplier();
        props.onChange();

        setLegacyState({
          buttonDisabled: false,
          buttonInfo: "回复",
          anonymouslyPostButtonInfo: "匿名回复",
        });
      }
      //status既不是400/402/403，也不是200（存在这种情况吗……）
      else {
        cacheForPost("markdown");
        noticeMessageShow("other");
        setLegacyState({
          buttonDisabled: false,
          buttonInfo: "请刷新",
          anonymouslyPostButtonInfo: "请刷新",
        });
      }
    } catch (e) {
      cacheForPost("markdown");
      noticeMessageShow("other");
      setLegacyState({
        buttonDisabled: false,
        buttonInfo: "请刷新",
        anonymouslyPostButtonInfo: "请刷新",
      });
    }
  };

  const postUbbContent = () => {
    sendUbbTopic(false);
  };

  const postAnonymousUbbContent = () => {
    if (props.boardInfo.anonymousState !== AnonymousState.Force) {
      if (!confirm("你真的要匿名吗？")) return;
    }

    sendUbbTopic(true);
  };

  const postMdContent = () => {
    sendMdTopic(false);
  };

  const postAnonymousMdContent = () => {
    if (props.boardInfo.anonymousState !== AnonymousState.Force) {
      if (!confirm("你真的要匿名吗？")) return;
    }

    sendMdTopic(true);
  };

  const showIP = async () => {
    const IPData = await findIP(props.topicInfo.id);
    setLegacyState({ IPData });
  };

  const closeIP = () => setLegacyState({ IPData: [] });

  const changeEditor = () => {
    if (!confirm("切换编辑器会丢失您之前的编辑内容，确定要切换吗？")) {
      return;
    }
    if (stateRef.current.mode === 0) {
      setLegacyState({ mode: 1 });
    } else {
      setLegacyState({ mode: 0 });
    }
  };

  const getInitialState = () => {
    return { value: "" };
  };

  const setValue = (v) => {
    setLegacyState({ mdeState: stateRef.current.mdeState + v }, () => {
      setLegacyState({ mdeState: stateRef.current.mdeState });
    });
  };

  const isContentEmpty = () => {
    switch (stateRef.current.mode) {
      case 0:
        return stateRef.current.content === "";
      case 1:
        return stateRef.current.mdeState === "";
      default:
        return true;
    }
  };

  const applyQuoteContent = (nextContent: any) => {
    const time = moment(nextContent.replyTime).format("YYYY-MM-DD HH:mm:ss");
    if (nextContent.userName) {
      if (stateRef.current.mode === 1) {
        const value = `>**以下是引用${nextContent.floor}楼：用户${nextContent.userName}在${time}的发言：**
${nextContent.content}
`;
        setLegacyState({ content: value, mdeState: value });
      } else {
        let floor = nextContent.floor;
        let url;
        if (floor > 10) {
          const page = parseInt(((floor - 1) / 10).toString()) + 1;
          floor = floor % 10;
          url = `/topic/${props.topicInfo.id}/${page}#${floor === 0 ? 10 : floor}`;
        } else {
          url = `/topic/${props.topicInfo.id}#${nextContent.floor}`;
        }
        const value = `[quote][b]以下是引用${nextContent.floor}楼：用户${nextContent.userName}在${time}的发言：[color=blue][url=${url}]>>查看原帖<<[/url][/color][/b]
${nextContent.content}[/quote]
`;
        setLegacyState({ content: value });
      }
    } else {
      setLegacyState({ content: "", mdeState: "" });
    }
  };

  React.useEffect(() => {
    window.onbeforeunload = () => {
      if (stateRef.current.content) return "您还有内容未发布，确认离开吗？";
      return null;
    };

    const loadInitialState = async () => {
      let wealth;
      try {
        wealth = await getUserWealth();
      } catch (error) {
        wealth = "查询财富值余额失败，请前往个人中心查看";
      }
      setLegacyState({ wealth });
      getCache();
    };
    void loadInitialState();

    return () => {
      // 不再把编辑内容写入回帖草稿（见 initialContent 注释）：
      // 每次打开编辑框都是全空，不做上次编辑的残留恢复。
      window.onbeforeunload = null;
    };
  }, []);

  React.useEffect(() => {
    if (props.content && typeof props.content !== "string") {
      applyQuoteContent(props.content);
    }
  }, [props.content]);

  React.useImperativeHandle(ref, () => ({ isContentEmpty }), [isContentEmpty]);

  //发帖时间超过365天提示
      const s1 = new Date();
      const s2 = new Date(props.topicInfo.time);
      const s = s1.getTime() - s2.getTime();
      const f = (s / 1000 / 60 / 60 / 24).toFixed(0);
      let ft = null;
      if (Number(f) > 365) {
        ft = (
          <div className={`${styles.row} ${styles.oldTopicWarning}`}>
            提示：该贴发布于{f}天前，如无必要请勿回复。
          </div>
        );
      }

      const isManager = isMaster(props.boardInfo.boardMasters);
      let notifyAllReplier = null;
      if (props.topicInfo.canNotifyAllReplier || isManager) {
        notifyAllReplier = (
          <div>
            <div className={`${styles.row} ${styles.notifyNotice}`}>
              <input type="checkbox" id="notifyAllReplierCheckBox" className={styles.notifyCheckbox}
                onChange={e => {
                  console.log(e.target.checked);
                  setLegacyState({ notifyAllReplier: e.target.checked });
                }} />
              <label htmlFor="notifyAllReplierCheckBox">通知本主题所有回复用户</label><br />
            </div>
            {isManager ?
              <div className={`${styles.row} ${styles.notifyNotice}`}>注意：你因拥有本版面的管理权限，可以在本版面无条件使用本功能，请谨慎使用。</div>
              : null}
          </div>
        )
      }

      let mode, editor;
      //版面匿名状态，包括不可匿名、强制匿名（心灵）以及可选匿名
      //不可匿名为0，强制匿名为1，可选匿名为2，仅楼主可选匿名为3
      const anonymousState = props.boardInfo.anonymousState;
      let ubbButtons;
      let markdownButtons;
      //不可匿名版面，或者，仅楼主可选匿名版面并且主楼非匿名或者非楼主回复时
      if (
        anonymousState === AnonymousState.NotAllowed ||
        (anonymousState === AnonymousState.OnlyPosterAllowed &&
          (!props.topicInfo.isAnonymous || !props.topicInfo.isMe))
      ) {
        ubbButtons = (
          <button
            id="post-topic-button"
            onClick={postUbbContent}
            disabled={stateRef.current.buttonDisabled}
            className={`${styles.button} ${styles.blue} ${styles.postTopicButton}`}
          >
            {stateRef.current.buttonInfo}
          </button>
        );
        markdownButtons = (
          <button
            id="post-topic-button-md"
            onClick={postMdContent}
            disabled={stateRef.current.buttonDisabled}
            className={`${styles.button} ${styles.blue} ${styles.postTopicButton}`}
          >
            {stateRef.current.buttonInfo}
          </button>
        );
      } else if (
        anonymousState === AnonymousState.Force ||
        (anonymousState === AnonymousState.OnlyPosterAllowed &&
          props.topicInfo.isAnonymous &&
          props.topicInfo.isMe)
      ) {
        //强制匿名版面，或者，仅楼主可选匿名版面并且主楼是匿名并且是楼主回复
        ubbButtons = (
          <div className={styles.anonymousButtons}>
            <button
              id="post-topic-button-anonymous"
              onClick={postAnonymousUbbContent}
              disabled={stateRef.current.buttonDisabled}
              className={`${styles.button} ${styles.grey} ${styles.postTopicButton}`}
            >
              {stateRef.current.anonymouslyPostButtonInfo}
            </button>
            <p>根据设置，你在本楼的回复都是匿名，并且不花费财富值。</p>
          </div>
        );
        markdownButtons = (
          <div className={styles.anonymousButtons}>
            <button
              id="post-topic-button-md-anonymous"
              onClick={postAnonymousMdContent}
              disabled={stateRef.current.buttonDisabled}
              className={`${styles.button} ${styles.grey} ${styles.postTopicButton}`}
            >
              {stateRef.current.anonymouslyPostButtonInfo}
            </button>
            <p>根据设置，你在本楼的回复都是匿名，并且不花费财富值。</p>
          </div>
        );
      } else if (anonymousState === AnonymousState.Allowed) {
        if (props.topicInfo.isAnonymous && props.topicInfo.isMe) {
          ubbButtons = (
            <div className={styles.anonymousButtons}>
              <button
                id="post-topic-button-anonymous"
                onClick={postAnonymousUbbContent}
                disabled={stateRef.current.buttonDisabled}
                className={`${styles.button} ${styles.grey} ${styles.postTopicButton}`}
              >
                {stateRef.current.anonymouslyPostButtonInfo}
              </button>
              <p>根据设置，你在本楼的回复都是匿名，并且不花费财富值。</p>
            </div>
          );
          markdownButtons = (
            <div className={styles.anonymousButtons}>
              <button
                id="post-topic-button-md-anonymous"
                onClick={postAnonymousMdContent}
                disabled={stateRef.current.buttonDisabled}
                className={`${styles.button} ${styles.grey} ${styles.postTopicButton}`}
              >
                {stateRef.current.anonymouslyPostButtonInfo}
              </button>
              <p>根据设置，你在本楼的回复都是匿名，并且不花费财富值。</p>
            </div>
          );
        } else {
          ubbButtons = (
            <div className={styles.anonymousButtons}>
              <div>
                <button
                  id="post-topic-button"
                  onClick={postUbbContent}
                  disabled={stateRef.current.buttonDisabled}
                  className={`${styles.button} ${styles.blue} ${styles.postTopicButton}`}
                >
                  {stateRef.current.buttonInfo}
                </button>
                <button
                  id="post-topic-button-anonymous"
                  onClick={postAnonymousUbbContent}
                  disabled={stateRef.current.buttonDisabled}
                  className={`${styles.button} ${styles.grey} ${styles.postTopicButton}`}
                >
                  {stateRef.current.anonymouslyPostButtonInfo}
                </button>
              </div>
              <p>
                在本版面匿名回复每次需消耗2000财富值。你当前的财富值余额为：
                {stateRef.current.wealth}
              </p>
            </div>
          );
          markdownButtons = (
            <div className={styles.anonymousButtons}>
              <div>
                <button
                  id="post-topic-button-md"
                  onClick={postMdContent}
                  disabled={stateRef.current.buttonDisabled}
                  className={`${styles.button} ${styles.blue} ${styles.postTopicButton}`}
                >
                  {stateRef.current.buttonInfo}
                </button>
                <button
                  id="post-topic-button-md-anonymous"
                  onClick={postAnonymousMdContent}
                  disabled={stateRef.current.buttonDisabled}
                  className={`${styles.button} ${styles.grey} ${styles.postTopicButton}`}
                >
                  {stateRef.current.anonymouslyPostButtonInfo}
                </button>
              </div>
              <p>
                在本版面匿名回复每次需消耗2000财富值。你当前的财富值余额为：
                {stateRef.current.wealth}
              </p>
            </div>
          );
        }
      }
      //根据ubb或markdown模式，显示相应的编辑器和按钮
      if (stateRef.current.mode === 0) {
        mode = "使用UBB模式编辑";
        editor = (
          <div>
            {ft}
            {notifyAllReplier}
            <UbbEditor
              update={update}
              value={stateRef.current.content}
              option={{ height: 20, submit: postUbbContent }}
            />
            <div className={`${styles.row} ${styles.ubbActionRow}`}>
              {ubbButtons}
            </div>
          </div>
        );
      } else {
        mode = "使用Markdown编辑";
        //console.log("react mde")
        //console.log(stateRef.current.mdeState)
        editor = (
          <div>
            <div>
              {ft}
              {notifyAllReplier}
              <MarkdownEditor
                value={stateRef.current.mdeState}
                onChange={handleValueChange}
                uploadImage={uploadImageFile}
                uploadFile={uploadImageFile}
                editorHeight={430}
              />
            </div>
            <div className={`${styles.row} ${styles.markdownActionRow}`}>
              {markdownButtons}
            </div>
          </div>
        );
      }
      //管理按钮

      const manageItems = [];
      const myInfo = getMyInfo();
      const isMe = myInfo && myInfo.id === props.topicInfo.userId;
      const hasManageFeature =
        isMe &&
        props.topicInfo.topicAuthorPermissions &&
        props.topicInfo.topicAuthorPermissions.length !== 0;

      if (isManager || hasManageFeature) {
        manageItems.push(
          <Button key={0} type="primary" onClick={showManagement}>
            管理
          </Button>
        );
        manageItems.push(
          <Button
            key={1}
            type="primary"
            onClick={showManageHistory}
            className={styles.manageButtonOffset}
          >
            管理记录
          </Button>
        );
      }

      if (isManager) {
        manageItems.push(
          <Button
            key={2}
            type="primary"
            onClick={showIP}
            className={styles.manageButtonOffset}
          >
            查看IP
          </Button>
        );
      }

      const manageButtonRegion = <div>{manageItems}</div>;
      //缓存按钮
      let cacheButton = null;
      if (getFailedReplyCache(props.topicInfo.id)) {
        cacheButton = (
          <div>
            <div className={styles.cacheRow}>
              <button
                id="post-topic-cache-button"
                onClick={cleancache}
                className={`${styles.button} ${styles.blue} ${styles.cacheButton}`}
              >
                下面文本框中的内容为前一次回帖失败时的缓存，你可以复制到相应的UBB/Markdown编辑器中重新编辑。点击这个按钮将清除缓存。
              </button>
            </div>
            <input
              id="cache-text"
              type="text"
              className={styles.cacheInput}
              onChange={getCache}
              value={stateRef.current.postCache}
            />
          </div>
        );
      }

      return (
        <div id="sendTopicInfo" className={styles.composer}>
          <div className={`${styles.row} ${styles.modeRow}`}>
            <div
              id="post-topic-changeMode"
              className={styles.changeEditor}
              onClick={changeEditor}
            >
              {stateRef.current.mode === 1 ? "切换到UBB编辑器" : "切换到Markdown编辑器"}
            </div>
          </div>
          {editor}
          {cacheButton}
          {manageButtonRegion}
          {stateRef.current.manageVisible && (
            <TopicManagementDialog
              update={onChange}
              boardId={props.boardInfo.id}
              topicInfo={props.topicInfo}
              onCancel={handleCancel}
              visible={stateRef.current.manageVisible}
              isManager={isManager}
              permissions={props.topicInfo.topicAuthorPermissions}
            />
          )}
          {stateRef.current.manageHistoryVisible && (
            <TopicManagementHistoryDialog
              topicInfo={props.topicInfo}
              onClose={() => setLegacyState({ manageHistoryVisible: false })}
              visible={stateRef.current.manageHistoryVisible}
            />
          )}
          {stateRef.current.IPData.length !== 0 && (
            <TopicIPData
              IPData={stateRef.current.IPData}
              changeStatus={closeIP}
            />
          )}

          {/**错误提示 */}
          {errorMessageSet.map(generateErrorNoticeMessage)}
          <SendTopicNoticeMessage
            key="reply-error-other"
            text="other"
            id="出现了意料之外的错误，请稍后重试。如果依然出现该问题，请联系管理员。"
          />
          <SendTopicNoticeMessage
            key="reply-error-unknown"
            text="unknown_error"
            id="原因未知，请刷新重试。如果依然出现该问题，请联系管理员。"
          />

          <NavigationPrompt
            when={Boolean(stateRef.current.content)}
            message={(location) =>
              (stateRef.current.content &&
                location.pathname.indexOf(props.topicInfo.id)) === -1
                ? "确定要离开吗？"
                : true
            }
          />

          <Dialog
            title="错误提示"
            open={stateRef.current.contentTooLongModalVisible}
            onOpenChange={(open) => {
              if (!open) closeContentTooLongModal();
            }}
            maskClosable={false}
          >
            内容过长，不应超过8000个字符。<br />当前字符数：{stateRef.current.mode === 0 ? stateRef.current.content.length : stateRef.current.mdeState.length}。
          </Dialog>
        </div>
      );
});
