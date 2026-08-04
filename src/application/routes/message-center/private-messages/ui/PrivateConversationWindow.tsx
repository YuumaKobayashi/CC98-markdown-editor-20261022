import * as React from "react";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type DragEvent,
} from "react";

import { useAppDispatch, useAppSelector } from "@application/store";
import { MessageReceiver } from "@modules/message/ui/MessageReceiver";
import { MessageSender } from "@modules/message/ui/MessageSender";
import {
  getRecentMessage,
  sendMessage,
  sortRecentMessage,
} from "@modules/message/api/service";
import { refreshUnreadCount } from "@modules/notification/model/refresh-unread-count";
import { selectUnreadCount } from "@modules/notification/model/selectors";
import { getMyInfo } from "@modules/session/api/session";
import { uploadFile } from "@modules/upload/api/service";
import type {
  MessagePersonInfo,
  MessageViewModel,
} from "@modules/message/model/view-model";
import { DocumentTitle } from "@foundation/ui/document-title";

import styles from "./PrivateConversationWindow.module.scss";

type MessageLoadStatus = "more" | "loading" | "done";
type ScrollAction = "bottom" | "prepend" | null;

// 父组件提供当前联系人，并保存本窗口刷新后的消息缓存。
interface PrivateConversationWindowProps {
  data: MessagePersonInfo | null;
  onContactUpdate(
    contact: MessagePersonInfo,
    messages: MessageViewModel[],
    moveToFront?: boolean
  ): void;
}

// 合并接口返回的最新消息与联系人缓存，避免重叠部分重复。
const mergeRecentMessages = (
  recentMessages: MessageViewModel[],
  cachedMessages: MessageViewModel[]
) => {
  if (!cachedMessages.length) return sortRecentMessage([...recentMessages]);
  const overlapIndex = recentMessages.findIndex(
    (message) => message.id === cachedMessages[0].id
  );
  const merged =
    overlapIndex >= 0
      ? [...recentMessages.slice(0, overlapIndex), ...cachedMessages]
      : [...recentMessages];
  return sortRecentMessage(merged);
};

