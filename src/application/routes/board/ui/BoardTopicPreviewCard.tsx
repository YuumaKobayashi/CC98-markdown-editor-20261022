import * as React from "react";
import type { IPost } from "@modules/post";
import type { ITopic } from "@modules/topic";
import { Spin } from "antd";
import { Link } from "react-router";

import { UbbCodeOptions, UbbContainer } from "@modules/ubb";

import styles from "./BoardTopicPreviewCard.module.scss";
import { getShortTopic } from "../api/service";

interface BoardTopicPreviewCardProps {
  data: ITopic;
}

export function BoardTopicPreviewCard({
  data,
}: BoardTopicPreviewCardProps) {
  const [posts, setPosts] = React.useState<any>([]);

  React.useEffect(() => {
    const loadPosts = async () => {
      const nextPosts = await getShortTopic(data.id);
      setPosts(nextPosts);
    };

    void loadPosts();
  }, []);

  return posts.length === 0 ? (
    <Spin size="large" />
  ) : (
    <div className={styles["board-postItem-cards"]}>
      {posts.map((item: IPost) => (
        <BoardTopicPreviewPost key={item.id} item={item} />
      ))}
    </div>
  );
}

function BoardTopicPreviewPost({ item }: { item: IPost }) {
  return (
    <div className={styles["board-postItem-card-body"]}>
      <div className={styles["board-postItem-card-information"]}>
        <div>{item.floor}L</div>
        <Link to={`/user/id/${item.userId}`}>
          <div className={styles["board-postItem-card-username"]}>
            {item.userName}
          </div>
        </Link>
      </div>
      <div className={styles["board-postItem-card-content"]}>
        <UbbContainer
          code={item.content}
          options={{ ...new UbbCodeOptions(), allowToolbox: false }}
        />
      </div>
    </div>
  );
}
