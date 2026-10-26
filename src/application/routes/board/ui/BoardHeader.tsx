import * as React from "react";
import type { BoardInfo } from "@modules/board/model/types";
import { Button } from "@foundation/ui/button";
import { Link } from "react-router";

import { getMyInfo } from "@modules/session/api/session";
import { UserState } from "@modules/user/model/dto";
import { HomeAdvertisementCarousel } from "@application/routes/home/advertisement";

import styles from "./BoardHeader.module.scss";
import { BoardAnnouncement } from "./BoardAnnouncement";
import { BoardBreadcrumb } from "./BoardBreadcrumb";

interface BoardHeaderProps {
  data: BoardInfo;
  page: string;
}

export function BoardHeader({ data, page }: BoardHeaderProps) {
  let tip: React.ReactNode = null;
  let isLogOn = false;
  let isVerified = false;
  let isLocked = true;

  if (getMyInfo()) {
    isLogOn = true;
    if (!getMyInfo().isVerified) {
      isVerified = false;
      tip = (
        <div className={styles.permissionNotice}>
          您的帐号未认证，无法发言，请先前往
          <a href="https://account.cc98.org">https://account.cc98.org</a>
          认证激活。
        </div>
      );
    } else {
      isVerified = true;
    }

    if (getMyInfo().lockState !== UserState.Normal) {
      isLocked = true;
      tip = <div className={styles.permissionNotice}>您被全站禁言。</div>;
    } else {
      isLocked = false;
    }
  } else {
    tip = (
      <div className={styles.permissionNotice}>
        您还未登录，不能发帖，请先登录
      </div>
    );
  }

  return (
    <div className={styles["board-head-body"]}>
      <BoardBreadcrumb boardId={data.id} boardInfo={data} />

      <BoardAnnouncement
        key={page}
        data={data}
        isFirstPage={page === "1"}
      />

      <div className={styles["board-head-bar"]}>
        {isLogOn && isVerified && !isLocked ? (
          <div className={styles.postActions}>
            <Link to={`/editor/postTopic/${data.id}`}>
              <Button className={styles["board-head-button"]}>发主题</Button>
            </Link>
            {data.canVote && (
              <Link to={`/editor/postVoteTopic/${data.id}`}>
                <Button
                  className={`${styles["board-head-button"]} ${styles.voteAction}`}
                >
                  发投票
                </Button>
              </Link>
            )}
          </div>
        ) : (
          tip
        )}
        <HomeAdvertisementCarousel />
      </div>
    </div>
  );
}
