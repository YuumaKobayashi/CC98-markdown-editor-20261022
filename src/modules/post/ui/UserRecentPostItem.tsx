// A '.tsx' file enables JSX support in the TypeScript compiler,
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import * as React from "react";
import { Link } from "react-router";

import type { UserRecentPost } from "@legacy/States/AppState";
import styles from "./UserRecentPostItem.module.scss";

interface UserRecentPostItemProps {
  userRecentPost: UserRecentPost;
}

/**
 * 用户最近单个帖子组件
 */
export function UserRecentPostItem({
  userRecentPost,
}: UserRecentPostItemProps) {
  return (
    <div className={styles["user-post"]}>
      <div className={styles["user-post-info"]}>
        <a className={styles["user-post-date"]}>
          {userRecentPost.time.slice(0, 19).replace("T", " ")}
        </a>
        <a className={styles["user-post-like-count"]}>
          赞：{userRecentPost.likeCount}
        </a>
        <a className={styles["user-post-like-count"]}>
          踩：{userRecentPost.dislikeCount}
        </a>
        <Link
          className={styles["user-post-board"]}
          to={`/board/${userRecentPost.boardId}`}
        >
          {userRecentPost.boardName}
        </Link>
      </div>
      <div className={styles["user-post-content"]}>
        <p>
          <Link
            to={`/topic/${userRecentPost.topicId}/${Math.floor((userRecentPost.floor - 1) / 10) + 1}#${userRecentPost.floor % 10}`}
          >
            {userRecentPost.content}
          </Link>
        </p>
        {/*userRecentPost.likeCount !== undefined ? <a className="fa-thumbs-o-up">{` ${userRecentPost.likeCount}`}</a> : null}
                  {userRecentPost.dislikeCount !== undefined ? <a className="fa-thumbs-o-down">{` ${userRecentPost.dislikeCount}`}</a> : null*/}
      </div>
    </div>
  );
}

export default UserRecentPostItem;
