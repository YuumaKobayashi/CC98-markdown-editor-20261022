import * as React from "react";
import { useNavigate } from "react-router";
import styles from "./TopicAwardInfo.module.scss";

export type TopicAwardInfoProps = {
  postId: unknown;
  portraitUrl: string;
  content: React.ReactNode;
  userName: string;
  reason: React.ReactNode;
  topicId: unknown;
};

export function TopicAwardInfo({
  portraitUrl,
  content,
  userName,
  reason,
}: TopicAwardInfoProps) {
  const navigate = useNavigate();

  // TODO: Replace this with <Link target="_blank"> navigation for user profiles.
  const navigateToUser = () => {
    void navigate(`/user/name/${userName}`);
  };

  return (
    <div className={styles.good}>
      <div className={styles.userImage}>
        <img
          style={{ cursor: "pointer" }}
          onClick={navigateToUser}
          src={portraitUrl}
        ></img>
      </div>
      <div
        className={styles.userName}
        style={{ cursor: "pointer" }}
        onClick={navigateToUser}
      >
        {userName}
      </div>
      <div className={styles.grades}>{content}</div>
      <div className={styles.credit}>
        <span>{reason}</span>
      </div>
    </div>
  );
}