// 管理单个联系人的消息加载、滚动、草稿、图片上传和发送。
export function PrivateConversationWindow({
  data: contact,
  onContactUpdate,
}: PrivateConversationWindowProps) {
  const dispatch = useAppDispatch();
  const unreadMessageCount =
    useAppSelector(selectUnreadCount).messageCount;

  // messages 按时间升序保存，便于从上到下渲染旧消息到新消息。
  const [messages, setMessages] = useState<MessageViewModel[]>([]);
  const [loadStatus, setLoadStatus] = useState<MessageLoadStatus>("done");
  const [draft, setDraft] = useState("");
  const [focused, setFocused] = useState(false);
  const [showPostError, setShowPostError] = useState(false);

  // DOM 引用分别用于调整滚动位置、聚焦输入框和触发隐藏文件框。
  const contentRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 这些 ref 跨异步任务保存最新值，防止旧请求和旧定时器更新当前会话。
  const requestId = useRef(0);
  const sendTimer = useRef<number>();
  const scrollAction = useRef<ScrollAction>(null);
  const previousScrollHeight = useRef(0);
  const contactIdRef = useRef<number | null>(contact?.id ?? null);
  const unreadCountRef = useRef(unreadMessageCount);
  contactIdRef.current = contact?.id ?? null;
  unreadCountRef.current = unreadMessageCount;

  // 只有本地仍显示未读时才向服务端重新同步总未读数。
  const refreshUnreadCountIfNeeded = () => {
    if (unreadCountRef.current) {
      void dispatch(refreshUnreadCount());
    }
  };

  // 联系人变化时重置窗口，并加载该会话最新的 10 条消息。
  useEffect(() => {
    const currentRequest = ++requestId.current;
    if (sendTimer.current !== undefined) window.clearTimeout(sendTimer.current);
    setMessages([]);
    setDraft("");
    setShowPostError(false);
    setLoadStatus(contact ? "more" : "done");
    if (!contact) return;

    // 合并接口结果和联系人缓存；过期请求只允许完成读取，不更新界面。
    const load = async () => {
      const recentMessages = (await getRecentMessage(contact.id, 0, 10)) ?? [];
      refreshUnreadCountIfNeeded();
      if (requestId.current !== currentRequest) return;

      const descendingMessages = mergeRecentMessages(
        recentMessages,
        contact.message ?? []
      );
      onContactUpdate(contact, descendingMessages);
      scrollAction.current = "bottom";
      // 接口/缓存为新到旧，渲染前反转为旧到新。
      setMessages([...descendingMessages].reverse());
      setLoadStatus(recentMessages.length === 10 ? "more" : "done");
    };
    void load();

    return () => {
      if (sendTimer.current !== undefined) window.clearTimeout(sendTimer.current);
    };
  }, [contact?.id, dispatch, onContactUpdate]);

  // prepend 后必须在浏览器绘制前恢复原滚动锚点，避免列表跳动。
  useLayoutEffect(() => {
    if (scrollAction.current !== "prepend" || !contentRef.current) return;
    contentRef.current.scrollTop =
      contentRef.current.scrollHeight - previousScrollHeight.current - 25;
    scrollAction.current = null;
  }, [messages]);

  // 首次加载或发送刷新后滚到最新一条；这里不需要阻塞浏览器绘制。
  useEffect(() => {
    if (scrollAction.current !== "bottom" || !contentRef.current) return;
    contentRef.current.scrollTop = contentRef.current.scrollHeight;
    scrollAction.current = null;
  }, [messages]);

  // 向前分页加载 10 条更早消息，并保持用户当前看到的滚动位置。
  const getMoreMessage = async () => {
    if (!contact || loadStatus !== "more") return;
    const currentRequest = ++requestId.current;
    // 分页接口使用新到旧的顺序和当前消息数作为偏移量。
    const oldDescending = [...messages].reverse();
    previousScrollHeight.current = contentRef.current?.scrollHeight ?? 0;
    setLoadStatus("loading");

    const newMessages =
      (await getRecentMessage(contact.id, oldDescending.length, 10)) ?? [];
    refreshUnreadCountIfNeeded();
    if (
      requestId.current !== currentRequest ||
      contactIdRef.current !== contact.id
    ) {
      return;
    }

    if (newMessages.length) {
      const descendingMessages = sortRecentMessage([
        ...oldDescending,
        ...newMessages,
      ]);
      onContactUpdate(contact, descendingMessages);
      scrollAction.current = "prepend";
      setMessages([...descendingMessages].reverse());
    }
    setLoadStatus(newMessages.length === 10 ? "more" : "done");
  };

  // 发送成功后重取最新消息，并把该联系人移到联系人列表首位。
  const refreshConversation = async (sentTo: MessagePersonInfo) => {
    const recentMessages = (await getRecentMessage(sentTo.id, 0, 10)) ?? [];
    // 用户若已切换联系人，丢弃这次发送对应的刷新结果。
    if (contactIdRef.current !== sentTo.id) return;
    const descendingMessages = mergeRecentMessages(
      recentMessages,
      sentTo.message ?? []
    );
    onContactUpdate(sentTo, descendingMessages, true);
    scrollAction.current = "bottom";
    setMessages([...descendingMessages].reverse());
    setLoadStatus(recentMessages.length === 10 ? "more" : "done");
  };

  // 上传单张图片，并把服务端地址包装成 UBB 图片标签插入草稿末尾。
  const uploadAndInsertImage = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("请选择图片文件");
      return;
    }
    const result = await uploadFile(file);
    if (result.isSuccess) {
      setDraft((current) => `${current}[img]${result.content}[/img]`);
      setShowPostError(false);
    } else {
      alert(`图片上传失败：${result.content}`);
    }
  };

  // 用自定义按钮打开隐藏的原生文件选择框。
  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  // 处理文件选择，并清空 input 以允许连续选择同一个文件。
  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) await uploadAndInsertImage(file);
    event.target.value = "";
  };

  // 粘贴内容包含图片时拦截默认行为，改为上传并插入 UBB。
  const handlePaste = async (event: ClipboardEvent<HTMLTextAreaElement>) => {
    const imageItem = Array.from(event.clipboardData.items).find((item) =>
      item.type.startsWith("image/")
    );
    if (!imageItem) return;
    event.preventDefault();
    const file = imageItem.getAsFile();
    if (file) await uploadAndInsertImage(file);
  };

  // 依次上传拖入输入框的所有图片文件。
  const handleDrop = async (event: DragEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
    const imageFiles = Array.from(event.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );
    for (const file of imageFiles) await uploadAndInsertImage(file);
  };

  // 取消浏览器默认拖放行为，允许 textarea 接收 drop 事件。
  const handleDragOver = (event: DragEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
  };

  // 聚焦输入框，同时隐藏占位提示和上一次发送错误。
  const handleFocus = () => {
    setFocused(true);
    setShowPostError(false);
    textareaRef.current?.focus();
  };

  // 记录失焦状态，空草稿时重新显示覆盖式占位提示。
  const handleBlur = () => {
    setFocused(false);
  };

  // 发送非空草稿；403 显示错误，其余结果延迟刷新会话。
  const postMessage = async () => {
    if (!contact || draft === "") return;
    const response = await sendMessage(
      JSON.stringify({ receiverId: contact.id, content: draft })
    );
    if (response.status === 403) {
      setDraft("");
      setShowPostError(true);
      return;
    }

    setDraft("");
    // 保留旧实现的短暂等待，让服务端有时间写入刚发送的消息。
    sendTimer.current = window.setTimeout(() => {
      void refreshConversation(contact);
    }, 200);
  };

  // 显示私信举报指引；按钮当前沿用旧样式保持隐藏。
  const report = () => {
    alert(
      "举报他人恶意私信请到【论坛事务】按照格式发帖投诉，记得截图保留证据，管理员会及时进行处理！感谢您对CC98的支持！"
    );
  };

  const myInfo = getMyInfo();
  const showNotice = !focused && draft === "";

  return (
    <div className={styles["message-message-window"]}>
      {contact ? (
        <DocumentTitle title={`与 ${contact.name} 的私信-CC98论坛`} />
      ) : null}
      <div className={styles["message-message-wHeader"]}>
        <div className={styles["message-message-wReport"]}></div>
        <div className={styles["message-message-wTitle"]}>
          {contact ? `与 ${contact.name} 的私信` : "无当前聊天对象"}
        </div>
        <div className={styles["message-message-wReport"]} hidden>
          <button onClick={report}>举报</button>
        </div>
      </div>
      <div
        className={styles["message-message-wContent"]}
        id="messageContent"
        ref={contentRef}
      >
        <div className={styles["message-message-wcLoading"]}>
          {contact ? (
            <div
              id="wcGetMore"
              className={styles["message-message-wcLoadingMore"]}
              hidden={loadStatus !== "more"}
              onClick={getMoreMessage}
            >
              点击加载更多...
            </div>
          ) : null}
          <img
            src="http://file.cc98.org/uploadfile/2017/11/19/2348481046.gif"
            id="wcLoadingImg"
            hidden={loadStatus !== "loading"}
          />
          <div
            id="wcLoadingText"
            className={styles["message-message-wcLoadingText"]}
            hidden={!contact || loadStatus !== "done"}
          >
            没有更多消息了~
          </div>
        </div>
        {/* 根据消息方向选择接收或发送气泡；无关当前用户的消息不渲染。 */}
        {contact && myInfo
          ? messages.map((message) => {
              if (message.receiverId === myInfo.id) {
                return (
                  <MessageReceiver
                    key={message.id}
                    id={message.id}
                    senderName={contact.name}
                    senderId={contact.id}
                    receiverName={myInfo.name}
                    receiverId={myInfo.id}
                    senderPortraitUrl={contact.portraitUrl}
                    receiverPortraitUrl={myInfo.portraitUrl}
                    content={message.content}
                    isRead={message.isRead}
                    time={message.time}
                    showTime={message.showTime}
                  />
                );
              }
              if (message.senderId === myInfo.id) {
                return (
                  <MessageSender
                    key={message.id}
                    id={message.id}
                    senderName={myInfo.name}
                    senderId={myInfo.id}
                    receiverName={contact.name}
                    receiverId={contact.id}
                    senderPortraitUrl={myInfo.portraitUrl}
                    receiverPortraitUrl={contact.portraitUrl}
                    content={message.content}
                    isRead={message.isRead}
                    time={message.time}
                    showTime={message.showTime}
                  />
                );
              }
              return null;
            })
          : null}
      </div>
      <div className={styles["message-message-wPost"]}>
        <textarea
          ref={textareaRef}
          className={styles["message-message-wPostArea"]}
          id="postContent"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onPaste={handlePaste}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        />
        <div
          id="wPostNotice"
          className={styles["message-message-wPostNotice"]}
          hidden={!showNotice}
          onClick={handleFocus}
        >
          请在这里填入您要发送的私信内容
        </div>
        <div
          id="wPostError"
          className={styles["message-message-wPostError"]}
          hidden={!showPostError}
          onClick={handleFocus}
        >
          发送失败，可能的原因有：发送太快；受到全站禁言或以上的处罚；服务器故障或者正在维护。
        </div>
        <input
          ref={fileInputRef}
          id="upload-files"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleImageUpload}
        />
        <div className={styles["message-message-wPostBtn-wrapper"]}>
          <button
            className={styles["message-message-wPostBtn"]}
            onClick={triggerImageUpload}
            type="button"
            style={{ marginRight: "10px" }}
          >
            上传图片
          </button>
          <button className={styles["message-message-wPostBtn"]} onClick={postMessage}>
            发送
          </button>
        </div>
      </div>
    </div>
  );
}
