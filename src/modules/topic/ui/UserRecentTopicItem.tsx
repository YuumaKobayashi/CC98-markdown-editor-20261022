// A '.tsx' file enables JSX support in the TypeScript compiler,
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import * as React from "react";
import { Link } from "react-router";

import type { UserRecentTopic } from "../model/types";
import styles from "./UserRecentTopicItem.module.scss";

interface UserRecentTopicItemProps {
  userRecentTopic: UserRecentTopic;
}

/**
 * 用户最近单个帖子组件
 */
export function UserRecentTopicItem({
  userRecentTopic,
}: UserRecentTopicItemProps) {
  return (
    <div className={styles["user-post"]}>
      <div className={styles["user-post-info"]}>
        <Link
          className={styles["user-post-board"]}
          to={`/board/${userRecentTopic.boardId}`}
        >
          {userRecentTopic.boardName}
        </Link>
        <a className={styles["user-post-date"]}>
          {userRecentTopic.time.slice(0, 19).replace("T", " ")}
        </a>
      </div>
      <div className={styles["user-post-content"]}>
        <p>
          <Link to={`/topic/${userRecentTopic.id}`}>
            {userRecentTopic.title.trim() ? (
              userRecentTopic.title
            ) : (
              <span style={{ display: "inline-block", width: "5rem" }}></span>
            )}
          </Link>
        </p>
        {/*userRecentTopic.likeCount !== undefined ? <a className="fa-thumbs-o-up">{` ${userRecentTopic.likeCount}`}</a> : null}
                  {userRecentTopic.dislikeCount !== undefined ? <a className="fa-thumbs-o-down">{` ${userRecentTopic.dislikeCount}`}</a> : null*/}
      </div>
    </div>
  );
}

export default UserRecentTopicItem;
