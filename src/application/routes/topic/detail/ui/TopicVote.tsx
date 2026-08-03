import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import moment from "moment";

import { useAppSelector } from "@application/store";
import {
  isLogOn,
  selectCurrentUser,
} from "@modules/session";
import {
  submitTopicVote,
  type TopicInfo,
  type VoteInfo,
} from "@modules/topic";
import styles from "./TopicVote.module.scss";

export interface TopicVoteProps {
  voteInfo: VoteInfo;
  topicInfo: TopicInfo;
  getInfo: () => void;
}

// TODO: hard code here
const colors = ["#ff0000", "#ff8000", "#22b14c", "#00a2e8", "#3f48cc"];

export function TopicVote({
  voteInfo,
  topicInfo,
  getInfo,
}: TopicVoteProps) {
  const currentUserId = useAppSelector(selectCurrentUser).id;
  const [items, setItems] = useState<number[]>(
    voteInfo.myRecord ? voteInfo.myRecord.items : []
  );
  const [message, setMessage] = useState("");
  const [messageOpacity, setMessageOpacity] = useState<0 | 1>(0);
  const [isVoting, setIsVoting] = useState(false);
  const messageOpacityTimerRef = useRef<number | null>(null);
  const messageTimerRef = useRef<number | null>(null);

  useEffect(() => {
    setItems(voteInfo.myRecord ? voteInfo.myRecord.items : []);
  }, [voteInfo]);

  useEffect(
    () => () => {
      if (messageOpacityTimerRef.current !== null) {
        window.clearTimeout(messageOpacityTimerRef.current);
      }
      if (messageTimerRef.current !== null) {
        window.clearTimeout(messageTimerRef.current);
      }
    },
    []
  );

  const handleInputChange = (id: number) => {
    setItems((currentItems) => {
      const index = currentItems.indexOf(id);
      if (index === -1) {
        return [...currentItems, id];
      }
      const nextItems = [...currentItems];
      nextItems.splice(index, 1);
      return nextItems;
    });
  };

  const submit = async () => {
    try {
      setIsVoting(true);
      const response = await submitTopicVote(voteInfo.topicId, items);
      getInfo();
      if (response.ok) throw new Error("投票成功");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : String(error));
      setMessageOpacity(1);
      messageOpacityTimerRef.current = window.setTimeout(() => {
        setMessageOpacity(0);
      }, 1000);
      messageTimerRef.current = window.setTimeout(() => {
        setMessage("");
      }, 1500);
      setIsVoting(false);
    }
  };

  const renderMessage = () => {
    switch (true) {
      case !isLogOn():
        return (
          <p>
            你还未登录，请先<Link to="/logOn">登陆</Link>。
          </p>
        );
      case voteInfo.canVote && voteInfo.needVote:
        return (
          <p>
            该投票在过期前，只有完成投票才能查看结果。你还未投过票，请先投票。
          </p>
        );
      case !!voteInfo.myRecord:
        return (
          <p>
            你已经投过票了，你的投票选项是：
            {voteInfo.myRecord.items.join("，")}。
          </p>
        );
      default:
        return null;
    }
  };

  let shouldNotShowInfo =
    voteInfo.needVote && !voteInfo.myRecord && voteInfo.isAvailable;
  if (currentUserId === topicInfo.userId) shouldNotShowInfo = false;

  return (
    <div className={styles.vote}>
      <p
        className={styles.voteMessage}
        style={{ opacity: messageOpacity }}
      >
        {message}
      </p>
      {voteInfo.voteItems.map((item, index) => (
        <div className="vote-item" key={item.id}>
          <p>
            <input
              type="checkbox"
              id={`vote${item.id}`}
              name="vote"
              checked={items.indexOf(item.id) !== -1}
              onChange={() => handleInputChange(item.id)}
              disabled={
                !voteInfo.canVote ||
                (items.length >= voteInfo.maxVoteCount &&
                  items.indexOf(item.id) === -1)
              }
            />
            <label htmlFor={`vote${item.id}`}>{item.description}</label>
          </p>
          <p className={styles.voteBar}>
            <span className={styles.voteTotal}>
              <span
                className={styles.voteCurrent}
                style={{
                  backgroundColor: colors[index % 5],
                  width: `${
                    (20 * item.count) / (voteInfo.voteUserCount || 1)
                  }rem`,
                }}
              ></span>
            </span>
            {shouldNotShowInfo ? null : (
              <span className="vote-item-info">
                {item.count}人/
                {(
                  (100 * item.count) /
                  (voteInfo.voteUserCount || 1)
                ).toFixed(2)}
                %
              </span>
            )}
          </p>
        </div>
      ))}
      <div className={styles.voteInfo}>
        <p>
          投票过期时间：
          {moment(voteInfo.expiredTime).format("YYYY年MM月DD日 HH:mm:ss")}
        </p>
        <p>
          每人最多允许投{voteInfo.maxVoteCount}票，已有
          {voteInfo.voteUserCount}人参与投票。
        </p>
        {renderMessage()}
      </div>
      {!voteInfo.canVote ? null : (
        <div className={styles.voteButtons}>
          <button
            className={`${styles.button} ${styles.blue}`}
            type="button"
            onClick={submit}
            disabled={!items.length || isVoting}
          >
            投票
          </button>
          <button
            className={`${styles.button} ${styles.blue}`}
            type="button"
            onClick={() => setItems([])}
          >
            重置
          </button>
        </div>
      )}
    </div>
  );
}
