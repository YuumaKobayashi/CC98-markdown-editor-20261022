import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";

import { MessagePerson } from "@modules/message";
import {
  getRecentContact,
  sortContactList,
} from "@modules/message";
import type { MessagePersonInfo, MessageProps } from "@modules/message";
import { DocumentTitle } from "@foundation/ui/document-title";

import styles from "../../MessageCenter.module.scss";
import { PrivateConversationWindow } from "./PrivateConversationWindow";
import { parsePrivateMessageContactRoute } from "../model/contact-route";

type ContactLoadStatus = "idle" | "loading" | "done";

export function PrivateMessagesPage() {
  const { search } = useLocation();
  // 父组件统一管理联系人列表、当前选中项和联系人分页状态。
  const [contacts, setContacts] = useState<MessagePersonInfo[] | null>(null);
  const [selectedContactId, setSelectedContactId] = useState<number | null>(null);
  const [contactLoadStatus, setContactLoadStatus] =
    useState<ContactLoadStatus>("idle");
  const requestId = useRef(0);

  // 首次进入或 deep link 变化时重新加载联系人，并默认选中第一项。
  useEffect(() => {
    const currentRequest = ++requestId.current;
    setContacts(null);
    setContactLoadStatus("idle");

    const load = async () => {
      let recentContacts = (await getRecentContact(0, 7)) ?? [];
      const { urlId, urlName } = parsePrivateMessageContactRoute(location.href);
      recentContacts =
        (await sortContactList([...recentContacts], urlId, urlName)) ?? [];
      if (requestId.current !== currentRequest) return;

      setContacts(recentContacts);
      setSelectedContactId(recentContacts[0]?.id ?? null);
    };
    void load();
  }, [search]);

  // 点击联系人时切换会话，并立即更新左侧的已读状态。
  const handleContactChange = (contact: MessagePersonInfo) => {
    const nextContacts = (contacts ?? []).map((item) =>
      item.id === contact.id ? { ...item, isRead: true } : item
    );
    setContacts(nextContacts);
    setSelectedContactId(contact.id);
  };

  const getMoreContact = async () => {
    if (contactLoadStatus !== "idle") return;
    const currentContacts = contacts ?? [];
    setContactLoadStatus("loading");
    const newContacts = await getRecentContact(currentContacts.length, 7);
    const nextContacts = [...currentContacts, ...(newContacts ?? [])];
    setContacts(nextContacts);
    setContactLoadStatus((newContacts?.length ?? 0) < 7 ? "done" : "idle");
  };

  // 子组件拿到新消息后，通过此回调同步更新父组件中的联系人。
  const handleContactUpdate = useCallback(
    (
      contact: MessagePersonInfo,
      messages: MessageProps[],
      moveToFront = false
    ) => {
      setContacts((currentContacts) => {
        const existingContacts = currentContacts ?? [];
        const existingIndex = existingContacts.findIndex(
          (item) => item.id === contact.id
        );
        // message 保存完整消息；lastContent 用于左侧联系人摘要。
        const nextContact = {
          ...(existingIndex >= 0 ? existingContacts[existingIndex] : contact),
          message: messages,
          lastContent: messages[0]?.content ?? "",
          isRead: true,
        };
        const nextContacts =
          existingIndex >= 0
            ? existingContacts.map((item, index) =>
                index === existingIndex ? nextContact : item
              )
            : [nextContact, ...existingContacts];

        // 发送新消息后，将当前联系人移动到列表第一位。
        if (moveToFront && existingIndex > 0) {
          return [
            nextContact,
            ...nextContacts.filter((item) => item.id !== contact.id),
          ];
        }
        return nextContacts;
      });
      if (moveToFront) setSelectedContactId(contact.id);
    },
    []
  );

  // 只保存选中 ID，联系人对象始终从最新列表中派生。
  const selectedContact =
    contacts?.find((contact) => contact.id === selectedContactId) ?? null;

  //TODO: 这里存在hardcode，应该使用常量或者配置值替代
  return (
    <div className={styles["message-message"]}>
      <DocumentTitle title="我的私信-CC98论坛" />
      <div className={styles["message-message-people"]}>
        <div className={styles["message-message-pTitle"]}>近期私信</div>
        <div className={styles["message-message-pList"]}>
          {contacts?.map((contact) => (
            <div
              key={contact.id}
              id={`contact_${contact.id}`}
              className={
                selectedContactId === contact.id
                  ? styles["message-message-pFocus"]
                  : undefined
              }
              onClick={() => handleContactChange(contact)}
            >
              <MessagePerson data={contact} />
            </div>
          ))}
          {contacts && contacts.length > 6 ? (
            <div className={styles["message-message-plMore"]} onClick={getMoreContact}>
              <img
                id="moreImg"
                src="http://file.cc98.org/uploadfile/2017/11/19/2348481046.gif"
                className={contactLoadStatus === "loading" ? "" : "displaynone"}
              />
              <div id="moreDot" className={contactLoadStatus === "idle" ? "" : "displaynone"}>...</div>
              <div id="moreShow" className={contactLoadStatus === "idle" ? "" : "displaynone"}>显示更多小伙伴~</div>
              <div id="moreDone" className={contactLoadStatus === "done" ? "" : "displaynone"}>小伙伴们都出来了~</div>
            </div>
          ) : null}
        </div>
      </div>
      <PrivateConversationWindow
        data={selectedContact}
        onContactUpdate={handleContactUpdate}
      />
    </div>
  );
}
